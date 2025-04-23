
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
  MenuIcon
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

export default function SidebarNavigation() {
  const { user, logout } = useUser();
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  // Define menu items based on user role
  const getMenuItems = () => {
    const baseItems = [
      {
        icon: Home,
        label: "Início",
        path: "/",
        roles: ["master_admin", "admin", "operator", "viewer"]
      },
      {
        icon: FileText,
        label: "Inserir Dados",
        path: "/production-form",
        roles: ["master_admin", "admin", "operator"],
        isNew: true
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
      }
    ];

    const adminItems = [
      {
        icon: Settings,
        label: "Configurações",
        path: "/admin",
        roles: ["master_admin", "admin"]
      }
    ];
    
    const masterAdminItems = [
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
        icon: Package,
        label: "Planos",
        path: "/plans",
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
      <SidebarHeader className="py-4 border-b">
        <div className="px-4 flex items-center justify-between">
          <LogoDisplay altura={40} />
          <SidebarTrigger>
            <Button variant="ghost" size="icon" className="md:hidden">
              <MenuIcon className="h-5 w-5" />
            </Button>
          </SidebarTrigger>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="py-2">
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton 
                  asChild 
                  isActive={isActive(item.path)}
                  tooltip={item.label}
                >
                  <Link to={item.path} className="flex items-center py-2">
                    <item.icon className="mr-2" size={18} />
                    <span>{item.label}</span>
                    {item.isNew && (
                      <span className="ml-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                        Novo
                      </span>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t mt-auto">
        <div className="flex flex-col gap-2">
          <div className="flex items-center space-x-3 mb-2">
            <Avatar>
              <AvatarImage src={user.photo} alt={user.name} />
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{user.name}</div>
              <div className="text-xs text-muted-foreground capitalize">{user.role.replace('_', ' ')}</div>
            </div>
          </div>
          <SidebarMenuButton onClick={logout} variant="outline" size="sm">
            <LogOut size={16} className="mr-2" />
            Sair
          </SidebarMenuButton>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
