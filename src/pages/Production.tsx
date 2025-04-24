
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const Production = () => {
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Dados salvos",
      description: "Os dados de produção foram registrados com sucesso"
    });
  };
  
  return (
    <div className="container mx-auto py-6 px-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">Inserir Dados de Produção</CardTitle>
          <CardDescription>
            Registre informações sobre a produção
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="date">Data</Label>
                <Input id="date" type="date" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="shift">Turno</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o turno" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Manhã</SelectItem>
                    <SelectItem value="afternoon">Tarde</SelectItem>
                    <SelectItem value="night">Noite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Local</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o local" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="line1">Linha 1</SelectItem>
                    <SelectItem value="line2">Linha 2</SelectItem>
                    <SelectItem value="line3">Linha 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="product">Produto</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o produto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prod1">Produto A</SelectItem>
                    <SelectItem value="prod2">Produto B</SelectItem>
                    <SelectItem value="prod3">Produto C</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="startTime">Hora de Início</Label>
                <Input id="startTime" type="time" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endTime">Hora de Término</Label>
                <Input id="endTime" type="time" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="productionAmount">Quantidade Produzida (kg)</Label>
                <Input id="productionAmount" type="number" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="peopleCount">Quantidade de Operadores</Label>
                <Input id="peopleCount" type="number" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea id="notes" rows={3} placeholder="Observações sobre a produção" />
            </div>
            
            <Button type="submit" className="w-full">
              Salvar Registro de Produção
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Production;
