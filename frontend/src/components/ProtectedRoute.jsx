import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const ProtectedRoute = () => {
  const { isAuthenticated, userId } = useAuth();
  console.log("ProtectedRoute - isAuthenticated:", isAuthenticated);
  console.log("ProtectedRoute - userId:", userId);
  return isAuthenticated ? (
    <Outlet context={{ userId }} />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default ProtectedRoute;
