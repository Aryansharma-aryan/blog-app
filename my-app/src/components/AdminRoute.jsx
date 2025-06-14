import React from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  // Allow only if token exists and role is 'admin'
  if (token && user?.role === "admin") {
    return children;
  }

  // Redirect if not authorized
  return <Navigate to="/login" />;
};

export default AdminRoute;
