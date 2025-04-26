
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { SidebarProvider } from "@/components/ui/sidebar";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/dashboard";
import Relatorios from "./pages/relatorios";
import Admin from "./pages/admin";
import MasterAdmin from "./pages/master-admin";
import Login from "./pages/login";
import Unauthorized from "./pages/unauthorized";
import ProductionForm from "./pages/production-form";
import { EmpresaProvider } from "./context/EmpresaContext";
import { UserProvider } from "./context/UserContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Companies from "./pages/master/Companies";
import Users from "./pages/master/Users";
import Plans from "./pages/master/Plans";
import MobileApp from "./pages/master/MobileApp";
import Help from "./pages/Help";
import ChangePassword from "./pages/master/ChangePassword";
import LogoConfig from "./pages/master/LogoConfig";
import Cadastros from "./pages/admin/Cadastros";
import PresentationMode from "./pages/PresentationMode";
import GoalsSettings from "./pages/GoalsSettings";
import Settings from "./pages/settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <UserProvider>
        <EmpresaProvider>
          <TooltipProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                
                <Route path="/" element={<Navigate to="/production-form" replace />} />
                
                <Route 
                  path="/home" 
                  element={
                    <ProtectedRoute requiredRoles={["master_admin", "admin", "operator", "viewer"]}>
                      <Index />
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
                  path="/relatorios" 
                  element={
                    <ProtectedRoute requiredRoles={["master_admin", "admin", "operator", "viewer"]}>
                      <Relatorios />
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
                  path="/admin/cadastros" 
                  element={
                    <ProtectedRoute requiredRoles={["master_admin", "admin"]}>
                      <Cadastros />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/goals" 
                  element={
                    <ProtectedRoute requiredRoles={["master_admin", "admin"]}>
                      <GoalsSettings />
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
                  path="/settings" 
                  element={
                    <ProtectedRoute requiredRoles={["master_admin"]}>
                      <Settings />
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
                  path="/mobile-app" 
                  element={
                    <ProtectedRoute requiredRoles={["master_admin"]}>
                      <MobileApp />
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
                
                <Route 
                  path="/logo-config" 
                  element={
                    <ProtectedRoute requiredRoles={["master_admin"]}>
                      <LogoConfig />
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
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </EmpresaProvider>
      </UserProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
