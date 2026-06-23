import "./Interview.css";

import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

import axios from "axios";
import Webcam from "react-webcam";

function Interview() {
  const location = useLocation();
  const navigate = useNavigate();

  const role = location.state?.role;

  const webcamRef = useRef(null);

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState([]);

  const [isListening, setIsListening] = useState(false);

  const [faceDetected, setFaceDetected] = useState(false);
  const [eyeScore, setEyeScore] = useState(0);
  const [checks, setChecks] = useState(0);

  const [timeLeft, setTimeLeft] = useState(600); // 10 mins

  /* ---------------- Fetch Questions ---------------- */

  useEffect(() => {
    if (!role) {
      navigate("/dashboard");
      return;
    }

    axios
      .get(`http://127.0.0.1:8000/questions/${role}`)
      .then((res) => {
        setQuestions(res.data);
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to load questions.");
      });
  }, [role, navigate]);

  /* ---------------- Timer ---------------- */

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);

          finishInterview();

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);

  }, [answers, currentQuestion, answer]);

  /* ---------------- Eye Tracking ---------------- */

  const checkEyeContact = async () => {
    try {
      const image = webcamRef.current?.getScreenshot();

      if (!image) return;

      const res = await axios.post(
        "http://127.0.0.1:8000/detect-eye-contact",
        { image }
      );

      const detected = res.data.face_detected;

      setFaceDetected(detected);

      setChecks((prev) => prev + 1);

      if (detected) {
        setEyeScore((prev) => prev + 1);
      }

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const interval = setInterval(
      checkEyeContact,
      5000
    );

    return () => clearInterval(interval);

  }, []);

  /* ---------------- Voice Input ---------------- */

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Speech Recognition is not supported in this browser."
      );

      return;
    }

    const recognition =
      new SpeechRecognition();

    recognition.lang = "en-US";

    recognition.start();

    setIsListening(true);

    recognition.onresult = (e) => {
      setAnswer(
        e.results[0][0].transcript
      );

      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  /* ---------------- Finish Interview ---------------- */

  const finishInterview = () => {
    const updated = [...answers];

    updated[currentQuestion] = {
      question: questions[currentQuestion],
      answer,
    };

    axios
      .post(
        "http://127.0.0.1:8000/analyze",
        updated
      )
      .then((res) => {
        navigate("/report", {
          state: {
            role,
            answers: updated,

            analysis: res.data,

            eyeContactScore:
              checks > 0
                ? Math.round(
                    (eyeScore / checks) * 100
                  )
                : 0,
          },
        });
      })
      .catch((err) => {
        console.error(err);

        alert(
          "Failed to analyze interview."
        );
      });
  };

  /* ---------------- Next ---------------- */

  const handleNext = () => {
    const updated = [...answers];

    updated[currentQuestion] = {
      question:
        questions[currentQuestion],

      answer,
    };

    setAnswers(updated);

    if (
      currentQuestion <
      questions.length - 1
    ) {
      const nextIndex =
        currentQuestion + 1;

      setCurrentQuestion(nextIndex);

      setAnswer(
        updated[nextIndex]?.answer || ""
      );

    } else {
      finishInterview();
    }
  };

  /* ---------------- Previous ---------------- */

  const handlePrevious = () => {
    if (currentQuestion === 0) return;

    const updated = [...answers];

    updated[currentQuestion] = {
      question:
        questions[currentQuestion],

      answer,
    };

    setAnswers(updated);

    const previous =
      currentQuestion - 1;

    setCurrentQuestion(previous);

    setAnswer(
      updated[previous]?.answer || ""
    );
  };

  /* ---------------- Loading ---------------- */

  if (!questions.length) {
    return (
      <div className="loading-screen">

        <h1>
          🤖 Preparing Your AI Interview...
        </h1>

        <p>
          Fetching Questions...
        </p>

      </div>
    );
  }

  /* ---------------- UI Values ---------------- */

  const progress =
    ((currentQuestion + 1) /
      questions.length) *
    100;

  const eyeContactPercentage =
    checks > 0
      ? Math.round(
          (eyeScore / checks) * 100
        )
      : 0;

  const minutes = Math.floor(
    timeLeft / 60
  );

  const seconds =
    timeLeft % 60;

  return (
    <div className="interview-page">

      <div className="interview-container">

        {/* HEADER */}

        <div className="interview-header">

          <div>
            <h1>
              {role} Interview
            </h1>

            <p>
              Answer confidently and
              maintain eye contact.
            </p>
          </div>

          <div className="timer-box">
            ⏱ {minutes}:
            {seconds
              .toString()
              .padStart(2, "0")}
          </div>

        </div>

        {/* PROGRESS */}

        <div className="progress-container">

          <div
            className="progress-fill"
            style={{
              width: `${progress}%`,
            }}
          />

        </div>

        <p className="progress-text">
          Question{" "}
          {currentQuestion + 1} of{" "}
          {questions.length}
        </p>

        {/* MAIN */}

        <div className="interview-grid">

          {/* LEFT */}

          <div className="left-panel">

            <div className="webcam-card">

              <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="webcam"
              />

            </div>

            <div className="status-card">

              <h3>
                👁 Face Status
              </h3>

              <p>
                {faceDetected
                  ? "✅ Face Detected"
                  : "❌ Face Not Detected"}
              </p>

            </div>

            <div className="status-card">

              <h3>
                📊 Eye Contact
              </h3>

              <p>
                {eyeContactPercentage}%
              </p>

            </div>

            <div className="coach-card">

              <h3>
                🤖 AI Coach
              </h3>

              <ul>

                <li>
                  ✓ Maintain eye contact
                </li>

                <li>
                  ✓ Use examples
                </li>

                <li>
                  {answer.length < 30
                    ? "⚠ Give more detailed answers"
                    : "✅ Good answer length"}
                </li>

              </ul>

            </div>

          </div>

          {/* RIGHT */}

          <div className="question-card">

            <h2>
              {
                questions[
                  currentQuestion
                ]
              }
            </h2>

            <textarea
              placeholder="Type your answer here..."
              value={answer}
              onChange={(e) =>
                setAnswer(
                  e.target.value
                )
              }
            />

            <div className="button-group">

              <button
                className="voice-btn"
                onClick={
                  startListening
                }
              >
                {isListening
                  ? "🎤 Listening..."
                  : "🎤 Speak"}
              </button>

              <div>

                <button
                  className="prev-btn"
                  onClick={
                    handlePrevious
                  }
                >
                  Previous
                </button>

                <button
                  className="next-btn"
                  onClick={handleNext}
                >
                  {currentQuestion ===
                  questions.length - 1
                    ? "Finish"
                    : "Next"}
                </button>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Interview;