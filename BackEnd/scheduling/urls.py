"""NexAI Scheduling – URL Configuration"""
from django.urls import path
from .views import (
    SubjectListCreateView,
    SubjectDetailView,
    RoomListCreateView,
    RoomDetailView,
    ExamSessionListCreateView,
    ExamSessionDetailView,
    TimetableSlotListView,
    trigger_timetable_generation,
    timetable_task_status,
    InvigilationDutyListCreateView,
)

app_name = "scheduling"

urlpatterns = [
    # Subjects
    path("subjects/",             SubjectListCreateView.as_view(),   name="subject-list"),
    path("subjects/<uuid:pk>/",   SubjectDetailView.as_view(),       name="subject-detail"),

    # Rooms
    path("rooms/",                RoomListCreateView.as_view(),      name="room-list"),
    path("rooms/<uuid:pk>/",      RoomDetailView.as_view(),          name="room-detail"),

    # Exam Sessions
    path("sessions/",             ExamSessionListCreateView.as_view(), name="session-list"),
    path("sessions/<uuid:pk>/",   ExamSessionDetailView.as_view(),     name="session-detail"),

    # Timetable
    path("timetable/",                                TimetableSlotListView.as_view(),  name="timetable-list"),
    path("timetable/generate/",                       trigger_timetable_generation,     name="timetable-generate"),
    path("timetable/status/<str:task_id>/",           timetable_task_status,            name="timetable-status"),

    # Invigilation
    path("invigilation/",         InvigilationDutyListCreateView.as_view(), name="invigilation-list"),
]
