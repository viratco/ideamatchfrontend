import React from "react";
import { Navigate, useLocation } from "react-router-dom";

import { isAuthenticated } from "@/utils/jwt";

const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  if (!isAuthenticated()) {
    // Redirect to sign-in, preserving where the user was trying to go
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }
  return <>{children}</>;
};

export default RequireAuth;
