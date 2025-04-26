
import React from 'react';
import { useUser } from '../context/UserContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Building2 } from 'lucide-react';
import { PLANOS } from '../config/planos';

export function PlanSwitcher() {
  const { user, switchPlan } = useUser();

  // Remove conditional rendering - it will be controlled by the menu now
  // if (user.role !== 'master_admin') {
  //   return null;
  // }

  return (
    <div className="mb-2 p-2 bg-gray-800 rounded-md border border-gray-700">
      <Label htmlFor="plan-select" className="text-xs text-gray-300 mb-1 flex items-center gap-1">
        <Building2 size={14} />
        Alternar Plano
      </Label>
      <Select
        onValueChange={switchPlan}
        defaultValue="basico"
      >
        <SelectTrigger id="plan-select" className="h-7 text-xs text-gray-200 bg-gray-700 hover:bg-gray-600">
          <SelectValue placeholder="Selecione um plano" />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 text-gray-200 border-gray-700">
          {PLANOS.map((plano) => (
            <SelectItem key={plano.id} value={plano.id} className="hover:bg-gray-700">
              {plano.nome}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
