"""
NexAI – RBAC Unit Tests
=======================

Tests the following RBAC mechanisms:
  1. UserRole constants are correct and complete
  2. User.has_role() method works correctly
  3. User.is_student and User.is_coe properties
  4. Each DRF permission class (IsChiefSuperintendent, IsHOD, etc.) grants access
     to the correct role and denies it to all others
  5. IsStaff grants to all non-student roles
  6. Unauthenticated requests are denied by all permission classes
"""
import pytest
from unittest.mock import MagicMock
from django.test import TestCase, RequestFactory

from users.constants import UserRole
from core.permissions import (
    IsChiefSuperintendent,
    IsHOD,
    IsPaperSetter,
    IsInvigilator,
    IsEvaluator,
    IsScrutinizer,
    IsStudent,
    IsStaff,
)


# ─── Helpers ─────────────────────────────────────────────────────────────────

def make_user(role: str, is_authenticated: bool = True):
    """Build a lightweight mock user – no DB needed."""
    user = MagicMock()
    user.role = role
    user.is_authenticated = is_authenticated
    user.is_active = True
    return user


def make_request(role: str, is_authenticated: bool = True):
    """Build a mock DRF request with the given user."""
    factory = RequestFactory()
    request = factory.get("/")
    request.user = make_user(role, is_authenticated)
    return request


ALL_ROLES = [
    UserRole.CHIEF_SUPERINTENDENT,
    UserRole.HOD,
    UserRole.PAPER_SETTER,
    UserRole.INVIGILATOR,
    UserRole.EVALUATOR,
    UserRole.SCRUTINIZER,
    UserRole.STUDENT,
]

STAFF_ROLES = [
    UserRole.CHIEF_SUPERINTENDENT,
    UserRole.HOD,
    UserRole.PAPER_SETTER,
    UserRole.INVIGILATOR,
    UserRole.EVALUATOR,
    UserRole.SCRUTINIZER,
]


# ═══════════════════════════════════════════════════════════════════════════════
# 1. UserRole Constants
# ═══════════════════════════════════════════════════════════════════════════════

class TestUserRoleConstants(TestCase):
    """Validate that UserRole constants are defined and CHOICES is complete."""

    def test_all_seven_roles_defined(self):
        """All 7 roles must be non-empty strings."""
        for role in ALL_ROLES:
            self.assertIsInstance(role, str)
            self.assertTrue(len(role) > 0)

    def test_choices_length(self):
        """CHOICES must have exactly 7 entries."""
        self.assertEqual(len(UserRole.CHOICES), 7)

    def test_choices_values_match_constants(self):
        """Every CHOICES value must match a constant."""
        choice_values = {v for v, _ in UserRole.CHOICES}
        for role in ALL_ROLES:
            self.assertIn(role, choice_values)

    def test_role_strings_are_screaming_snake_case(self):
        """Role strings should be uppercase with underscores."""
        for role in ALL_ROLES:
            self.assertEqual(role, role.upper())
            self.assertEqual(role, role.replace(" ", "_"))

    def test_student_role_is_default_choice(self):
        """STUDENT must be in CHOICES."""
        choice_values = {v for v, _ in UserRole.CHOICES}
        self.assertIn(UserRole.STUDENT, choice_values)


# ═══════════════════════════════════════════════════════════════════════════════
# 2. User Model RBAC Methods (mocked – no DB)
# ═══════════════════════════════════════════════════════════════════════════════

class TestUserRBACMethods(TestCase):

    def _user_with_role(self, role):
        """Create a user-like object with the given role (no DB)."""
        from unittest.mock import MagicMock
        u = MagicMock()
        u.role = role
        return u

    def test_has_role_returns_true_for_matching_role(self):
        """has_role() must return True when the user's role is in the list."""
        from users.models import User
        u = User.__new__(User)
        u.role = UserRole.HOD
        self.assertTrue(u.has_role(UserRole.HOD))

    def test_has_role_returns_true_for_multiple_matching_roles(self):
        from users.models import User
        u = User.__new__(User)
        u.role = UserRole.EVALUATOR
        self.assertTrue(u.has_role(UserRole.EVALUATOR, UserRole.SCRUTINIZER))

    def test_has_role_returns_false_for_non_matching_role(self):
        from users.models import User
        u = User.__new__(User)
        u.role = UserRole.STUDENT
        self.assertFalse(u.has_role(UserRole.HOD))

    def test_is_student_property_true(self):
        from users.models import User
        u = User.__new__(User)
        u.role = UserRole.STUDENT
        self.assertTrue(u.is_student)

    def test_is_student_property_false_for_hod(self):
        from users.models import User
        u = User.__new__(User)
        u.role = UserRole.HOD
        self.assertFalse(u.is_student)

    def test_is_coe_property_true(self):
        from users.models import User
        u = User.__new__(User)
        u.role = UserRole.CHIEF_SUPERINTENDENT
        self.assertTrue(u.is_coe)

    def test_is_coe_property_false_for_student(self):
        from users.models import User
        u = User.__new__(User)
        u.role = UserRole.STUDENT
        self.assertFalse(u.is_coe)


