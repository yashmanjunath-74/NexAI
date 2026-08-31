"""NexAI Core – DRF Permission Classes"""
from rest_framework.permissions import BasePermission
from users.constants import UserRole


class IsChiefSuperintendent(BasePermission):
    """Allow access only to CoE / Chief Superintendent role."""
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated
                    and request.user.role == UserRole.CHIEF_SUPERINTENDENT)


class IsHOD(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated
                    and request.user.role == UserRole.HOD)


class IsPaperSetter(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated
                    and request.user.role == UserRole.PAPER_SETTER)


class IsInvigilator(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated
                    and request.user.role == UserRole.INVIGILATOR)


class IsEvaluator(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated
                    and request.user.role in [UserRole.EVALUATOR, UserRole.SCRUTINIZER])


class IsScrutinizer(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated
                    and request.user.role == UserRole.SCRUTINIZER)


class IsStudent(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated
                    and request.user.role == UserRole.STUDENT)


class IsStaff(BasePermission):
    """Any staff role (non-student)."""
    STAFF_ROLES = {
        UserRole.CHIEF_SUPERINTENDENT,
        UserRole.HOD,
        UserRole.PAPER_SETTER,
        UserRole.INVIGILATOR,
        UserRole.EVALUATOR,
        UserRole.SCRUTINIZER,
    }

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated
                    and request.user.role in self.STAFF_ROLES)
