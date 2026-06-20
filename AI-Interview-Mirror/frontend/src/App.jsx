import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import SelectRole from "./pages/SelectRole";
import Interview from "./pages/Interview";
import Report from "./pages/Report";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" 
        element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/select-role" 
        element={<ProtectedRoute><SelectRole /></ProtectedRoute>} />
        <Route path="/interview" 
        element={<ProtectedRoute><Interview /></ProtectedRoute>} />
        <Route path="/report" 
        element={<ProtectedRoute><Report /></ProtectedRoute>} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;