# ═══════════════════════════════════════════════════════════════════════════════
# 3. IsChiefSuperintendent Permission
# ═══════════════════════════════════════════════════════════════════════════════

class TestIsChiefSuperintendentPermission(TestCase):

    def setUp(self):
        self.perm = IsChiefSuperintendent()
        self.view = MagicMock()

    def test_grants_access_to_coe(self):
        request = make_request(UserRole.CHIEF_SUPERINTENDENT)
        self.assertTrue(self.perm.has_permission(request, self.view))

    def test_denies_access_to_hod(self):
        request = make_request(UserRole.HOD)
        self.assertFalse(self.perm.has_permission(request, self.view))

    def test_denies_access_to_student(self):
        request = make_request(UserRole.STUDENT)
        self.assertFalse(self.perm.has_permission(request, self.view))

    def test_denies_unauthenticated(self):
        request = make_request(UserRole.CHIEF_SUPERINTENDENT, is_authenticated=False)
        self.assertFalse(self.perm.has_permission(request, self.view))

    @pytest.mark.parametrize("role", [
        UserRole.HOD, UserRole.PAPER_SETTER, UserRole.INVIGILATOR,
        UserRole.EVALUATOR, UserRole.SCRUTINIZER, UserRole.STUDENT,
    ])
    def test_denies_all_non_coe_roles(self, role=None):
        """Parametrized-style: run for each non-CoE role."""
        non_coe = [
            UserRole.HOD, UserRole.PAPER_SETTER, UserRole.INVIGILATOR,
            UserRole.EVALUATOR, UserRole.SCRUTINIZER, UserRole.STUDENT,
        ]
        for r in non_coe:
            with self.subTest(role=r):
                req = make_request(r)
                self.assertFalse(self.perm.has_permission(req, self.view))


# ═══════════════════════════════════════════════════════════════════════════════
# 4. IsHOD Permission
# ═══════════════════════════════════════════════════════════════════════════════

class TestIsHODPermission(TestCase):

    def setUp(self):
        self.perm = IsHOD()
        self.view = MagicMock()

    def test_grants_access_to_hod(self):
        request = make_request(UserRole.HOD)
        self.assertTrue(self.perm.has_permission(request, self.view))

    def test_denies_access_to_coe(self):
        request = make_request(UserRole.CHIEF_SUPERINTENDENT)
        self.assertFalse(self.perm.has_permission(request, self.view))

    def test_denies_access_to_student(self):
        request = make_request(UserRole.STUDENT)
        self.assertFalse(self.perm.has_permission(request, self.view))

    def test_denies_unauthenticated(self):
        request = make_request(UserRole.HOD, is_authenticated=False)
        self.assertFalse(self.perm.has_permission(request, self.view))


# ═══════════════════════════════════════════════════════════════════════════════
# 5. IsPaperSetter Permission
# ═══════════════════════════════════════════════════════════════════════════════

class TestIsPaperSetterPermission(TestCase):

    def setUp(self):
        self.perm = IsPaperSetter()
        self.view = MagicMock()

    def test_grants_access_to_setter(self):
        request = make_request(UserRole.PAPER_SETTER)
        self.assertTrue(self.perm.has_permission(request, self.view))

    def test_denies_student(self):
        request = make_request(UserRole.STUDENT)
        self.assertFalse(self.perm.has_permission(request, self.view))

    def test_denies_unauthenticated(self):
        request = make_request(UserRole.PAPER_SETTER, is_authenticated=False)
        self.assertFalse(self.perm.has_permission(request, self.view))


# ═══════════════════════════════════════════════════════════════════════════════
# 6. IsInvigilator Permission
# ═══════════════════════════════════════════════════════════════════════════════

class TestIsInvigilatorPermission(TestCase):

    def setUp(self):
        self.perm = IsInvigilator()
        self.view = MagicMock()

    def test_grants_access_to_invigilator(self):
        request = make_request(UserRole.INVIGILATOR)
        self.assertTrue(self.perm.has_permission(request, self.view))

    def test_denies_student(self):
        request = make_request(UserRole.STUDENT)
        self.assertFalse(self.perm.has_permission(request, self.view))

    def test_denies_hod(self):
        request = make_request(UserRole.HOD)
        self.assertFalse(self.perm.has_permission(request, self.view))


# ═══════════════════════════════════════════════════════════════════════════════
# 7. IsEvaluator Permission (grants EVALUATOR and SCRUTINIZER)
# ═══════════════════════════════════════════════════════════════════════════════

