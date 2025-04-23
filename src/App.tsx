
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

const queryClient = new QueryClient();

const App = () => (
  <UserProvider>
    <EmpresaProvider>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                
                <Route 
                  path="/" 
                  element={
                    <ProtectedRoute requiredRoles={["admin", "operator", "viewer"]}>
                      <Index />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute requiredRoles={["admin", "operator", "viewer"]}>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/relatorios" 
                  element={
                    <ProtectedRoute requiredRoles={["admin", "operator", "viewer"]}>
                      <Relatorios />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/production-form" 
                  element={
                    <ProtectedRoute requiredRoles={["admin", "operator"]}>
                      <ProductionForm />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute requiredRoles={["admin"]}>
                      <Admin />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/master-admin" 
                  element={
                    <ProtectedRoute requiredRoles={["admin"]}>
                      <MasterAdmin />
                    </ProtectedRoute>
                  } 
                />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </HelmetProvider>
      </QueryClientProvider>
    </EmpresaProvider>
  </UserProvider>
);

export default App;
