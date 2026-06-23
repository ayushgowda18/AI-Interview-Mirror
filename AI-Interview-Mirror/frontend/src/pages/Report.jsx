import "./Report.css";
import { useLocation, useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Report() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return (
      <div className="report-page">
        <h2>No report found.</h2>

        <button
          className="home-btn"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const analysis = state.analysis || {};
  const answers = state.answers || [];
  const role = state.role || "";
  const eye = state.eyeContactScore || 0;

  const chartData = {
    labels: [
      "Communication",
      "Eye Contact",
      "Words",
      "Fillers",
    ],

    datasets: [
      {
        label: "Interview Performance",
        data: [
          analysis.communication_score || 0,
          eye,
          analysis.total_words || 0,
          analysis.filler_count || 0,
        ],

        backgroundColor: [
          "#6366F1",
          "#10B981",
          "#3B82F6",
          "#EF4444",
        ],

        borderRadius: 10,
      },
    ],
  };

  return (
    <div className="report-page">

      <div className="report-container">

        <div className="report-header">

          <h1>
            📊 AI Interview Report
          </h1>

          <p>
            Role: {role}
          </p>

        </div>

        <div className="summary-grid">

          <div className="summary-card">
            <h2>
              {analysis.communication_score || 0}
            </h2>

            <p>
              Communication Score
            </p>
          </div>

          <div className="summary-card">
            <h2>
              {analysis.total_words || 0}
            </h2>

            <p>
              Total Words
            </p>
          </div>

          <div className="summary-card">
            <h2>
              {analysis.filler_count || 0}
            </h2>

            <p>
              Filler Words
            </p>
          </div>

          <div className="summary-card">
            <h2>
              {eye}%
            </h2>

            <p>
              Eye Contact
            </p>
          </div>

        </div>

        <div className="feedback-card">

          <h2>
            🤖 AI Feedback
          </h2>

          <p>
            {analysis.feedback ||
              analysis.suggestion ||
              "No feedback available."}
          </p>

        </div>

        <div className="chart-card">

          <h2>
            📈 Performance Overview
          </h2>

          <Bar data={chartData} />

        </div>

        <div className="answers-card">

          <h2>
            📝 Your Responses
          </h2>

          {answers.map((a, index) => (
            <div
              className="answer-item"
              key={index}
            >
              <h4>
                Q{index + 1}. {a.question}
              </h4>

              <p>
                {a.answer}
              </p>
            </div>
          ))}

        </div>

        <button
          className="home-btn"
          onClick={() => navigate("/dashboard")}
        >
          🏠 Back to Dashboard
        </button>

      </div>

    </div>
  );
}

export default Report;