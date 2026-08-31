import pytest
from unittest.mock import patch
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from proctoring.models import ProctoringSession, ProctoringEvent
from users.models import User, Department, Student
from scheduling.models import Subject, ExamSession, TimetableSlot
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
    
    from scheduling.models import Room
    room = Room.objects.create(name="Room 101", building="A", total_capacity=60, exam_capacity=30)
    timetable_slot = TimetableSlot.objects.create(
        exam_session=session,
        subject=subject,
        room=room,
        exam_date=date(2025,10,1),
        start_time="10:00:00",
        end_time="13:00:00"
    )
    
    return {
        "coe": coe,
        "student_user": student_user,
        "student": student,
        "timetable_slot": timetable_slot
    }

@pytest.mark.django_db
class TestProctoringAPI:
    def test_student_can_start_session(self, api_client, setup_data):
        student_user = setup_data["student_user"]
        timetable_slot = setup_data["timetable_slot"]
        
        api_client.force_authenticate(user=student_user)
        url = reverse('proctoringsession-start-session')
        
        response = api_client.post(url, data={"timetable_slot_id": str(timetable_slot.id)}, format='json')
        assert response.status_code == status.HTTP_201_CREATED
        
        session = ProctoringSession.objects.get(id=response.data["id"])
        assert session.student == setup_data["student"]
        assert session.is_active is True

    @patch('proctoring.views.detect_anomalies')
    def test_upload_frame_creates_events(self, mock_detect, api_client, setup_data):
        student_user = setup_data["student_user"]
        timetable_slot = setup_data["timetable_slot"]
        
        session = ProctoringSession.objects.create(
            student=setup_data["student"],
            timetable_slot_id=timetable_slot.id
        )
        
        # Mock the AI engine to return a specific anomaly
        mock_detect.return_value = [{
            "event_type": ProctoringEvent.EventTypeChoices.MOBILE_PHONE,
            "severity": ProctoringEvent.SeverityChoices.HIGH,
            "screenshot_url": "http://fake.url"
        }]
        
        api_client.force_authenticate(user=student_user)
        url = reverse('proctoringsession-upload-frame', kwargs={'pk': session.pk})
        
        response = api_client.post(url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data["anomalies_detected"] == 1
        
        event = ProctoringEvent.objects.first()
        assert event.event_type == ProctoringEvent.EventTypeChoices.MOBILE_PHONE
        assert event.severity == ProctoringEvent.SeverityChoices.HIGH

    def test_coe_can_view_live_radar(self, api_client, setup_data):
        coe = setup_data["coe"]
        session = ProctoringSession.objects.create(
            student=setup_data["student"],
            timetable_slot_id=setup_data["timetable_slot"].id
        )
        
        ProctoringEvent.objects.create(
            session=session,
            event_type=ProctoringEvent.EventTypeChoices.MOBILE_PHONE,
            severity=ProctoringEvent.SeverityChoices.HIGH
        )
        
        api_client.force_authenticate(user=coe)
        url = reverse('proctoringsession-live-radar')
        
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 1
        assert response.data[0]["high_severity_flags"] == 1
        assert response.data[0]["student_usn"] == "1RV25CS001"
