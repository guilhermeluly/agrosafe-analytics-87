
import React from "react";
import { Helmet } from "react-helmet-async";
import { useUser } from "../context/UserContext";
import { useEmpresa } from "../context/EmpresaContext";
import SidebarNavigation from "./SidebarNavigation";
import { SidebarProvider } from "@/components/ui/sidebar";

interface AppLayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function AppLayout({ children, title }: AppLayoutProps) {
  const { user } = useUser();
  const { empresa } = useEmpresa();
  
  // Only show the sidebar if the user is authenticated
  if (!user.isAuthenticated) {
    return <>{children}</>;
  }

  const pageTitle = empresa.nome ? `${empresa.nome} - ${title}` : title;

  return (
    <>
      <Helmet><title>{pageTitle}</title></Helmet>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <SidebarNavigation />
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </SidebarProvider>
    </>
  );
}
