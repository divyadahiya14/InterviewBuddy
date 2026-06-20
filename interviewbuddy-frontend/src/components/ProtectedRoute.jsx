import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRole }) {
  const email = localStorage.getItem("email");
  const role = localStorage.getItem("role");

  if (!email) {
    // Redirect to login if user is not authenticated
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && role && role.toLowerCase() !== allowedRole.toLowerCase()) {
    // Redirect to respective dashboard if role does not match
    if (role === "interviewer") {
      return <Navigate to="/interviewer-dashboard" replace />;
    } else {
      return <Navigate to="/interview-choice" replace />;
    }
  }

  return children;
}
