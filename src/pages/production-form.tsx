
import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Factory, TruckIcon, Clock, AlertTriangle } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import ProductionFormFields from '@/components/production-form/ProductionFormFields';
import StopsSection from '@/components/production-form/StopsSection';
import SetupTimesSection from '@/components/production-form/SetupTimesSection';
import MovimentacaoFormFields from '@/components/production-form/MovimentacaoFormFields';
import { SetupTime, StopTime } from "@/types";

export default function ProductionForm() {
  const { toast } = useToast();
  const [formType, setFormType] = useState<"production" | "logistics">("production");
  
  // Production form data
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    shift: "",
    location: "",
    plannedProduction: 0,
    actualProduction: 0,
    rework: 0,
    scrap: 0,
    lostPackages: 0,
    setupTime: 0,
    observations: ""
  });
  
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  
  // Setup times and stops data
  const [setupTimes, setSetupTimes] = useState<SetupTime[]>([]);
  const [stopTimes, setStopTimes] = useState<StopTime[]>([]);
  
  // Sample data for the form
  const allLines = [
    { id: "1", name: "Linha 1", nominalCapacity: 100, standardSetupTime: 30 },
    { id: "2", name: "Linha 2", nominalCapacity: 150, standardSetupTime: 45 },
    { id: "3", name: "Linha 3", nominalCapacity: 200, standardSetupTime: 60 }
  ];
  
  const shifts = [
    { id: "1", name: "Manhã", startTime: "06:00", endTime: "14:00" },
    { id: "2", name: "Tarde", startTime: "14:00", endTime: "22:00" },
    { id: "3", name: "Noite", startTime: "22:00", endTime: "06:00" }
  ];
  
  const stopReasons = [
    "Manutenção Corretiva",
    "Manutenção Preventiva",
    "Setup/Preparação",
    "Falta de Material",
    "Falta de Operador",
    "Reunião/Treinamento",
    "Parada Não Programada",
    "Ajustes de Qualidade",
    "Outros"
  ];

  // Standard setup time based on selected line
  const standardSetupTime = allLines.find(l => l.name === formData.location)?.standardSetupTime || 30;
  
  // Functions for handling setup times
  const addSetupTime = (setup: Omit<SetupTime, "id">) => {
    setSetupTimes(prev => [...prev, { ...setup, id: uuidv4() }]);
  };
  
  const removeSetupTime = (index: number) => {
    setSetupTimes(prev => prev.filter((_, idx) => idx !== index));
  };
  
  // Functions for handling stop times
  const addStopTime = (stop: Omit<StopTime, "id">) => {
    setStopTimes(prev => [...prev, { ...stop, id: uuidv4() }]);
  };
  
  const removeStopTime = (index: number) => {
    setStopTimes(prev => prev.filter((_, idx) => idx !== index));
  };
  
  // Handle production form submission
  const handleProductionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const errors: {[key: string]: string} = {};
    if (!formData.date) errors.date = "Data é obrigatória";
    if (!formData.shift) errors.shift = "Turno é obrigatório";
    if (!formData.location) errors.location = "Linha de produção é obrigatória";
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast({
        variant: "destructive",
        title: "Erro na validação",
        description: "Por favor, preencha todos os campos obrigatórios."
      });
      return;
    }
    
    // Submit data
    toast({
      title: "Dados registrados",
      description: "Os dados de produção foram salvos com sucesso.",
    });
    
    // Reset form
    setFormErrors({});
    setStopTimes([]);
    setSetupTimes([]);
  };
  
  // Handle logistics form submission
  const handleLogisticsSubmit = (data: any) => {
    toast({
      title: "Dados registrados",
      description: `Os dados de ${data.type === "expedicao" ? "expedição" : "recebimento"} foram salvos com sucesso.`,
    });
  };

  return (
    <AppLayout title="Registrar Dados">
      <div className="container mx-auto p-4">
        <Card className="mb-6">
          <CardHeader className="bg-muted">
            <CardTitle className="text-2xl font-bold">Registrar Dados</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Button 
                onClick={() => setFormType("production")}
                variant={formType === "production" ? "default" : "outline"}
                className="flex items-center justify-center h-16"
              >
                <Factory className="mr-2 h-5 w-5" />
                <span className="text-lg">Produção</span>
              </Button>
              <Button 
                onClick={() => setFormType("logistics")}
                variant={formType === "logistics" ? "default" : "outline"}
                className="flex items-center justify-center h-16"
              >
                <TruckIcon className="mr-2 h-5 w-5" />
                <span className="text-lg">Logística</span>
              </Button>
            </div>
            
            {formType === "production" ? (
              <form onSubmit={handleProductionSubmit} className="space-y-6">
                <ProductionFormFields 
                  formData={formData}
                  setFormData={setFormData}
                  formErrors={formErrors}
                  setFormErrors={setFormErrors}
                  allLines={allLines}
                  shifts={shifts}
                  unitType="unidades"
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-white rounded-xl p-3 md:p-5 border mb-2 shadow">
                  <div>
                    <Label htmlFor="planned" className="font-bold text-blue-600">Produção Planejada *</Label>
                    <Input 
                      id="planned" 
                      type="number"
                      value={formData.plannedProduction || ""}
                      onChange={(e) => setFormData({...formData, plannedProduction: Number(e.target.value)})}
                      className="bg-softGray"
                      required 
                    />
                  </div>
                  <div>
                    <Label htmlFor="actual" className="font-bold text-green-600">Produção Real *</Label>
                    <Input 
                      id="actual" 
                      type="number"
                      value={formData.actualProduction || ""}
                      onChange={(e) => setFormData({...formData, actualProduction: Number(e.target.value)})}
                      className="bg-softGray"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="rework" className="font-bold text-amber-600">Retrabalho</Label>
                    <Input 
                      id="rework" 
                      type="number"
                      value={formData.rework || ""}
                      onChange={(e) => setFormData({...formData, rework: Number(e.target.value)})}
                      className="bg-softGray"
                    />
                  </div>
                  <div>
                    <Label htmlFor="scrap" className="font-bold text-red-600">Refugo</Label>
                    <Input 
                      id="scrap" 
                      type="number"
                      value={formData.scrap || ""}
                      onChange={(e) => setFormData({...formData, scrap: Number(e.target.value)})}
                      className="bg-softGray"
                    />
                  </div>
                </div>

                {/* Setup Times Section */}
                <SetupTimesSection 
                  setups={setupTimes}
                  addSetup={addSetupTime}
                  removeSetup={removeSetupTime}
                  standardSetupTime={standardSetupTime}
                />

                {/* Stops Section */}
                <StopsSection
                  stops={stopTimes}
                  stopReasons={stopReasons}
                  addStop={addStopTime}
                  removeStop={removeStopTime}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white rounded-xl p-3 md:p-5 border mb-2 shadow">
                  <div className="md:col-span-3">
                    <Label htmlFor="observations" className="font-bold">Observações</Label>
                    <textarea
                      id="observations"
                      rows={3}
                      value={formData.observations}
                      onChange={(e) => setFormData({...formData, observations: e.target.value})}
                      className="w-full p-2 border rounded bg-softGray"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Registrar Produção
                  </Button>
                </div>
              </form>
            ) : (
              <MovimentacaoFormFields onSave={handleLogisticsSubmit} />
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
