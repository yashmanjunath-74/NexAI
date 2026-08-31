"""
Shared test factories and fixtures for NexAI unit tests.
Uses factory_boy to create model instances without hitting the DB
(where possible), and Django's TestCase for integration tests.
"""
import uuid
import factory
from factory.django import DjangoModelFactory
from django.contrib.auth import get_user_model
from users.constants import UserRole

User = get_user_model()


# ─── User Factories ───────────────────────────────────────────────────────────

class UserFactory(DjangoModelFactory):
    class Meta:
        model = User
        skip_postgeneration_save = True

    id = factory.LazyFunction(uuid.uuid4)
    email = factory.Sequence(lambda n: f"user{n}@nexai.test")
    full_name = factory.Faker("name")
    phone = factory.Faker("phone_number")
    role = UserRole.STUDENT
    is_active = True
    is_staff = False

    @factory.post_generation
    def password(self, create, extracted, **kwargs):
        pwd = extracted or "TestPass@123"
        self.set_password(pwd)
        if create:
            self.save()


class CoEUserFactory(UserFactory):
    role = UserRole.CHIEF_SUPERINTENDENT
    is_staff = True


class HODUserFactory(UserFactory):
    role = UserRole.HOD


class PaperSetterFactory(UserFactory):
    role = UserRole.PAPER_SETTER


class InvigilatorFactory(UserFactory):
    role = UserRole.INVIGILATOR


class EvaluatorFactory(UserFactory):
    role = UserRole.EVALUATOR


class ScrutinizerFactory(UserFactory):
    role = UserRole.SCRUTINIZER


class StudentUserFactory(UserFactory):
    role = UserRole.STUDENT
