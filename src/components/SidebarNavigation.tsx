
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  BarChart2, 
  Home,
  LogOut,
  UserCog,
  Database,
  Users,
  Package,
  Smartphone,
  HelpCircle,
  Menu,
  Download,
  Target,
  Globe,
  PresentationIcon,
  Lock,
  Edit,
  FileSpreadsheet,
  Trash2
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroupLabel,
  SidebarGroup,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import LogoDisplay from "./LogoDisplay";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

interface MenuItem {
  icon: React.ComponentType<any>;
  label: string;
  path: string;
  roles: string[];
  isNew?: boolean;
  onClick?: () => void;
}

export default function SidebarNavigation() {
  const { user, logout } = useUser();
  const location = useLocation();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const isActive = (path: string) => location.pathname === path;

  const handleExportData = () => {
    toast({
      title: "Exportação iniciada",
      description: "Os dados estão sendo exportados para CSV."
    });
  };

  const handlePresentationMode = () => {
    toast({
      title: "Modo de Apresentação",
      description: "Iniciando modo de apresentação dos indicadores."
    });
  };

  const handleSidebarTrigger = () => {
    const sidebarContent = document.querySelector('[data-sidebar-content]');
    if (sidebarContent) {
      sidebarContent.classList.toggle('hidden');
    }
  };

  const getMenuItems = (): MenuItem[] => {
    const baseItems: MenuItem[] = [
      {
        icon: Home,
        label: "Início",
        path: "/home",
        roles: ["master_admin", "admin", "operator", "viewer"]
      },
      {
        icon: FileText,
        label: "Registrar Dados",
        path: "/production-form",
        roles: ["master_admin", "admin", "operator"],
        isNew: false
      },
      {
        icon: LayoutDashboard,
        label: "Dashboard",
        path: "/dashboard",
        roles: ["master_admin", "admin", "operator", "viewer"]
      },
      {
        icon: BarChart2,
        label: "Relatórios",
        path: "/relatorios",
        roles: ["master_admin", "admin", "operator", "viewer"]
      },
      {
        icon: PresentationIcon,
        label: "Modo Apresentação",
        path: "#",
        roles: ["master_admin", "admin", "operator", "viewer"],
        onClick: handlePresentationMode
      }
    ];

    const adminItems: MenuItem[] = [
      {
        icon: Settings,
        label: "Configurações",
        path: "/admin",
        roles: ["master_admin", "admin"]
      },
      {
        icon: FileSpreadsheet,
        label: "Cadastros",
        path: "/cadastros",
        roles: ["master_admin", "admin"],
        isNew: true
      },
      {
        icon: Target,
        label: "Definir Metas",
        path: "/goals",
        roles: ["master_admin", "admin"]
      },
      {
        icon: Database,
        label: "Banco de Dados",
        path: "/database",
        roles: ["master_admin", "admin"]
      },
      {
        icon: Download,
        label: "Exportar Dados",
        path: "#",
        roles: ["master_admin", "admin"],
        onClick: handleExportData
      }
    ];
    
    const masterAdminItems: MenuItem[] = [
      {
        icon: UserCog,
        label: "Gerenciamento do Sistema",
        path: "/master-admin",
        roles: ["master_admin"]
      },
      {
        icon: Database,
        label: "Empresas",
        path: "/companies",
        roles: ["master_admin"]
      },
      {
        icon: Users,
        label: "Usuários",
        path: "/users",
        roles: ["master_admin"]
      },
      {
        icon: Trash2,
        label: "Reset de Dados",
        path: "/reset-data",
        roles: ["master_admin"],
        isNew: true
      },
      {
        icon: Lock,
        label: "Alterar Senha",
        path: "/change-password",
        roles: ["master_admin"]
      },
      {
        icon: Package,
        label: "Planos",
        path: "/plans",
        roles: ["master_admin"]
      },
      {
        icon: Globe,
        label: "Configuração DNS",
        path: "/dns-config",
        roles: ["master_admin"]
      },
      {
        icon: Edit,
        label: "Logotipo",
        path: "/logo-config",
        roles: ["master_admin"]
      },
      {
        icon: Smartphone,
        label: "Aplicativo Mobile",
        path: "/mobile-app",
        roles: ["master_admin"]
      },
      {
        icon: HelpCircle,
        label: "Ajuda",
        path: "/help",
        roles: ["master_admin", "admin", "operator", "viewer"]
      }
    ];

    let menuItems = baseItems;
    
    if (user.role === "admin") {
      menuItems = [...menuItems, ...adminItems];
    }
    
    if (user.role === "master_admin") {
      menuItems = [...menuItems, ...adminItems, ...masterAdminItems];
    }
    
    return menuItems.filter(item => item.roles.includes(user.role));
  };

  const menuItems = getMenuItems();
  const userInitials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <Sidebar>
      <SidebarHeader className="py-4 border-b bg-gray-900 text-white">
        <div className="px-4 flex items-center justify-between">
          <LogoDisplay altura={40} />
          <SidebarTrigger>
            <div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden text-white hover:bg-gray-800"
                onClick={handleSidebarTrigger}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </SidebarTrigger>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="py-2 bg-gray-900 text-white">
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-400">Menu Principal</SidebarGroupLabel>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.path + item.label}>
                {item.onClick ? (
                  <SidebarMenuButton 
                    isActive={isActive(item.path)}
                    tooltip={item.label}
                    onClick={() => {
                      item.onClick?.();
                      if (isMobile) handleSidebarTrigger();
                    }}
                    className="hover:bg-gray-800 text-white data-[active=true]:bg-gray-800"
                  >
                    <div className="flex items-center gap-2">
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                      {item.isNew && (
                        <span className="ml-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                          Novo
                        </span>
                      )}
                    </div>
                  </SidebarMenuButton>
                ) : (
                  <Link 
                    to={item.path} 
                    onClick={isMobile ? handleSidebarTrigger : undefined} 
                    className="w-full"
                  >
                    <SidebarMenuButton 
                      isActive={isActive(item.path)}
                      tooltip={item.label}
                      className="hover:bg-gray-800 text-white data-[active=true]:bg-gray-800"
                    >
                      <div className="flex items-center gap-2">
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                        {item.isNew && (
                          <span className="ml-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                            Novo
                          </span>
                        )}
                      </div>
                    </SidebarMenuButton>
                  </Link>
                )}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t bg-gray-900 text-white mt-auto">
        <div className="flex flex-col gap-2">
          <div className="flex items-center space-x-3 mb-2">
            <Avatar>
              <AvatarImage src={user.photo} alt={user.name} />
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-white">{user.name}</div>
              <div className="text-xs text-gray-400 capitalize">{user.role.replace('_', ' ')}</div>
            </div>
          </div>
          <Button 
            onClick={logout} 
            variant="outline" 
            size="sm" 
            className="border-gray-600 hover:bg-gray-800 text-purple-300"
          >
            <LogOut size={16} className="mr-2" />
            Sair
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
