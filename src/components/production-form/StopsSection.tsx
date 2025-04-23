
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface StopTime { tempo: number; motivo: string }
interface StopsSectionProps {
  stops: StopTime[];
  newStop: StopTime;
  stopReasons: string[];
  setNewStop: (v: StopTime) => void;
  addStop: () => void;
  removeStop: (idx: number) => void;
  handleStopChange: (field: "tempo" | "motivo", valor: string) => void;
}

export default function StopsSection({
  stops,
  newStop,
  stopReasons,
  addStop,
  removeStop,
  handleStopChange,
}: StopsSectionProps) {
  return (
    <Card className="bg-muted/50 border-l-4 border-brightOrange">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Paradas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          <div className="flex gap-2 items-center flex-wrap">
            <Input
              type="number"
              min={0}
              placeholder="Tempo (min)"
              value={newStop.tempo || ""}
              onChange={e => handleStopChange("tempo", e.target.value)}
              className="w-24"
            />
            <select
              value={newStop.motivo}
              onChange={e => handleStopChange("motivo", e.target.value)}
              className="w-full md:w-[170px] rounded-md border border-gray-300 bg-white h-10 px-2"
            >
              {stopReasons.map((reason, idx) => (
                <option key={idx} value={reason}>{reason}</option>
              ))}
            </select>
            <Button type="button" size="sm" variant="default" onClick={addStop} className="bg-brightOrange hover:bg-softOrange">
              Adicionar
            </Button>
          </div>
          {stops.length > 0 && (
            <ul className="mt-2 space-y-2">
              {stops.map((stop, idx) => (
                <li key={idx} className="flex items-center gap-2 px-2 py-1 bg-gray-100 rounded">
                  <span className="font-semibold text-sm">{stop.tempo} min</span>
                  <span className="text-xs text-gray-600">{stop.motivo}</span>
                  <Button 
                    type="button" 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => removeStop(idx)}
                    className="h-6 px-2 text-xs ml-auto"
                  >
                    Remover
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
