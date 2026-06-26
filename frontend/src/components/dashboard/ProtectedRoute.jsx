import { Navigate } from "react-router-dom";
import { getStoredAuthSession } from "../../api/auth";

export default function ProtectedRoute({ children }) {
  const session = getStoredAuthSession();

  // Double check both token locations depending on how your saveAuthSession stores it
  const hasToken = session?.token || localStorage.getItem("token") || sessionStorage.getItem("token");

  if (!hasToken) {
    console.log("ProtectedRoute Blocked Access: No session found.");
    return <Navigate to="/login" replace />;
  }

  return children;
}