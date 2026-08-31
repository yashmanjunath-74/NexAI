import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from users.models import User, Department, Student
from scheduling.models import Subject, ExamSession, TimetableSlot, Room
from scanning.models import ScanningSession
from evaluation.models import AnswerScript, AnswerScriptKeyMap
from student.models import Result
from datetime import date

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def setup_data():
    dept = Department.objects.create(name="CS", code="CS")
    
    student_user = User.objects.create_user(email="student@test.com", password="pwd", full_name="Student", role="STUDENT", department=dept)
    student = Student.objects.create(user=student_user, department=dept, usn="1RV25CS001", current_semester=5, batch_year=2025)
    
    subject = Subject.objects.create(code="CS501", name="OS", department=dept, semester=5, batch_year=2025)
    session = ExamSession.objects.create(name="Fall 2025", semester=5, academic_year="2025", start_date=date(2025,9,1), end_date=date(2025,12,1))
    
    room = Room.objects.create(name="101", building="A", total_capacity=60, exam_capacity=30)
    
    timetable_slot = TimetableSlot.objects.create(
        exam_session=session,
        subject=subject,
        room=room,
        exam_date=date(2025,10,1),
        start_time="10:00:00",
        end_time="13:00:00"
    )
    
    scan_session = ScanningSession.objects.create(
        timetable_slot=timetable_slot,
        invigilator=student_user
    )
    
    from vault.models import QuestionPaper
    qp = QuestionPaper.objects.create(
        title="OS Paper",
        subject=subject,
        exam_session=session,
        setter=student_user
    )
    
    script = AnswerScript.objects.create(
        scanning_session=scan_session,
        question_paper=qp,
        status='COMPLETED',
        evaluator_total_score=45.00
    )
    
    AnswerScriptKeyMap.objects.create(
        answer_script=script,
        student=student
    )
    
    return {
        "student_user": student_user,
        "student": student,
        "subject": subject,
        "session": session
    }

@pytest.mark.django_db
class TestStudentPortalAPI:
    def test_my_profile(self, api_client, setup_data):
        api_client.force_authenticate(user=setup_data["student_user"])
        url = reverse('studentportal-my-profile')
        
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data["usn"] == "1RV25CS001"
        assert response.data["department"] == "CS"

    def test_my_results_calculates_grades(self, api_client, setup_data):
        api_client.force_authenticate(user=setup_data["student_user"])
        url = reverse('studentportal-my-results')
        
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 1
        
        result_data = response.data[0]
        # Evaluator score was 45. Mock CIE was 40. Total = 85. Grade = A.
        assert result_data["cie_marks"] == "40.00"
        assert result_data["see_marks"] == "45.00"
        assert result_data["total_marks"] == "85.00"
        assert result_data["grade"] == "A"
        assert result_data["subject_code"] == "CS501"

        # Check DB
        result_obj = Result.objects.first()
        assert result_obj.grade == "A"
