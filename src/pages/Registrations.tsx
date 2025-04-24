
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const Registrations = () => {
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Registro salvo",
      description: "Os dados foram salvos com sucesso"
    });
  };
  
  return (
    <div className="container mx-auto py-6 px-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">Cadastros</CardTitle>
          <CardDescription>
            Gerencie locais, tempos padrão e produções nominais
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="locations" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="locations">Locais</TabsTrigger>
          <TabsTrigger value="standard-times">Tempos Padrão</TabsTrigger>
        </TabsList>
        
        <TabsContent value="locations">
          <Card>
            <CardHeader>
              <CardTitle>Cadastro de Novo Local</CardTitle>
              <CardDescription>
                Adicione informações sobre um novo local de produção
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="locationName">Nome do Local</Label>
                    <Input id="locationName" placeholder="Ex: Linha 01" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="locationCode">Código</Label>
                    <Input id="locationCode" placeholder="Ex: L01" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="locationDescription">Descrição</Label>
                    <Textarea 
                      id="locationDescription" 
                      placeholder="Detalhes sobre o local de produção" 
                      rows={3}
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full">
                  Salvar Novo Local
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="standard-times">
          <Card>
            <CardHeader>
              <CardTitle>Cadastro de Tempo Padrão</CardTitle>
              <CardDescription>
                Configure os tempos padrão de setup e produção nominal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="productName">Produto</Label>
                    <Input id="productName" placeholder="Nome do produto" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="productCode">Código do Produto</Label>
                    <Input id="productCode" placeholder="Código" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="setupTime">Tempo de Setup (min)</Label>
                    <Input 
                      id="setupTime" 
                      type="number" 
                      placeholder="Ex: 30" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="nominalProduction">Produção Nominal (kg/h)</Label>
                    <Input 
                      id="nominalProduction" 
                      type="number" 
                      placeholder="Ex: 500" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Local</Label>
                    <Input id="location" placeholder="Local de produção" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">Observações</Label>
                    <Textarea 
                      id="notes" 
                      placeholder="Observações adicionais"
                      rows={3}
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full mt-6">
                  Salvar Tempo Padrão
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Registrations;
