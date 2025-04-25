
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

interface Stop {
  startTime: string;
  endTime: string;
  description: string;
}

interface UnscheduledStopsSectionProps {
  stops: Stop[];
  onAdd: (newStop: Stop) => void;
  onRemove: (index: number) => void;
}

export default function UnscheduledStopsSection({
  stops,
  onAdd,
  onRemove
}: UnscheduledStopsSectionProps) {
  const [newStop, setNewStop] = useState<Stop>({
    startTime: '',
    endTime: '',
    description: ''
  });

  const handleAdd = () => {
    if (!newStop.startTime || !newStop.endTime || !newStop.description) return;
    onAdd(newStop);
    setNewStop({ startTime: '', endTime: '', description: '' });
  };

  return (
    <Card className="bg-red-50 border-l-4 border-red-500">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Paradas Não Programadas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <Label htmlFor="stop-start">Início</Label>
              <Input
                id="stop-start"
                type="time"
                value={newStop.startTime}
                onChange={(e) => setNewStop({ ...newStop, startTime: e.target.value })}
                className="bg-white"
              />
            </div>
            <div>
              <Label htmlFor="stop-end">Fim</Label>
              <Input
                id="stop-end"
                type="time"
                value={newStop.endTime}
                onChange={(e) => setNewStop({ ...newStop, endTime: e.target.value })}
                className="bg-white"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="stop-desc">Descrição</Label>
              <div className="flex gap-2">
                <Input
                  id="stop-desc"
                  value={newStop.description}
                  onChange={(e) => setNewStop({ ...newStop, description: e.target.value })}
                  placeholder="Motivo da parada"
                  className="bg-white"
                />
                <Button onClick={handleAdd} className="bg-red-600 hover:bg-red-700">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {stops.length > 0 && (
            <div className="space-y-2">
              {stops.map((stop, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium">{stop.startTime} - {stop.endTime}</span>
                    <span className="text-sm">{stop.description}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    onClick={() => onRemove(index)}
                    className="h-8 px-2 text-red-600 hover:text-red-700"
                  >
                    Remover
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
