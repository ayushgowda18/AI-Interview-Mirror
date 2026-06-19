import { useLocation } from "react-router-dom";
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

  const analysis = state.analysis;
  const answers = state.answers;
  const role = state.role;
  const eye = state.eyeContactScore || 0;

  const data = {
    labels: ["Score", "Words", "Filler"],
    datasets: [
      {
        label: "Performance",
        data: [
          analysis.communication_score,
          analysis.total_words,
          analysis.filler_count,
        ],
      },
    ],
  };

  return (
    <div>
      <h1>Interview Report</h1>

      <h2>{role}</h2>

      <h3>🎯 Score: {analysis.communication_score}</h3>
      <h3>📝 Words: {analysis.total_words}</h3>
      <h3>⚠️ Fillers: {analysis.filler_count}</h3>
      <h3>👀 Eye Contact: {eye}%</h3>

      <Bar data={data} />

      <hr />

      {answers.map((a, i) => (
        <div key={i}>
          <p><b>Q:</b> {a.question}</p>
          <p><b>A:</b> {a.answer}</p>
        </div>
      ))}
    </div>
  );
}

export default Report;