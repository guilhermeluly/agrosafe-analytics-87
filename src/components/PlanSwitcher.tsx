
import React from 'react';
import { useUser } from '../context/UserContext';
import { useEmpresa } from '../context/EmpresaContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Building2 } from 'lucide-react';
import { PLANOS } from '../config/planos';
import { toast } from './ui/use-toast';

export function PlanSwitcher() {
  const { user } = useUser();
  const { empresa, setEmpresa } = useEmpresa();
  
  const handlePlanSwitch = (planId: string) => {
    try {
      // Find the selected plan details
      const selectedPlan = PLANOS.find(p => p.id === planId);
      
      if (selectedPlan && empresa) {
        // Update the empresa object with the new plan
        setEmpresa({
          ...empresa,
          planoId: planId
        });
        
        toast({
          title: "Plano alterado",
          description: `O plano foi alterado para: ${selectedPlan.nome}`
        });
      }
    } catch (error) {
      console.error("Erro ao alternar plano:", error);
      toast({
        variant: "destructive",
        title: "Erro ao alternar plano",
        description: "Não foi possível alterar o plano selecionado."
      });
    }
  };

  return (
    <div className="p-2 bg-gray-800 rounded-md border border-gray-700">
      <Label htmlFor="plan-select" className="text-xs text-gray-300 mb-1 flex items-center gap-1">
        <Building2 size={14} />
        Alternar Plano
      </Label>
      <Select
        onValueChange={handlePlanSwitch}
        defaultValue={empresa?.planoId || "basico"}
        value={empresa?.planoId || "basico"}
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
