import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");

    window.location.href = "/";
  };

  const handleStartInterview = () => {
    navigate("/select-role");
  };

  const handleVoiceInterview = () => {
    alert("🎤 Voice Interview feature coming soon!");
  };

  const handleResumeAnalyzer = () => {
    alert("📄 Resume Analyzer feature coming soon!");
  };

  const handleInterviewHistory = () => {
    alert("📊 Interview History feature coming soon!");
  };

  return (
    <div className="dashboard-page">

      <div className="dashboard-container">

        {/* HERO SECTION */}
        <div className="hero-card">

          <h1>
            Welcome back, {username}! 👋
          </h1>

          <p>
            Ready to ace your next interview?
          </p>

          <button
            className="start-btn"
            onClick={handleStartInterview}
          >
            🚀 Start AI Interview
          </button>

        </div>

        {/* QUICK ACTIONS */}
        <div className="section-title">
          Quick Actions
        </div>

        <div className="quick-grid">

          <div
            className="action-card"
            onClick={handleStartInterview}
          >
            🧠
            <h3>Generate Questions</h3>
          </div>

          <div
            className="action-card"
            onClick={handleVoiceInterview}
          >
            🎤
            <h3>Voice Interview</h3>
          </div>

          <div
            className="action-card"
            onClick={handleResumeAnalyzer}
          >
            📄
            <h3>Resume Analyzer</h3>
          </div>

          <div
            className="action-card"
            onClick={handleInterviewHistory}
          >
            📊
            <h3>Interview History</h3>
          </div>

        </div>

        {/* STATS */}
        <div className="stats-section">

          <div className="stat-card">
            <h2>0</h2>
            <p>Interviews Taken</p>
          </div>

          <div className="stat-card">
            <h2>0%</h2>
            <p>Average Score</p>
          </div>

          <div className="stat-card">
            <h2>🔥 0</h2>
            <p>Current Streak</p>
          </div>

        </div>

        {/* AI COACH */}
        <div className="coach-card">

          <h2>🤖 AI Coach</h2>

          <p>
            Start your first interview to receive
            personalized recommendations.
          </p>

        </div>

        {/* LOGOUT */}
        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>

    </div>
  );
}

export default Dashboard;