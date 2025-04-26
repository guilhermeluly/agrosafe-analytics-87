
import React from "react";
import { useUser } from "@/context/UserContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, UserCog } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function UserProfile() {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  
  if (!user.isAuthenticated) {
    return null;
  }

  const userInitials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={user.photo || undefined} alt={user.name} />
          <AvatarFallback className="bg-gray-700">{userInitials}</AvatarFallback>
        </Avatar>
        <div className="space-y-0.5">
          <div className="text-sm font-medium text-gray-200">{user.name}</div>
          <div className="text-xs text-gray-400">{user.email}</div>
        </div>
      </div>
      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-700"
          onClick={() => navigate("/change-password")}
        >
          <UserCog className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-400 hover:text-white hover:bg-red-900"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
