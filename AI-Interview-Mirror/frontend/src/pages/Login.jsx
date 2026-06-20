import "./Login.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

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
      const { data } = await axios.post(
        "http://127.0.0.1:8000/login",
        form
      );

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("username", data.username);

      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
      }

      alert("Login Successful!");

      window.location.href = "/dashboard";
    } catch (error) {
      alert(error.response?.data?.detail || "Invalid Credentials");
    }
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        {/* LEFT SIDE */}
        <div className="login-left">
          <div className="brand">
            <div className="logo">🪞</div>

            <div>
              <h2>AI Interview Mirror</h2>

              <p>Your Personal AI Interview Coach</p>
            </div>
          </div>

          <div className="welcome-section">
            <h1>Welcome Back 👋</h1>

            <p>
              Sign in to continue your AI-powered interview journey.
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="input-box">
              <FaUser className="input-icon" />

              <input
                type="text"
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-box">
              <FaLock className="input-icon" />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
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

            <div className="options-row">
              <label className="remember">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() =>
                    setRememberMe(!rememberMe)
                  }
                />

                Remember Me
              </label>

              <a href="#" className="forgot-link">
                Forgot Password?
              </a>
            </div>

            <button className="signin-btn" type="submit">
              Sign In →
            </button>
          </form>

          <div className="register-text">
            Don't have an account?

            <a href="/register">
              Create Account
            </a>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="login-right">
          <div className="floating-circle circle1"></div>
          <div className="floating-circle circle2"></div>

          <div className="illustration">
            <div className="candidate">
              👨‍💼
            </div>

            <div className="robot">
              🤖
            </div>
          </div>

          <div className="right-content">
            <h1>
              Practice.
              <br />
              Improve.
              <br />
              Succeed.
            </h1>

            <p>
              Prepare for your dream career with
              AI-powered mock interviews.
            </p>

            <div className="features">
              <div className="feature">
                📚 Practice
              </div>

              <div className="feature">
                📊 Analyze
              </div>

              <div className="feature">
                📈 Improve
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;