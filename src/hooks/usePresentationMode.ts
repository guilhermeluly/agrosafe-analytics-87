
import { useState, useEffect, useCallback } from 'react';
import { DateRange } from 'react-day-picker';
import { LineTurnoCombo } from '@/components/sidebar/types';

interface UsePresentationModeProps {
  fullscreen: boolean;
  autoRotate: boolean;
  rotationInterval: number;
  selectedCombinations: string[];
}

export function usePresentationMode({ 
  fullscreen, 
  autoRotate, 
  rotationInterval, 
  selectedCombinations 
}: UsePresentationModeProps) {
  const [activeMetric, setActiveMetric] = useState("oee");
  const [currentCombinationIndex, setCurrentCombinationIndex] = useState(0);

  useEffect(() => {
    if (fullscreen && autoRotate) {
      const timer = setInterval(() => {
        setActiveMetric(prevMetric => {
          const metrics = ["oee", "componentes", "paradas", "rejects", "setup", "movimentacao", "produtividade", "loadTime"];
          const currentIndex = metrics.indexOf(prevMetric);
          const nextIndex = (currentIndex + 1) % metrics.length;
          return metrics[nextIndex];
        });
      }, rotationInterval * 1000);
      
      return () => clearInterval(timer);
    }
  }, [fullscreen, autoRotate, rotationInterval]);
  
  useEffect(() => {
    if (fullscreen && autoRotate && selectedCombinations.length > 1) {
      const combinationTimer = setInterval(() => {
        setCurrentCombinationIndex(prevIndex => (prevIndex + 1) % selectedCombinations.length);
      }, rotationInterval * 2000);
      
      return () => clearInterval(combinationTimer);
    }
  }, [fullscreen, autoRotate, rotationInterval, selectedCombinations]);

  return {
    activeMetric,
    setActiveMetric,
    currentCombinationIndex
  };
}
