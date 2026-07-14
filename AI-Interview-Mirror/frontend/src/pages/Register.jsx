import "./Register.css";
import { useState, useEffect } from "react";
import axios from "axios";

import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaRobot,
  FaRocket,
  FaChartLine,
  FaTrophy,
} from "react-icons/fa";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      window.location.href = "/dashboard";
    }
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/register",
        {
          username: form.username,
          email: form.email,
          password: form.password,
        }
      );

      alert(response.data.message);

      window.location.href = "/";
    } catch (error) {
      alert(
        error.response?.data?.detail ||
        "Registration failed"
      );
    }
  };

  return (
    <div className="register-page">
      <div className="register-wrapper">

        {/* LEFT SIDE */}
        <div className="register-left">

          <div className="brand">

            <div className="brand-icon">
              <FaRobot />
            </div>

            <div>
              <h2>AI Interview Mirror</h2>
              <p>Your Personal AI Interview Coach</p>
            </div>

          </div>

          <div className="welcome-section">

            <h1>Create Account ✨</h1>

            <p>
              Join thousands of learners preparing
              smarter with AI-powered interviews.
            </p>

          </div>

          <form onSubmit={handleRegister}>

            {/* Username */}
            <div className="input-box">

              <FaUser className="input-icon" />

              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                value={form.username}
                onChange={handleChange}
                required
              />

            </div>

            {/* Email */}
            <div className="input-box">

              <FaEnvelope className="input-icon" />

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                required
              />

            </div>

            {/* Password */}
            <div className="input-box">

              <FaLock className="input-icon" />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create password"
                value={form.password}
                onChange={handleChange}
                required
              />

              <span
                className="eye-icon"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </span>

            </div>

            {/* Confirm Password */}
            <div className="input-box">

              <FaLock className="input-icon" />

              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                name="confirmPassword"
                placeholder="Confirm password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />

              <span
                className="eye-icon"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
              >
                {showConfirmPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </span>

            </div>

            <button
              type="submit"
              className="register-btn"
            >
              Create Account →
            </button>

          </form>

          <p className="login-text">

            Already have an account?

            <a href="/">
              Sign In
            </a>

          </p>

        </div>

        {/* RIGHT SIDE */}
        <div className="register-right">

          <div className="floating-card card-1">
            <FaRocket />
          </div>

          <div className="floating-card card-2">
            <FaChartLine />
          </div>

          <div className="floating-card card-3">
            <FaTrophy />
          </div>

          <div className="hero-content">

            <h1>
              Start.
              <br />
              Learn.
              <br />
              <span>Get Hired.</span>
            </h1>

            <p>
              Build confidence through AI-powered
              mock interviews and land your dream
              job faster.
            </p>

            <div className="feature-list">

              <div className="feature-item">
                🚀 Personalized Questions
              </div>

              <div className="feature-item">
                📈 Instant Feedback
              </div>

              <div className="feature-item">
                🏆 Career Growth
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Register;