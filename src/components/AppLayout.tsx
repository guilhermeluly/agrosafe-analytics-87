
import React from "react";
import { Helmet } from "react-helmet-async";
import { useUser } from "../context/UserContext";
import { useEmpresa } from "../context/EmpresaContext";
import SidebarNavigation from "./SidebarNavigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AppLayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function AppLayout({ children, title }: AppLayoutProps) {
  const { user } = useUser();
  const { empresa } = useEmpresa();
  const isMobile = useIsMobile();

  // Only show the sidebar if the user is authenticated
  if (!user.isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <>
      <Helmet><title>{title}</title></Helmet>
      <SidebarProvider defaultCollapsed={false}>
        <div className="flex min-h-screen w-full flex-col">
          <div className="flex flex-1 w-full">
            <SidebarNavigation />
            <main className="flex-1 p-3 md:p-6 overflow-auto">
              {isMobile && (
                <div className="mb-4 flex items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    className="mr-2"
                    aria-label="Toggle menu"
                    onClick={() => {
                      const sidebarTrigger = document.querySelector('[data-sidebar-trigger]');
                      if (sidebarTrigger) {
                        (sidebarTrigger as HTMLButtonElement).click();
                      }
                    }}
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </div>
              )}
              {children}
            </main>
          </div>
          <footer className="bg-gray-100 border-t p-4 text-center text-xs text-gray-600">
            Desenvolvido por AgroSafe Serviços Empresariais LTDA CNPJ 54.630.417/0001-67
          </footer>
        </div>
      </SidebarProvider>
    </>
  );
}
