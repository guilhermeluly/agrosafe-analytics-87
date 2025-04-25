
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

interface LineShiftFilterProps {
  selectedLine: string;
  selectedShift: string;
  onLineChange: (line: string) => void;
  onShiftChange: (shift: string) => void;
  allLines: { id: string; name: string }[];
  allShifts: { id: string; name: string }[];
}

export function LineShiftFilter({
  selectedLine,
  selectedShift,
  onLineChange,
  onShiftChange,
  allLines,
  allShifts
}: LineShiftFilterProps) {
  return (
    <Card className="border shadow-sm">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Select value={selectedLine} onValueChange={onLineChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar Linha" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Linhas</SelectItem>
                {allLines.map((line) => (
                  <SelectItem key={line.id} value={line.id}>
                    {line.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select value={selectedShift} onValueChange={onShiftChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar Turno" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Turnos</SelectItem>
                {allShifts.map((shift) => (
                  <SelectItem key={shift.id} value={shift.id}>
                    {shift.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
