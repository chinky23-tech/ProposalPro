import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/Signup";
import ProtectedRoute from "./components/dashboard/ProtectedRoute"; 
import Dashboard from "./pages/dashboard/Dashboard";
import PublicProposalView from "/src/public/PublicProposalView.jsx"; 

// Dashboard shell handles its own view rendering

export default function App() {
  return (
    <>
      <ToastContainer position="bottom-right" autoClose={3000} />

      <Routes>
        {/* Public Landing Redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/p/:token" element={<PublicProposalView />} />
        
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