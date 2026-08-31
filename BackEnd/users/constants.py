"""NexAI Users – Role Constants"""


class UserRole:
    CHIEF_SUPERINTENDENT = "CHIEF_SUPERINTENDENT"
    HOD = "HOD"
    PAPER_SETTER = "PAPER_SETTER"
    INVIGILATOR = "INVIGILATOR"
    EVALUATOR = "EVALUATOR"
    SCRUTINIZER = "SCRUTINIZER"
    STUDENT = "STUDENT"

    CHOICES = [
        (CHIEF_SUPERINTENDENT, "Chief Superintendent / CoE"),
        (HOD, "Head of Department"),
        (PAPER_SETTER, "Question Paper Setter"),
        (INVIGILATOR, "Invigilator"),
        (EVALUATOR, "Faculty Evaluator"),
        (SCRUTINIZER, "Scrutinizer"),
        (STUDENT, "Student"),
    ]
