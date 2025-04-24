
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Clock, Plus, Trash2 } from "lucide-react";

interface Shift {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
}

export default function ShiftsRegistry() {
  const { toast } = useToast();
  const [shifts, setShifts] = useState<Shift[]>([
    { id: '1', name: 'Manhã', startTime: '06:00', endTime: '14:00' },
    { id: '2', name: 'Tarde', startTime: '14:00', endTime: '22:00' },
    { id: '3', name: 'Noite', startTime: '22:00', endTime: '06:00' },
  ]);
  
  const [newShift, setNewShift] = useState<Omit<Shift, "id">>({
    name: '',
    startTime: '',
    endTime: '',
  });

  const handleAddShift = () => {
    if (!newShift.name || !newShift.startTime || !newShift.endTime) {
      toast({
        variant: "destructive",
        title: "Erro ao adicionar turno",
        description: "Preencha todos os campos obrigatórios",
      });
      return;
    }

    const id = (shifts.length + 1).toString();
    setShifts([...shifts, { ...newShift, id }]);
    setNewShift({ name: '', startTime: '', endTime: '' });
    
    toast({
      title: "Turno adicionado",
      description: "O novo turno foi cadastrado com sucesso",
    });
  };

  const handleRemoveShift = (id: string) => {
    setShifts(shifts.filter(shift => shift.id !== id));
    toast({
      title: "Turno removido",
      description: "O turno foi removido com sucesso",
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="shift-name">Nome do Turno</Label>
          <Input
            id="shift-name"
            value={newShift.name}
            onChange={(e) => setNewShift({ ...newShift, name: e.target.value })}
            placeholder="Ex: Manhã"
          />
        </div>
        <div>
          <Label htmlFor="start-time">Horário Início</Label>
          <Input
            id="start-time"
            type="time"
            value={newShift.startTime}
            onChange={(e) => setNewShift({ ...newShift, startTime: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="end-time">Horário Fim</Label>
          <Input
            id="end-time"
            type="time"
            value={newShift.endTime}
            onChange={(e) => setNewShift({ ...newShift, endTime: e.target.value })}
          />
        </div>
        <div className="flex items-end">
          <Button onClick={handleAddShift} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Turno
          </Button>
        </div>
      </div>

      {shifts.length > 0 && (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Início</TableHead>
                <TableHead>Fim</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shifts.map((shift) => (
                <TableRow key={shift.id}>
                  <TableCell>{shift.name}</TableCell>
                  <TableCell>{shift.startTime}</TableCell>
                  <TableCell>{shift.endTime}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveShift(shift.id)}
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
