
import React, { useState } from "react";
import { DateRange } from "react-day-picker";
import AppLayout from "@/components/AppLayout";
import { useEmpresa } from "@/context/EmpresaContext";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PresentationConfig } from "@/components/presentation/PresentationConfig";
import { PresentationDisplay } from "@/components/presentation/PresentationDisplay";
import { usePresentationMode } from "@/hooks/usePresentationMode";
import { LOCAL_COMBINATIONS } from "@/utils/combinations";

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
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>(['oee', 'components']);

  const { activeMetric, setActiveMetric, currentCombinationIndex } = usePresentationMode({
    fullscreen,
    autoRotate,
    rotationInterval,
    selectedCombinations
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
    if (selectedCombinations.length === 0) return LOCAL_COMBINATIONS.find(c => c.id === 'global');
    const combinationId = selectedCombinations[currentCombinationIndex];
    return LOCAL_COMBINATIONS.find(c => c.id === combinationId);
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
          onStartPresentation={toggleFullscreen}
        />
      </div>
    </AppLayout>
  );
}
