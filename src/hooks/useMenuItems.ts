
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
  Trash2
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
        icon: Edit,
        label: "Cadastros",
        path: "/admin/cadastros",
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
        onClick: () => {
          toast({
            title: "Exportação iniciada",
            description: "Os dados estão sendo exportados para CSV."
          });
        }
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

  return { getMenuItems };
}

