import random

def extract_text_from_image(image_bytes: bytes) -> str:
    """
    Simulates OCR on a scanned page to extract handwritten text.
    In production, this would call a Vision model (e.g., YOLO + Tesseract/TrOCR).
    """
    # Mock text
    return "This is a simulated extracted text from the student's answer script."

def calculate_bert_similarity(student_answer: str, rubric_answer: str) -> tuple[float, float, dict]:
    """
    Simulates BERT sentence-transformers text similarity between the student's
    answer and the model rubric answer.
    Returns: (score_percentage, confidence, feedback_dict)
    """
    # Generate a random score between 0.4 and 0.95 to simulate AI evaluation
    score_pct = round(random.uniform(0.4, 0.95), 2)
    confidence = round(random.uniform(0.7, 0.99), 2)
    
    feedback = {
        "keywords_found": ["simulated", "answer", "concept"],
        "missing_keywords": ["important_term"],
        "grammar_score": 0.8
    }
    
    return score_pct, confidence, feedback
