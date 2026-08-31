import uuid
from django.db import models
from users.models import User

class AuditLog(models.Model):
    class ActionChoices(models.TextChoices):
        VAULT_UNLOCK = "VAULT_UNLOCK", "Question Paper Vault Unlocked"
        PAPER_APPROVED = "PAPER_APPROVED", "Question Paper Approved"
        GRADE_OVERRIDE = "GRADE_OVERRIDE", "Student Grade Overridden"
        ELIGIBILITY_UPDATE = "ELIGIBILITY_UPDATE", "Student Eligibility Mass Updated"
        SYSTEM_CONFIG = "SYSTEM_CONFIG", "System Configuration Changed"

    class SeverityChoices(models.TextChoices):
        LOW = "LOW", "Low"
        MEDIUM = "MEDIUM", "Medium"
        HIGH = "HIGH", "High"
        CRITICAL = "CRITICAL", "Critical"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    timestamp = models.DateTimeField(auto_now_add=True)
    actor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="audit_logs")
    action = models.CharField(max_length=50, choices=ActionChoices.choices)
    severity = models.CharField(max_length=10, choices=SeverityChoices.choices, default=SeverityChoices.LOW)
    details = models.JSONField(default=dict, help_text="Additional metadata regarding the action")
    ip_address = models.GenericIPAddressField(null=True, blank=True)

    class Meta:
        db_table = "analytics_audit_log"
        ordering = ["-timestamp"]

    def __str__(self):
        return f"{self.action} by {self.actor} at {self.timestamp}"
