import "./SelectRole.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SelectRole() {
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState("");
  const [interviewType, setInterviewType] = useState("Technical");
  const [questionCount, setQuestionCount] = useState(5);

  const roles = [
    {
      title: "Software Developer",
      icon: "💻",
    },
    {
      title: "AIML Engineer",
      icon: "🤖",
    },
    {
      title: "Web Developer",
      icon: "🌐",
    },
    {
      title: "HR Interview",
      icon: "👔",
    },
  ];

  const handleStart = () => {
    if (!selectedRole) {
      alert("Please select a role.");
      return;
    }

    navigate("/interview", {
      state: {
        role: selectedRole,
        type: interviewType,
        count: questionCount,
      },
    });
  };

  return (
    <div className="select-role-page">
      <div className="select-role-container">

        <h1>🚀 Start AI Interview</h1>

        <p className="subtitle">
          Customize your interview experience
        </p>

        <h2>Select Role</h2>

        <div className="roles-grid">
          {roles.map((role) => (
            <div
              key={role.title}
              className={`role-card ${
                selectedRole === role.title
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setSelectedRole(role.title)
              }
            >
              <span className="role-icon">
                {role.icon}
              </span>

              <h3>{role.title}</h3>
            </div>
          ))}
        </div>

        <div className="options-section">

          <div className="option-box">
            <label>
              Interview Type
            </label>

            <select
              value={interviewType}
              onChange={(e) =>
                setInterviewType(
                  e.target.value
                )
              }
            >
              <option>
                Technical
              </option>

              <option>
                HR
              </option>

              <option>
                Mixed
              </option>
            </select>
          </div>

          <div className="option-box">
            <label>
              Questions
            </label>

            <select
              value={questionCount}
              onChange={(e) =>
                setQuestionCount(
                  Number(
                    e.target.value
                  )
                )
              }
            >
              <option value={5}>
                5 Questions
              </option>

              <option value={10}>
                10 Questions
              </option>

              <option value={15}>
                15 Questions
              </option>
            </select>
          </div>

        </div>

        <div className="ai-tip">
          <h3>🤖 AI Tip</h3>

          <p>
            Technical interviews test
            concepts and coding skills.
            Mixed interviews combine
            technical and behavioral
            questions.
          </p>
        </div>

        <button
          className="start-btn"
          onClick={handleStart}
        >
          🚀 Start Interview
        </button>

      </div>
    </div>
  );
}

export default SelectRole;