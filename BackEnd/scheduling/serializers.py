"""NexAI Scheduling – Serializers"""
from rest_framework import serializers
from .models import Subject, Room, ExamSession, TimetableSlot, InvigilationDuty, StudentSubjectEnrollment


class SubjectSerializer(serializers.ModelSerializer):
    department_code = serializers.CharField(source="department.code", read_only=True)
    department_name = serializers.CharField(source="department.name", read_only=True)

    class Meta:
        model = Subject
        fields = [
            "id", "code", "name", "subject_type", "department", "department_code",
            "department_name", "semester", "credits", "batch_year",
            "exam_duration_mins", "co_list", "is_active", "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = [
            "id", "name", "building", "floor", "total_capacity",
            "exam_capacity", "has_cctv", "has_wifi", "is_lab", "is_active",
        ]
        read_only_fields = ["id"]


class ExamSessionSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source="created_by.full_name", read_only=True)
    slot_count = serializers.SerializerMethodField()

    class Meta:
        model = ExamSession
        fields = [
            "id", "name", "semester", "academic_year", "start_date", "end_date",
            "status", "scheduling_task_id", "created_by", "created_by_name",
            "slot_count", "created_at",
        ]
        read_only_fields = ["id", "scheduling_task_id", "status", "created_at"]

    def get_slot_count(self, obj):
        return obj.timetable_slots.count()


class TimetableSlotSerializer(serializers.ModelSerializer):
    subject_code = serializers.CharField(source="subject.code", read_only=True)
    subject_name = serializers.CharField(source="subject.name", read_only=True)
    room_name = serializers.CharField(source="room.name", read_only=True)
    room_capacity = serializers.IntegerField(source="room.exam_capacity", read_only=True)

    class Meta:
        model = TimetableSlot
        fields = [
            "id", "exam_session", "subject", "subject_code", "subject_name",
            "room", "room_name", "room_capacity",
            "exam_date", "start_time", "end_time", "status", "solver_score",
        ]
        read_only_fields = ["id", "solver_score"]


class InvigilationDutySerializer(serializers.ModelSerializer):
    invigilator_name = serializers.CharField(source="invigilator.full_name", read_only=True)

    class Meta:
        model = InvigilationDuty
        fields = ["id", "timetable_slot", "invigilator", "invigilator_name", "duty_role", "assigned_at"]
        read_only_fields = ["id", "assigned_at"]


class TimetableGenerateSerializer(serializers.Serializer):
    """Request body for triggering the Celery timetabling task."""
    exam_session_id = serializers.UUIDField()
    time_limit_secs = serializers.IntegerField(default=120, min_value=30, max_value=600)
