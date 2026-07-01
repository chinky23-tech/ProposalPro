import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/Signup";
import ProtectedRoute from "./components/dashboard/ProtectedRoute"; 
import Dashboard from "./pages/dashboard/Dashboard";

// Dashboard shell handles its own view rendering

export default function App() {
  return (
    <>
      <ToastContainer position="bottom-right" autoClose={3000} />

      <Routes>
        {/* Public Landing Redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Authentication Channels */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Authenticated Application Shell */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch-All Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}