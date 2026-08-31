import random
from .models import ProctoringEvent

def detect_anomalies(image_bytes: bytes) -> list[dict]:
    """
    Simulates a YOLO/FaceNet model evaluating a webcam frame.
    Returns a list of anomalies if any are detected.
    """
    # In a real environment, we'd pass image_bytes to PyTorch/ONNX
    
    anomalies = []
    
    # 5% chance of simulating an anomaly
    if random.random() < 0.05:
        # Pick a random event type
        event_type = random.choice([
            ProctoringEvent.EventTypeChoices.NO_FACE,
            ProctoringEvent.EventTypeChoices.MULTIPLE_FACES,
            ProctoringEvent.EventTypeChoices.MOBILE_PHONE,
            ProctoringEvent.EventTypeChoices.LOOKING_AWAY
        ])
        
        # Determine severity
        if event_type == ProctoringEvent.EventTypeChoices.MOBILE_PHONE:
            severity = ProctoringEvent.SeverityChoices.HIGH
        elif event_type == ProctoringEvent.EventTypeChoices.MULTIPLE_FACES:
            severity = ProctoringEvent.SeverityChoices.HIGH
        elif event_type == ProctoringEvent.EventTypeChoices.NO_FACE:
            severity = ProctoringEvent.SeverityChoices.MEDIUM
        else:
            severity = ProctoringEvent.SeverityChoices.LOW
            
        anomalies.append({
            "event_type": event_type,
            "severity": severity,
            "screenshot_url": "https://nexai-mock.s3.amazonaws.com/evidence/frame_x.jpg"
        })
        
    return anomalies
