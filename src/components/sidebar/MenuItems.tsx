
import { Link } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { getPlanoById } from "@/config/planos";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { LucideIcon } from "lucide-react";

interface MenuItem {
  title: string;
  href: string;
  icon: LucideIcon;
  role: string[];
  isPremium?: boolean;
}

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
        if (!item.role.includes(user.role)) return null;
        
        // Skip premium features for non-premium plans
        if (item.isPremium && plano?.id !== "completo") return null;

        const active = isActive(item.href);

        return (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              active={active}
              onClick={onMobileClick}
            >
              <Link to={item.href}>
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </>
  );
}

