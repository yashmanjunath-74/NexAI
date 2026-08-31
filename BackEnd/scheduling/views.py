"""NexAI Scheduling – API Views"""
from celery.result import AsyncResult
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from core.permissions import IsChiefSuperintendent, IsStaff
from .models import Subject, Room, ExamSession, TimetableSlot, InvigilationDuty
from .serializers import (
    SubjectSerializer,
    RoomSerializer,
    ExamSessionSerializer,
    TimetableSlotSerializer,
    InvigilationDutySerializer,
    TimetableGenerateSerializer,
)


# ─── Subject ──────────────────────────────────────────────────────────────────

class SubjectListCreateView(generics.ListCreateAPIView):
    """List all subjects or create a new one. CoE/HOD only for writes."""
    serializer_class = SubjectSerializer
    permission_classes = [IsStaff]
    queryset = Subject.objects.select_related("department").filter(is_active=True)
    filterset_fields = ["semester", "subject_type", "department", "batch_year"]
    search_fields = ["code", "name"]
    ordering_fields = ["semester", "code", "created_at"]


class SubjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or soft-delete a subject."""
    serializer_class = SubjectSerializer
    permission_classes = [IsChiefSuperintendent]
    queryset = Subject.objects.select_related("department")

    def perform_destroy(self, instance):
        # Soft delete
        instance.is_active = False
        instance.save(update_fields=["is_active"])


# ─── Room ─────────────────────────────────────────────────────────────────────

class RoomListCreateView(generics.ListCreateAPIView):
    serializer_class = RoomSerializer
    permission_classes = [IsStaff]
    queryset = Room.objects.filter(is_active=True)
    filterset_fields = ["is_lab", "has_wifi", "building"]
    search_fields = ["name", "building"]


class RoomDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = RoomSerializer
    permission_classes = [IsChiefSuperintendent]
    queryset = Room.objects.all()

    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save(update_fields=["is_active"])


# ─── ExamSession ─────────────────────────────────────────────────────────────

class ExamSessionListCreateView(generics.ListCreateAPIView):
    serializer_class = ExamSessionSerializer
    permission_classes = [IsChiefSuperintendent]
    queryset = ExamSession.objects.select_related("created_by").prefetch_related("timetable_slots")
    filterset_fields = ["status", "semester", "academic_year"]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class ExamSessionDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = ExamSessionSerializer
    permission_classes = [IsChiefSuperintendent]
    queryset = ExamSession.objects.all()


# ─── Timetable ────────────────────────────────────────────────────────────────

class TimetableSlotListView(generics.ListAPIView):
    """Public read: all staff can view the timetable."""
    serializer_class = TimetableSlotSerializer
    permission_classes = [IsStaff]
    filterset_fields = ["exam_session", "exam_date", "status", "subject", "room"]
    ordering_fields = ["exam_date", "start_time"]

    def get_queryset(self):
        return TimetableSlot.objects.select_related(
            "subject", "room", "exam_session"
        ).all()


@api_view(["POST"])
@permission_classes([IsChiefSuperintendent])
def trigger_timetable_generation(request):
    """
    POST /api/v1/scheduling/timetable/generate/

    Triggers an async Celery task to run the OR-Tools CP-SAT solver.
    Returns the Celery task ID for polling.
    """
    from .tasks import generate_timetable

    serializer = TimetableGenerateSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    exam_session_id = str(serializer.validated_data["exam_session_id"])
    time_limit = serializer.validated_data["time_limit_secs"]

    # Verify session exists and is in DRAFT status
    try:
        session = ExamSession.objects.get(id=exam_session_id)
    except ExamSession.DoesNotExist:
        return Response(
            {"error": "ExamSession not found"},
            status=status.HTTP_404_NOT_FOUND,
        )

    if session.status not in (
        ExamSession.SessionStatus.DRAFT,
        ExamSession.SessionStatus.SCHEDULED,  # allow re-generation
    ):
        return Response(
            {"error": f"Cannot generate timetable for session in status '{session.status}'"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Dispatch Celery task
    task = generate_timetable.apply_async(
        kwargs={"exam_session_id": exam_session_id, "time_limit_secs": time_limit},
        countdown=0,
    )

    return Response(
        {
            "success": True,
            "task_id": task.id,
            "message": (
                f"Timetable generation started for session '{session.name}'. "
                f"Poll /scheduling/timetable/status/{task.id}/ for progress."
            ),
        },
        status=status.HTTP_202_ACCEPTED,
    )


@api_view(["GET"])
@permission_classes([IsChiefSuperintendent])
def timetable_task_status(request, task_id: str):
    """
    GET /api/v1/scheduling/timetable/status/<task_id>/
    Poll the status of a running OR-Tools Celery task.
    """
    task_result = AsyncResult(task_id)
    return Response(
        {
            "task_id": task_id,
            "status": task_result.status,
            "ready": task_result.ready(),
            "result": task_result.result if task_result.ready() else None,
        }
    )


# ─── Invigilation ─────────────────────────────────────────────────────────────

class InvigilationDutyListCreateView(generics.ListCreateAPIView):
    serializer_class = InvigilationDutySerializer
    permission_classes = [IsChiefSuperintendent]
    queryset = InvigilationDuty.objects.select_related(
        "invigilator", "timetable_slot__subject", "timetable_slot__room"
    )
    filterset_fields = ["timetable_slot", "invigilator", "duty_role"]
