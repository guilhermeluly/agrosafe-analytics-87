
import { 
  LayoutDashboard, FileText, Settings, BarChart2, Home,
  UserCog, Database, Users, Package, Smartphone, HelpCircle,
  Eye, Globe
} from "lucide-react";
import { useUser } from "@/context/UserContext";

export function useMenuItems() {
  const { user } = useUser();

  const getMenuItems = () => {
    const baseItems = [
      {
        title: "Início",
        icon: Home,
        href: "/home",
        roles: ["master_admin", "admin", "operator", "viewer"]
      },
      {
        title: "Registrar Dados",
        icon: FileText,
        href: "/production-form",
        roles: ["master_admin", "admin", "operator"]
      },
      {
        title: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
        roles: ["master_admin", "admin", "operator", "viewer"]
      },
      {
        title: "Relatórios",
        icon: BarChart2,
        href: "/relatorios",
        roles: ["master_admin", "admin", "operator", "viewer"]
      }
    ];

    const adminItems = [
      {
        title: "Configurações",
        icon: Settings,
        href: "/admin",
        roles: ["master_admin", "admin"],
        submenu: [
          {
            title: "Cadastros",
            href: "/admin/cadastros",
            roles: ["master_admin", "admin"]
          },
          {
            title: "Banco de Dados",
            href: "/database",
            roles: ["master_admin", "admin"]
          },
          {
            title: "Configuração DNS",
            href: "/dns-config",
            roles: ["master_admin"]
          }
        ]
      }
    ];

    const masterAdminItems = [
      {
        title: "Visualização",
        icon: Eye,
        href: "#",
        roles: ["master_admin"],
        submenu: [
          {
            title: "Alternar Nível de Acesso",
            href: "/role-switch",
            roles: ["master_admin"]
          },
          {
            title: "Alternar Plano",
            href: "/plan-switch",
            roles: ["master_admin"]
          },
          {
            title: "Visualizar Empresa",
            href: "/company-view",
            roles: ["master_admin"]
          }
        ]
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

  return { getMenuItems };
}
