
import { useState, useEffect, useCallback } from 'react';
import { DateRange } from 'react-day-picker';
import { LineTurnoCombo } from '@/components/sidebar/types';

interface UsePresentationModeProps {
  fullscreen: boolean;
  autoRotate: boolean;
  rotationInterval: number;
  selectedCombinations: string[];
  selectedIndicators: string[];
}

export function usePresentationMode({ 
  fullscreen, 
  autoRotate, 
  rotationInterval, 
  selectedCombinations,
  selectedIndicators
}: UsePresentationModeProps) {
  const [activeMetric, setActiveMetric] = useState(selectedIndicators[0] || "oee");
  const [currentCombinationIndex, setCurrentCombinationIndex] = useState(0);

  // Reset active metric if the selected indicators change
  useEffect(() => {
    if (selectedIndicators.length > 0 && !selectedIndicators.includes(activeMetric)) {
      setActiveMetric(selectedIndicators[0]);
    }
  }, [selectedIndicators, activeMetric]);

  useEffect(() => {
    if (fullscreen && autoRotate && selectedIndicators.length > 1) {
      const timer = setInterval(() => {
        setActiveMetric(prevMetric => {
          const currentIndex = selectedIndicators.indexOf(prevMetric);
          const nextIndex = (currentIndex + 1) % selectedIndicators.length;
          return selectedIndicators[nextIndex];
        });
      }, rotationInterval * 1000);
      
      return () => clearInterval(timer);
    }
  }, [fullscreen, autoRotate, rotationInterval, selectedIndicators]);
  
  useEffect(() => {
    if (fullscreen && autoRotate && selectedCombinations.length > 1) {
      const combinationTimer = setInterval(() => {
        setCurrentCombinationIndex(prevIndex => (prevIndex + 1) % selectedCombinations.length);
      }, rotationInterval * 2000); // Change combinations less frequently than metrics
      
      return () => clearInterval(combinationTimer);
    }
  }, [fullscreen, autoRotate, rotationInterval, selectedCombinations]);

  return {
    activeMetric,
    setActiveMetric,
    currentCombinationIndex
  };
}
