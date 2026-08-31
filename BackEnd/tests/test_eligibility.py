"""NexAI - Eligibility API Tests"""
import pytest
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
from users.constants import UserRole
from users.models import Student
from eligibility.models import StudentEligibility, HallTicket


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def hod_user(django_user_model):
    return django_user_model.objects.create_user(
        email="hod@nexai.test", password="test", role=UserRole.HOD
    )


@pytest.fixture
def student_user(django_user_model):
    return django_user_model.objects.create_user(
        email="student@nexai.test", password="test", role=UserRole.STUDENT
    )


@pytest.fixture
def hod_client(api_client, hod_user):
    api_client.force_authenticate(user=hod_user)
    return api_client


@pytest.fixture
def student_client(api_client, student_user):
    api_client.force_authenticate(user=student_user)
    return api_client


@pytest.mark.django_db
class TestEligibilityAPI:
    def test_hod_can_view_eligibility_records(self, hod_client):
        url = reverse("eligibility-records-list")
        response = hod_client.get(url)
        assert response.status_code == status.HTTP_200_OK

    def test_student_can_view_own_eligibility_records(self, student_client):
        url = reverse("eligibility-records-list")
        response = student_client.get(url)
        assert response.status_code == status.HTTP_200_OK

    def test_hod_can_trigger_generate_hall_tickets(self, hod_client):
        import uuid
        fake_uuid = uuid.uuid4()
        url = reverse("generate-hall-tickets", kwargs={"session_id": fake_uuid})
        response = hod_client.post(url)
        assert response.status_code in [status.HTTP_202_ACCEPTED, status.HTTP_404_NOT_FOUND]

    def test_student_cannot_trigger_generate_hall_tickets(self, student_client):
        import uuid
        fake_uuid = uuid.uuid4()
        url = reverse("generate-hall-tickets", kwargs={"session_id": fake_uuid})
        response = student_client.post(url)
        assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
class TestEligibilityCeleryTasks:
    def test_process_eligibility_csv_logic(self, db):
        from eligibility.tasks import process_eligibility_csv
        from scheduling.models import ExamSession, Subject
        from users.models import Department
        
        dept = Department.objects.create(code="CS", name="Computer Science")
        from datetime import date
        session = ExamSession.objects.create(name="Fall 2025", semester=5, academic_year="2025", start_date=date(2025, 9, 1), end_date=date(2025, 12, 1))
        subject = Subject.objects.create(code="CS501", name="OS", subject_type="THEORY", department=dept, semester=5, batch_year=2025)
        from users.models import User
        user = User.objects.create_user(email="test@nexai.test", password="test", full_name="Test Student")
        student = Student.objects.create(user=user, usn="1NX25CS001", department=dept, current_semester=5, batch_year=2025)
        
        csv_data = "usn,subject_code,attendance,cie\n1NX25CS001,CS501,80,45\n1NX25CS001,UNKNOWN,90,50\n"
        result = process_eligibility_csv(csv_data, str(session.id))
        
        assert result["status"] == "completed"
        assert result["processed"] == 1
        assert len(result["errors"]) == 1
        
        eligibility = StudentEligibility.objects.get(student=student, subject=subject, exam_session=session)
        assert eligibility.is_eligible is True
        assert eligibility.attendance_percentage == 80
        assert eligibility.cie_marks == 45

    def test_generate_hall_tickets_for_session(self, db):
        from eligibility.tasks import generate_hall_tickets_for_session
        from scheduling.models import ExamSession, Subject
        from users.models import Department
        
        dept = Department.objects.create(code="CS", name="Computer Science")
        from datetime import date
        session = ExamSession.objects.create(name="Fall 2025", semester=5, academic_year="2025", start_date=date(2025, 9, 1), end_date=date(2025, 12, 1))
        subject = Subject.objects.create(code="CS501", name="OS", subject_type="THEORY", department=dept, semester=5, batch_year=2025)
        from users.models import User
        user = User.objects.create_user(email="test@nexai.test", password="test", full_name="Test Student")
        student = Student.objects.create(user=user, usn="1NX25CS001", department=dept, current_semester=5, batch_year=2025)
        
        # Make student eligible
        StudentEligibility.objects.create(
            student=student, subject=subject, exam_session=session,
            attendance_percentage=85, cie_marks=42, is_eligible=True
        )
        
        result = generate_hall_tickets_for_session(str(session.id))
        assert result["status"] == "completed"
        assert result["generated_count"] == 1
        
        hall_ticket = HallTicket.objects.get(student=student, exam_session=session)
        assert hall_ticket.ticket_number.startswith(f"HT-{session.id}-1NX25CS001")
        assert hall_ticket.is_revoked is False
