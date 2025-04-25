import React, { useState } from 'react';
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineShiftFilter } from '@/components/filters/LineShiftFilter';
import AppLayout from '@/components/AppLayout';

export default function Relatorios() {
  const [selectedLine, setSelectedLine] = useState('all');
  const [selectedShift, setSelectedShift] = useState('all');
  
  // Example data - in a real app, this would come from your backend
  const allLines = [
    { id: 'linha-1', name: 'Linha 1' },
    { id: 'linha-2', name: 'Linha 2' },
    { id: 'linha-3', name: 'Linha 3' },
  ];
  
  const allShifts = [
    { id: 'turno-1', name: 'Manhã' },
    { id: 'turno-2', name: 'Tarde' },
    { id: 'turno-3', name: 'Noite' },
  ];

  return (
    <AppLayout title="Relatórios">
      <div className="container mx-auto p-4">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filtros do Relatório</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DateRangePicker className="w-full" />
            <LineShiftFilter
              selectedLine={selectedLine}
              selectedShift={selectedShift}
              onLineChange={setSelectedLine}
              onShiftChange={setSelectedShift}
              allLines={allLines}
              allShifts={allShifts}
            />
          </CardContent>
        </Card>

        {/* Rest of your reports content */}
      </div>
    </AppLayout>
  );
}
