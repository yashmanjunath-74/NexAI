from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from users.models import Student
from eligibility.models import HallTicket, StudentEligibility
from eligibility.serializers import HallTicketSerializer
from evaluation.models import AnswerScriptKeyMap
from .models import Result
from .serializers import ResultSerializer

class StudentPortalViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def _get_student(self, user):
        try:
            return Student.objects.get(user=user)
        except Student.DoesNotExist:
            return None

    @action(detail=False, methods=['get'])
    def my_profile(self, request):
        student = self._get_student(request.user)
        if not student:
            return Response({"error": "Student profile not found"}, status=status.HTTP_404_NOT_FOUND)
        
        return Response({
            "usn": student.usn,
            "name": student.user.full_name,
            "department": student.department.name,
            "semester": student.current_semester,
            "batch_year": student.batch_year
        })

    @action(detail=False, methods=['get'])
    def my_hall_tickets(self, request):
        student = self._get_student(request.user)
        if not student:
            return Response({"error": "Student profile not found"}, status=status.HTTP_404_NOT_FOUND)
            
        hall_tickets = HallTicket.objects.filter(student=student)
        serializer = HallTicketSerializer(hall_tickets, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def my_results(self, request):
        student = self._get_student(request.user)
        if not student:
            return Response({"error": "Student profile not found"}, status=status.HTTP_404_NOT_FOUND)
            
        # For MVP: Dynamically fetch AnswerScript SEE marks and update/create Result.
        # We need to find all AnswerScriptKeyMap for this student.
        key_maps = AnswerScriptKeyMap.objects.filter(student=student).select_related('answer_script')
        
        for key_map in key_maps:
            script = key_map.answer_script
            if script.status == 'COMPLETED':
                # Find the timetable slot to get subject and session
                # The AnswerScript belongs to an ExamSession and a Subject
                # Oh wait, AnswerScript belongs to ScanningSession -> TimetableSlot -> Subject
                timetable_slot = script.scanning_session.timetable_slot
                
                # Fetch or create the Result record
                result, created = Result.objects.get_or_create(
                    student=student,
                    subject=timetable_slot.subject,
                    exam_session=timetable_slot.exam_session,
                    defaults={
                        'cie_marks': 40.00 # Mock CIE marks for MVP if not already in system
                    }
                )
                
                # Update SEE marks
                if result.see_marks != script.evaluator_total_score:
                    result.see_marks = script.evaluator_total_score
                    result.save() # This triggers the grade calculation
                    
        # Now return all results
        results = Result.objects.filter(student=student).order_by('-exam_session__start_date', 'subject__code')
        serializer = ResultSerializer(results, many=True)
        return Response(serializer.data)
