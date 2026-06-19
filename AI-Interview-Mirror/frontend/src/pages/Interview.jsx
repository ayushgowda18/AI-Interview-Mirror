import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Webcam from "react-webcam";

function Interview() {
  const location = useLocation();
  const navigate = useNavigate();

  const role = location.state.role;

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState([]);

  const [isListening, setIsListening] = useState(false);

  const webcamRef = useRef(null);

  const [eyeScore, setEyeScore] = useState(0);
  const [checks, setChecks] = useState(0);
  const [faceDetected, setFaceDetected] = useState(false);

  // Fetch questions
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/questions/${role}`)
      .then((res) => setQuestions(res.data));
  }, [role]);

  // Voice
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";

    recognition.start();
    setIsListening(true);

    recognition.onresult = (e) => {
      setAnswer(e.results[0][0].transcript);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);
  };

  // Eye tracking
  const checkEyeContact = async () => {
    const image = webcamRef.current.getScreenshot();

    if (!image) return;

    const res = await axios.post(
      "http://127.0.0.1:8000/detect-eye-contact",
      { image }
    );

    const detected = res.data.face_detected;

    setFaceDetected(detected);
    setChecks((p) => p + 1);

    if (detected) setEyeScore((p) => p + 1);
  };

  useEffect(() => {
    const interval = setInterval(checkEyeContact, 5000);
    return () => clearInterval(interval);
  }, []);

  // Next
  const handleNext = () => {
    const updated = [
      ...answers,
      {
        question: questions[currentQuestion],
        answer,
      },
    ];

    setAnswers(updated);
    setAnswer("");

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((p) => p + 1);
    } else {
      axios
        .post("http://127.0.0.1:8000/analyze", updated)
        .then((res) => {
          navigate("/report", {
            state: {
              role,
              answers: updated,
              analysis: res.data,
              eyeContactScore:
                checks > 0
                  ? Math.round((eyeScore / checks) * 100)
                  : 0,
            },
          });
        });
    }
  };

  if (!questions.length) return <h2>Loading...</h2>;

  return (
    <div>
      <h1>{role} Interview</h1>

      <Webcam
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={300}
      />

      <p>
        Face: {faceDetected ? "👀 Detected" : "❌ Not Detected"}
      </p>

      <h3>
        Q{currentQuestion + 1}/{questions.length}
      </h3>

      <p>{questions[currentQuestion]}</p>

      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />

      <br />

      <button onClick={startListening}>
        {isListening ? "🎤 Listening..." : "🎤 Speak"}
      </button>

      <button onClick={handleNext}>
        {currentQuestion === questions.length - 1
          ? "Finish"
          : "Next"}
      </button>
    </div>
  );
}

export default Interview;