
import React, { useState, useEffect } from "react";
import AppLayout from "../components/AppLayout";
import { useUser } from "../context/UserContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ProductionData } from "../types";
import {
  calculateAvailability,
  calculatePerformance,
  calculateQuality,
  calculateOEE,
  adjustSetupTime
} from "../utils/oeeCalculations";

// Mock data for lines and shifts
const productionLines = [
  { id: "1", name: "Linha 1", nominalCapacity: 100, standardSetupTime: 15 },
  { id: "2", name: "Linha 2", nominalCapacity: 150, standardSetupTime: 20 },
  { id: "3", name: "Linha 3", nominalCapacity: 120, standardSetupTime: 18 }
];

const shifts = [
  { id: "1", name: "Manhã", startTime: "06:00", endTime: "14:00" },
  { id: "2", name: "Tarde", startTime: "14:00", endTime: "22:00" },
  { id: "3", name: "Noite", startTime: "22:00", endTime: "06:00" }
];

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
  
  const [selectedLine, setSelectedLine] = useState(productionLines[0]);
  const [workingHours, setWorkingHours] = useState(8); // Default 8 hours per shift
  const [oeePreview, setOeePreview] = useState({
    availability: 0,
    performance: 0, 
    quality: 0,
    oee: 0
  });

  // Update selected line when location changes
  useEffect(() => {
    const line = productionLines.find(l => l.name === formData.location);
    if (line) {
      setSelectedLine(line);
    }
  }, [formData.location]);
  
  // Calculate OEE preview for the form
  useEffect(() => {
    if (formData.actualProduction > 0) {
      // Convert working hours to minutes
      const plannedTime = workingHours * 60;
      
      // Calculate adjusted setup time (according to business rules)
      const adjustedSetupTime = adjustSetupTime(formData.setupTime);
      
      // Calculate OEE metrics
      const availability = calculateAvailability(plannedTime, adjustedSetupTime);
      
      const idealCycleTime = 60 / selectedLine.nominalCapacity; // minutes per unit
      const performance = calculatePerformance(
        formData.actualProduction, 
        plannedTime, 
        adjustedSetupTime, 
        idealCycleTime
      );
      
      const quality = calculateQuality(
        formData.actualProduction,
        formData.rework,
        formData.scrap,
        formData.lostPackages
      );
      
      const oee = calculateOEE(availability, performance, quality);
      
      setOeePreview({
        availability: Math.round(availability),
        performance: Math.round(performance),
        quality: Math.round(quality),
        oee: Math.round(oee)
      });
    }
  }, [formData, workingHours, selectedLine]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === "date" ? value : Number(value) || value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would normally save to a database
    console.log("Production data:", formData);
    
    toast({
      title: "Dados salvos",
      description: "Os dados de produção foram salvos com sucesso.",
    });
  };

  return (
    <AppLayout title="Inserção de Dados - OEE">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Inserir Dados de Produção</CardTitle>
            <CardDescription>
              Preencha todos os campos para calcular o OEE (Eficiência Global do Equipamento)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    {shifts.map(shift => (
                      <option key={shift.id} value={shift.name}>
                        {shift.name}
                      </option>
                    ))}
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
                    {productionLines.map(line => (
                      <option key={line.id} value={line.name}>
                        {line.name} - Cap: {line.nominalCapacity} un/h
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <Card className="bg-muted/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Dados do Planejamento</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="plannedProduction">Produção Planejada (unidades)</Label>
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
                          <Label htmlFor="workingHours">Horas Trabalhadas no Turno</Label>
                          <Input
                            id="workingHours"
                            type="number"
                            value={workingHours}
                            onChange={(e) => setWorkingHours(Number(e.target.value))}
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
                          <p className="text-xs text-muted-foreground">
                            Tempo padrão: {selectedLine.standardSetupTime} min
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <Card className="bg-muted/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Dados da Produção</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="actualProduction">Produção Real (unidades)</Label>
                          <Input
                            id="actualProduction"
                            name="actualProduction"
                            type="number"
                            value={formData.actualProduction}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-3 gap-3">
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
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              {formData.actualProduction > 0 && (
                <Card className="bg-green-50 dark:bg-green-900/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Prévia do Cálculo OEE</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="text-center p-2 bg-background rounded-md">
                        <div className="text-sm font-medium">Disponibilidade</div>
                        <div className="text-2xl font-bold">{oeePreview.availability}%</div>
                      </div>
                      <div className="text-center p-2 bg-background rounded-md">
                        <div className="text-sm font-medium">Performance</div>
                        <div className="text-2xl font-bold">{oeePreview.performance}%</div>
                      </div>
                      <div className="text-center p-2 bg-background rounded-md">
                        <div className="text-sm font-medium">Qualidade</div>
                        <div className="text-2xl font-bold">{oeePreview.quality}%</div>
                      </div>
                      <div className="text-center p-2 bg-green-100 dark:bg-green-800/40 rounded-md">
                        <div className="text-sm font-medium">OEE</div>
                        <div className="text-2xl font-bold">{oeePreview.oee}%</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
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
              
              <Button type="submit" className="w-full">
                Salvar Dados
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
