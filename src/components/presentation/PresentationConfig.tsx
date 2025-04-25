
import React, { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeftRight, PlusSquare, X } from "lucide-react";
import { IndicatorSelector } from './IndicatorSelector';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LineShiftFilter } from '../filters/LineShiftFilter';
import { LineTurnoCombo } from '@/components/sidebar/types';
import { Separator } from "@/components/ui/separator";

interface ChartDisplayOptions {
  showValues: boolean;
  showGrid: boolean;
  darkMode: boolean;
  showTrendline: boolean;
}

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
  chartOptions?: ChartDisplayOptions;
  setChartOptions?: (options: ChartDisplayOptions) => void;
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
  setSelectedCombinations = () => {},
  chartOptions = {
    showValues: true,
    showGrid: true,
    darkMode: true,
    showTrendline: false,
  },
  setChartOptions = () => {}
}: PresentationConfigProps) {
  const [currentLine, setCurrentLine] = useState('all');
  const [currentShift, setCurrentShift] = useState('all');

  // Function to add current line-shift combination to selected combinations
  const addCombination = () => {
    if (currentLine && currentShift) {
      const combinationId = `${currentLine}-${currentShift}`;
      if (!selectedCombinations.includes(combinationId)) {
        setSelectedCombinations([...selectedCombinations, combinationId]);
      }
    }
  };

  // Function to remove a combination
  const removeCombination = (combinationId: string) => {
    setSelectedCombinations(selectedCombinations.filter(id => id !== combinationId));
  };

  // Get line and shift names for display
  const getLineName = (lineId: string) => {
    if (lineId === 'all') return 'Todas as Linhas';
    const line = allLines.find(l => l.id === lineId);
    return line ? line.name : lineId;
  };

  const getShiftName = (shiftId: string) => {
    if (shiftId === 'all') return 'Todos os Turnos';
    const shift = allShifts.find(s => s.id === shiftId);
    return shift ? shift.name : shiftId;
  };

  // Handler for chart display options
  const handleChartOptionChange = (option: keyof ChartDisplayOptions, value: boolean) => {
    setChartOptions({
      ...chartOptions,
      [option]: value
    });
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="shadow-lg col-span-1 lg:col-span-2">
          <CardHeader className="bg-purple-900 text-white">
            <CardTitle>Configurações do Modo Apresentação</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Period Selection */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Período de Análise</h3>
              <DateRangePicker
                className="w-full"
                value={dateRange}
                onChange={onDateRangeChange}
              />
            </div>

            {/* Line and Shift Configuration */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Configuração de Linhas e Turnos para Apresentação</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="col-span-1 md:col-span-3">
                  <LineShiftFilter
                    selectedLine={currentLine}
                    selectedShift={currentShift}
                    onLineChange={setCurrentLine}
                    onShiftChange={setCurrentShift}
                    allLines={allLines}
                    allShifts={allShifts}
                  />
                </div>
                <div className="col-span-1">
                  <Button 
                    onClick={addCombination}
                    className="w-full h-full bg-green-600 hover:bg-green-700"
                    disabled={!currentLine || !currentShift}
                  >
                    <PlusSquare className="mr-2 h-4 w-4" />
                    Adicionar
                  </Button>
                </div>
              </div>

              {/* Selected Combinations */}
              <div className="border rounded-md p-2">
                <h4 className="text-sm font-medium mb-2">Combinações Selecionadas</h4>
                {selectedCombinations.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">Nenhuma combinação selecionada. Selecione pelo menos uma combinação.</p>
                ) : (
                  <ScrollArea className="h-28">
                    <div className="space-y-2">
                      {selectedCombinations.map((combo) => {
                        const [lineId, shiftId] = combo.split('-');
                        return (
                          <div key={combo} className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                            <span className="text-sm">{getLineName(lineId)} - {getShiftName(shiftId)}</span>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => removeCombination(combo)}
                              className="h-6 w-6 p-0"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                )}
              </div>
            </div>

            {/* Chart Display Options */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Opções de Exibição dos Gráficos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="showValues"
                      checked={chartOptions.showValues}
                      onCheckedChange={(checked) => handleChartOptionChange('showValues', checked as boolean)}
                    />
                    <label htmlFor="showValues" className="text-sm">
                      Exibir valores nos gráficos
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="showGrid"
                      checked={chartOptions.showGrid}
                      onCheckedChange={(checked) => handleChartOptionChange('showGrid', checked as boolean)}
                    />
                    <label htmlFor="showGrid" className="text-sm">
                      Exibir linhas de grade
                    </label>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="darkMode"
                      checked={chartOptions.darkMode}
                      onCheckedChange={(checked) => handleChartOptionChange('darkMode', checked as boolean)}
                    />
                    <label htmlFor="darkMode" className="text-sm">
                      Usar fundo escuro
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="showTrendline"
                      checked={chartOptions.showTrendline}
                      onCheckedChange={(checked) => handleChartOptionChange('showTrendline', checked as boolean)}
                    />
                    <label htmlFor="showTrendline" className="text-sm">
                      Exibir linha de tendência
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Rotation Settings */}
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
