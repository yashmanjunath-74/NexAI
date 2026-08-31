"""NexAI - Eligibility Admin"""
from django.contrib import admin
from .models import StudentEligibility, HallTicket

@admin.register(StudentEligibility)
class StudentEligibilityAdmin(admin.ModelAdmin):
    list_display = ["student", "subject", "exam_session", "attendance_percentage", "cie_marks", "is_eligible"]
    list_filter = ["is_eligible", "exam_session", "subject"]
    search_fields = ["student__usn", "student__user__full_name", "subject__code"]
    raw_id_fields = ["student", "subject", "exam_session"]

@admin.register(HallTicket)
class HallTicketAdmin(admin.ModelAdmin):
    list_display = ["ticket_number", "student", "exam_session", "is_revoked"]
    list_filter = ["is_revoked", "exam_session"]
    search_fields = ["ticket_number", "student__usn", "student__user__full_name"]
    raw_id_fields = ["student", "exam_session"]
    readonly_fields = ["ticket_number"]
