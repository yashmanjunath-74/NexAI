"""NexAI – WebSocket URL routing"""
from django.urls import path
from proctoring.consumers import ProctorConsumer
from analytics.consumers import RadarConsumer
from student.consumers import ExamConsumer

websocket_urlpatterns = [
    # CoE live institutional radar
    path("ws/radar/<str:session_id>/", RadarConsumer.as_asgi()),

    # Proctor live video + alert feed per room
    path("ws/proctor/<str:room_id>/", ProctorConsumer.as_asgi()),

    # Student exam sandbox keepalive + AI proctoring feed
    path("ws/exam/<str:student_id>/", ExamConsumer.as_asgi()),
]
