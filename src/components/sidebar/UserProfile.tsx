
import React from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/context/UserContext";

export function UserProfile() {
  const { user, logout } = useUser();
  const userInitials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center space-x-3 mb-2">
        <Avatar>
          <AvatarImage src={user.photo} alt={user.name} />
          <AvatarFallback>{userInitials}</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium text-white">{user.name}</div>
          <div className="text-xs text-gray-400 capitalize">{user.role.replace('_', ' ')}</div>
        </div>
      </div>
      <Button 
        onClick={logout} 
        variant="outline" 
        size="sm" 
        className="border-gray-600 hover:bg-gray-800 text-purple-300"
      >
        <LogOut size={16} className="mr-2" />
        Sair
      </Button>
    </div>
  );
}

