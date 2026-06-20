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


# Create FastAPI app
app = FastAPI()

# Create database tables
Base.metadata.create_all(bind=engine)

# Password hashing
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

SECRET_KEY = "AI_Interview_Mirror_Secret_Key_2025"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60


# Database session dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------- HOME ----------------
@app.get("/")
def home():
    return {
        "message": "Backend Running successfully"
    }


# ---------------- QUESTIONS ----------------
@app.get("/questions/{role}")
def get_questions(role: str):
    return questions.get(role, [])


# ---------------- AI ANALYSIS ----------------
class Response(BaseModel):
    question: str
    answer: str


@app.post("/analyze")
def analyze(responses: list[Response]):

    filler_words = [
        "um",
        "uh",
        "like",
        "basically",
        "you know"
    ]

    total_words = 0
    filler_count = 0

    for response in responses:
        text = response.answer.lower()
        words = text.split()

        total_words += len(words)

        for filler in filler_words:
            filler_count += text.count(filler)

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

    image_data = image_data.split(",")[1]

    image_bytes = base64.b64decode(image_data)

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
        1.1,
        5
    )

    return {
        "face_detected": len(faces) > 0
    }


# ---------------- REGISTER ----------------
@app.post("/register")
def register(
    user: schemas.UserCreate,
    db: Session = Depends(get_db)
):

    # Check username
    existing_user = (
        db.query(models.User)
        .filter(
            models.User.username == user.username
        )
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Username already exists"
        )

    # Check email
    existing_email = (
        db.query(models.User)
        .filter(
            models.User.email == user.email
        )
        .first()
    )

    if existing_email:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    # Hash password
    hashed_password = pwd_context.hash(
        user.password
    )

    # Create user
    new_user = models.User(
        username=user.username,
        email=user.email,
        password=hashed_password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User registered successfully"
    }

# ---------------- JWT TOKEN GENERATION ----------------    
def create_access_token(data: dict):
    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return encoded_jwt

# ---------------- LOGIN ----------------
@app.post("/login")
def login(
    user: schemas.UserLogin,
    db: Session = Depends(get_db)
):

    db_user = (
        db.query(models.User)
        .filter(models.User.username == user.username)
        .first()
    )

    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

    if not pwd_context.verify(
        user.password,
        db_user.password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

    access_token = create_access_token(
        data={
            "sub": db_user.username
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "username": db_user.username
    }