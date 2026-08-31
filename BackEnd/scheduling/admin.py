"""NexAI Scheduling – Admin Registration"""
from django.contrib import admin
from .models import (
    Subject, Room, ExamSession, TimetableSlot,
    InvigilationDuty, StudentSubjectEnrollment,
)


@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ["code", "name", "subject_type", "department", "semester", "credits", "is_active"]
    list_filter = ["subject_type", "semester", "department", "is_active"]
    search_fields = ["code", "name"]
    ordering = ["semester", "code"]


@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ["name", "building", "floor", "exam_capacity", "has_cctv", "has_wifi", "is_active"]
    list_filter = ["building", "is_lab", "has_wifi", "is_active"]
    search_fields = ["name", "building"]


@admin.register(ExamSession)
class ExamSessionAdmin(admin.ModelAdmin):
    list_display = ["name", "semester", "academic_year", "start_date", "end_date", "status"]
    list_filter = ["status", "semester", "academic_year"]
    search_fields = ["name"]
    readonly_fields = ["scheduling_task_id"]


@admin.register(TimetableSlot)
class TimetableSlotAdmin(admin.ModelAdmin):
    list_display = ["subject", "room", "exam_date", "start_time", "end_time", "status"]
    list_filter = ["status", "exam_date", "exam_session"]
    search_fields = ["subject__code", "room__name"]
    ordering = ["exam_date", "start_time"]


@admin.register(InvigilationDuty)
class InvigilationDutyAdmin(admin.ModelAdmin):
    list_display = ["invigilator", "timetable_slot", "duty_role", "assigned_at"]
    list_filter = ["duty_role"]
    search_fields = ["invigilator__full_name", "invigilator__email"]


@admin.register(StudentSubjectEnrollment)
class StudentSubjectEnrollmentAdmin(admin.ModelAdmin):
    list_display = ["student", "subject", "exam_session", "enrolled_at"]
    list_filter = ["exam_session", "subject"]
    search_fields = ["student__usn", "subject__code"]
