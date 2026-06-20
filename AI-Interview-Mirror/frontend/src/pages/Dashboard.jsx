function Dashboard() {
  const username = localStorage.getItem("username");
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");

    window.location.href = "/login";
  };
  return (
    <div>
      
      <h2>Welcome back, {username}! 👋</h2>

      <p>
        Ready to ace your next interview?
      </p>
      <button onClick={handleLogout}>
        Logout
      </button>
      
    </div>
  );
}

export default Dashboard;