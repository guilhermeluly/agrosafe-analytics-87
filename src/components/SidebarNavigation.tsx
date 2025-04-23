
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
  UserCog
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
  SidebarGroup
} from "@/components/ui/sidebar";
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
        roles: ["admin", "operator", "viewer"]
      },
      {
        icon: LayoutDashboard,
        label: "Dashboard",
        path: "/dashboard",
        roles: ["admin", "operator", "viewer"]
      },
      {
        icon: FileText,
        label: "Inserir Dados",
        path: "/production-form",
        roles: ["admin", "operator"]
      },
      {
        icon: BarChart2,
        label: "Relatórios",
        path: "/relatorios",
        roles: ["admin", "operator", "viewer"]
      }
    ];

    const adminItems = [
      {
        icon: Settings,
        label: "Configurações",
        path: "/admin",
        roles: ["admin"]
      }
    ];
    
    const masterAdminItems = [
      {
        icon: UserCog,
        label: "Admin Master",
        path: "/master-admin",
        roles: ["admin"]
      }
    ];

    let menuItems = baseItems;
    
    if (user.role === "admin") {
      menuItems = [...menuItems, ...adminItems];
      
      // Only show master admin for the main admin account
      if (user.id === "1") {
        menuItems = [...menuItems, ...masterAdminItems];
      }
    }
    
    return menuItems.filter(item => item.roles.includes(user.role));
  };

  const menuItems = getMenuItems();

  return (
    <Sidebar>
      <SidebarHeader className="py-4">
        <div className="px-4">
          <LogoDisplay altura={40} />
        </div>
      </SidebarHeader>
      
      <SidebarContent>
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
                  <Link to={item.path}>
                    <item.icon className="mr-2" size={18} />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <div className="flex flex-col gap-2">
          <div className="text-sm text-muted-foreground">
            Logado como: <span className="font-medium">{user.name}</span>
            <div className="text-xs">Nível: {user.role}</div>
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
