"""
NexAI Scheduling – Subject, Room, ExamSession, TimetableSlot, InvigilationDuty
These are the core academic/scheduling models consumed by the OR-Tools engine.
"""
import uuid
from django.db import models
from django.core.validators import MinValueValidator


class Subject(models.Model):
    """
    An academic subject (paper) that appears in an exam timetable.
    Tied to a department and a semester; enrolled students link via
    StudentSubjectEnrollment.
    """

    class SubjectType(models.TextChoices):
        CORE = "CORE", "Core Subject"
        ELECTIVE = "ELECTIVE", "Elective Subject"
        LAB = "LAB", "Laboratory / Practical"
        PROJECT = "PROJECT", "Project / Seminar"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # ── Identity ──────────────────────────────────────────────────────────────
    code = models.CharField(max_length=20, unique=True, help_text="e.g. CS601")
    name = models.CharField(max_length=200)
    subject_type = models.CharField(
        max_length=10, choices=SubjectType.choices, default=SubjectType.CORE
    )

    # ── Academic context ──────────────────────────────────────────────────────
    department = models.ForeignKey(
        "users.Department",
        on_delete=models.PROTECT,
        related_name="subjects",
    )
    semester = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1)],
        help_text="Semester number (1–8)",
    )
    credits = models.PositiveSmallIntegerField(default=4)
    batch_year = models.PositiveSmallIntegerField(
        help_text="Batch year this subject applies to (e.g. 2022)"
    )

    # ── Exam duration ─────────────────────────────────────────────────────────
    exam_duration_mins = models.PositiveSmallIntegerField(
        default=180,
        help_text="SEE exam duration in minutes (default 3 hours)",
    )

    # ── Course Outcomes ───────────────────────────────────────────────────────
    co_list = models.JSONField(
        default=list,
        help_text="List of CO codes, e.g. ['CO1','CO2','CO3']",
    )

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "scheduling_subject"
        ordering = ["semester", "code"]
        unique_together = [("code", "batch_year")]

    def __str__(self):
        return f"{self.code} – {self.name} (Sem {self.semester})"


class Room(models.Model):
    """Physical examination room / lab."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True, help_text="e.g. Room 101")
    building = models.CharField(max_length=100)
    floor = models.PositiveSmallIntegerField(default=0)
    total_capacity = models.PositiveSmallIntegerField()
    exam_capacity = models.PositiveSmallIntegerField(
        help_text="Max students allowed during an exam (usually 60–70% of total)"
    )
    has_cctv = models.BooleanField(default=True)
    has_wifi = models.BooleanField(default=False)
    is_lab = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = "scheduling_room"
        ordering = ["building", "floor", "name"]

    def __str__(self):
        return f"{self.name} ({self.building}, Cap: {self.exam_capacity})"


class ExamSession(models.Model):
    """
    A scheduled examination window (e.g. 'Nov-Dec 2024 SEE').
    The OR-Tools engine generates TimetableSlots inside this session.
    """

    class SessionStatus(models.TextChoices):
        DRAFT = "DRAFT", "Draft"
        SCHEDULED = "SCHEDULED", "Timetable Generated"
        ACTIVE = "ACTIVE", "Exams In Progress"
        COMPLETED = "COMPLETED", "Completed"
        CANCELLED = "CANCELLED", "Cancelled"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200, help_text="e.g. Nov-Dec 2024 SEE")
    semester = models.PositiveSmallIntegerField()
    academic_year = models.CharField(max_length=10, help_text="e.g. 2024-25")
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(
        max_length=15,
        choices=SessionStatus.choices,
        default=SessionStatus.DRAFT,
        db_index=True,
    )
    scheduling_task_id = models.CharField(
        max_length=255, blank=True,
        help_text="Celery task ID for OR-Tools scheduling run"
    )
    created_by = models.ForeignKey(
        "users.User",
        on_delete=models.SET_NULL,
        null=True,
        related_name="created_exam_sessions",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "scheduling_exam_session"
        ordering = ["-start_date"]

    def __str__(self):
        return f"{self.name} [{self.status}]"


class TimetableSlot(models.Model):
    """
    A single scheduled exam slot: Subject × Room × Date × Time.
    Generated by the OR-Tools CP-SAT solver via a Celery task.
    """

    class SlotStatus(models.TextChoices):
        SCHEDULED = "SCHEDULED", "Scheduled"
        CONFIRMED = "CONFIRMED", "Confirmed"
        CANCELLED = "CANCELLED", "Cancelled"
        RESCHEDULED = "RESCHEDULED", "Rescheduled"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    exam_session = models.ForeignKey(
        ExamSession,
        on_delete=models.CASCADE,
        related_name="timetable_slots",
    )
    subject = models.ForeignKey(
        Subject,
        on_delete=models.PROTECT,
        related_name="timetable_slots",
    )
    room = models.ForeignKey(
        Room,
        on_delete=models.PROTECT,
        related_name="timetable_slots",
    )

    # ── Time ──────────────────────────────────────────────────────────────────
    exam_date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()

    # ── Status ────────────────────────────────────────────────────────────────
    status = models.CharField(
        max_length=15,
        choices=SlotStatus.choices,
        default=SlotStatus.SCHEDULED,
    )

    # ── Solver metadata ───────────────────────────────────────────────────────
    solver_score = models.FloatField(
        null=True, blank=True,
        help_text="Objective score from OR-Tools solver for this slot"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "scheduling_timetable_slot"
        ordering = ["exam_date", "start_time"]
        # Hard constraint: no two subjects in the same room at the same time
        unique_together = [("room", "exam_date", "start_time")]

    def __str__(self):
        return (
            f"{self.subject.code} | {self.room.name} | "
            f"{self.exam_date} {self.start_time}"
        )


class InvigilationDuty(models.Model):
    """Maps an invigilator (User) to a TimetableSlot."""

    class DutyRole(models.TextChoices):
        CHIEF = "CHIEF", "Chief Invigilator"
        RELIEF = "RELIEF", "Relief Invigilator"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    timetable_slot = models.ForeignKey(
        TimetableSlot,
        on_delete=models.CASCADE,
        related_name="invigilation_duties",
    )
    invigilator = models.ForeignKey(
        "users.User",
        on_delete=models.PROTECT,
        related_name="invigilation_duties",
        limit_choices_to={"role__in": ["INVIGILATOR", "HOD", "EVALUATOR"]},
    )
    duty_role = models.CharField(
        max_length=10,
        choices=DutyRole.choices,
        default=DutyRole.CHIEF,
    )
    assigned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "scheduling_invigilation_duty"
        # An invigilator cannot be in two rooms at the same time
        unique_together = [("timetable_slot", "invigilator")]

    def __str__(self):
        return (
            f"{self.invigilator.full_name} → "
            f"{self.timetable_slot.subject.code} [{self.duty_role}]"
        )


class StudentSubjectEnrollment(models.Model):
    """
    Maps a Student to a Subject for a given ExamSession.
    Used by the OR-Tools engine to enforce 'no student in two exams simultaneously'.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey(
        "users.Student",
        on_delete=models.CASCADE,
        related_name="subject_enrollments",
    )
    subject = models.ForeignKey(
        Subject,
        on_delete=models.CASCADE,
        related_name="student_enrollments",
    )
    exam_session = models.ForeignKey(
        ExamSession,
        on_delete=models.CASCADE,
        related_name="student_enrollments",
    )
    enrolled_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "scheduling_student_subject_enrollment"
        unique_together = [("student", "subject", "exam_session")]

    def __str__(self):
        return (
            f"{self.student.usn} → {self.subject.code} "
            f"[{self.exam_session.name}]"
        )
