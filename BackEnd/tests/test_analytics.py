import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from users.models import User, Department, Student
from student.models import Result
from scheduling.models import Subject, ExamSession
from analytics.models import AuditLog
from datetime import date

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def setup_data():
    dept = Department.objects.create(name="CS", code="CS")
    coe = User.objects.create_user(email="coe@test.com", password="pwd", full_name="CoE", role="CHIEF_SUPERINTENDENT", department=dept)
    student_user = User.objects.create_user(email="student@test.com", password="pwd", full_name="Student", role="STUDENT", department=dept)
    
    student = Student.objects.create(user=student_user, department=dept, usn="1RV25CS001", current_semester=5, batch_year=2025)
    subject = Subject.objects.create(code="CS501", name="OS", department=dept, semester=5, batch_year=2025)
    session = ExamSession.objects.create(name="Fall 2025", semester=5, academic_year="2025", start_date=date(2025,9,1), end_date=date(2025,12,1))
    
    # Create Result for metrics
    Result.objects.create(
        student=student,
        subject=subject,
        exam_session=session,
        cie_marks=40,
        see_marks=45
        # Total = 85 (Grade A)
    )
    
    # Create Audit Log
    AuditLog.objects.create(
        actor=coe,
        action=AuditLog.ActionChoices.VAULT_UNLOCK,
        severity=AuditLog.SeverityChoices.HIGH,
        details={"paper_id": "1234"}
    )
    
    return {
        "coe": coe,
        "student_user": student_user
    }


@pytest.mark.django_db
class TestAnalyticsAPI:
    def test_audit_ledger_access(self, api_client, setup_data):
        coe = setup_data["coe"]
        student_user = setup_data["student_user"]
        
        url = reverse('audit-list')
        
        # Student should be forbidden
        api_client.force_authenticate(user=student_user)
        response = api_client.get(url)
        assert response.status_code == status.HTTP_403_FORBIDDEN
        
        # CoE should see logs
        api_client.force_authenticate(user=coe)
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        results = response.data.get('results', response.data)
        assert len(results) == 1
        assert results[0]["action"] == "VAULT_UNLOCK"

    def test_performance_metrics(self, api_client, setup_data):
        coe = setup_data["coe"]
        url = reverse('metrics-summary')
        
        api_client.force_authenticate(user=coe)
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data["total_students_evaluated"] == 1
        assert response.data["average_gpa"] == 9.0  # Grade A is 9 points
        assert response.data["pass_percentage"] == 100.0
