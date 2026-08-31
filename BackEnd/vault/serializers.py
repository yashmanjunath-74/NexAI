from rest_framework import serializers
from .models import QuestionPaper, Question

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = [
            'id', 'section', 'question_number', 'part', 'question_type',
            'text_content', 'latex_content', 'marks', 'co_tag', 'bloom_level', 'is_optional'
        ]

class QuestionPaperSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    subject_code = serializers.CharField(source='subject.code', read_only=True)
    exam_session_name = serializers.CharField(source='exam_session.name', read_only=True)

    class Meta:
        model = QuestionPaper
        fields = [
            'id', 'subject', 'subject_code', 'exam_session', 'exam_session_name',
            'title', 'total_marks', 'duration_mins', 'difficulty_level',
            'instructions', 'status', 'created_at', 'updated_at', 'questions',
            'ipfs_cid', 'key_unlock_timestamp', 'key_distributed_at'
        ]
        read_only_fields = ['status', 'ipfs_cid', 'key_unlock_timestamp', 'key_distributed_at']

class PaperLockSerializer(serializers.Serializer):
    """
    Serializer used by the Paper Setter to lock and submit a paper.
    Contains any final metadata needed to lock the paper.
    """
    key_unlock_timestamp = serializers.DateTimeField(required=True)
