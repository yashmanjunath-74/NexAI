import json
import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.utils import timezone
from datetime import timedelta
from vault.models import QuestionPaper
from users.models import User, Department
from scheduling.models import Subject, ExamSession

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def setup_data():
    dept = Department.objects.create(name="CS", code="CS")
    setter = User.objects.create_user(email="setter@test.com", password="pwd", full_name="Setter", role="PAPER_SETTER", department=dept)
    coe = User.objects.create_user(email="coe@test.com", password="pwd", full_name="CoE", role="CHIEF_SUPERINTENDENT", department=dept)
    subject = Subject.objects.create(code="CS501", name="OS", department=dept, semester=5, batch_year=2025)
    
    from datetime import date
    session = ExamSession.objects.create(name="Fall 2025", semester=5, academic_year="2025", start_date=date(2025,9,1), end_date=date(2025,12,1))
    
    paper = QuestionPaper.objects.create(
        subject=subject,
        exam_session=session,
        setter=setter,
        title="OS Finals",
        status=QuestionPaper.PaperStatus.DRAFT
    )
    
    return {
        "setter": setter,
        "coe": coe,
        "paper": paper
    }

@pytest.mark.django_db
class TestVaultAPI:
    def test_setter_can_lock_and_submit_paper(self, api_client, setup_data):
        setter = setup_data["setter"]
        paper = setup_data["paper"]
        
        api_client.force_authenticate(user=setter)
        url = reverse('question-paper-lock-and-submit', kwargs={'pk': paper.pk})
        
        unlock_time = timezone.now() + timedelta(days=1)
        
        response = api_client.post(url, data={
            "key_unlock_timestamp": unlock_time.isoformat()
        }, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        assert "ipfs_cid" in response.data
        
        paper.refresh_from_db()
        assert paper.status == QuestionPaper.PaperStatus.SUBMITTED
        assert paper.ipfs_cid != ""
        assert paper.encrypted_aes_key is not None

    def test_coe_can_approve_paper(self, api_client, setup_data):
        setter = setup_data["setter"]
        coe = setup_data["coe"]
        paper = setup_data["paper"]
        
        # Setter locks
        api_client.force_authenticate(user=setter)
        url = reverse('question-paper-lock-and-submit', kwargs={'pk': paper.pk})
        unlock_time = timezone.now() + timedelta(days=1)
        api_client.post(url, data={"key_unlock_timestamp": unlock_time.isoformat()}, format='json')
        
        # CoE approves
        api_client.force_authenticate(user=coe)
        approve_url = reverse('question-paper-approve', kwargs={'pk': paper.pk})
        response = api_client.post(approve_url)
        
        assert response.status_code == status.HTTP_200_OK
        paper.refresh_from_db()
        assert paper.status == QuestionPaper.PaperStatus.ENCRYPTED

    def test_early_unlock_fails(self, api_client, setup_data):
        setter = setup_data["setter"]
        coe = setup_data["coe"]
        paper = setup_data["paper"]
        
        api_client.force_authenticate(user=setter)
        url = reverse('question-paper-lock-and-submit', kwargs={'pk': paper.pk})
        unlock_time = timezone.now() + timedelta(days=1) # Future time
        api_client.post(url, data={"key_unlock_timestamp": unlock_time.isoformat()}, format='json')
        
        api_client.force_authenticate(user=coe)
        api_client.post(reverse('question-paper-approve', kwargs={'pk': paper.pk}))
        
        # Try unlock
        unlock_url = reverse('question-paper-unlock', kwargs={'pk': paper.pk})
        response = api_client.get(unlock_url)
        
        assert response.status_code == status.HTTP_403_FORBIDDEN
        assert "Unlock time has not been reached" in response.data["error"]

    def test_timely_unlock_succeeds(self, api_client, setup_data):
        setter = setup_data["setter"]
        coe = setup_data["coe"]
        paper = setup_data["paper"]
        
        api_client.force_authenticate(user=setter)
        url = reverse('question-paper-lock-and-submit', kwargs={'pk': paper.pk})
        unlock_time = timezone.now() - timedelta(minutes=5) # Past time
        api_client.post(url, data={"key_unlock_timestamp": unlock_time.isoformat()}, format='json')
        
        api_client.force_authenticate(user=coe)
        api_client.post(reverse('question-paper-approve', kwargs={'pk': paper.pk}))
        
        # Try unlock
        unlock_url = reverse('question-paper-unlock', kwargs={'pk': paper.pk})
        response = api_client.get(unlock_url)
        
        assert response.status_code == status.HTTP_200_OK
        assert "content" in response.data
        assert "aes_key_hex" in response.data
        
        content = response.data["content"]
        assert content["title"] == "OS Finals"
        
        paper.refresh_from_db()
        assert paper.status == QuestionPaper.PaperStatus.DISTRIBUTED
