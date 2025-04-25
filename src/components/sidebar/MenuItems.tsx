
import { Link } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { getPlanoById } from "@/config/planos";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { MenuItem } from "./types";

interface MenuItemsProps {
  items: MenuItem[];
  isActive: (path: string) => boolean;
  onMobileClick?: () => void;
}

export function MenuItems({ items, isActive, onMobileClick }: MenuItemsProps) {
  const { user } = useUser();
  const plano = getPlanoById(user?.planoId || "basico");

  return (
    <>
      {items.map((item) => {
        // Skip if user doesn't have required role
        if (!item.roles || !user?.role || !item.roles.includes(user.role)) return null;
        
        // Skip premium features for non-premium plans
        if (item.isPremium && plano?.id !== "completo") return null;

        const active = isActive(item.path);

        return (
          <SidebarMenuItem key={item.path}>
            <SidebarMenuButton
              asChild
              isActive={active}
              onClick={onMobileClick}
            >
              <Link to={item.path}>
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </>
  );
}
