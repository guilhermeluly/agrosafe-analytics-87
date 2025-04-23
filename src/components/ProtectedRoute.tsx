
import React from "react";
import { Navigate } from "react-router-dom";
import { useUser, UserRole } from "../context/UserContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles,
}) => {
  const { user, isAuthorized } = useUser();

  if (!user.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAuthorized(requiredRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
