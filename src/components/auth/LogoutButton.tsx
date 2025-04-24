
import React from 'react';
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';

const LogoutButton = () => {
  const { logout } = useAuth();

  return (
    <Button variant="outline" size="sm" onClick={logout} className="ml-auto">
      <LogOut className="h-4 w-4 mr-2" />
      Sair
    </Button>
  );
};

export default LogoutButton;
