
import React, { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeftRight } from "lucide-react";
import { IndicatorSelector } from './IndicatorSelector';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LineShiftFilter } from '../filters/LineShiftFilter';

interface PresentationConfigProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  rotationInterval: number;
  setRotationInterval: (interval: number) => void;
  autoRotate: boolean;
  setAutoRotate: (autoRotate: boolean) => void;
  selectedIndicators: string[];
  onIndicatorToggle: (id: string) => void;
  onStartPresentation: () => void;
  selectedLine: string;
  selectedShift: string;
  onLineChange: (line: string) => void;
  onShiftChange: (shift: string) => void;
  allLines: { id: string; name: string }[];
  allShifts: { id: string; name: string }[];
  selectedCombinations?: string[];
  setSelectedCombinations?: (combinations: string[]) => void;
}

export function PresentationConfig({
  dateRange,
  onDateRangeChange,
  rotationInterval,
  setRotationInterval,
  autoRotate,
  setAutoRotate,
  selectedIndicators,
  onIndicatorToggle,
  onStartPresentation,
  selectedLine,
  selectedShift,
  onLineChange,
  onShiftChange,
  allLines,
  allShifts,
  selectedCombinations = [],
  setSelectedCombinations = () => {}
}: PresentationConfigProps) {
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="shadow-lg col-span-1 lg:col-span-2">
          <CardHeader className="bg-purple-900 text-white">
            <CardTitle>Configurações do Modo Apresentação</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Período de Análise</h3>
              <DateRangePicker
                className="w-full"
                value={dateRange}
                onChange={onDateRangeChange}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Seleção de Linha e Turno</h3>
              <LineShiftFilter
                selectedLine={selectedLine}
                selectedShift={selectedShift}
                onLineChange={onLineChange}
                onShiftChange={onShiftChange}
                allLines={allLines}
                allShifts={allShifts}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Intervalo de Rotação (segundos)</h3>
                <Select value={rotationInterval.toString()} onValueChange={value => setRotationInterval(Number(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tempo de rotação" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 segundos</SelectItem>
                    <SelectItem value="15">15 segundos</SelectItem>
                    <SelectItem value="30">30 segundos</SelectItem>
                    <SelectItem value="60">1 minuto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="autoRotate"
                checked={autoRotate}
                onCheckedChange={(checked) => setAutoRotate(checked as boolean)}
              />
              <label htmlFor="autoRotate" className="text-sm font-medium">
                Rotação automática de indicadores
              </label>
            </div>
          </CardContent>
        </Card>

        <IndicatorSelector
          selectedIndicators={selectedIndicators}
          onIndicatorToggle={onIndicatorToggle}
        />
      </div>

      <Button 
        className="w-full bg-purple-600 hover:bg-purple-700"
        size="lg"
        onClick={onStartPresentation}
        disabled={!selectedLine || !selectedShift || selectedIndicators.length === 0}
      >
        Iniciar Apresentação em Tela Cheia
        <ArrowLeftRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}
