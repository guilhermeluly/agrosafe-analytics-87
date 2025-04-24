
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Truck } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { getPlanoById } from "@/config/planos";
import { Button } from "@/components/ui/button";

interface DataTypeSelectorProps {
  onSelectType: (type: "production" | "logistics") => void;
}

export default function DataTypeSelector({ onSelectType }: DataTypeSelectorProps) {
  const { user } = useUser();
  const plano = getPlanoById(user?.planoId || "basico");
  const showLogistics = user.role === "admin" || user.role === "master_admin" || (plano && plano.id === "completo");

  return (
    <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
      <Card
        className="cursor-pointer hover:shadow-lg transition-shadow bg-white hover:scale-105"
        onClick={() => onSelectType("production")}
      >
        <CardContent className="flex flex-col items-center justify-center p-6">
          <FileText className="h-12 w-12 text-primary mb-4" />
          <h3 className="text-xl font-bold mb-2">Dados de Produção</h3>
          <p className="text-center text-muted-foreground">
            Registre informações sobre produção, setup, paradas e OEE
          </p>
        </CardContent>
      </Card>

      {showLogistics && (
        <Card
          className="cursor-pointer hover:shadow-lg transition-shadow bg-white hover:scale-105"
          onClick={() => onSelectType("logistics")}
        >
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Truck className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Dados de Movimentação</h3>
            <p className="text-center text-muted-foreground">
              Registre informações sobre expedição e recebimento
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
