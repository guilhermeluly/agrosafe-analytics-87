
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";
import { TruckType } from '../production-form/TruckTypeSelector';

export default function TruckTypesRegistry() {
  const { toast } = useToast();
  const [truckTypes, setTruckTypes] = useState<TruckType[]>([
    { id: '1', name: 'Carreta', capacity: 30000 },
    { id: '2', name: 'Truck Sider', capacity: 14000 },
    { id: '3', name: 'Truck Baú', capacity: 12000 },
    { id: '4', name: 'VUC', capacity: 3500 },
    { id: '5', name: '3/4', capacity: 4000 },
  ]);
  
  const [newTruckType, setNewTruckType] = useState<Omit<TruckType, "id">>({
    name: '',
    capacity: 0,
  });

  const handleAddTruckType = () => {
    if (!newTruckType.name || !newTruckType.capacity) {
      toast({
        variant: "destructive",
        title: "Erro ao adicionar veículo",
        description: "Preencha todos os campos obrigatórios",
      });
      return;
    }

    const id = (truckTypes.length + 1).toString();
    setTruckTypes([...truckTypes, { ...newTruckType, id }]);
    setNewTruckType({ name: '', capacity: 0 });
    
    toast({
      title: "Veículo adicionado",
      description: "O novo tipo de veículo foi cadastrado com sucesso",
    });
  };

  const handleRemoveTruckType = (id: string) => {
    setTruckTypes(truckTypes.filter(type => type.id !== id));
    toast({
      title: "Veículo removido",
      description: "O tipo de veículo foi removido com sucesso",
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="truck-name">Nome do Veículo</Label>
          <Input
            id="truck-name"
            value={newTruckType.name}
            onChange={(e) => setNewTruckType({ ...newTruckType, name: e.target.value })}
            placeholder="Ex: Carreta"
          />
        </div>
        <div>
          <Label htmlFor="capacity">Capacidade (kg)</Label>
          <Input
            id="capacity"
            type="number"
            value={newTruckType.capacity || ''}
            onChange={(e) => setNewTruckType({ ...newTruckType, capacity: Number(e.target.value) })}
            placeholder="Ex: 30000"
          />
        </div>
        <div className="flex items-end">
          <Button onClick={handleAddTruckType} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Veículo
          </Button>
        </div>
      </div>

      {truckTypes.length > 0 && (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Capacidade (kg)</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {truckTypes.map((type) => (
                <TableRow key={type.id}>
                  <TableCell>{type.name}</TableCell>
                  <TableCell>{type.capacity} kg</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveTruckType(type.id)}
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
