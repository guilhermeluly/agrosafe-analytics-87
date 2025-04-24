
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUser, UserRole } from "../context/UserContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles,
}) => {
  const location = useLocation();
  
  try {
    const { user, isAuthorized } = useUser();

    if (!user.isAuthenticated) {
      // Redirect to login page but save the location they were trying to access
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!isAuthorized(requiredRoles)) {
      return <Navigate to="/unauthorized" replace />;
    }

    // If not master_admin, ensure they can only access their company's data
    if (user.role !== 'master_admin' && location.pathname.includes('/company/')) {
      const requestedCompanyId = location.pathname.split('/company/')[1]?.split('/')[0];
      if (requestedCompanyId && requestedCompanyId !== user.companyId) {
        return <Navigate to="/unauthorized" replace />;
      }
    }

    return <>{children}</>;
  } catch (error) {
    // If useUser fails (provider not available), redirect to login
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
