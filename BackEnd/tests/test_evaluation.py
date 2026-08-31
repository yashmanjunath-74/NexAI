import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from evaluation.models import AnswerScript, QuestionGrade
from users.models import User, Department
from scheduling.models import Subject, ExamSession, TimetableSlot
from vault.models import QuestionPaper, Question

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def setup_data():
    dept = Department.objects.create(name="CS", code="CS")
    invigilator = User.objects.create_user(email="invig@test.com", password="pwd", full_name="Invigilator", role="INVIGILATOR", department=dept)
    evaluator = User.objects.create_user(email="eval@test.com", password="pwd", full_name="Evaluator", role="EVALUATOR", department=dept)
    setter = User.objects.create_user(email="setter@test.com", password="pwd", full_name="Setter", role="PAPER_SETTER", department=dept)
    
    subject = Subject.objects.create(code="CS501", name="OS", department=dept, semester=5, batch_year=2025)
    
    from datetime import date
    session = ExamSession.objects.create(name="Fall 2025", semester=5, academic_year="2025", start_date=date(2025,9,1), end_date=date(2025,12,1))
    
    paper = QuestionPaper.objects.create(
        subject=subject,
        exam_session=session,
        setter=setter,
        title="OS Finals",
        status=QuestionPaper.PaperStatus.APPROVED
    )
    
    q1 = Question.objects.create(question_paper=paper, section="A", question_number=1, marks=10, bloom_level="REMEMBER")
    q2 = Question.objects.create(question_paper=paper, section="A", question_number=2, marks=10, bloom_level="UNDERSTAND")
    
    script = AnswerScript.objects.create(
        question_paper=paper,
        evaluation_code="EVAL123",
        uploaded_by=invigilator,
        status=AnswerScript.ScriptStatus.UPLOADED,
        assigned_evaluator=evaluator
    )
    
    return {
        "invigilator": invigilator,
        "evaluator": evaluator,
        "paper": paper,
        "script": script,
        "q1": q1,
        "q2": q2
    }

@pytest.mark.django_db
class TestEvaluationAPI:
    def test_invigilator_can_upload_page(self, api_client, setup_data):
        invigilator = setup_data["invigilator"]
        script = setup_data["script"]
        
        api_client.force_authenticate(user=invigilator)
        url = reverse('answerscript-upload-page', kwargs={'pk': script.pk})
        
        response = api_client.post(url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data["page_number"] == 1
        
        script.refresh_from_db()
        assert script.page_count == 1
        assert script.pages.count() == 1

    def test_complete_upload_triggers_ai_evaluation(self, api_client, setup_data):
        invigilator = setup_data["invigilator"]
        script = setup_data["script"]
        
        # Test synchronously by calling the Celery task directly
        from evaluation.tasks import process_answer_script_task
        process_answer_script_task(script.id)
        
        script.refresh_from_db()
        assert script.status == AnswerScript.ScriptStatus.ASSIGNED
        assert script.ai_total_score is not None
        assert script.question_grades.count() == 2
        assert script.question_grades.first().ai_suggested_score is not None

    def test_evaluator_can_submit_grade(self, api_client, setup_data):
        evaluator = setup_data["evaluator"]
        script = setup_data["script"]
        q1 = setup_data["q1"]
        
        from evaluation.tasks import process_answer_script_task
        process_answer_script_task(script.id)
        
        api_client.force_authenticate(user=evaluator)
        url = reverse('answerscript-submit-grade', kwargs={'pk': script.pk})
        
        response = api_client.post(url, data={
            "question_id": str(q1.id),
            "evaluator_score": 8.5,
            "override_reason": "Good answer"
        }, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        
        script.refresh_from_db()
        grade = script.question_grades.get(question=q1)
        assert grade.evaluator_score == 8.5
        assert script.evaluator_total_score == 8.5