class TestIsEvaluatorPermission(TestCase):

    def setUp(self):
        self.perm = IsEvaluator()
        self.view = MagicMock()

    def test_grants_access_to_evaluator(self):
        request = make_request(UserRole.EVALUATOR)
        self.assertTrue(self.perm.has_permission(request, self.view))

    def test_grants_access_to_scrutinizer(self):
        """Scrutinizer is a superset of Evaluator – must also get access."""
        request = make_request(UserRole.SCRUTINIZER)
        self.assertTrue(self.perm.has_permission(request, self.view))

    def test_denies_student(self):
        request = make_request(UserRole.STUDENT)
        self.assertFalse(self.perm.has_permission(request, self.view))

    def test_denies_invigilator(self):
        request = make_request(UserRole.INVIGILATOR)
        self.assertFalse(self.perm.has_permission(request, self.view))


# ═══════════════════════════════════════════════════════════════════════════════
# 8. IsScrutinizer Permission
# ═══════════════════════════════════════════════════════════════════════════════

class TestIsScrutinizerPermission(TestCase):

    def setUp(self):
        self.perm = IsScrutinizer()
        self.view = MagicMock()

    def test_grants_access_to_scrutinizer(self):
        request = make_request(UserRole.SCRUTINIZER)
        self.assertTrue(self.perm.has_permission(request, self.view))

    def test_denies_evaluator(self):
        """Regular Evaluator should NOT have Scrutinizer-only access."""
        request = make_request(UserRole.EVALUATOR)
        self.assertFalse(self.perm.has_permission(request, self.view))

    def test_denies_student(self):
        request = make_request(UserRole.STUDENT)
        self.assertFalse(self.perm.has_permission(request, self.view))


# ═══════════════════════════════════════════════════════════════════════════════
# 9. IsStudent Permission
# ═══════════════════════════════════════════════════════════════════════════════

class TestIsStudentPermission(TestCase):

    def setUp(self):
        self.perm = IsStudent()
        self.view = MagicMock()

    def test_grants_access_to_student(self):
        request = make_request(UserRole.STUDENT)
        self.assertTrue(self.perm.has_permission(request, self.view))

    def test_denies_staff_roles(self):
        for role in STAFF_ROLES:
            with self.subTest(role=role):
                req = make_request(role)
                self.assertFalse(self.perm.has_permission(req, self.view))

    def test_denies_unauthenticated(self):
        request = make_request(UserRole.STUDENT, is_authenticated=False)
        self.assertFalse(self.perm.has_permission(request, self.view))


# ═══════════════════════════════════════════════════════════════════════════════
# 10. IsStaff Permission (broad staff access)
# ═══════════════════════════════════════════════════════════════════════════════

class TestIsStaffPermission(TestCase):

    def setUp(self):
        self.perm = IsStaff()
        self.view = MagicMock()

    def test_grants_access_to_all_staff_roles(self):
        for role in STAFF_ROLES:
            with self.subTest(role=role):
                req = make_request(role)
                self.assertTrue(self.perm.has_permission(req, self.view))

    def test_denies_student(self):
        request = make_request(UserRole.STUDENT)
        self.assertFalse(self.perm.has_permission(request, self.view))

    def test_denies_unauthenticated_coe(self):
        """Even a CoE role must not pass if not authenticated."""
        request = make_request(UserRole.CHIEF_SUPERINTENDENT, is_authenticated=False)
        self.assertFalse(self.perm.has_permission(request, self.view))

    def test_denies_unauthenticated_evaluator(self):
        request = make_request(UserRole.EVALUATOR, is_authenticated=False)
        self.assertFalse(self.perm.has_permission(request, self.view))


# ═══════════════════════════════════════════════════════════════════════════════
# 11. Cross-permission isolation
# ═══════════════════════════════════════════════════════════════════════════════

class TestPermissionIsolation(TestCase):
    """Each permission class must only grant access to its intended role(s)."""

    PERM_ROLE_MAP = [
        (IsChiefSuperintendent, [UserRole.CHIEF_SUPERINTENDENT]),
        (IsHOD,                 [UserRole.HOD]),
        (IsPaperSetter,         [UserRole.PAPER_SETTER]),
        (IsInvigilator,         [UserRole.INVIGILATOR]),
        (IsScrutinizer,         [UserRole.SCRUTINIZER]),
        (IsStudent,             [UserRole.STUDENT]),
    ]

    def test_each_permission_only_grants_intended_role(self):
        view = MagicMock()
        for PermClass, allowed_roles in self.PERM_ROLE_MAP:
            perm = PermClass()
            for role in ALL_ROLES:
                req = make_request(role)
                result = perm.has_permission(req, view)
                expected = role in allowed_roles
                with self.subTest(perm=PermClass.__name__, role=role):
                    self.assertEqual(
                        result,
                        expected,
                        msg=(
                            f"{PermClass.__name__} should "
                            f"{'grant' if expected else 'deny'} {role}, "
                            f"but got {'granted' if result else 'denied'}"
                        ),
                    )
