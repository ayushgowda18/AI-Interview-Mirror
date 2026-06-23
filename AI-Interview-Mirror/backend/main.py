from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from passlib.context import CryptContext

from questions import questions
from database import Base, engine, SessionLocal
import models
import schemas

import cv2
import base64
import numpy as np
from PIL import Image
import io

from jose import jwt
from datetime import datetime, timedelta

import google.generativeai as genai
import json
import os
from dotenv import load_dotenv


# ======================================================
# FASTAPI APP
# ======================================================

app = FastAPI()


# ======================================================
# DATABASE
# ======================================================

Base.metadata.create_all(bind=engine)


# ======================================================
# PASSWORD HASHING
# ======================================================

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


# ======================================================
# JWT CONFIGURATION
# ======================================================

SECRET_KEY = "AI_Interview_Mirror_Secret_Key_2025"

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 60


# ======================================================
# GEMINI CONFIGURATION
# ======================================================

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise Exception(
        "GEMINI_API_KEY not found in .env file"
    )

genai.configure(
    api_key=GEMINI_API_KEY
)

gemini_model = genai.GenerativeModel(
    "gemini-2.5-flash"
)


# ======================================================
# DATABASE DEPENDENCY
# ======================================================

def get_db():
    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# ======================================================
# CORS
# ======================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ======================================================
# HOME
# ======================================================

@app.get("/")
def home():

    return {
        "message":
        "Backend Running Successfully 🚀"
    }


# ======================================================
# QUESTIONS API
# ======================================================

@app.get("/questions/{role}")
def get_questions(role: str):

    return questions.get(role, [])


# ======================================================
# REGISTER API
# ======================================================

@app.post("/register")
def register(
    user: schemas.UserCreate,
    db: Session = Depends(get_db)
):

    existing_user = (
        db.query(models.User)
        .filter(
            models.User.username ==
            user.username
        )
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Username already exists"
        )

    existing_email = (
        db.query(models.User)
        .filter(
            models.User.email ==
            user.email
        )
        .first()
    )

    if existing_email:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    hashed_password = pwd_context.hash(
        user.password
    )

    new_user = models.User(
        username=user.username,
        email=user.email,
        password=hashed_password
    )

    db.add(new_user)

    db.commit()

    db.refresh(new_user)

    return {
        "message":
        "User registered successfully"
    }


# ======================================================
# JWT TOKEN GENERATION
# ======================================================

def create_access_token(
    data: dict
):

    to_encode = data.copy()

    expire = (
        datetime.utcnow()
        + timedelta(
            minutes=
            ACCESS_TOKEN_EXPIRE_MINUTES
        )
    )

    to_encode.update(
        {
            "exp": expire
        }
    )

    encoded_jwt = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return encoded_jwt


# ======================================================
# LOGIN API
# ======================================================

@app.post("/login")
def login(
    user: schemas.UserLogin,
    db: Session = Depends(get_db)
):

    db_user = (
        db.query(models.User)
        .filter(
            models.User.username ==
            user.username
        )
        .first()
    )

    if not db_user:
        raise HTTPException(
            status_code=401,
            detail=
            "Invalid username or password"
        )

    valid_password = pwd_context.verify(
        user.password,
        db_user.password
    )

    if not valid_password:
        raise HTTPException(
            status_code=401,
            detail=
            "Invalid username or password"
        )

    access_token = create_access_token(
        data={
            "sub":
            db_user.username
        }
    )

    return {
        "access_token":
        access_token,

        "token_type":
        "bearer",

        "username":
        db_user.username
    }
# ======================================================
# EYE CONTACT DETECTION
# ======================================================

face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades +
    "haarcascade_frontalface_default.xml"
)


@app.post("/detect-eye-contact")
def detect_eye_contact(data: dict):

    image_data = data.get("image")

    if not image_data:
        return {
            "face_detected": False
        }

    try:
        image_data = image_data.split(",")[1]

        image_bytes = base64.b64decode(
            image_data
        )

        image = Image.open(
            io.BytesIO(image_bytes)
        )

        frame = np.array(image)

        frame = cv2.cvtColor(
            frame,
            cv2.COLOR_RGB2BGR
        )

        gray = cv2.cvtColor(
            frame,
            cv2.COLOR_BGR2GRAY
        )

        faces = face_cascade.detectMultiScale(
            gray,
            scaleFactor=1.1,
            minNeighbors=5
        )

        return {
            "face_detected": len(faces) > 0
        }

    except Exception:
        return {
            "face_detected": False
        }


# ======================================================
# GEMINI ANALYSIS SCHEMA
# ======================================================

class Response(BaseModel):
    question: str
    answer: str


# ======================================================
# GEMINI AI ANALYSIS
# ======================================================

@app.post("/analyze")
def analyze(responses: list[Response]):

    try:

        prompt = """
You are an expert interview coach.

Analyze the following interview answers and return ONLY valid JSON.

Required JSON format:

{
    "overall_score": 0,
    "communication_feedback": "",
    "technical_feedback": "",
    "strengths": [],
    "improvements": [],
    "recommendation": ""
}

Scoring Rules:
- Score should be between 0 and 100.
- Strengths should be an array.
- Improvements should be an array.
- Recommendation should be one short sentence.

Interview Answers:

"""

        for response in responses:
            prompt += (
                f"\nQuestion: {response.question}\n"
                f"Answer: {response.answer}\n"
            )

        gemini_response = gemini_model.generate_content(
            prompt
        )

        result = gemini_response.text.strip()

        # Remove markdown if Gemini returns it
        result = result.replace(
            "```json",
            ""
        )

        result = result.replace(
            "```",
            ""
        )

        result = result.strip()

        analysis = json.loads(result)

        return analysis

    except Exception as e:

        print(
            "ANALYZE ERROR:",
            str(e)
        )

        return {
            "overall_score": 0,
            "communication_feedback":
                "AI analysis unavailable.",

            "technical_feedback":
                "AI analysis unavailable.",

            "strengths": [],

            "improvements": [
                "Try again later."
            ],

            "recommendation":
                "Unable to generate recommendation."
        }


# ======================================================
# END OF FILE
# ======================================================