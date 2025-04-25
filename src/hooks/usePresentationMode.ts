
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
  selectedCombinations = [], // Default to empty array
  selectedIndicators = []   // Default to empty array
}: UsePresentationModeProps) {
  // Ensure we have valid arrays, defaulting to empty arrays if undefined
  const safeCombinations = Array.isArray(selectedCombinations) ? selectedCombinations : [];
  const safeIndicators = Array.isArray(selectedIndicators) ? selectedIndicators : [];
  
  // Initialize activeMetric with the first indicator or fallback to "oee"
  const [activeMetric, setActiveMetric] = useState(safeIndicators.length > 0 ? safeIndicators[0] : "oee");
  const [currentCombinationIndex, setCurrentCombinationIndex] = useState(0);

  // Reset active metric if the selected indicators change
  useEffect(() => {
    if (safeIndicators.length > 0 && !safeIndicators.includes(activeMetric)) {
      setActiveMetric(safeIndicators[0]);
    }
  }, [safeIndicators, activeMetric]);

  useEffect(() => {
    if (fullscreen && autoRotate && safeIndicators.length > 1) {
      const timer = setInterval(() => {
        setActiveMetric(prevMetric => {
          const currentIndex = safeIndicators.indexOf(prevMetric);
          const nextIndex = (currentIndex + 1) % safeIndicators.length;
          return safeIndicators[nextIndex];
        });
      }, rotationInterval * 1000);
      
      return () => clearInterval(timer);
    }
  }, [fullscreen, autoRotate, rotationInterval, safeIndicators]);
  
  useEffect(() => {
    if (fullscreen && autoRotate && safeCombinations.length > 1) {
      const combinationTimer = setInterval(() => {
        setCurrentCombinationIndex(prevIndex => (prevIndex + 1) % safeCombinations.length);
      }, rotationInterval * 2000); // Change combinations less frequently than metrics
      
      return () => clearInterval(combinationTimer);
    }
  }, [fullscreen, autoRotate, rotationInterval, safeCombinations]);

  return {
    activeMetric,
    setActiveMetric,
    currentCombinationIndex
  };
}
