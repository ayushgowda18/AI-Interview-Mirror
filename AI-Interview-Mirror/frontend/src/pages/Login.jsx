import "./Login.css";
import { useState, useEffect } from "react";
import axios from "axios";
import loginArtwork from "../assets/login-artwork.png";

import {
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaRobot,
} from "react-icons/fa";

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    username: "",
    password: "",
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

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/login",
        form
      );

      localStorage.setItem(
        "token",
        response.data.access_token
      );

      localStorage.setItem(
        "username",
        response.data.username
      );

      alert("Login Successful!");

      window.location.href = "/dashboard";
    } catch (error) {
      alert(
        error.response?.data?.detail ||
          "Invalid username or password"
      );
    }
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">

        {/* LEFT PANEL */}
        <div className="login-left">

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
            <h1>
              Welcome Back! 👋
            </h1>

            <p>
              Sign in to continue your AI-powered
              interview journey.
            </p>
          </div>

          <form onSubmit={handleLogin}>

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

            {/* Password */}
            <div className="input-box">

              <FaLock className="input-icon" />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
              />

              <span
                className="eye-icon"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
              >
                {showPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </span>

            </div>

            <div className="options-row">

              <label className="remember">
                <input type="checkbox" />
                Remember Me
              </label>

              <a
                href="#"
                className="forgot-link"
              >
                Forgot Password?
              </a>

            </div>

            <button
              type="submit"
              className="signin-btn"
            >
              Sign In →
            </button>

          </form>

          <div className="divider">
            <span>or</span>
          </div>

          <p className="register-text">
            Don't have an account?

            <a href="/register">
              Create Account
            </a>
          </p>

        </div>

        {/* RIGHT PANEL */}
        <div className="login-right">

          <img
            src={loginArtwork}
            alt="AI Interview"
            className="artwork-image"
          />

        </div>

      </div>
    </div>
  );
}

export default Login;