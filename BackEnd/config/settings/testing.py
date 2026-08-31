"""NexAI – Test Settings (SQLite, no Redis, no S3)"""
from .base import *  # noqa: F401, F403

DEBUG = True
ALLOWED_HOSTS = ["*"]

# ── Use SQLite for fast test execution (no PostgreSQL required) ──────────────
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": ":memory:",
    }
}

# ── No Channels/Redis for unit tests ────────────────────────────────────────
CHANNEL_LAYERS = {"default": {"BACKEND": "channels.layers.InMemoryChannelLayer"}}

# ── No S3 / MinIO for unit tests ─────────────────────────────────────────────
DEFAULT_FILE_STORAGE = "django.core.files.storage.FileSystemStorage"

# ── Celery runs tasks synchronously in tests ─────────────────────────────────
CELERY_BROKER_URL = "memory://"
CELERY_TASK_ALWAYS_EAGER = True
CELERY_TASK_EAGER_PROPAGATES = True

# ── Disable Celery results backend for unit tests ────────────────────────────
CELERY_RESULT_BACKEND = "cache"
CELERY_CACHE_BACKEND = "memory"

# ── Use LocMemCache instead of Redis for unit tests ──────────────────────────
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "LOCATION": "unique-snowflake",
    }
}

# ── Remove heavy third-party apps not needed in unit tests ───────────────────
INSTALLED_APPS = [
    app for app in INSTALLED_APPS  # noqa: F405
    if app not in ("debug_toolbar", "django_celery_beat")
]

EMAIL_BACKEND = "django.core.mail.backends.locmem.EmailBackend"

# ── Password hashing: use fastest hasher in tests ────────────────────────────
PASSWORD_HASHERS = ["django.contrib.auth.hashers.MD5PasswordHasher"]

# ── Disable API throttling for tests ─────────────────────────────────────────
REST_FRAMEWORK = {
    **REST_FRAMEWORK,
    "DEFAULT_THROTTLE_CLASSES": [],
}
