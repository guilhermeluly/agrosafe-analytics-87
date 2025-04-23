
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SetupTimesSectionProps {
  setups: { tempo: number }[];
  handleSetupChange: (idx: number, valor: string) => void;
  addSetup: () => void;
  removeSetup: (idx: number) => void;
  standardSetupTime: number;
}

export default function SetupTimesSection({
  setups,
  handleSetupChange,
  addSetup,
  removeSetup,
  standardSetupTime,
}: SetupTimesSectionProps) {
  return (
    <Card className="bg-muted/50 border-l-4 border-vividPurple">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Tempos de Setup</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-2">
          {setups.map((setup, idx) => (
            <div key={idx} className="flex items-center gap-2 mb-1">
              <Input
                type="number"
                min={0}
                value={setup.tempo}
                onChange={e => handleSetupChange(idx, e.target.value)}
                className="w-28"
              />
              <span className="text-xs text-muted-foreground">min</span>
              {setups.length > 1 && (
                <Button type="button" variant="outline" size="sm" onClick={() => removeSetup(idx)}>
                  Remover
                </Button>
              )}
            </div>
          ))}
          <Button type="button" size="sm" variant="default" onClick={addSetup} className="bg-vividPurple hover:bg-secondaryPurple">
            Adicionar Setup
          </Button>
          <p className="text-xs text-muted-foreground">
            Tempo padrão: {standardSetupTime} min
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
