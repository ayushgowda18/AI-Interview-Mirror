import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/ login";
import Dashboard from "./pages/Dashboard";
import SelectRole from "./pages/SelectRole";
import Interview from "./pages/Interview";
import Report from "./pages/Report";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/select-role" element={<SelectRole />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/report" element={<Report />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;