
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

interface Setup {
  minutes: number;
  description: string;
}

interface SetupTimesSectionProps {
  setups: Setup[];
  onAdd: (setup: Setup) => void;
  onRemove: (index: number) => void;
}

export default function SetupTimesSection({
  setups,
  onAdd,
  onRemove
}: SetupTimesSectionProps) {
  const [newSetup, setNewSetup] = useState<Setup>({
    minutes: 0,
    description: ''
  });

  const handleAdd = () => {
    if (!newSetup.minutes || !newSetup.description) return;
    onAdd(newSetup);
    setNewSetup({ minutes: 0, description: '' });
  };

  return (
    <Card className="bg-purple-50 border-l-4 border-purple-500">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Tempos de Setup</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="setup-time">Tempo (minutos)</Label>
              <Input
                id="setup-time"
                type="number"
                min={0}
                value={newSetup.minutes || ''}
                onChange={(e) => setNewSetup({ ...newSetup, minutes: Number(e.target.value) })}
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
                    <span className="text-sm font-medium">{setup.minutes} minutos</span>
                    <span className="text-sm">{setup.description}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    onClick={() => onRemove(index)}
                    className="h-8 px-2 text-purple-600 hover:text-purple-700"
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
