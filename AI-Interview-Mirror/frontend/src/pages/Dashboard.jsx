import "./Dashboard.css";

function Dashboard() {
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");

    window.location.href = "/";
  };

  return (
    <div className="dashboard-page">

      <div className="dashboard-container">

        <div className="hero-card">
          <h1>
            Welcome back, {username}! 👋
          </h1>

          <p>
            Ready to ace your next interview?
          </p>

          <button className="start-btn">
            🚀 Start AI Interview
          </button>
        </div>

        <div className="section-title">
          Quick Actions
        </div>

        <div className="quick-grid">

          <div className="action-card">
            🧠
            <h3>Generate Questions</h3>
          </div>

          <div className="action-card">
            🎤
            <h3>Voice Interview</h3>
          </div>

          <div className="action-card">
            📄
            <h3>Resume Analyzer</h3>
          </div>

          <div className="action-card">
            📊
            <h3>Interview History</h3>
          </div>

        </div>

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

        <div className="coach-card">

          <h2>🤖 AI Coach</h2>

          <p>
            Start your first interview to receive
            personalized recommendations.
          </p>

        </div>

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