
import React from "react";
import { useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMenuItems } from "@/hooks/useMenuItems";
import { MenuItems } from "./sidebar/MenuItems";
import { UserProfile } from "./sidebar/UserProfile";
import LogoDisplay from "./LogoDisplay";
import { MenuItem } from "./sidebar/types";

export default function SidebarNavigation() {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { getMenuItems } = useMenuItems();
  const isActive = (path: string) => location.pathname === path;

  const handleSidebarTrigger = () => {
    const sidebarContent = document.querySelector('[data-sidebar-content]');
    if (sidebarContent) {
      sidebarContent.classList.toggle('hidden');
    }
  };

  const menuItems = getMenuItems() as MenuItem[];

  return (
    <Sidebar>
      <SidebarHeader className="py-4 border-b bg-gray-900 text-white">
        <div className="px-4 flex items-center justify-between">
          <LogoDisplay altura={40} />
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden text-white hover:bg-gray-800"
            onClick={handleSidebarTrigger}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="py-2 bg-gray-900 text-white">
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-400">Menu Principal</SidebarGroupLabel>
          <SidebarMenu>
            <MenuItems 
              items={menuItems}
              isActive={isActive}
              onMobileClick={handleSidebarTrigger}
            />
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t bg-gray-900 text-white mt-auto">
        <UserProfile />
      </SidebarFooter>
    </Sidebar>
  );
}
