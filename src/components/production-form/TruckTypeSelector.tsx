
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Truck, CarFront } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type TruckType = {
  id: string;
  name: string;
  capacity: number;
};

const defaultTruckTypes: TruckType[] = [
  { id: '1', name: 'Carreta', capacity: 30000 },
  { id: '2', name: 'Truck Sider', capacity: 14000 },
  { id: '3', name: 'Truck Baú', capacity: 12000 },
  { id: '4', name: 'VUC', capacity: 3500 },
  { id: '5', name: '3/4', capacity: 4000 },
];

interface TruckTypeSelectorProps {
  selectedType: string;
  onTypeChange: (typeId: string) => void;
}

export default function TruckTypeSelector({ selectedType, onTypeChange }: TruckTypeSelectorProps) {
  return (
    <Card className="mb-6 bg-white shadow-md border-l-4 border-vividPurple">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Truck className="w-5 h-5" />
          Tipo de Veículo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label>Selecione o tipo de veículo</Label>
              <Select value={selectedType} onValueChange={onTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de veículo" />
                </SelectTrigger>
                <SelectContent>
                  {defaultTruckTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      <div className="flex items-center gap-2">
                        {type.name === 'VUC' || type.name === '3/4' ? (
                          <CarFront className="w-4 h-4" />
                        ) : (
                          <Truck className="w-4 h-4" />
                        )}
                        <span>{type.name} - {type.capacity}kg</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
