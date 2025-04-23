
import React, { useState, useEffect } from "react";
import AppLayout from "../components/AppLayout";
import { useUser } from "../context/UserContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input"; // Added the missing import
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  calculateAvailability,
  calculatePerformance,
  calculateQuality,
  calculateOEE,
  adjustSetupTime
} from "../utils/oeeCalculations";
import { Save } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import ProductionFormFields from "@/components/production-form/ProductionFormFields";
import SetupTimesSection from "@/components/production-form/SetupTimesSection";
import StopsSection from "@/components/production-form/StopsSection";
import LogisticsSection from "@/components/production-form/LogisticsSection";
import OEEPreviewSection from "@/components/production-form/OEEPreviewSection";

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

  // Pass to child as callback
  const handleSetupChange = (idx: number, valor: string) => {
    setSetups(prev => prev.map((s, i) => i === idx ? { tempo: Number(valor) } : s));
  };
  const addSetup = () => setSetups(prev => [...prev, { tempo: 0 }]);
  const removeSetup = (idx: number) => setSetups(prev => prev.filter((_, i) => i !== idx));

  const handleStopChange = (field: "tempo" | "motivo", valor: string) => {
    setNewStop(prev => ({ ...prev, [field]: field === "tempo" ? Number(valor) : valor }));
  };
  const addStop = () => {
    if (newStop.tempo > 0 && newStop.motivo.trim()) {
      setStops(prev => [...prev, newStop]);
      setNewStop({ tempo: 0, motivo: stopReasons[0] });
    }
  };
  const removeStop = (idx: number) => setStops(prev => prev.filter((_, i) => i !== idx));

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
              <ProductionFormFields
                formData={formData}
                setFormData={setFormData}
                formErrors={formErrors}
                setFormErrors={setFormErrors}
                allLines={allLines}
                shifts={shifts}
                newLineName={newLineName}
                setNewLineName={setNewLineName}
                newLineCapacity={newLineCapacity}
                setNewLineCapacity={setNewLineCapacity}
                newLineSetup={newLineSetup}
                setNewLineSetup={setNewLineSetup}
                handleAddLine={handleAddLine}
                setUnitType={setUnitType}
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

              <LogisticsSection
                loadingTime={loadingTime}
                setLoadingTime={setLoadingTime}
                unloadingTime={unloadingTime}
                setUnloadingTime={setUnloadingTime}
              />

              {formData.actualProduction > 0 && <OEEPreviewSection oeePreview={oeePreview} />}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                <SetupTimesSection
                  setups={setups}
                  handleSetupChange={handleSetupChange}
                  addSetup={addSetup}
                  removeSetup={removeSetup}
                  standardSetupTime={selectedLine.standardSetupTime}
                />
                <StopsSection
                  stops={stops}
                  newStop={newStop}
                  stopReasons={stopReasons}
                  setNewStop={setNewStop}
                  addStop={addStop}
                  removeStop={removeStop}
                  handleStopChange={handleStopChange}
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
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
