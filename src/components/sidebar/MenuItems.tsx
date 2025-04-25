
import React from "react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { MenuItem } from "./types";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

interface MenuItemsProps {
  items: MenuItem[];
  isActive: (path: string) => boolean;
  onMobileClick?: () => void;
}

export function MenuItems({ items, isActive, onMobileClick }: MenuItemsProps) {
  const isMobile = useIsMobile();

  return (
    <>
      {items.map((item) => (
        <SidebarMenuItem key={item.path + item.label}>
          {item.onClick ? (
            <SidebarMenuButton 
              isActive={isActive(item.path)}
              tooltip={item.label}
              onClick={() => {
                item.onClick?.();
                if (isMobile) onMobileClick?.();
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
              onClick={isMobile ? onMobileClick : undefined} 
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
    </>
  );
}

