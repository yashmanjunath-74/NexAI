"""NexAI - Eligibility API Views"""
from rest_framework import viewsets, views, status, generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from core.permissions import IsHOD, IsStudent
from .models import StudentEligibility, HallTicket
from .serializers import (
    StudentEligibilitySerializer, HallTicketSerializer,
    BulkEligibilityUploadSerializer
)
from .tasks import process_eligibility_csv, generate_hall_tickets_for_session
from scheduling.models import ExamSession


class StudentEligibilityViewSet(viewsets.ReadOnlyModelViewSet):
    """
    HOD can view all eligibility records.
    Student can only view their own records.
    """
    serializer_class = StudentEligibilitySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'student_profile'):
            return StudentEligibility.objects.filter(student=user.student_profile)
        # HODs/Admins can see all or filter by session
        qs = StudentEligibility.objects.all()
        session_id = self.request.query_params.get('session_id')
        if session_id:
            qs = qs.filter(exam_session_id=session_id)
        return qs


class HallTicketViewSet(viewsets.ReadOnlyModelViewSet):
    """
    HOD can view all hall tickets.
    Student can only view their own hall ticket.
    """
    serializer_class = HallTicketSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'student_profile'):
            return HallTicket.objects.filter(student=user.student_profile, is_revoked=False)
        qs = HallTicket.objects.all()
        session_id = self.request.query_params.get('session_id')
        if session_id:
            qs = qs.filter(exam_session_id=session_id)
        return qs


class BulkEligibilityUploadView(views.APIView):
    """
    Accepts a CSV upload and triggers Celery task.
    """
    permission_classes = [IsHOD]

    def post(self, request, *args, **kwargs):
        serializer = BulkEligibilityUploadSerializer(data=request.data)
        if serializer.is_valid():
            file_obj = serializer.validated_data['file']
            session_id = serializer.validated_data['exam_session_id']
            
            # Read file content as string
            try:
                file_content = file_obj.read().decode('utf-8')
            except Exception as e:
                return Response({"error": "Failed to read CSV. Ensure it is UTF-8 encoded."}, status=status.HTTP_400_BAD_REQUEST)

            # Trigger celery task
            task = process_eligibility_csv.delay(file_content, str(session_id))
            
            return Response({
                "message": "CSV upload accepted. Processing started.",
                "task_id": task.id
            }, status=status.HTTP_202_ACCEPTED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GenerateHallTicketsView(views.APIView):
    """
    Triggers generation of Hall Tickets for an Exam Session.
    """
    permission_classes = [IsHOD]

    def post(self, request, session_id):
        # Verify session exists
        if not ExamSession.objects.filter(id=session_id).exists():
            return Response({"error": "Session not found"}, status=status.HTTP_404_NOT_FOUND)
        
        task = generate_hall_tickets_for_session.delay(str(session_id))
        
        return Response({
            "message": "Hall ticket generation started.",
            "task_id": task.id
        }, status=status.HTTP_202_ACCEPTED)
