import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.development")
django.setup()

from django.contrib.auth import get_user_model
from users.constants import UserRole

User = get_user_model()

def create_users():
    print("Creating test users...")
    users = [
        {"email": "coe@nexai.com", "password": "password123", "full_name": "Chief Superintendent", "role": UserRole.CHIEF_SUPERINTENDENT, "is_superuser": True},
        {"email": "hod@nexai.com", "password": "password123", "full_name": "Head of Department", "role": UserRole.HOD},
        {"email": "setter@nexai.com", "password": "password123", "full_name": "Question Paper Setter", "role": UserRole.PAPER_SETTER},
        {"email": "invigilator@nexai.com", "password": "password123", "full_name": "Invigilator", "role": UserRole.INVIGILATOR},
        {"email": "evaluator@nexai.com", "password": "password123", "full_name": "Central Evaluator", "role": UserRole.EVALUATOR},
        {"email": "scrutinizer@nexai.com", "password": "password123", "full_name": "Central Scrutinizer", "role": UserRole.SCRUTINIZER},
        {"email": "student@nexai.com", "password": "password123", "full_name": "Student", "role": UserRole.STUDENT},
    ]
    
    for u in users:
        if not User.objects.filter(email=u["email"]).exists():
            is_super = u.pop("is_superuser", False)
            if is_super:
                User.objects.create_superuser(**u)
            else:
                User.objects.create_user(**u)
            print(f"Created {u['role']} user: {u['email']} / password123")
        else:
            print(f"User {u['email']} already exists.")

if __name__ == "__main__":
    create_users()
