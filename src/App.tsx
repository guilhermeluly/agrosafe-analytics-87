import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { EmpresaProvider } from './context/EmpresaContext';
import Login from './pages/Login';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import ProductionForm from './pages/ProductionForm';
import Admin from './pages/Admin';
import Database from './pages/Database';
import Companies from './pages/Companies';
import Users from './pages/Users';
import Plans from './pages/Plans';
import LogoConfig from './pages/LogoConfig';
import MobileApp from './pages/MobileApp';
import DNSConfig from './pages/DNSConfig';
import ChangePassword from './pages/ChangePassword';
import Unauthorized from './pages/Unauthorized';
import SidebarNavigation from './components/SidebarNavigation';
import AppLayout from './components/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import ReportSettingsPage from './pages/ReportSettingsPage';
import Relatorios from './pages/Relatorios';
import PresentationMode from './pages/PresentationMode';
import Help from './pages/Help';
import ResetData from './pages/ResetData';
import RoleNotification from './components/RoleNotification';

// Add the new route imports
import RoleSwitchPage from './pages/admin/RoleSwitch';
import PlanSwitchPage from './pages/admin/PlanSwitch';
import CompanyViewPage from './pages/admin/CompanyView';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if the user is authenticated based on some condition (e.g., token in local storage)
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token); // Set to true if token exists, false otherwise
  }, []);

  return (
    <UserProvider>
      <EmpresaProvider>
        <Router>
          <AppLayout>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/home"
                element={
                  <ProtectedRoute requiredRoles={["master_admin", "admin", "operator", "viewer"]}>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute requiredRoles={["master_admin", "admin", "operator", "viewer"]}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/production-form"
                element={
                  <ProtectedRoute requiredRoles={["master_admin", "admin", "operator"]}>
                    <ProductionForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRoles={["master_admin", "admin"]}>
                    <Admin />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/database"
                element={
                  <ProtectedRoute requiredRoles={["master_admin", "admin"]}>
                    <Database />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/companies"
                element={
                  <ProtectedRoute requiredRoles={["master_admin"]}>
                    <Companies />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users"
                element={
                  <ProtectedRoute requiredRoles={["master_admin"]}>
                    <Users />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/plans"
                element={
                  <ProtectedRoute requiredRoles={["master_admin"]}>
                    <Plans />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/logo-config"
                element={
                  <ProtectedRoute requiredRoles={["master_admin"]}>
                    <LogoConfig />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mobile-app"
                element={
                  <ProtectedRoute requiredRoles={["master_admin"]}>
                    <MobileApp />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dns-config"
                element={
                  <ProtectedRoute requiredRoles={["master_admin"]}>
                    <DNSConfig />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/change-password"
                element={
                  <ProtectedRoute requiredRoles={["master_admin"]}>
                    <ChangePassword />
                  </ProtectedRoute>
                }
              />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route
                path="/report-settings"
                element={
                  <ProtectedRoute requiredRoles={["master_admin", "admin"]}>
                    <ReportSettingsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/relatorios"
                element={
                  <ProtectedRoute requiredRoles={["master_admin", "admin", "operator", "viewer"]}>
                    <Relatorios />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/presentation-mode"
                element={
                  <ProtectedRoute requiredRoles={["master_admin", "admin", "operator", "viewer"]}>
                    <PresentationMode />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/help"
                element={
                  <ProtectedRoute requiredRoles={["master_admin", "admin", "operator", "viewer"]}>
                    <Help />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reset-data"
                element={
                  <ProtectedRoute requiredRoles={["master_admin"]}>
                    <ResetData />
                  </ProtectedRoute>
                }
              />
              
              {/* Add these new routes */}
              <Route
                path="/role-switch"
                element={
                  <ProtectedRoute requiredRoles={["master_admin"]}>
                    <RoleSwitchPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/plan-switch"
                element={
                  <ProtectedRoute requiredRoles={["master_admin"]}>
                    <PlanSwitchPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/company-view"
                element={
                  <ProtectedRoute requiredRoles={["master_admin"]}>
                    <CompanyViewPage />
                  </ProtectedRoute>
                }
              />
              
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="*" element={<Navigate to="/home" />} />
            </Routes>
          </AppLayout>
        </Router>
      </EmpresaProvider>
    </UserProvider>
  );
}

export default App;
