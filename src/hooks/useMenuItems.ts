
import {
  LayoutDashboard, 
  FileText, 
  Settings, 
  BarChart2, 
  Home,
  UserCog,
  Database,
  Users,
  Package,
  Smartphone,
  HelpCircle,
  Download,
  Globe,
  PresentationIcon,
  Lock,
  Edit,
  FileSpreadsheet,
  Trash2,
  Eye,
  FileUp
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { MenuItem } from "@/components/sidebar/types";
import { useUser } from "@/context/UserContext";

export function useMenuItems() {
  const { user } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handlePresentationMode = () => {
    navigate("/presentation-mode");
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
        roles: ["master_admin", "admin", "operator"]
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
        path: "/presentation-mode",
        roles: ["master_admin", "admin", "operator", "viewer"]
      },
      {
        icon: HelpCircle,
        label: "Ajuda",
        path: "/help",
        roles: ["master_admin", "admin", "operator", "viewer"]
      }
    ];

    // Only master_admin can see the visualization menu
    if (user.role === "master_admin") {
      baseItems.push({
        icon: Eye,
        label: "Visualização",
        path: "#",
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
      });
    }

    // Admin settings items
    const adminSettingsSubmenu = [
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
        title: "Exportar Dados",
        href: "#",
        roles: ["master_admin", "admin"],
        onClick: () => {
          toast({
            title: "Exportação iniciada",
            description: "Os dados estão sendo exportados para CSV."
          });
        }
      }
    ];

    // Add DNS Config to admin settings submenu if master_admin
    if (user.role === "master_admin") {
      adminSettingsSubmenu.push({
        title: "Configuração DNS",
        href: "/dns-config",
        roles: ["master_admin"]
      });
      
      adminSettingsSubmenu.push({
        title: "Reset de Dados",
        href: "/reset-data",
        roles: ["master_admin"]
      });
    }

    // Add the settings menu for admin and master_admin
    if (user.role === "admin" || user.role === "master_admin") {
      baseItems.push({
        icon: Settings,
        label: "Configurações",
        path: "/admin",
        roles: ["master_admin", "admin"],
        submenu: adminSettingsSubmenu
      });
    }

    // Add master admin specific items
    const masterAdminItems: MenuItem[] = [];
    
    if (user.role === "master_admin") {
      masterAdminItems.push(
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
        }
      );
    }
    
    // Combine all menus
    if (user.role === "master_admin") {
      baseItems.push(...masterAdminItems);
    }
    
    // Filter items based on user role
    return baseItems.filter(item => {
      return user && user.role && item.roles && item.roles.includes(user.role);
    });
  };

  return { getMenuItems };
}
