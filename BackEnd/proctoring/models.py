import uuid
from django.db import models
from users.models import Student
from scheduling.models import TimetableSlot

class ProctoringSession(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="proctoring_sessions")
    timetable_slot = models.ForeignKey(TimetableSlot, on_delete=models.CASCADE, related_name="proctoring_sessions")
    
    is_active = models.BooleanField(default=True)
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "proctoring_session"

class ProctoringEvent(models.Model):
    class EventTypeChoices(models.TextChoices):
        NO_FACE = "NO_FACE", "No Face Detected"
        MULTIPLE_FACES = "MULTIPLE_FACES", "Multiple Faces Detected"
        MOBILE_PHONE = "MOBILE_PHONE", "Mobile Phone Detected"
        LOOKING_AWAY = "LOOKING_AWAY", "Looking Away from Screen"
        TAB_SWITCH = "TAB_SWITCH", "Tab Switch Detected"

    class SeverityChoices(models.TextChoices):
        LOW = "LOW", "Low"
        MEDIUM = "MEDIUM", "Medium"
        HIGH = "HIGH", "High"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    session = models.ForeignKey(ProctoringSession, on_delete=models.CASCADE, related_name="events")
    timestamp = models.DateTimeField(auto_now_add=True)
    
    event_type = models.CharField(max_length=50, choices=EventTypeChoices.choices)
    severity = models.CharField(max_length=10, choices=SeverityChoices.choices, default=SeverityChoices.MEDIUM)
    screenshot_url = models.URLField(max_length=500, blank=True, null=True, help_text="S3 URL for the evidence frame")

    class Meta:
        db_table = "proctoring_event"
        ordering = ["-timestamp"]
