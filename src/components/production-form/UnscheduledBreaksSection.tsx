
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

interface Break {
  startTime: string;
  endTime: string;
  description: string;
}

interface UnscheduledBreaksSectionProps {
  breaks: Break[];
  onAdd: (newBreak: Break) => void;
  onRemove: (index: number) => void;
}

export default function UnscheduledBreaksSection({
  breaks,
  onAdd,
  onRemove
}: UnscheduledBreaksSectionProps) {
  const [newBreak, setNewBreak] = useState<Break>({
    startTime: '',
    endTime: '',
    description: ''
  });

  const handleAdd = () => {
    if (!newBreak.startTime || !newBreak.endTime || !newBreak.description) return;
    onAdd(newBreak);
    setNewBreak({ startTime: '', endTime: '', description: '' });
  };

  return (
    <Card className="bg-yellow-50 border-l-4 border-yellow-500">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Intervalos Não Programados</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <Label htmlFor="break-start">Início</Label>
              <Input
                id="break-start"
                type="time"
                value={newBreak.startTime}
                onChange={(e) => setNewBreak({ ...newBreak, startTime: e.target.value })}
                className="bg-white"
              />
            </div>
            <div>
              <Label htmlFor="break-end">Fim</Label>
              <Input
                id="break-end"
                type="time"
                value={newBreak.endTime}
                onChange={(e) => setNewBreak({ ...newBreak, endTime: e.target.value })}
                className="bg-white"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="break-desc">Descrição</Label>
              <div className="flex gap-2">
                <Input
                  id="break-desc"
                  value={newBreak.description}
                  onChange={(e) => setNewBreak({ ...newBreak, description: e.target.value })}
                  placeholder="Ex: Almoço, Café"
                  className="bg-white"
                />
                <Button onClick={handleAdd} className="bg-yellow-600 hover:bg-yellow-700">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {breaks.length > 0 && (
            <div className="space-y-2">
              {breaks.map((breakItem, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium">{breakItem.startTime} - {breakItem.endTime}</span>
                    <span className="text-sm">{breakItem.description}</span>
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
