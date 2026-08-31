"""NexAI Users – Extended Admin Registration"""
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Department, BiometricProfile, Student


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ["email", "full_name", "role", "department", "is_active"]
    list_filter = ["role", "department", "is_active"]
    search_fields = ["email", "full_name", "employee_id"]
    ordering = ["-created_at"]
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Personal Info", {"fields": ("full_name", "phone", "employee_id")}),
        ("Role & Department", {"fields": ("role", "department")}),
        ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
    )
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("email", "full_name", "role", "department", "password1", "password2"),
        }),
    )


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ["code", "name", "hod"]
    search_fields = ["code", "name"]


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ["usn", "full_name", "department", "current_semester",
                    "batch_year", "overall_attendance_pct", "is_eligible_for_exam"]
    list_filter = ["department", "current_semester", "batch_year", "is_eligible_for_exam"]
    search_fields = ["usn", "user__full_name", "user__email"]
    ordering = ["usn"]
    readonly_fields = ["created_at", "updated_at"]


@admin.register(BiometricProfile)
class BiometricProfileAdmin(admin.ModelAdmin):
    list_display = ["student", "enrolled_at", "last_verified_at"]
    search_fields = ["student__email", "student__full_name"]
