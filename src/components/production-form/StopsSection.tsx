
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StopTime { 
  id: string;
  tempo: number; 
  motivo: string;
  horarioInicio?: string;
  horarioFim?: string;
}

interface StopsSectionProps {
  stops: StopTime[];
  stopReasons: string[];
  addStop: (stop: Omit<StopTime, "id">) => void;
  removeStop: (idx: number) => void;
}

export default function StopsSection({
  stops,
  stopReasons,
  addStop,
  removeStop,
}: StopsSectionProps) {
  const [newStop, setNewStop] = useState<Omit<StopTime, "id">>({
    tempo: 0,
    motivo: stopReasons[0] || "",
    horarioInicio: "",
    horarioFim: ""
  });

  const handleAddStop = () => {
    if (!newStop.tempo || !newStop.motivo) {
      return;
    }

    // Se horários foram fornecidos, calcular o tempo automaticamente
    if (newStop.horarioInicio && newStop.horarioFim) {
      const inicio = new Date(`2000-01-01T${newStop.horarioInicio}:00`);
      const fim = new Date(`2000-01-01T${newStop.horarioFim}:00`);
      const diffMinutes = Math.round((fim.getTime() - inicio.getTime()) / 60000);
      
      addStop({
        ...newStop,
        tempo: diffMinutes > 0 ? diffMinutes : newStop.tempo
      });
    } else {
      addStop(newStop);
    }
    
    // Reset form
    setNewStop({
      tempo: 0,
      motivo: stopReasons[0] || "",
      horarioInicio: "",
      horarioFim: ""
    });
  };

  const handleChange = (field: keyof Omit<StopTime, "id">, value: string | number) => {
    setNewStop(prev => ({ ...prev, [field]: value }));
  };

  // Calcular tempo total de paradas
  const totalStopTime = stops.reduce((total, stop) => total + stop.tempo, 0);

  return (
    <Card className="bg-muted/50 border-l-4 border-brightOrange">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Paradas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="space-y-1">
              <Label htmlFor="stop-start">Horário Início (opcional)</Label>
              <Input
                id="stop-start"
                type="time"
                value={newStop.horarioInicio || ""}
                onChange={e => handleChange("horarioInicio", e.target.value)}
                className="bg-white"
              />
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="stop-end">Horário Fim (opcional)</Label>
              <Input
                id="stop-end"
                type="time"
                value={newStop.horarioFim || ""}
                onChange={e => handleChange("horarioFim", e.target.value)}
                className="bg-white"
              />
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="stop-time">Tempo (min)</Label>
              <Input
                id="stop-time"
                type="number"
                min={0}
                value={newStop.tempo || ""}
                onChange={e => handleChange("tempo", Number(e.target.value))}
                className="bg-white"
                placeholder="Minutos"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Se informar horário início/fim, será calculado automaticamente
              </p>
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="stop-reason">Motivo</Label>
              <Select 
                value={newStop.motivo} 
                onValueChange={value => handleChange("motivo", value)}
              >
                <SelectTrigger id="stop-reason" className="bg-white">
                  <SelectValue placeholder="Selecione o motivo" />
                </SelectTrigger>
                <SelectContent>
                  {stopReasons.map((reason, idx) => (
                    <SelectItem key={idx} value={reason}>{reason}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button 
            type="button" 
            size="sm" 
            variant="default" 
            onClick={handleAddStop} 
            className="bg-brightOrange hover:bg-softOrange w-full mt-1"
          >
            Adicionar Parada
          </Button>

          {stops.length > 0 && (
            <>
              <div className="mt-2 rounded-md border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-4 py-2 text-left">Motivo</th>
                      <th className="px-4 py-2 text-left">Horário</th>
                      <th className="px-4 py-2 text-left">Tempo (min)</th>
                      <th className="px-4 py-2 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stops.map((stop, idx) => (
                      <tr key={stop.id || idx} className="border-b">
                        <td className="px-4 py-2">{stop.motivo}</td>
                        <td className="px-4 py-2">
                          {stop.horarioInicio && stop.horarioFim 
                            ? `${stop.horarioInicio} - ${stop.horarioFim}` 
                            : '-'
                          }
                        </td>
                        <td className="px-4 py-2">{stop.tempo}</td>
                        <td className="px-4 py-2 text-right">
                          <Button 
                            type="button" 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => removeStop(idx)}
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
              
              <div className="text-sm font-medium mt-1 p-2 bg-amber-100 rounded">
                Tempo total de paradas: {totalStopTime} minutos
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
