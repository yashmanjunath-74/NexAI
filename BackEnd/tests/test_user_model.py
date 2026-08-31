"""
NexAI – Additional RBAC Integration Tests (using Django DB)
These tests require the database and verify the User model
constraints work correctly with the DB backend.
"""
import pytest
from django.test import TestCase
from django.db import IntegrityError
from users.constants import UserRole


@pytest.mark.django_db
class TestUserModelDB(TestCase):
    """Test User model with actual DB constraints."""

    def _create_user(self, email, role, password="Test@1234"):
        from django.contrib.auth import get_user_model
        User = get_user_model()
        return User.objects.create_user(
            email=email,
            full_name=f"Test {role}",
            role=role,
            password=password,
        )

    def test_create_user_with_each_role(self):
        """Users with all 7 roles can be created successfully."""
        for i, role in enumerate(UserRole.CHOICES):
            role_val = role[0]
            user = self._create_user(f"test{i}@nexai.test", role_val)
            self.assertEqual(user.role, role_val)
            self.assertTrue(user.is_active)

    def test_email_is_unique(self):
        """Duplicate email should raise IntegrityError."""
        self._create_user("duplicate@nexai.test", UserRole.STUDENT)
        with self.assertRaises(Exception):
            self._create_user("duplicate@nexai.test", UserRole.HOD)

    def test_superuser_gets_coe_role_by_default(self):
        """create_superuser must default to CHIEF_SUPERINTENDENT role."""
        from django.contrib.auth import get_user_model
        User = get_user_model()
        su = User.objects.create_superuser(
            email="coe@nexai.test",
            full_name="Super CoE",
            password="Admin@1234",
        )
        self.assertEqual(su.role, UserRole.CHIEF_SUPERINTENDENT)
        self.assertTrue(su.is_staff)
        self.assertTrue(su.is_superuser)

    def test_password_is_hashed(self):
        """Raw password must NOT be stored in the DB."""
        user = self._create_user("hashed@nexai.test", UserRole.STUDENT)
        self.assertNotEqual(user.password, "Test@1234")
        self.assertTrue(user.password.startswith(("pbkdf2_", "md5$", "bcrypt")))

    def test_student_profile_links_to_user(self):
        """Student model can be created and linked to a STUDENT user."""
        from users.models import Student, Department
        user = self._create_user("student@nexai.test", UserRole.STUDENT)
        dept, _ = Department.objects.get_or_create(code="CS", defaults={"name": "Computer Science"})
        student = Student.objects.create(
            user=user,
            department=dept,
            usn="1XX21CS001",
            current_semester=5,
            batch_year=2021,
        )
        self.assertEqual(student.full_name, user.full_name)
        self.assertEqual(student.email, user.email)
        self.assertEqual(student.usn, "1XX21CS001")

    def test_usn_is_unique(self):
        """Two students cannot share the same USN."""
        from users.models import Student, Department
        dept, _ = Department.objects.get_or_create(code="CS2", defaults={"name": "CS Dept"})
        u1 = self._create_user("s1@nexai.test", UserRole.STUDENT)
        u2 = self._create_user("s2@nexai.test", UserRole.STUDENT)
        Student.objects.create(user=u1, department=dept, usn="UNIQUE001",
                               current_semester=1, batch_year=2022)
        with self.assertRaises(IntegrityError):
            Student.objects.create(user=u2, department=dept, usn="UNIQUE001",
                                   current_semester=1, batch_year=2022)
