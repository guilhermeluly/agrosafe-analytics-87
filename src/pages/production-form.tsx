
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useUser } from "../context/UserContext";
import Header from "../components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ProductionData } from "../types";

export default function ProductionForm() {
  const { user } = useUser();
  const { toast } = useToast();
  const isAdmin = user.role === "admin";
  
  const [formData, setFormData] = useState<ProductionData>({
    date: new Date().toISOString().split('T')[0],
    shift: "Manhã",
    location: "Linha 1",
    plannedProduction: 1000,
    actualProduction: 0,
    rework: 0,
    scrap: 0,
    lostPackages: 0,
    setupTime: 0
  });

  // Admin only - setup standards
  const [nominalCapacity, setNominalCapacity] = useState(100);
  const [standardSetupTime, setStandardSetupTime] = useState(15);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would normally save to a database
    console.log("Production data:", formData);
    
    // If admin is updating standards
    if (isAdmin) {
      console.log("Updated standards:", { nominalCapacity, standardSetupTime });
    }
    
    toast({
      title: "Dados salvos",
      description: "Os dados de produção foram salvos com sucesso.",
    });
  };

  return (
    <>
      <Helmet><title>Inserção de Dados - OEE</title></Helmet>
      <Header />
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Inserir Dados de Produção</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Data</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="shift">Turno</Label>
                  <select
                    id="shift"
                    name="shift"
                    value={formData.shift}
                    onChange={handleChange}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    required
                  >
                    <option value="Manhã">Manhã</option>
                    <option value="Tarde">Tarde</option>
                    <option value="Noite">Noite</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Linha/Local</Label>
                  <select
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    required
                  >
                    <option value="Linha 1">Linha 1</option>
                    <option value="Linha 2">Linha 2</option>
                    <option value="Linha 3">Linha 3</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="plannedProduction">Produção Planejada</Label>
                  <Input
                    id="plannedProduction"
                    name="plannedProduction"
                    type="number"
                    value={formData.plannedProduction}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="actualProduction">Produção Real</Label>
                  <Input
                    id="actualProduction"
                    name="actualProduction"
                    type="number"
                    value={formData.actualProduction}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="rework">Retrabalho</Label>
                  <Input
                    id="rework"
                    name="rework"
                    type="number"
                    value={formData.rework}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="scrap">Refugo</Label>
                  <Input
                    id="scrap"
                    name="scrap"
                    type="number"
                    value={formData.scrap}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lostPackages">Embalagens Perdidas</Label>
                  <Input
                    id="lostPackages"
                    name="lostPackages"
                    type="number"
                    value={formData.lostPackages}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="setupTime">Tempo de Setup (min)</Label>
                  <Input
                    id="setupTime"
                    name="setupTime"
                    type="number"
                    value={formData.setupTime}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="observations">Observações</Label>
                <Textarea
                  id="observations"
                  name="observations"
                  value={formData.observations || ""}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
              
              {isAdmin && (
                <div className="pt-4 border-t">
                  <h3 className="text-lg font-medium mb-3">Configurações (Apenas Admin)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nominalCapacity">Capacidade Nominal (un/hora)</Label>
                      <Input
                        id="nominalCapacity"
                        type="number"
                        value={nominalCapacity}
                        onChange={(e) => setNominalCapacity(Number(e.target.value))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="standardSetupTime">Tempo Padrão Setup (min)</Label>
                      <Input
                        id="standardSetupTime"
                        type="number"
                        value={standardSetupTime}
                        onChange={(e) => setStandardSetupTime(Number(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              <Button type="submit" className="w-full">
                Salvar Dados
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
