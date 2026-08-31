from rest_framework import serializers
from .models import ProctoringSession, ProctoringEvent

class ProctoringEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProctoringEvent
        fields = ['id', 'timestamp', 'event_type', 'severity', 'screenshot_url']

class ProctoringSessionSerializer(serializers.ModelSerializer):
    events = ProctoringEventSerializer(many=True, read_only=True)
    student_usn = serializers.CharField(source='student.usn', read_only=True)
    
    class Meta:
        model = ProctoringSession
        fields = ['id', 'student', 'student_usn', 'timetable_slot', 'is_active', 'start_time', 'end_time', 'events']
        read_only_fields = ['is_active', 'start_time', 'end_time']
