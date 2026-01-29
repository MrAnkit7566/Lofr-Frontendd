import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();

  // ✅ If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // ✅ If a role is required and user doesn’t match, block access
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  // ✅ Otherwise, allow access
  return children;
};

export default ProtectedRoute;
