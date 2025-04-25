
import React, { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeftRight, Globe } from "lucide-react";
import { IndicatorSelector } from './IndicatorSelector';
import { LOCAL_COMBINATIONS } from '@/utils/combinations';
import { LineTurnoCombo } from '@/components/sidebar/types';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PresentationConfigProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  rotationInterval: number;
  setRotationInterval: (interval: number) => void;
  autoRotate: boolean;
  setAutoRotate: (autoRotate: boolean) => void;
  selectedIndicators: string[];
  onIndicatorToggle: (id: string) => void;
  selectedCombinations: string[];
  setSelectedCombinations: (combinations: string[]) => void;
  onStartPresentation: () => void;
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
  selectedCombinations,
  setSelectedCombinations,
  onStartPresentation
}: PresentationConfigProps) {
  
  // Fixed this function to return a string array explicitly
  const handleCombinationToggle = (id: string) => {
    if (selectedCombinations.includes(id)) {
      // If already selected, remove it
      const newCombinations = selectedCombinations.filter(c => c !== id);
      setSelectedCombinations(newCombinations);
    } else {
      // If not selected, add it
      const newCombinations = [...selectedCombinations, id];
      setSelectedCombinations(newCombinations);
    }
  };
  
  const isGlobalSelected = selectedCombinations.includes('global');

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
              <h3 className="text-sm font-medium">Combinações de Linha e Turno</h3>
              <div className="border rounded-md p-3 bg-gray-50">
                <div className="flex items-center space-x-2 mb-3">
                  <Checkbox 
                    id="global" 
                    checked={isGlobalSelected}
                    onCheckedChange={() => handleCombinationToggle('global')}
                  />
                  <label htmlFor="global" className="text-sm font-medium flex items-center gap-1">
                    <Globe className="h-4 w-4" />
                    Global (Todas as linhas e turnos)
                  </label>
                </div>
                
                <ScrollArea className="h-32 pr-4">
                  <div className="space-y-2">
                    {LOCAL_COMBINATIONS.filter(combo => combo.id !== 'global').map((combo) => (
                      <div key={combo.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`combo-${combo.id}`} 
                          checked={selectedCombinations.includes(combo.id)}
                          onCheckedChange={() => handleCombinationToggle(combo.id)}
                          disabled={isGlobalSelected}
                        />
                        <label 
                          htmlFor={`combo-${combo.id}`} 
                          className={`text-sm ${isGlobalSelected ? "text-gray-400" : "text-gray-700"}`}
                        >
                          {combo.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
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
                Rotação automática de indicadores e combinações
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
        disabled={selectedCombinations.length === 0 || selectedIndicators.length === 0}
      >
        Iniciar Apresentação em Tela Cheia
        <ArrowLeftRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}
