"""
NexAI Vault – QuestionPaper model
The question paper lifecycle: DRAFT → SUBMITTED → APPROVED → ENCRYPTED → DISTRIBUTED
"""
import uuid
from django.db import models


class QuestionPaper(models.Model):
    """
    A question paper for a specific Subject + ExamSession combination.
    Authored by a Paper Setter, approved by CoE, then AES-256-GCM encrypted
    and stored in S3/MinIO with a time-locked key.
    """

    class PaperStatus(models.TextChoices):
        DRAFT = "DRAFT", "Draft – Being Authored"
        SUBMITTED = "SUBMITTED", "Submitted for Approval"
        APPROVED = "APPROVED", "Approved by CoE"
        REJECTED = "REJECTED", "Rejected – Needs Revision"
        ENCRYPTED = "ENCRYPTED", "Encrypted & Locked in Vault"
        DISTRIBUTED = "DISTRIBUTED", "AES Key Distributed"

    class DifficultyLevel(models.TextChoices):
        EASY = "EASY", "Easy"
        MEDIUM = "MEDIUM", "Medium"
        HARD = "HARD", "Hard"
        MIXED = "MIXED", "Mixed"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # ── Academic Context ──────────────────────────────────────────────────────
    subject = models.ForeignKey(
        "scheduling.Subject",
        on_delete=models.PROTECT,
        related_name="question_papers",
    )
    exam_session = models.ForeignKey(
        "scheduling.ExamSession",
        on_delete=models.PROTECT,
        related_name="question_papers",
    )

    # ── Authorship ────────────────────────────────────────────────────────────
    setter = models.ForeignKey(
        "users.User",
        on_delete=models.PROTECT,
        related_name="authored_papers",
        limit_choices_to={"role": "PAPER_SETTER"},
    )
    setter_access_token = models.UUIDField(
        default=uuid.uuid4,
        help_text="Time-expiring token issued by Dean to grant setter access",
    )
    token_expires_at = models.DateTimeField(
        null=True, blank=True,
        help_text="When the setter's authoring token expires",
    )

    # ── Content Metadata ──────────────────────────────────────────────────────
    title = models.CharField(max_length=300)
    total_marks = models.PositiveSmallIntegerField(default=100)
    duration_mins = models.PositiveSmallIntegerField(default=180)
    difficulty_level = models.CharField(
        max_length=10,
        choices=DifficultyLevel.choices,
        default=DifficultyLevel.MIXED,
    )
    instructions = models.TextField(blank=True)

    # ── Status & Approval ────────────────────────────────────────────────────
    status = models.CharField(
        max_length=15,
        choices=PaperStatus.choices,
        default=PaperStatus.DRAFT,
        db_index=True,
    )
    approved_by = models.ForeignKey(
        "users.User",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="approved_papers",
        limit_choices_to={"role": "CHIEF_SUPERINTENDENT"},
    )
    approved_at = models.DateTimeField(null=True, blank=True)
    rejection_note = models.TextField(blank=True)

    # ── Vault / Encryption ────────────────────────────────────────────────────
    ipfs_cid = models.CharField(
        max_length=500, blank=True,
        help_text="IPFS Content Identifier for the AES-256-GCM encrypted PDF blob",
    )
    aes_key_hash = models.CharField(
        max_length=128, blank=True,
        help_text="SHA-256 hash of the AES key",
    )
    encrypted_aes_key = models.BinaryField(
        blank=True, null=True,
        help_text="Symmetrically encrypted AES key (unlocked only by backend master key/HSM)",
    )
    key_unlock_timestamp = models.DateTimeField(
        null=True, blank=True,
        help_text="UTC time when AES key is automatically released",
    )
    key_distributed_at = models.DateTimeField(null=True, blank=True)

    # ── CO-PO Coverage Summary ────────────────────────────────────────────────
    co_coverage = models.JSONField(
        default=dict,
        help_text="Dict mapping CO codes to marks covered, e.g. {'CO1':20,'CO2':30}",
    )
    bloom_distribution = models.JSONField(
        default=dict,
        help_text="Bloom's taxonomy marks distribution, e.g. {'REMEMBER':10,'UNDERSTAND':30}",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "vault_question_paper"
        ordering = ["-created_at"]
        unique_together = [("subject", "exam_session")]
        verbose_name = "Question Paper"
        verbose_name_plural = "Question Papers"

    def __str__(self):
        return f"{self.subject.code} – {self.exam_session.name} [{self.status}]"

    @property
    def is_locked(self):
        return self.status in (
            self.PaperStatus.ENCRYPTED,
            self.PaperStatus.DISTRIBUTED,
        )

    @property
    def is_editable(self):
        return self.status in (self.PaperStatus.DRAFT, self.PaperStatus.REJECTED)


class Question(models.Model):
    """Individual question within a QuestionPaper."""

    class QuestionType(models.TextChoices):
        MCQ = "MCQ", "Multiple Choice"
        SHORT = "SHORT", "Short Answer"
        DESCRIPTIVE = "DESC", "Descriptive"
        DIAGRAM = "DRAW", "Diagram / Derivation"
        NUMERICAL = "NUM", "Numerical Problem"

    class BloomLevel(models.TextChoices):
        REMEMBER = "REMEMBER", "Remember (L1)"
        UNDERSTAND = "UNDERSTAND", "Understand (L2)"
        APPLY = "APPLY", "Apply (L3)"
        ANALYZE = "ANALYZE", "Analyze (L4)"
        EVALUATE = "EVALUATE", "Evaluate (L5)"
        CREATE = "CREATE", "Create (L6)"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    question_paper = models.ForeignKey(
        QuestionPaper,
        on_delete=models.CASCADE,
        related_name="questions",
    )

    section = models.CharField(max_length=5, help_text="e.g. A, B, C")
    question_number = models.PositiveSmallIntegerField()
    part = models.CharField(max_length=3, blank=True, help_text="e.g. (a), (b)")

    question_type = models.CharField(
        max_length=10, choices=QuestionType.choices, default=QuestionType.DESCRIPTIVE
    )

    text_content = models.TextField(help_text="Plain text version of the question")
    latex_content = models.TextField(
        blank=True, help_text="LaTeX-formatted version for mathematical questions"
    )

    marks = models.PositiveSmallIntegerField()
    co_tag = models.CharField(max_length=10, help_text="e.g. CO3")
    bloom_level = models.CharField(max_length=15, choices=BloomLevel.choices)

    is_optional = models.BooleanField(
        default=False,
        help_text="True if the student can choose between this and another question",
    )

    class Meta:
        db_table = "vault_question"
        ordering = ["section", "question_number"]
        unique_together = [("question_paper", "section", "question_number", "part")]

    def __str__(self):
        return (
            f"Q{self.section}{self.question_number}"
            f"{'(' + self.part + ')' if self.part else ''} "
            f"[{self.marks}M, {self.bloom_level}]"
        )


class AnswerRubric(models.Model):
    """Model answer / grading rubric uploaded by the setter for a Question."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    question = models.OneToOneField(
        Question,
        on_delete=models.CASCADE,
        related_name="rubric",
    )
    rubric_text = models.TextField(help_text="Detailed model answer / scheme of evaluation")
    key_points = models.JSONField(
        default=list,
        help_text="List of key points with individual mark weights",
    )
    max_marks = models.PositiveSmallIntegerField()
    s3_path = models.CharField(
        max_length=500, blank=True,
        help_text="Optional S3 path to a handwritten/scanned rubric image",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "vault_answer_rubric"

    def __str__(self):
        return f"Rubric for {self.question}"
