
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface ScheduledBreak {
  id: string;
  startTime: string;
  endTime: string;
  description: string;
}

interface ScheduledBreaksComponentProps {
  breaks: ScheduledBreak[];
  addBreak: (newBreak: Omit<ScheduledBreak, "id">) => void;
  removeBreak: (id: string) => void;
}

export default function ScheduledBreaksComponent({
  breaks,
  addBreak,
  removeBreak
}: ScheduledBreaksComponentProps) {
  const [newBreak, setNewBreak] = React.useState<Omit<ScheduledBreak, "id">>({
    startTime: "",
    endTime: "",
    description: "",
  });

  const handleAddBreak = () => {
    if (!newBreak.startTime || !newBreak.endTime || !newBreak.description) {
      return;
    }

    addBreak(newBreak);
    
    // Reset form
    setNewBreak({
      startTime: "",
      endTime: "",
      description: "",
    });
  };

  // Calculate total break time in minutes
  const calculateTotalBreakTime = () => {
    return breaks.reduce((total, breakItem) => {
      if (!breakItem.startTime || !breakItem.endTime) return total;
      
      const start = new Date(`2000-01-01T${breakItem.startTime}:00`);
      const end = new Date(`2000-01-01T${breakItem.endTime}:00`);
      const diffMinutes = (end.getTime() - start.getTime()) / 60000;
      
      return total + diffMinutes;
    }, 0);
  };

  return (
    <Card className="mb-6 bg-yellow-50 shadow-md border-l-4 border-yellow-500">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Intervalos Programados
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="break-start">Início</Label>
              <Input
                id="break-start"
                type="time"
                value={newBreak.startTime}
                onChange={(e) => setNewBreak({ ...newBreak, startTime: e.target.value })}
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="break-end">Fim</Label>
              <Input
                id="break-end"
                type="time"
                value={newBreak.endTime}
                onChange={(e) => setNewBreak({ ...newBreak, endTime: e.target.value })}
                className="bg-white"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="break-desc">Descrição</Label>
              <div className="flex gap-2">
                <Input
                  id="break-desc"
                  value={newBreak.description}
                  onChange={(e) => setNewBreak({ ...newBreak, description: e.target.value })}
                  placeholder="Ex: Almoço, Jantar, Café"
                  className="bg-white"
                />
                <Button onClick={handleAddBreak} className="bg-yellow-600 hover:bg-yellow-700">
                  Adicionar
                </Button>
              </div>
            </div>
          </div>

          {breaks.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Intervalos Registrados</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {breaks.map((breakItem) => (
                  <div 
                    key={breakItem.id} 
                    className="flex items-center justify-between p-2 bg-white rounded border"
                  >
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-medium">
                        {breakItem.startTime} - {breakItem.endTime}
                      </span>
                      <span className="text-sm">{breakItem.description}</span>
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => removeBreak(breakItem.id)}
                      className="h-8 px-2 text-red-600 hover:text-red-700"
                    >
                      Remover
                    </Button>
                  </div>
                ))}
                
                <div className="text-sm font-medium mt-2 p-2 bg-yellow-100 rounded">
                  Tempo total de intervalos: {calculateTotalBreakTime()} minutos
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
