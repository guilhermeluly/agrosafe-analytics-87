
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useEmpresa } from "@/context/EmpresaContext";
import { PresentationIndicator } from '../sidebar/types';

const DEFAULT_INDICATORS: PresentationIndicator[] = [
  { id: 'oee', label: 'OEE Geral', category: 'oee' },
  { id: 'components', label: 'Componentes OEE', category: 'oee' },
  { id: 'stops', label: 'Análise de Paradas', category: 'oee' },
  { id: 'rejects', label: 'Rejeitos e Reprocesso', category: 'oee' },
  { id: 'setup', label: 'Tempo Médio de Setup', category: 'productivity' },
  { id: 'trucks', label: 'Movimentação de Caminhões', category: 'logistics', isPremium: true },
  { id: 'productivity', label: 'Kg/Hora/Homem', category: 'logistics', isPremium: true },
  { id: 'loadTime', label: 'Tempo Entre Movimentações', category: 'logistics', isPremium: true },
];

interface Props {
  selectedIndicators: string[];
  onIndicatorToggle: (id: string) => void;
}

export function IndicatorSelector({ selectedIndicators = [], onIndicatorToggle }: Props) {
  const { empresa } = useEmpresa();
  const isPremium = empresa.planoId === "completo" || empresa.planoId === "medio";

  // Ensure selectedIndicators is always an array
  const safeSelectedIndicators = Array.isArray(selectedIndicators) ? selectedIndicators : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Indicadores para Apresentação</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DEFAULT_INDICATORS.map(indicator => {
            const isDisabled = indicator.isPremium && !isPremium;
            
            return (
              <div key={indicator.id} className="flex items-start space-x-2">
                <Checkbox 
                  id={`indicator-${indicator.id}`}
                  checked={safeSelectedIndicators.includes(indicator.id)}
                  onCheckedChange={() => !isDisabled && onIndicatorToggle(indicator.id)}
                  disabled={isDisabled}
                />
                <label 
                  htmlFor={`indicator-${indicator.id}`}
                  className={`text-sm cursor-pointer ${isDisabled ? 'text-gray-400' : ''}`}
                >
                  {indicator.label}
                  {isDisabled && (
                    <span className="ml-2 text-xs text-amber-500">(Premium)</span>
                  )}
                </label>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
