
import React, { useState, useEffect } from "react";
import { DateRange } from "react-day-picker";
import AppLayout from "@/components/AppLayout";
import { useEmpresa } from "@/context/EmpresaContext";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PresentationConfig } from "@/components/presentation/PresentationConfig";
import { PresentationDisplay } from "@/components/presentation/PresentationDisplay";
import { usePresentationMode } from "@/hooks/usePresentationMode";
import { LineTurnoCombo } from "@/components/sidebar/types";

export default function PresentationMode() {
  const { empresa } = useEmpresa();
  const isPremium = empresa.planoId === "completo" || empresa.planoId === "medio";
  
  const [fullscreen, setFullscreen] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [rotationInterval, setRotationInterval] = useState(15);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date()
  });
  const [selectedCombinations, setSelectedCombinations] = useState<string[]>(['global']);
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>(['oee', 'componentes']);

  // Get production lines and shifts from storage or state
  // Using hardcoded data for now until we connect to the real data source
  const productionLines = [
    { id: 'linha-1', name: 'Linha 1', nominalCapacity: 120, standardSetupTime: 15 },
    { id: 'linha-2', name: 'Linha 2', nominalCapacity: 150, standardSetupTime: 20 },
    { id: 'linha-3', name: 'Linha 3', nominalCapacity: 180, standardSetupTime: 25 },
  ];
  
  const shifts = [
    { id: '1', name: 'Manhã', startTime: '06:00', endTime: '14:00' },
    { id: '2', name: 'Tarde', startTime: '14:00', endTime: '22:00' },
    { id: '3', name: 'Noite', startTime: '22:00', endTime: '06:00' },
  ];
  
  // Generate combinations based on registered lines and shifts
  const lineTurnoCombos: LineTurnoCombo[] = [
    { id: 'global', name: 'Global (Todas as linhas e turnos)', linha: 'todas', turno: 'todos' },
    ...productionLines.flatMap(line => 
      shifts.map(shift => ({
        id: `${line.id}-${shift.id}`,
        name: `${line.name} - ${shift.name}`,
        linha: line.id,
        turno: shift.id
      }))
    )
  ];

  const { activeMetric, setActiveMetric, currentCombinationIndex } = usePresentationMode({
    fullscreen,
    autoRotate,
    rotationInterval,
    selectedCombinations,
    selectedIndicators
  });

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  const handleExitPresentation = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    window.history.back();
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (range?.from) {
      setDateRange(range);
    }
  };

  const handleIndicatorToggle = (id: string) => {
    setSelectedIndicators(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const getCurrentCombination = () => {
    if (selectedCombinations.length === 0) return lineTurnoCombos.find(c => c.id === 'global');
    const combinationId = selectedCombinations[currentCombinationIndex];
    return lineTurnoCombos.find(c => c.id === combinationId);
  };

  if (fullscreen) {
    return (
      <PresentationDisplay
        dateRange={dateRange}
        currentCombination={getCurrentCombination()}
        onExitFullscreen={toggleFullscreen}
        activeMetric={activeMetric}
        setActiveMetric={setActiveMetric}
        selectedIndicators={selectedIndicators}
        isPremium={isPremium}
      />
    );
  }

  return (
    <AppLayout title="Modo Apresentação - OEE Performance Hub">
      <div className="container mx-auto py-6 px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Modo Apresentação</h1>
          <Button onClick={handleExitPresentation} variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Voltar
          </Button>
        </div>

        <PresentationConfig
          dateRange={dateRange}
          onDateRangeChange={handleDateRangeChange}
          rotationInterval={rotationInterval}
          setRotationInterval={setRotationInterval}
          autoRotate={autoRotate}
          setAutoRotate={setAutoRotate}
          selectedIndicators={selectedIndicators}
          onIndicatorToggle={handleIndicatorToggle}
          selectedCombinations={selectedCombinations}
          setSelectedCombinations={setSelectedCombinations}
          onStartPresentation={toggleFullscreen}
        />
      </div>
    </AppLayout>
  );
}
