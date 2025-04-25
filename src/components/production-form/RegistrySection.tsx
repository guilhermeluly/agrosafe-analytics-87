
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEmpresa } from "@/context/EmpresaContext";
import { toast } from "sonner";

interface Line {
  id: string;
  name: string;
  nominalCapacity: number;
  standardSetupTime: number;
}

interface RegistrySectionProps {
  customLines: Line[];
  setCustomLines: (lines: Line[]) => void;
  productionLines: Line[];
  unitType: 'kg/h' | 'unidades/h'; // Added correct type
  setUnitType: (type: 'kg/h' | 'unidades/h') => void; // Updated type for setUnitType
}

export default function RegistrySection({
  customLines,
  setCustomLines,
  productionLines,
  unitType,
  setUnitType
}: RegistrySectionProps) {
  const [newLineName, setNewLineName] = useState("");
  const [newLineCapacity, setNewLineCapacity] = useState<number>(100);
  const [newLineSetup, setNewLineSetup] = useState<number>(10);
  const { empresa } = useEmpresa();
  
  const handleAddLine = () => {
    if (newLineName.trim() && newLineCapacity > 0) {
      const id = (customLines.length + productionLines.length + 1).toString();
      setCustomLines([
        ...customLines,
        { id, name: newLineName.trim(), nominalCapacity: newLineCapacity, standardSetupTime: newLineSetup }
      ]);
      setNewLineName("");
      setNewLineCapacity(100);
      setNewLineSetup(10);
      
      toast.success("Linha/Local adicionado com sucesso!");
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Cadastrar Nova Linha/Local</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="newLineName">Nome da Linha/Local</Label>
              <Input
                id="newLineName"
                placeholder="Ex: Linha 4, Setor B, etc"
                value={newLineName}
                onChange={e => setNewLineName(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="newLineCapacity">Capacidade Nominal</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    id="newLineCapacity"
                    type="number"
                    min={1}
                    value={newLineCapacity}
                    onChange={e => setNewLineCapacity(Number(e.target.value))}
                  />
                  <span className="text-sm">{empresa.unidadeCapacidade}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Capacidade de produção por hora
                </p>
              </div>
              
              <div>
                <Label htmlFor="newLineSetup">Tempo Padrão de Setup</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    id="newLineSetup"
                    type="number"
                    min={1}
                    value={newLineSetup}
                    onChange={e => setNewLineSetup(Number(e.target.value))}
                  />
                  <span className="text-sm">min</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Tempo médio necessário para setup
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button 
                type="button" 
                onClick={handleAddLine} 
                className="flex-1 bg-vividPurple hover:bg-secondaryPurple mt-2"
              >
                Adicionar Linha/Local
              </Button>
              
              <Button 
                type="button"
                onClick={() => toast.success("Configurações salvas com sucesso!")} 
                className="flex-1 bg-green-600 hover:bg-green-700 mt-2"
              >
                Salvar Configurações
              </Button>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Linhas/Locais Cadastrados</h3>
            <div className="bg-muted/30 p-3 rounded-md max-h-60 overflow-y-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left pb-2">Nome</th>
                    <th className="text-left pb-2">Capacidade</th>
                    <th className="text-left pb-2">Setup (min)</th>
                  </tr>
                </thead>
                <tbody>
                  {[...productionLines, ...customLines].map(line => (
                    <tr key={line.id} className="border-b border-gray-200 last:border-0">
                      <td className="py-2">{line.name}</td>
                      <td className="py-2">{line.nominalCapacity} {empresa.unidadeCapacidade}</td>
                      <td className="py-2">{line.standardSetupTime} min</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
