import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineShiftFilter } from "@/components/filters/LineShiftFilter";
import AppLayout from "@/components/AppLayout";

const mockLines = [
  { id: "linha1", name: "Linha 1" },
  { id: "linha2", name: "Linha 2" },
  { id: "linha3", name: "Linha 3" }
];

const mockShifts = [
  { id: "turno1", name: "Manhã" },
  { id: "turno2", name: "Tarde" },
  { id: "turno3", name: "Noite" }
];

export default function Relatorios() {
  const [selectedLine, setSelectedLine] = useState("all");
  const [selectedShift, setSelectedShift] = useState("all");
  
  return (
    <AppLayout title="Relatórios">
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Filtros do Relatório</CardTitle>
          </CardHeader>
          <CardContent>
            <LineShiftFilter
              selectedLine={selectedLine}
              selectedShift={selectedShift}
              onLineChange={setSelectedLine}
              onShiftChange={setSelectedShift}
              allLines={mockLines}
              allShifts={mockShifts}
            />
          </CardContent>
        </Card>
        
        {/* Add report content here */}
      </div>
    </AppLayout>
  );
}
