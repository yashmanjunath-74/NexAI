from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import AuditLog
from .serializers import AuditLogSerializer
from student.models import Result
from core.permissions import IsChiefSuperintendent
from django.db.models import Avg, Count

class AuditLedgerViewSet(viewsets.ReadOnlyModelViewSet):
    """
    CoE read-only access to the immutable audit ledger.
    """
    queryset = AuditLog.objects.all()
    serializer_class = AuditLogSerializer
    permission_classes = [IsAuthenticated, IsChiefSuperintendent]


class PerformanceMetricsViewSet(viewsets.ViewSet):
    """
    Institutional metrics for CoE Dashboard.
    """
    permission_classes = [IsAuthenticated, IsChiefSuperintendent]

    @action(detail=False, methods=['get'])
    def summary(self, request):
        # Calculate institutional metrics based on Results
        total_results = Result.objects.count()
        if total_results == 0:
            return Response({
                "total_students_evaluated": 0,
                "average_gpa": 0,
                "pass_percentage": 0,
            })
            
        # Passing means grade is not F or ABSENT
        passed_results = Result.objects.exclude(grade__in=['F', 'ABSENT']).count()
        pass_percentage = (passed_results / total_results) * 100
        
        # Approximate GPA by mapping grades to numbers
        # In a real app we'd do this via DB annotation, but doing it simply here for MVP
        grade_points = {'S': 10, 'A': 9, 'B': 8, 'C': 7, 'D': 6, 'E': 5, 'F': 0, 'ABSENT': 0}
        
        total_points = 0
        valid_results = 0
        for result in Result.objects.all():
            if result.grade in grade_points:
                total_points += grade_points[result.grade]
                valid_results += 1
                
        average_gpa = total_points / valid_results if valid_results > 0 else 0
        
        return Response({
            "total_students_evaluated": total_results,
            "average_gpa": round(average_gpa, 2),
            "pass_percentage": round(pass_percentage, 1)
        })
