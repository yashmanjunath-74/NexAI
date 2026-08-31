from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import AnswerScript, ScriptPage, QuestionGrade
from .serializers import AnswerScriptSerializer, ScriptPageSerializer, QuestionGradeSerializer
from .tasks import process_answer_script_task

class AnswerScriptViewSet(viewsets.ModelViewSet):
    queryset = AnswerScript.objects.all()
    serializer_class = AnswerScriptSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "INVIGILATOR":
            return AnswerScript.objects.filter(uploaded_by=user)
        elif user.role in ["EVALUATOR", "SCRUTINIZER"]:
            return AnswerScript.objects.filter(assigned_evaluator=user)
        elif user.role == "CHIEF_SUPERINTENDENT":
            return AnswerScript.objects.all()
        return AnswerScript.objects.none()

    @action(detail=True, methods=['post'])
    def upload_page(self, request, pk=None):
        """
        Invigilator uploads a single scanned page of the script.
        """
        script = self.get_object()
        if script.upload_complete:
            return Response({"error": "Upload is already marked as complete."}, status=status.HTTP_400_BAD_REQUEST)

        # In reality we would save the file to S3 and generate a URL
        # For simulation, we'll just increment page count and save a dummy URL
        page_number = script.page_count + 1
        dummy_url = f"https://nexai-mock-bucket.s3.amazonaws.com/scripts/{script.id}/page_{page_number}.jpg"
        
        ScriptPage.objects.create(
            answer_script=script,
            page_number=page_number,
            s3_url=dummy_url,
            quality_score=15.0
        )
        
        script.page_count = page_number
        script.save()

        return Response({"status": "page uploaded", "page_number": page_number})

    @action(detail=True, methods=['post'])
    def complete_upload(self, request, pk=None):
        """
        Invigilator finalizes the upload. Triggers the AI Auto-Evaluation.
        """
        script = self.get_object()
        if script.upload_complete:
            return Response({"error": "Already complete."}, status=status.HTTP_400_BAD_REQUEST)

        script.upload_complete = True
        script.upload_completed_at = timezone.now()
        script.save()

        # Trigger Celery Task
        process_answer_script_task.delay(script.id)

        return Response({"status": "upload completed, AI evaluation triggered."})

    @action(detail=True, methods=['post'])
    def submit_grade(self, request, pk=None):
        """
        Evaluator submits the final grade for a specific question.
        Expects {"question_id": UUID, "evaluator_score": float, "override_reason": str}
        """
        script = self.get_object()
        user = request.user

        if script.assigned_evaluator != user:
            return Response({"error": "You are not assigned to this script."}, status=status.HTTP_403_FORBIDDEN)

        question_id = request.data.get('question_id')
        score = request.data.get('evaluator_score')
        reason = request.data.get('override_reason', '')

        try:
            grade = QuestionGrade.objects.get(answer_script=script, question_id=question_id)
        except QuestionGrade.DoesNotExist:
            return Response({"error": "Question grade record not found."}, status=status.HTTP_404_NOT_FOUND)

        grade.evaluator_score = score
        grade.evaluator = user
        grade.override_reason = reason
        grade.evaluated_at = timezone.now()
        grade.save()

        # Recalculate total evaluator score
        total = sum(g.evaluator_score for g in script.question_grades.all() if g.evaluator_score is not None)
        script.evaluator_total_score = total
        script.save()

        return Response({"status": "grade saved", "evaluator_total_score": total})
