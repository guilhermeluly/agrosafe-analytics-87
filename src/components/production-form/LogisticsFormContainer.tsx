
import React, { useState } from "react";
import LogisticsSectionSelector from "./LogisticsSectionSelector";
import LogisticsSection from "./LogisticsSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Truck, Upload, Download } from "lucide-react";

interface LogisticsFormContainerProps {
  loadingTime: number;
  setLoadingTime: (v: number) => void;
  unloadingTime: number;
  setUnloadingTime: (v: number) => void;
}

export default function LogisticsFormContainer({
  loadingTime,
  setLoadingTime,
  unloadingTime,
  setUnloadingTime,
}: LogisticsFormContainerProps) {
  const [selectedSection, setSelectedSection] = useState<"loading" | "unloading" | null>(null);

  if (!selectedSection) {
    return <LogisticsSectionSelector onSelectSection={setSelectedSection} />;
  }

  return (
    <Card className={`shadow border-l-4 ${selectedSection === "loading" ? "border-green-500 bg-green-50" : "border-blue-500 bg-blue-50"}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center">
          <Truck className="w-5 h-5 mr-2" />
          {selectedSection === "loading" ? (
            <span className="flex items-center text-green-700">Logística - Carregamento <Upload className="w-4 h-4 ml-2" /></span>
          ) : (
            <span className="flex items-center text-blue-700">Logística - Descarregamento <Download className="w-4 h-4 ml-2" /></span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {selectedSection === "loading" ? (
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <Label htmlFor="loadingTime" className="block font-medium text-gray-700 mb-1">
                Tempo de Carregamento (min)
              </Label>
              <Input
                id="loadingTime"
                type="number"
                value={loadingTime}
                onChange={(e) => setLoadingTime(Number(e.target.value))}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">Tempo médio gasto para carregar materiais</p>
            </div>
          ) : (
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <Label htmlFor="unloadingTime" className="block font-medium text-gray-700 mb-1">
                Tempo de Descarregamento (min)
              </Label>
              <Input
                id="unloadingTime"
                type="number"
                value={unloadingTime}
                onChange={(e) => setUnloadingTime(Number(e.target.value))}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">Tempo médio gasto para descarregar produtos</p>
            </div>
          )}
          
          <div className="flex justify-end space-x-4 mt-4">
            <Button
              onClick={() => setSelectedSection(null)}
              variant="outline"
              className="text-gray-600 hover:text-gray-800"
            >
              Voltar à seleção
            </Button>
            <Button
              className={selectedSection === "loading" ? 
                "bg-green-600 hover:bg-green-700 text-white" : 
                "bg-blue-600 hover:bg-blue-700 text-white"}
            >
              Salvar {selectedSection === "loading" ? "Carregamento" : "Descarregamento"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
