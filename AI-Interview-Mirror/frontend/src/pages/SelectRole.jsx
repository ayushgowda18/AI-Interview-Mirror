import { useNavigate } from "react-router-dom";

function SelectRole() {
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    navigate("/interview", {
      state: {
        role: role,
      },
    });
  };

  return (
    <div>
      <h1>Select Interview Role</h1>

      <button onClick={() => handleRoleSelect("Software Developer")}>
        Software Developer
      </button>

      <button onClick={() => handleRoleSelect("AIML Engineer")}>
        AIML Engineer
      </button>

      <button onClick={() => handleRoleSelect("Web Developer")}>
        Web Developer
      </button>

      <button onClick={() => handleRoleSelect("HR Interview")}>
        HR Interview
      </button>
    </div>
  );
}

export default SelectRole;