// ProtectedAdminRoute.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const ProtectedAdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // if (user.role !== "admin") {
  //   return <Navigate to="/login" replace />;
  // }

  // ProtectedAdminRoute.jsx
if ((user.role || "").toLowerCase() !== "admin") {
  return <Navigate to="/login" replace />;
}



  return children;
};

export default ProtectedAdminRoute;
