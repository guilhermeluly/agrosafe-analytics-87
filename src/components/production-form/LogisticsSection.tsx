
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Truck } from "lucide-react";

interface LogisticsSectionProps {
  loadingTime: number;
  setLoadingTime: (v: number) => void;
  unloadingTime: number;
  setUnloadingTime: (v: number) => void;
  showLogistics: boolean;
}

export default function LogisticsSection({
  loadingTime,
  setLoadingTime,
  unloadingTime,
  setUnloadingTime,
  showLogistics
}: LogisticsSectionProps) {
  if (!showLogistics) return null;
  
  return (
    <Card className="bg-cyan-50 shadow border-l-4 border-cyan-500">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center">
          <Truck className="w-5 h-5 mr-2" />
          Logística - Carregamento e Descarregamento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="loadingTime" className="font-bold text-gray-700">
              Tempo de Carregamento (min)
            </Label>
            <Input
              id="loadingTime"
              type="number"
              min={0}
              value={loadingTime}
              onChange={e => setLoadingTime(Number(e.target.value))}
              className="bg-white"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Tempo médio gasto para carregar materiais
            </p>
          </div>
          <div>
            <Label htmlFor="unloadingTime" className="font-bold text-gray-700">
              Tempo de Descarregamento (min)
            </Label>
            <Input
              id="unloadingTime"
              type="number"
              min={0}
              value={unloadingTime}
              onChange={e => setUnloadingTime(Number(e.target.value))}
              className="bg-white"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Tempo médio gasto para descarregar produtos
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
