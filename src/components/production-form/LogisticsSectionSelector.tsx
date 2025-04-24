
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Truck } from "lucide-react";

interface LogisticsSectionSelectorProps {
  onSelectSection: (section: "loading" | "unloading") => void;
}

export default function LogisticsSectionSelector({ onSelectSection }: LogisticsSectionSelectorProps) {
  return (
    <Card className="bg-cyan-50 shadow border-l-4 border-cyan-500">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center">
          <Truck className="w-5 h-5 mr-2" />
          Logística - Selecione o tipo de operação
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            onClick={() => onSelectSection("loading")}
            className="h-24 bg-green-600 hover:bg-green-700 text-white flex flex-col items-center justify-center space-y-2"
          >
            <span className="text-lg font-semibold">Carregamento</span>
            <ArrowRight className="w-6 h-6" />
          </Button>
          <Button
            onClick={() => onSelectSection("unloading")}
            className="h-24 bg-blue-600 hover:bg-blue-700 text-white flex flex-col items-center justify-center space-y-2"
          >
            <span className="text-lg font-semibold">Descarregamento</span>
            <ArrowRight className="w-6 h-6" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
