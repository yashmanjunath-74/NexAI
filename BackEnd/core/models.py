"""NexAI Core App – Base Models & Shared Utilities"""
import uuid
from django.db import models


class TimestampedModel(models.Model):
    """Abstract base model that adds created_at and updated_at timestamps."""

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class UUIDModel(models.Model):
    """Abstract base model using UUID as primary key."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    class Meta:
        abstract = True


class BaseModel(UUIDModel, TimestampedModel):
    """Combine UUID PK + timestamps – the standard base for NexAI models."""

    class Meta:
        abstract = True
