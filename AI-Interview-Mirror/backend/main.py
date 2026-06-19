from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from questions import questions

import cv2
import base64
import numpy as np
from PIL import Image
import io

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Backend Running"}

@app.get("/questions/{role}")
def get_questions(role: str):
    return questions.get(role, [])


# ---------------- AI ANALYSIS ----------------
class Response(BaseModel):
    question: str
    answer: str


@app.post("/analyze")
def analyze(responses: list[Response]):

    filler_words = ["um", "uh", "like", "basically", "you know"]

    total_words = 0
    filler_count = 0

    for r in responses:
        text = r.answer.lower()
        words = text.split()

        total_words += len(words)

        for f in filler_words:
            filler_count += text.count(f)

    score = 100 - (filler_count * 5)
    if score < 0:
        score = 0

    suggestion = (
        "Excellent communication!"
        if filler_count <= 2
        else "Try reducing filler words and improve structure."
    )

    return {
        "total_words": total_words,
        "filler_count": filler_count,
        "communication_score": score,
        "suggestion": suggestion,
    }


# ---------------- EYE CONTACT ----------------
face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
)

@app.post("/detect-eye-contact")
def detect_eye_contact(data: dict):

    image_data = data.get("image")

    if not image_data:
        return {"face_detected": False}

    image_data = image_data.split(",")[1]
    image_bytes = base64.b64decode(image_data)

    image = Image.open(io.BytesIO(image_bytes))
    frame = np.array(image)
    frame = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    faces = face_cascade.detectMultiScale(gray, 1.1, 5)

    return {
        "face_detected": len(faces) > 0
    }