
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LogisticsSectionProps {
  type: "loading" | "unloading" | null;
  setType: (type: "loading" | "unloading" | null) => void;
  loadingTime: number;
  setLoadingTime: (v: number) => void;
  unloadingTime: number;
  setUnloadingTime: (v: number) => void;
}

export default function LogisticsSection({
  type,
  setType,
  loadingTime,
  setLoadingTime,
  unloadingTime,
  setUnloadingTime
}: LogisticsSectionProps) {
  if (!type) {
    return (
      <Card className="bg-cyan-50 shadow border-l-4 border-cyan-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center">
            <Truck className="w-5 h-5 mr-2" />
            Selecione o Tipo de Operação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select onValueChange={(value) => setType(value as "loading" | "unloading")}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo de operação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="loading">Carregamento</SelectItem>
              <SelectItem value="unloading">Descarregamento</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-cyan-50 shadow border-l-4 border-cyan-500">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center">
          <Truck className="w-5 h-5 mr-2" />
          {type === "loading" ? "Carregamento" : "Descarregamento"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor={type === "loading" ? "loadingTime" : "unloadingTime"} className="font-bold text-gray-700">
              Tempo de {type === "loading" ? "Carregamento" : "Descarregamento"} (min)
            </Label>
            <Input
              id={type === "loading" ? "loadingTime" : "unloadingTime"}
              type="number"
              min={0}
              value={type === "loading" ? loadingTime : unloadingTime}
              onChange={e => type === "loading" ? setLoadingTime(Number(e.target.value)) : setUnloadingTime(Number(e.target.value))}
              className="bg-white"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Tempo médio gasto para {type === "loading" ? "carregar materiais" : "descarregar produtos"}
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setType(null)}
            className="w-full"
          >
            Voltar para Seleção
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
