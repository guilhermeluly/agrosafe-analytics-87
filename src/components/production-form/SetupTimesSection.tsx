
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SetupTime } from "@/types";

interface SetupTimesSectionProps {
  setups: SetupTime[];
  addSetup: (setup: Omit<SetupTime, "id">) => void;
  removeSetup: (idx: number) => void;
  standardSetupTime: number;
}

export default function SetupTimesSection({
  setups,
  addSetup,
  removeSetup,
  standardSetupTime,
}: SetupTimesSectionProps) {
  const [newSetup, setNewSetup] = useState<Omit<SetupTime, "id">>({
    tempo: standardSetupTime,
    descricao: "",
    horarioInicio: "",
    horarioFim: ""
  });

  const handleChange = (field: keyof Omit<SetupTime, "id">, value: string | number) => {
    setNewSetup(prev => ({ ...prev, [field]: value }));
  };

  const handleAddSetup = () => {
    if (!newSetup.tempo) {
      return;
    }

    // Se horários foram fornecidos, calcular o tempo automaticamente
    if (newSetup.horarioInicio && newSetup.horarioFim) {
      const inicio = new Date(`2000-01-01T${newSetup.horarioInicio}:00`);
      const fim = new Date(`2000-01-01T${newSetup.horarioFim}:00`);
      const diffMinutes = Math.round((fim.getTime() - inicio.getTime()) / 60000);
      
      addSetup({
        ...newSetup,
        tempo: diffMinutes > 0 ? diffMinutes : newSetup.tempo
      });
    } else {
      addSetup(newSetup);
    }
    
    // Reset form
    setNewSetup({
      tempo: standardSetupTime,
      descricao: "",
      horarioInicio: "",
      horarioFim: ""
    });
  };

  // Calcular tempo total de setup
  const totalSetupTime = setups.reduce((total, setup) => total + setup.tempo, 0);

  return (
    <Card className="bg-muted/50 border-l-4 border-vividPurple">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Tempos de Setup</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="space-y-1">
              <Label htmlFor="setup-start">Horário Início (opcional)</Label>
              <Input
                id="setup-start"
                type="time"
                value={newSetup.horarioInicio || ""}
                onChange={e => handleChange("horarioInicio", e.target.value)}
                className="bg-white"
              />
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="setup-end">Horário Fim (opcional)</Label>
              <Input
                id="setup-end"
                type="time"
                value={newSetup.horarioFim || ""}
                onChange={e => handleChange("horarioFim", e.target.value)}
                className="bg-white"
              />
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="setup-time">Tempo (min)</Label>
              <Input
                id="setup-time"
                type="number"
                min={0}
                value={newSetup.tempo || ""}
                onChange={e => handleChange("tempo", Number(e.target.value))}
                className="bg-white"
                placeholder="Minutos"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Tempo padrão: {standardSetupTime} min
              </p>
            </div>
            
            <div className="space-y-1 md:col-span-4">
              <Label htmlFor="setup-desc">Descrição (opcional)</Label>
              <div className="flex gap-2">
                <Textarea
                  id="setup-desc"
                  value={newSetup.descricao}
                  onChange={e => handleChange("descricao", e.target.value)}
                  placeholder="Descreva o tipo de setup realizado"
                  className="bg-white"
                  rows={1}
                />
                <Button 
                  type="button" 
                  onClick={handleAddSetup} 
                  className="bg-vividPurple hover:bg-secondaryPurple self-start"
                >
                  Adicionar Setup
                </Button>
              </div>
            </div>
          </div>
          
          {setups.length > 0 && (
            <>
              <div className="mt-2 rounded-md border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-4 py-2 text-left">Descrição</th>
                      <th className="px-4 py-2 text-left">Horário</th>
                      <th className="px-4 py-2 text-left">Tempo (min)</th>
                      <th className="px-4 py-2 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {setups.map((setup, idx) => (
                      <tr key={setup.id} className="border-b">
                        <td className="px-4 py-2">{setup.descricao || "Setup"}</td>
                        <td className="px-4 py-2">
                          {setup.horarioInicio && setup.horarioFim 
                            ? `${setup.horarioInicio} - ${setup.horarioFim}` 
                            : '-'
                          }
                        </td>
                        <td className="px-4 py-2">{setup.tempo}</td>
                        <td className="px-4 py-2 text-right">
                          <Button 
                            type="button" 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => removeSetup(idx)}
                            className="h-6 px-2 text-xs text-red-600 hover:text-red-700"
                          >
                            Remover
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="text-sm font-medium mt-1 p-2 bg-purple-100 rounded">
                Tempo total de setup: {totalSetupTime} minutos
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
