
import React from 'react';
import AppLayout from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle } from "lucide-react";

export default function ProductionForm() {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Dados registrados",
      description: "Os dados de produção foram salvos com sucesso.",
    });
  };

  return (
    <AppLayout title="Registrar Dados">
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Registrar Dados</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="production" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                <TabsTrigger value="production">Produção</TabsTrigger>
                <TabsTrigger value="logistics">Logística</TabsTrigger>
              </TabsList>

              <TabsContent value="production">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Data</Label>
                      <Input id="date" type="date" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shift">Turno</Label>
                      <select 
                        id="shift" 
                        className="w-full h-10 px-3 rounded-md border border-input"
                        required
                      >
                        <option value="">Selecione...</option>
                        <option value="morning">Manhã</option>
                        <option value="afternoon">Tarde</option>
                        <option value="night">Noite</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="line">Linha</Label>
                      <select 
                        id="line" 
                        className="w-full h-10 px-3 rounded-md border border-input"
                        required
                      >
                        <option value="">Selecione...</option>
                        <option value="line1">Linha 1</option>
                        <option value="line2">Linha 2</option>
                        <option value="line3">Linha 3</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="planned">Produção Planejada</Label>
                      <Input id="planned" type="number" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="actual">Produção Real</Label>
                      <Input id="actual" type="number" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rework">Retrabalho</Label>
                      <Input id="rework" type="number" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="scrap">Refugo</Label>
                      <Input id="scrap" type="number" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="lost-packages">Pacotes Perdidos</Label>
                      <Input id="lost-packages" type="number" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="setup-time">Tempo de Setup (min)</Label>
                      <Input id="setup-time" type="number" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="observations">Observações</Label>
                      <Input id="observations" type="text" />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <Button type="submit" className="bg-green-600 hover:bg-green-700">
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Registrar Produção
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="logistics">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="logistics-date">Data</Label>
                      <Input id="logistics-date" type="date" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="logistics-shift">Turno</Label>
                      <select 
                        id="logistics-shift" 
                        className="w-full h-10 px-3 rounded-md border border-input"
                        required
                      >
                        <option value="">Selecione...</option>
                        <option value="morning">Manhã</option>
                        <option value="afternoon">Tarde</option>
                        <option value="night">Noite</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="truck-type">Tipo de Veículo</Label>
                      <select 
                        id="truck-type" 
                        className="w-full h-10 px-3 rounded-md border border-input"
                        required
                      >
                        <option value="">Selecione...</option>
                        <option value="truck">Caminhão</option>
                        <option value="van">Van</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start-time">Hora Início</Label>
                      <Input id="start-time" type="time" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end-time">Hora Fim</Label>
                      <Input id="end-time" type="time" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight">Peso (kg)</Label>
                      <Input id="weight" type="number" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="people">Nº de Pessoas</Label>
                      <Input id="people" type="number" required />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Registrar Movimentação
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
