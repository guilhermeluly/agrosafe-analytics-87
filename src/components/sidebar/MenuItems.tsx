
import { Link } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { getPlanoById } from "@/config/planos";
import { 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarGroup, 
  SidebarGroupLabel,
  SidebarMenu
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { MenuItem } from "./types";
import { useEmpresa } from "@/context/EmpresaContext";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface MenuItemsProps {
  items: MenuItem[];
  isActive: (path: string) => boolean;
  onMobileClick?: () => void;
}

export function MenuItems({ items, isActive, onMobileClick }: MenuItemsProps) {
  const { user } = useUser();
  // Get empresa info to determine plan
  const { empresa } = useEmpresa();
  const plano = getPlanoById(empresa?.planoId || "basico");
  
  // Track open submenus
  const [openSubmenus, setOpenSubmenus] = useState<{[key: string]: boolean}>({});
  
  const toggleSubmenu = (title: string) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  return (
    <>
      {items.map((item) => {
        // Skip if user doesn't have required role
        if (!item.roles || !user?.role || !item.roles.includes(user.role)) return null;
        
        // Skip premium features for non-premium plans
        if (item.isPremium && plano?.id !== "completo") return null;

        const active = isActive(item.path);
        
        // If the item has a submenu
        if (item.submenu && item.submenu.length > 0) {
          const hasAccessToAnySubmenuItem = item.submenu.some(
            subItem => subItem.roles && subItem.roles.includes(user.role || "")
          );
          
          if (!hasAccessToAnySubmenuItem) return null;
          
          return (
            <Collapsible
              key={item.path}
              open={openSubmenus[item.label || item.title || ""] || false}
              onOpenChange={() => toggleSubmenu(item.label || item.title || "")}
            >
              <SidebarMenuItem>
                <CollapsibleTrigger className="flex items-center justify-between w-full px-2 py-2 text-sm rounded-md hover:bg-sidebar-accent">
                  <div className="flex items-center">
                    {item.icon && <item.icon className="h-4 w-4 mr-2" />}
                    <span>{item.label || item.title}</span>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </CollapsibleTrigger>
              </SidebarMenuItem>
              
              <CollapsibleContent>
                <div className="pl-6 space-y-1">
                  {item.submenu.map((subItem) => {
                    if (!subItem.roles || !user?.role || !subItem.roles.includes(user.role)) return null;
                    
                    const subActive = isActive(subItem.href);
                    
                    return (
                      <SidebarMenuItem key={subItem.href}>
                        <SidebarMenuButton
                          asChild
                          isActive={subActive}
                          onClick={() => {
                            if (onMobileClick) onMobileClick();
                            if (subItem.onClick) subItem.onClick();
                          }}
                        >
                          <Link to={subItem.href}>
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </div>
              </CollapsibleContent>
            </Collapsible>
          );
        }

        return (
          <SidebarMenuItem key={item.path}>
            <SidebarMenuButton
              asChild
              isActive={active}
              onClick={() => {
                if (onMobileClick) onMobileClick();
                if (item.onClick) item.onClick();
              }}
            >
              <Link to={item.path}>
                {item.icon && <item.icon className="h-4 w-4" />}
                <span>{item.label || item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </>
  );
}
