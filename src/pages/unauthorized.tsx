
import React from "react";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AppLayout from "../components/AppLayout";

export default function Unauthorized() {
  const { user, logout } = useUser();

  return (
    <AppLayout title="Acesso não autorizado">
      <div className="min-h-[80vh] flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-xl text-center text-red-600">
              Acesso não autorizado
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">
              Olá {user.name}, seu nível de acesso ({user.role}) não permite acessar esta página.
            </p>
            <div className="flex flex-col space-y-2">
              <Button asChild variant="outline">
                <Link to="/dashboard">Ir para Dashboard</Link>
              </Button>
              <Button onClick={logout} variant="destructive">
                Sair do sistema
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
