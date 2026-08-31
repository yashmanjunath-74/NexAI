"""NexAI Users – Serializers"""
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from .models import Department, BiometricProfile

User = get_user_model()


class NexAITokenObtainPairSerializer(TokenObtainPairSerializer):
    """Extend JWT token payload with role, name, and department."""

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["role"] = user.role
        token["full_name"] = user.full_name
        token["email"] = user.email
        if user.department:
            token["department_id"] = str(user.department.id)
            token["department_code"] = user.department.code
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        # Append user info to response body too
        data["user"] = {
            "id": str(self.user.id),
            "email": self.user.email,
            "full_name": self.user.full_name,
            "role": self.user.role,
        }
        return data


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ["id", "name", "code"]


class UserSerializer(serializers.ModelSerializer):
    department = DepartmentSerializer(read_only=True)

    class Meta:
        model = User
        fields = [
            "id", "email", "full_name", "phone", "employee_id",
            "role", "department", "is_active", "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = [
            "email", "full_name", "phone", "employee_id",
            "role", "department", "password",
        ]

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class BiometricEnrollSerializer(serializers.Serializer):
    """Accepts a 512-d face embedding from the mobile client."""
    face_embedding = serializers.ListField(
        child=serializers.FloatField(),
        min_length=512,
        max_length=512,
    )
    device_hash = serializers.CharField(max_length=128, required=False)


class BiometricVerifySerializer(serializers.Serializer):
    """Live face embedding to verify against stored profile."""
    face_embedding = serializers.ListField(
        child=serializers.FloatField(),
        min_length=512,
        max_length=512,
    )


class StudentSerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source="user", read_only=True)
    department_details = DepartmentSerializer(source="department", read_only=True)

    class Meta:
        from .models import Student
        model = Student
        fields = [
            "id", "user", "department", "usn", "current_semester",
            "batch_year", "overall_attendance_pct", "is_eligible_for_exam",
            "user_details", "department_details", "created_at"
        ]
        read_only_fields = ["id", "created_at", "is_eligible_for_exam"]
