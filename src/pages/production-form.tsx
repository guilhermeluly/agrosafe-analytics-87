
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
import { Save, Truck, ArrowRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

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

type SetupTime = { tempo: number };
type StopTime = { tempo: number; motivo: string };

export default function ProductionForm() {
  const { user } = useUser();
  const { toast } = useToast();
  const isMobile = useIsMobile();
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
    setupTime: 0,
    observations: ""
  });
  const [setups, setSetups] = useState<SetupTime[]>([{ tempo: 0 }]);
  const [stops, setStops] = useState<StopTime[]>([]);
  const [newStop, setNewStop] = useState<StopTime>({ tempo: 0, motivo: stopReasons[0] });
  const [selectedLine, setSelectedLine] = useState(productionLines[0]);
  const [workingHours, setWorkingHours] = useState(8);
  const [oeePreview, setOeePreview] = useState({
    availability: 0,
    performance: 0,
    quality: 0,
    oee: 0
  });
  const [customLines, setCustomLines] = useState<{ id: string, name: string, nominalCapacity: number, standardSetupTime: number }[]>([]);
  const [newLineName, setNewLineName] = useState("");
  const [newLineCapacity, setNewLineCapacity] = useState<number>(100);
  const [newLineSetup, setNewLineSetup] = useState<number>(10);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [loadingTime, setLoadingTime] = useState<number>(0);
  const [unloadingTime, setUnloadingTime] = useState<number>(0);
  const [unitType, setUnitType] = useState<"unidades" | "kg">("unidades");

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === "date" ? value : Number(value) || value });
    
    // Limpar erro do campo quando ele for preenchido
    if (formErrors[name]) {
      setFormErrors({...formErrors, [name]: ''});
    }
  };

  const handleSetupChange = (idx: number, valor: string) => {
    const temp = setups.map((s, i) => i === idx ? { tempo: Number(valor) } : s);
    setSetups(temp);
  };
  const addSetup = () => setSetups([...setups, { tempo: 0 }]);
  const removeSetup = (idx: number) => setSetups(setups.filter((_, i) => i !== idx));

  const handleStopChange = (field: "tempo" | "motivo", valor: string) => {
    setNewStop({ ...newStop, [field]: field === "tempo" ? Number(valor) : valor });
  };
  const addStop = () => {
    if (newStop.tempo > 0 && newStop.motivo.trim()) {
      setStops([...stops, newStop]);
      setNewStop({ tempo: 0, motivo: stopReasons[0] });
    }
  };
  const removeStop = (idx: number) => setStops(stops.filter((_, i) => i !== idx));

  const handleAddLine = () => {
    if (newLineName.trim() && newLineCapacity > 0) {
      const id = (customLines.length + productionLines.length + 1).toString();
      setCustomLines([
        ...customLines,
        { id, name: newLineName.trim(), nominalCapacity: newLineCapacity, standardSetupTime: newLineSetup }
      ]);
      setNewLineName("");
      setNewLineCapacity(100);
      setNewLineSetup(10);
    }
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
    
    console.log("Production data:", formData, "Setups:", setups, "Paradas:", stops, "Carga/Descarga:", { loading: loadingTime, unloading: unloadingTime });

    toast({
      title: "Dados salvos",
      description: "Os dados de produção foram salvos com sucesso."
    });
  };

  return (
    <AppLayout title="Inserção de Dados - OEE">
      <div className="max-w-4xl mx-auto py-2 md:py-6">
        <Card className="shadow-lg border-2 border-vividPurple bg-softGray">
          <CardHeader>
            <CardTitle className="text-vividPurple text-xl md:text-2xl">Inserir Dados de Produção</CardTitle>
            <CardDescription>
              Preencha todos os campos para calcular o OEE (Eficiência Global do Equipamento)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6">
                <div className="space-y-2">
                  <Label htmlFor="date" className={formErrors.date ? "text-destructive" : ""}>Data *</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className={`accent-vividPurple bg-white ${formErrors.date ? "border-destructive" : ""}`}
                  />
                  {formErrors.date && <p className="text-xs text-destructive">{formErrors.date}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shift" className={formErrors.shift ? "text-destructive" : ""}>Turno *</Label>
                  <select
                    id="shift"
                    name="shift"
                    value={formData.shift}
                    onChange={handleChange}
                    className={`w-full rounded-md border bg-background px-3 py-2 border-gray-300 ${formErrors.shift ? "border-destructive" : ""}`}
                    required
                  >
                    {shifts.map(shift => (
                      <option key={shift.id} value={shift.name}>
                        {shift.name}
                      </option>
                    ))}
                  </select>
                  {formErrors.shift && <p className="text-xs text-destructive">{formErrors.shift}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location" className={formErrors.location ? "text-destructive" : ""}>Linha/Local *</Label>
                  <select
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className={`w-full rounded-md border bg-background px-3 py-2 border-gray-300 ${formErrors.location ? "border-destructive" : ""}`}
                    required
                  >
                    {allLines.map(line => (
                      <option key={line.id} value={line.name}>
                        {line.name} - Cap: {line.nominalCapacity} {unitType}/h
                      </option>
                    ))}
                  </select>
                  {formErrors.location && <p className="text-xs text-destructive">{formErrors.location}</p>}
                  
                  <div className="flex flex-col space-y-2 mt-2">
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Novo local"
                        value={newLineName}
                        onChange={e => setNewLineName(e.target.value)}
                        className="w-full md:w-28"
                      />
                      <Input
                        type="number"
                        min={1}
                        placeholder="Capac."
                        value={newLineCapacity}
                        onChange={e => setNewLineCapacity(Number(e.target.value))}
                        className="w-20"
                      />
                      <select
                        value={unitType}
                        onChange={e => setUnitType(e.target.value as "unidades" | "kg")}
                        className="w-24 h-10 rounded-md border border-gray-300 bg-white px-2"
                      >
                        <option value="unidades">un/h</option>
                        <option value="kg">kg/h</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min={1}
                        placeholder="Setup (min)"
                        value={newLineSetup}
                        onChange={e => setNewLineSetup(Number(e.target.value))}
                        className="w-32"
                      />
                      <Button type="button" size="sm" onClick={handleAddLine} className="bg-vividPurple hover:bg-secondaryPurple">
                        Adicionar Local
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Capacidade nominal em {unitType}/hora e tempo padrão de setup (min).
                    </p>
                  </div>
                </div>
              </div>

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
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                      onChange={handleChange}
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
                      onChange={handleChange}
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
                      onChange={handleChange}
                      required
                      className="bg-softGray"
                    />
                  </div>
                </div>
              </div>

              {/* Novos indicadores de carregamento e descarregamento */}
              <Card className="bg-cyan-50 shadow border-l-4 border-cyan-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Truck className="w-5 h-5 mr-2" />
                    Logística - Carregamento e Descarregamento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="loadingTime" className="font-bold text-gray-700">
                        Tempo de Carregamento (min)
                      </Label>
                      <Input
                        id="loadingTime"
                        type="number"
                        min={0}
                        value={loadingTime}
                        onChange={e => setLoadingTime(Number(e.target.value))}
                        className="bg-white"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Tempo médio gasto para carregar materiais
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="unloadingTime" className="font-bold text-gray-700">
                        Tempo de Descarregamento (min)
                      </Label>
                      <Input
                        id="unloadingTime"
                        type="number"
                        min={0}
                        value={unloadingTime}
                        onChange={e => setUnloadingTime(Number(e.target.value))}
                        className="bg-white"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Tempo médio gasto para descarregar produtos
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {formData.actualProduction > 0 && (
                <Card className="bg-green-50 dark:bg-green-900/20 shadow border-l-4 border-green-500">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Prévia do Cálculo OEE</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      <div className="text-center p-2">
                        <div className="text-sm font-medium">Disponibilidade</div>
                        <div className="text-2xl font-bold">{oeePreview.availability}%</div>
                      </div>
                      <div className="text-center p-2">
                        <div className="text-sm font-medium">Performance</div>
                        <div className="text-2xl font-bold">{oeePreview.performance}%</div>
                      </div>
                      <div className="text-center p-2">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                <Card className="bg-muted/50 border-l-4 border-vividPurple">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Tempos de Setup</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-2">
                      {setups.map((setup, idx) => (
                        <div key={idx} className="flex items-center gap-2 mb-1">
                          <Input
                            type="number"
                            min={0}
                            value={setup.tempo}
                            onChange={e => handleSetupChange(idx, e.target.value)}
                            className="w-28"
                          />
                          <span className="text-xs text-muted-foreground">min</span>
                          {setups.length > 1 && (
                            <Button type="button" variant="outline" size="sm" onClick={() => removeSetup(idx)}>
                              Remover
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button type="button" size="sm" variant="default" onClick={addSetup} className="bg-vividPurple hover:bg-secondaryPurple">
                        Adicionar Setup
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        Tempo padrão: {selectedLine.standardSetupTime} min
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-muted/50 border-l-4 border-brightOrange">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Paradas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-3">
                      <div className="flex gap-2 items-center flex-wrap">
                        <Input
                          type="number"
                          min={0}
                          placeholder="Tempo (min)"
                          value={newStop.tempo || ""}
                          onChange={e => handleStopChange("tempo", e.target.value)}
                          className="w-24"
                        />
                        <select
                          value={newStop.motivo}
                          onChange={e => handleStopChange("motivo", e.target.value)}
                          className="w-full md:w-[170px] rounded-md border border-gray-300 bg-white h-10 px-2"
                        >
                          {stopReasons.map((reason, idx) => (
                            <option key={idx} value={reason}>{reason}</option>
                          ))}
                        </select>
                        <Button type="button" size="sm" variant="default" onClick={addStop} className="bg-brightOrange hover:bg-softOrange">
                          Adicionar
                        </Button>
                      </div>
                      {stops.length > 0 && (
                        <ul className="mt-2 space-y-2">
                          {stops.map((stop, idx) => (
                            <li key={idx} className="flex items-center gap-2 px-2 py-1 bg-gray-100 rounded">
                              <span className="font-semibold text-sm">{stop.tempo} min</span>
                              <span className="text-xs text-gray-600">{stop.motivo}</span>
                              <Button 
                                type="button" 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => removeStop(idx)}
                                className="h-6 px-2 text-xs ml-auto"
                              >
                                Remover
                              </Button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="observations">Observações</Label>
                <Textarea
                  id="observations"
                  name="observations"
                  value={formData.observations || ""}
                  onChange={handleChange}
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
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
