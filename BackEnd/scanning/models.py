"""
NexAI Scanning – ScanningSession and BookletPacket models.
A ScanningSession is opened by an Invigilator for a specific TimetableSlot.
"""
import uuid
from django.db import models


class ScanningSession(models.Model):
    """
    Time-bound, room-specific, geofenced session authorizing
    an Invigilator to upload scanned booklets.
    """

    class SessionStatus(models.TextChoices):
        PENDING = "PENDING", "Pending Activation"
        ACTIVE = "ACTIVE", "Active"
        EXPIRED = "EXPIRED", "Expired"
        CLOSED = "CLOSED", "Manually Closed"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    timetable_slot = models.ForeignKey(
        "scheduling.TimetableSlot",
        on_delete=models.PROTECT,
        related_name="scanning_sessions",
    )
    invigilator = models.ForeignKey(
        "users.User",
        on_delete=models.PROTECT,
        related_name="scanning_sessions",
        limit_choices_to={"role": "INVIGILATOR"},
    )

    session_token = models.UUIDField(
        default=uuid.uuid4, unique=True,
        help_text="One-time token sent to the mobile app for session validation",
    )

    # ── Geofence ──────────────────────────────────────────────────────────────
    geofence_lat = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    geofence_lng = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    geofence_radius_m = models.PositiveSmallIntegerField(
        default=200,
        help_text="Allowed radius in meters from the room coordinates",
    )

    status = models.CharField(
        max_length=10,
        choices=SessionStatus.choices,
        default=SessionStatus.PENDING,
        db_index=True,
    )

    activated_at = models.DateTimeField(null=True, blank=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "scanning_session"
        ordering = ["-created_at"]

    def __str__(self):
        return (
            f"Session {self.session_token} | "
            f"{self.timetable_slot} [{self.status}]"
        )
