
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";

export default function StopReasonsRegistry() {
  const { toast } = useToast();
  const [stopReasons, setStopReasons] = useState<string[]>([
    'Manutenção',
    'Setup',
    'Troca de Turno',
    'Falta de Material',
    'Reunião',
    'Limpeza'
  ]);
  
  const [newReason, setNewReason] = useState('');

  const handleAddReason = () => {
    if (!newReason.trim()) {
      toast({
        variant: "destructive",
        title: "Erro ao adicionar motivo",
        description: "O motivo não pode estar vazio",
      });
      return;
    }

    if (stopReasons.includes(newReason.trim())) {
      toast({
        variant: "destructive",
        title: "Erro ao adicionar motivo",
        description: "Este motivo já existe",
      });
      return;
    }

    setStopReasons([...stopReasons, newReason.trim()]);
    setNewReason('');
    
    toast({
      title: "Motivo adicionado",
      description: "O novo motivo de parada foi cadastrado com sucesso",
    });
  };

  const handleRemoveReason = (reasonToRemove: string) => {
    setStopReasons(stopReasons.filter(reason => reason !== reasonToRemove));
    toast({
      title: "Motivo removido",
      description: "O motivo de parada foi removido com sucesso",
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="stop-reason">Motivo da Parada</Label>
          <Input
            id="stop-reason"
            value={newReason}
            onChange={(e) => setNewReason(e.target.value)}
            placeholder="Ex: Manutenção"
          />
        </div>
        <div className="flex items-end">
          <Button onClick={handleAddReason} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Motivo
          </Button>
        </div>
      </div>

      {stopReasons.length > 0 && (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Motivo</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stopReasons.map((reason) => (
                <TableRow key={reason}>
                  <TableCell>{reason}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveReason(reason)}
                      className="h-8 w-8 p-0 text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
