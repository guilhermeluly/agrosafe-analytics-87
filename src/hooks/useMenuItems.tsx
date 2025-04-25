
import { 
  LayoutDashboard, Settings, FileText, Database, 
  Users, BuildingIcon, HardDrive, HelpCircle, Eye,
  BarChart2, Server
} from "lucide-react";
import { useUser } from "@/context/UserContext";

export function useMenuItems() {
  const { user } = useUser();

  const getMenuItems = () => {
    const menuItems = [
      {
        title: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
        roles: ["master_admin", "admin", "operator", "viewer"]
      },
      {
        title: "Registrar Dados",
        icon: FileText,
        href: "/production-form",
        roles: ["master_admin", "admin", "operator"]
      },
      {
        title: "Relatórios",
        icon: BarChart2,
        href: "/relatorios",
        roles: ["master_admin", "admin", "operator", "viewer"]
      },
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
      },
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
            title: "Metas",
            href: "/goals",
            roles: ["master_admin", "admin"]
          },
          {
            title: "Configurações Avançadas",
            href: "/dns-config",
            roles: ["master_admin"]
          }
        ]
      },
      {
        title: "Banco de Dados",
        icon: Database,
        href: "/database",
        roles: ["master_admin", "admin"]
      },
      {
        title: "Suporte Técnico",
        icon: HelpCircle,
        href: "/help",
        roles: ["master_admin", "admin", "operator", "viewer"]
      }
    ];

    // Filter items based on user role
    return menuItems.filter(item => item.roles.includes(user.role));
  };

  return { getMenuItems };
}
