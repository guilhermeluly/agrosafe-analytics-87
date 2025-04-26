
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

export interface Setup {
  startTime: string;
  endTime: string;
  description: string;
}

interface SetupTimesSectionProps {
  setups: Setup[];
  onAdd: (newSetup: Setup) => void;
  onRemove: (index: number) => void;
}

export default function SetupTimesSection({
  setups,
  onAdd,
  onRemove
}: SetupTimesSectionProps) {
  const [newSetup, setNewSetup] = useState<Setup>({
    startTime: '',
    endTime: '',
    description: ''
  });

  const handleAdd = () => {
    if (!newSetup.startTime || !newSetup.endTime || !newSetup.description) return;
    onAdd(newSetup);
    setNewSetup({ startTime: '', endTime: '', description: '' });
  };

  return (
    <Card className="bg-purple-50 border-l-4 border-purple-500">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Tempos de Setup</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <Label htmlFor="setup-start">Início</Label>
              <Input
                id="setup-start"
                type="time"
                value={newSetup.startTime}
                onChange={(e) => setNewSetup({ ...newSetup, startTime: e.target.value })}
                className="bg-white"
              />
            </div>
            <div>
              <Label htmlFor="setup-end">Fim</Label>
              <Input
                id="setup-end"
                type="time"
                value={newSetup.endTime}
                onChange={(e) => setNewSetup({ ...newSetup, endTime: e.target.value })}
                className="bg-white"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="setup-desc">Descrição</Label>
              <div className="flex gap-2">
                <Input
                  id="setup-desc"
                  value={newSetup.description}
                  onChange={(e) => setNewSetup({ ...newSetup, description: e.target.value })}
                  placeholder="Tipo de setup"
                  className="bg-white"
                />
                <Button onClick={handleAdd} className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {setups.length > 0 && (
            <div className="space-y-2">
              {setups.map((setup, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium">{setup.startTime} - {setup.endTime}</span>
                    <span className="text-sm">{setup.description}</span>
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
