
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Trash2 } from "lucide-react";

interface ScheduledBreak {
  id: string;
  startTime: string;
  endTime: string;
  description: string;
}

interface Props {
  breaks: ScheduledBreak[];
  addBreak: (newBreak: Omit<ScheduledBreak, "id">) => void;
  removeBreak: (id: string) => void;
}

// Motivos pré-cadastrados (em produção, isso viria do banco de dados)
const MOTIVOS_PARADA = [
  { id: '1', description: 'Reunião de Equipe' },
  { id: '2', description: 'Manutenção Preventiva' },
  { id: '3', description: 'Troca de Turno' },
  { id: '4', description: 'Almoço' },
  { id: '5', description: 'Limpeza' },
  { id: '6', description: 'Setup de Equipamento' },
];

export default function ScheduledBreaksComponent({ breaks, addBreak, removeBreak }: Props) {
  const [newBreak, setNewBreak] = useState({
    startTime: '',
    endTime: '',
    description: '',
  });

  const handleAdd = () => {
    if (newBreak.startTime && newBreak.endTime && newBreak.description) {
      addBreak(newBreak);
      setNewBreak({
        startTime: '',
        endTime: '',
        description: '',
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="font-medium">Intervalos Programados</div>
      
      {breaks.length > 0 && (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Início</TableHead>
                <TableHead>Fim</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {breaks.map((breakItem) => (
                <TableRow key={breakItem.id}>
                  <TableCell>{breakItem.startTime}</TableCell>
                  <TableCell>{breakItem.endTime}</TableCell>
                  <TableCell>{breakItem.description}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeBreak(breakItem.id)}
                      className="h-8 w-8 p-0"
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

      <div className="flex flex-wrap gap-4 items-end">
        <div className="space-y-1">
          <Label>Início</Label>
          <Input
            type="time"
            value={newBreak.startTime}
            onChange={(e) => setNewBreak({ ...newBreak, startTime: e.target.value })}
            className="w-32"
          />
        </div>
        <div className="space-y-1">
          <Label>Fim</Label>
          <Input
            type="time"
            value={newBreak.endTime}
            onChange={(e) => setNewBreak({ ...newBreak, endTime: e.target.value })}
            className="w-32"
          />
        </div>
        <div className="space-y-1 flex-1">
          <Label>Motivo da Parada</Label>
          <Select
            value={newBreak.description}
            onValueChange={(value) => setNewBreak({ ...newBreak, description: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o motivo" />
            </SelectTrigger>
            <SelectContent>
              {MOTIVOS_PARADA.map((motivo) => (
                <SelectItem key={motivo.id} value={motivo.description}>
                  {motivo.description}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Adicionar
        </Button>
      </div>
    </div>
  );
}
