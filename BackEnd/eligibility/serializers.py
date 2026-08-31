"""NexAI - Eligibility Serializers"""
from rest_framework import serializers
from .models import StudentEligibility, HallTicket
from users.serializers import StudentSerializer
from scheduling.serializers import SubjectSerializer, ExamSessionSerializer


class StudentEligibilitySerializer(serializers.ModelSerializer):
    student_details = StudentSerializer(source="student", read_only=True)
    subject_details = SubjectSerializer(source="subject", read_only=True)

    class Meta:
        model = StudentEligibility
        fields = [
            "id", "student", "subject", "exam_session",
            "attendance_percentage", "cie_marks",
            "is_eligible", "remarks",
            "student_details", "subject_details",
            "created_at", "updated_at"
        ]
        read_only_fields = ["is_eligible", "remarks"]


class HallTicketSerializer(serializers.ModelSerializer):
    student_details = StudentSerializer(source="student", read_only=True)
    exam_session_details = ExamSessionSerializer(source="exam_session", read_only=True)

    class Meta:
        model = HallTicket
        fields = [
            "id", "ticket_number", "student", "exam_session",
            "qr_code_data", "is_revoked",
            "student_details", "exam_session_details",
            "created_at"
        ]
        read_only_fields = ["ticket_number", "qr_code_data", "is_revoked"]


class BulkEligibilityUploadSerializer(serializers.Serializer):
    """
    Serializer for handling CSV uploads for bulk eligibility data.
    The file should have columns: usn, subject_code, attendance, cie
    """
    file = serializers.FileField()
    exam_session_id = serializers.UUIDField()

    def validate_file(self, value):
        if not value.name.endswith('.csv'):
            raise serializers.ValidationError("Only CSV files are allowed.")
        return value
