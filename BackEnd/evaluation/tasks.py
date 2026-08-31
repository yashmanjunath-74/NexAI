import logging
from celery import shared_task
from django.db import transaction
from vault.models import Question
from .models import AnswerScript, QuestionGrade
from .ai_engine import extract_text_from_image, calculate_bert_similarity

logger = logging.getLogger(__name__)

@shared_task
def process_answer_script_task(script_id):
    """
    Celery task that runs the AI evaluation engine on an uploaded AnswerScript.
    It iterates through all questions in the paper, generates a mock OCR/BERT score,
    and updates the database.
    """
    try:
        script = AnswerScript.objects.get(id=script_id)
        if script.status != AnswerScript.ScriptStatus.UPLOADED:
            return f"Script {script_id} already processing or processed."

        # Mark as in progress temporarily (though it's usually fast, real BERT is slow)
        script.status = AnswerScript.ScriptStatus.IN_PROGRESS
        script.save()

        total_ai_score = 0
        questions = Question.objects.filter(question_paper=script.question_paper)
        
        with transaction.atomic():
            for q in questions:
                # 1. Simulate OCR
                student_text = extract_text_from_image(b"fake_image_bytes")
                
                # 2. Simulate BERT (comparing against a fake rubric)
                rubric_text = "Expected answer text"
                score_pct, confidence, feedback = calculate_bert_similarity(student_text, rubric_text)
                
                # 3. Calculate absolute score
                suggested_score = round(q.marks * score_pct, 2)
                total_ai_score += suggested_score
                
                # 4. Save Grade
                QuestionGrade.objects.create(
                    answer_script=script,
                    question=q,
                    ai_suggested_score=suggested_score,
                    ai_confidence=confidence,
                    ai_feedback=feedback
                )

        script.ai_total_score = total_ai_score
        script.status = AnswerScript.ScriptStatus.ASSIGNED  # Ready for human evaluator
        script.save()
        
        return f"Successfully evaluated script {script_id}"

    except AnswerScript.DoesNotExist:
        logger.error(f"AnswerScript {script_id} not found.")
    except Exception as e:
        logger.error(f"Error processing script {script_id}: {str(e)}")
