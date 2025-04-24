
import React, { useState, useEffect } from "react";
import AppLayout from "../components/AppLayout";
import DataTypeSelector from "@/components/data-input/DataTypeSelector";
import { useUser } from "../context/UserContext";
import { getPlanoById } from "../config/planos";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  calculateAvailability,
  calculatePerformance,
  calculateQuality,
  calculateOEE,
  adjustSetupTime
} from "../utils/oeeCalculations";
import { Save, Settings, FileText } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import ProductionFormFields from "@/components/production-form/ProductionFormFields";
import SetupTimesSection from "@/components/production-form/SetupTimesSection";
import StopsSection from "@/components/production-form/StopsSection";
import LogisticsSection from "@/components/production-form/LogisticsSection";
import OEEPreviewSection from "@/components/production-form/OEEPreviewSection";
import RegistrySection from "@/components/production-form/RegistrySection";
import MovimentacaoFormFields from "@/components/production-form/MovimentacaoFormFields";
import ScheduledBreaksComponent from "@/components/production-form/ScheduledBreaksComponent";
import { SetupTime, StopTime, ScheduledBreak } from "@/types";

const stopReasons = [
  "Manutenção",
  "Troca de Produto",
  "Falta de Material",
  "Setup",
  "Quebra",
  "Intervalo",
  "Energia Elétrica",
  "Outro"
];

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
  const isMobile = useIsMobile();
  const isAdmin = user.role === "admin" || user.role === "master_admin";
  const [activeTab, setActiveTab] = useState("inserir");
  const [selectedType, setSelectedType] = useState<"selector" | "production" | "logistics">("selector");
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    shift: "Manhã",
    location: "Linha 1",
    plannedProduction: 1000,
    actualProduction: 0,
    rework: 0,
    scrap: 0,
    lostPackages: 0,
    setupTime: 0,
    observations: ""
  });
  const [setups, setSetups] = useState<SetupTime[]>([]);
  const [stops, setStops] = useState<StopTime[]>([]);
  const [scheduledBreaks, setScheduledBreaks] = useState<ScheduledBreak[]>([]);
  const [selectedLine, setSelectedLine] = useState(productionLines[0]);
  const [workingHours, setWorkingHours] = useState(8);
  const [oeePreview, setOeePreview] = useState({
    availability: 0,
    performance: 0,
    quality: 0,
    oee: 0
  });
  const [customLines, setCustomLines] = useState<{ id: string, name: string, nominalCapacity: number, standardSetupTime: number }[]>([]);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [loadingTime, setLoadingTime] = useState<number>(0);
  const [unloadingTime, setUnloadingTime] = useState<number>(0);
  const [unitType, setUnitType] = useState<"unidades" | "kg">("unidades");

  const plano = getPlanoById(user?.planoId || "basico");
  const showLogistics = isAdmin || (plano && plano.id === "completo");

  const allLines = [...productionLines, ...customLines];

  useEffect(() => {
    const line = allLines.find(l => l.name === formData.location);
    if (line) setSelectedLine(line);
  }, [formData.location, allLines]);

  useEffect(() => {
    if (formData.actualProduction > 0) {
      const plannedTime = workingHours * 60;
      const somaSetups = setups.reduce((acc, s) => acc + Number(s.tempo || 0), 0);
      const adjustedSetupTime = adjustSetupTime(somaSetups);
      const availability = calculateAvailability(plannedTime, adjustedSetupTime);
      const idealCycleTime = 60 / selectedLine.nominalCapacity;
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
  }, [formData, workingHours, setups, selectedLine]);

  const addSetup = (setup: Omit<SetupTime, "id">) => {
    const newId = `setup-${Date.now()}`;
    const newSetup: SetupTime = {
      id: newId,
      tempo: setup.tempo,
      descricao: setup.descricao || "",
      horarioInicio: setup.horarioInicio,
      horarioFim: setup.horarioFim
    };
    setSetups(prev => [...prev, newSetup]);
  };

  const removeSetup = (idx: number) => {
    setSetups(prev => prev.filter((_, i) => i !== idx));
  };

  const addStop = (stop: Omit<StopTime, "id">) => {
    const newId = `stop-${Date.now()}`;
    const newStop: StopTime = {
      id: newId,
      tempo: stop.tempo,
      motivo: stop.motivo,
      horarioInicio: stop.horarioInicio,
      horarioFim: stop.horarioFim
    };
    setStops(prev => [...prev, newStop]);
  };

  const removeStop = (idx: number) => {
    setStops(prev => prev.filter((_, i) => i !== idx));
  };

  const addScheduledBreak = (breakData: Omit<ScheduledBreak, "id">) => {
    const newId = `break-${Date.now()}`;
    setScheduledBreaks(prev => [...prev, { ...breakData, id: newId }]);
  };

  const removeScheduledBreak = (id: string) => {
    setScheduledBreaks(prev => prev.filter(b => b.id !== id));
  };

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    if (!formData.date) errors.date = "Data é obrigatória";
    if (!formData.shift) errors.shift = "Turno é obrigatório";
    if (!formData.location) errors.location = "Local é obrigatório";
    if (!formData.plannedProduction) errors.plannedProduction = "Produção planejada é obrigatória";
    if (!formData.actualProduction) errors.actualProduction = "Produção real é obrigatória";
    if (!workingHours || workingHours <= 0) errors.workingHours = "Tempo disponível é obrigatório";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Erro de validação",
        description: "Por favor, preencha todos os campos obrigatórios."
      });
      return;
    }
    console.log("Production data:", formData, "Setups:", setups, "Paradas:", stops, "Intervalos Programados:", scheduledBreaks);
    toast({
      title: "Dados salvos",
      description: "Os dados de produção foram salvos com sucesso."
    });
  };

  const handleSaveCustomLines = () => {
    console.log("Salvando configurações de cadastros...");
    toast({
      title: "Configurações salvas",
      description: "As configurações foram salvas com sucesso."
    });
  };

  const handleSaveMovimentacao = (data: any) => {
    console.log("Dados de movimentação:", data);
    toast({
      title: "Dados salvos",
      description: "Os dados de movimentação foram salvos com sucesso."
    });
  };

  return (
    <AppLayout title="Inserção de Dados - OEE">
      <div className="max-w-4xl mx-auto py-2 md:py-6">
        {selectedType === "selector" ? (
          <DataTypeSelector
            onSelectType={(type) => setSelectedType(type)}
          />
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => setSelectedType("selector")}
                  className="mb-4"
                >
                  Voltar
                </Button>
                <h1 className="text-2xl font-bold text-vividPurple">
                  {selectedType === "production" ? "Dados de Produção" : "Dados de Movimentação"}
                </h1>
              </div>
              <TabsList className="ml-auto">
                <TabsTrigger value="inserir" className="flex items-center gap-2">
                  <FileText size={16} />
                  <span>Inserir Dados</span>
                </TabsTrigger>
                {isAdmin && (
                  <TabsTrigger value="cadastros" className="flex items-center gap-2">
                    <Settings size={16} />
                    <span>Cadastros</span>
                  </TabsTrigger>
                )}
              </TabsList>
            </div>

            <TabsContent value="inserir">
              <Card className="shadow-lg border-2 border-vividPurple bg-softGray">
                <CardHeader>
                  <CardTitle className="text-vividPurple text-xl md:text-2xl">
                    {selectedType === "production" ? "Inserir Dados de Produção" : "Inserir Dados de Movimentação"}
                  </CardTitle>
                  <CardDescription>
                    {selectedType === "production" 
                      ? "Preencha todos os campos para calcular o OEE (Eficiência Global do Equipamento)"
                      : "Registre informações sobre expedição e recebimento de materiais"
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedType === "production" ? (
                    <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                      <ProductionFormFields
                        formData={formData}
                        setFormData={setFormData}
                        formErrors={formErrors}
                        setFormErrors={setFormErrors}
                        allLines={allLines}
                        shifts={shifts}
                        unitType={unitType}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 bg-white rounded-xl p-3 md:p-5 border mb-2 shadow">
                        <div>
                          <Label htmlFor="plannedProduction" className={`font-bold text-vividPurple ${formErrors.plannedProduction ? "text-destructive" : ""}`}>
                            Produção Planejada ({unitType}) *
                          </Label>
                          <Input
                            id="plannedProduction"
                            name="plannedProduction"
                            type="number"
                            value={formData.plannedProduction}
                            onChange={e => setFormData(f => ({ ...f, plannedProduction: Number(e.target.value) }))}
                            required
                            className={`bg-softGray ${formErrors.plannedProduction ? "border-destructive" : ""}`}
                          />
                          {formErrors.plannedProduction && <p className="text-xs text-destructive">{formErrors.plannedProduction}</p>}
                        </div>
                        <div>
                          <Label htmlFor="workingHours" className={`font-bold text-vividPurple ${formErrors.workingHours ? "text-destructive" : ""}`}>
                            Horas Trabalhadas no Turno *
                          </Label>
                          <Input
                            id="workingHours"
                            type="number"
                            value={workingHours}
                            onChange={e => {
                              setWorkingHours(Number(e.target.value));
                              if (formErrors.workingHours) {
                                setFormErrors({...formErrors, workingHours: ''});
                              }
                            }}
                            required
                            className={`bg-softGray ${formErrors.workingHours ? "border-destructive" : ""}`}
                          />
                          {formErrors.workingHours && <p className="text-xs text-destructive">{formErrors.workingHours}</p>}
                        </div>
                        <div>
                          <Label htmlFor="actualProduction" className={`font-bold text-vividPurple ${formErrors.actualProduction ? "text-destructive" : ""}`}>
                            Produção Real ({unitType}) *
                          </Label>
                          <Input
                            id="actualProduction"
                            name="actualProduction"
                            type="number"
                            value={formData.actualProduction}
                            onChange={e => setFormData(f => ({ ...f, actualProduction: Number(e.target.value) }))}
                            required
                            className={`bg-softGray ${formErrors.actualProduction ? "border-destructive" : ""}`}
                          />
                          {formErrors.actualProduction && <p className="text-xs text-destructive">{formErrors.actualProduction}</p>}
                        </div>
                        <div className="grid grid-cols-3 gap-2 mt-4">
                          <div>
                            <Label htmlFor="rework" className="font-bold">Retrabalho</Label>
                            <Input
                              id="rework"
                              name="rework"
                              type="number"
                              value={formData.rework}
                              onChange={e => setFormData(f => ({ ...f, rework: Number(e.target.value) }))}
                              required
                              className="bg-softGray"
                            />
                          </div>
                          <div>
                            <Label htmlFor="scrap" className="font-bold">Refugo</Label>
                            <Input
                              id="scrap"
                              name="scrap"
                              type="number"
                              value={formData.scrap}
                              onChange={e => setFormData(f => ({ ...f, scrap: Number(e.target.value) }))}
                              required
                              className="bg-softGray"
                            />
                          </div>
                          <div>
                            <Label htmlFor="lostPackages" className="font-bold">Embalagens Perdidas</Label>
                            <Input
                              id="lostPackages"
                              name="lostPackages"
                              type="number"
                              value={formData.lostPackages}
                              onChange={e => setFormData(f => ({ ...f, lostPackages: Number(e.target.value) }))}
                              required
                              className="bg-softGray"
                            />
                          </div>
                        </div>
                      </div>

                      <ScheduledBreaksComponent 
                        breaks={scheduledBreaks}
                        addBreak={addScheduledBreak}
                        removeBreak={removeScheduledBreak}
                      />

                      {formData.actualProduction > 0 && <OEEPreviewSection oeePreview={oeePreview} />}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                        <SetupTimesSection
                          setups={setups}
                          addSetup={addSetup}
                          removeSetup={removeSetup}
                          standardSetupTime={selectedLine.standardSetupTime}
                        />
                        <StopsSection
                          stops={stops}
                          stopReasons={stopReasons}
                          addStop={addStop}
                          removeStop={removeStop}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="observations">Observações</Label>
                        <Textarea
                          id="observations"
                          name="observations"
                          value={formData.observations || ""}
                          onChange={e => setFormData(f => ({ ...f, observations: e.target.value }))}
                          rows={3}
                          className="bg-white"
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full h-12 text-lg font-bold rounded-full bg-vividPurple hover:bg-primary/90 shadow-lg flex items-center justify-center gap-2 animate-fade-in"
                      >
                        <Save className="w-5 h-5" />
                        Salvar Dados
                      </Button>
                    </form>
                  ) : (
                    <MovimentacaoFormFields 
                      onSave={handleSaveMovimentacao} 
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {isAdmin && (
              <TabsContent value="cadastros">
                <div className="space-y-6">
                  <RegistrySection 
                    customLines={customLines}
                    setCustomLines={setCustomLines}
                    productionLines={productionLines}
                    unitType={unitType}
                    setUnitType={setUnitType}
                  />
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleSaveCustomLines} 
                      className="bg-vividPurple hover:bg-primary/90 shadow-lg flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Salvar Configurações
                    </Button>
                  </div>
                </div>
              </TabsContent>
            )}
          </Tabs>
        )}
      </div>
    </AppLayout>
  );
}
