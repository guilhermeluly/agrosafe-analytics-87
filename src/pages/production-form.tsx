
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

// Novo: tipos para setup e parada
type SetupTime = { tempo: number };
type StopTime = { tempo: number; motivo: string };

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
    setupTime: 0,
    observations: ""
  });

  const [setups, setSetups] = useState<SetupTime[]>([{ tempo: 0 }]);
  const [stops, setStops] = useState<StopTime[]>([]);
  const [newStop, setNewStop] = useState<StopTime>({ tempo: 0, motivo: "" });

  const [selectedLine, setSelectedLine] = useState(productionLines[0]);
  const [workingHours, setWorkingHours] = useState(8);
  const [oeePreview, setOeePreview] = useState({
    availability: 0,
    performance: 0,
    quality: 0,
    oee: 0
  });

  // Atualizar linha selecionada
  useEffect(() => {
    const line = productionLines.find(l => l.name === formData.location);
    if (line) setSelectedLine(line);
  }, [formData.location]);

  // Calcular OEE preview
  useEffect(() => {
    if (formData.actualProduction > 0) {
      const plannedTime = workingHours * 60;
      // Somar todos os tempos de setup
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

  // Mudanças do formulário principal
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === "date" ? value : Number(value) || value });
  };

  // Novo: editar setups
  const handleSetupChange = (idx: number, valor: string) => {
    const temp = setups.map((s, i) => i === idx ? { tempo: Number(valor) } : s);
    setSetups(temp);
  };
  const addSetup = () => setSetups([...setups, { tempo: 0 }]);
  const removeSetup = (idx: number) => setSetups(setups.filter((_, i) => i !== idx));

  // Novo: editar paradas
  const handleStopChange = (field: "tempo" | "motivo", valor: string) => {
    setNewStop({ ...newStop, [field]: field === "tempo" ? Number(valor) : valor });
  };
  const addStop = () => {
    if (newStop.tempo > 0 && newStop.motivo.trim()) {
      setStops([...stops, newStop]);
      setNewStop({ tempo: 0, motivo: "" });
    }
  };
  const removeStop = (idx: number) => setStops(stops.filter((_, i) => i !== idx));

  // Salvar
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui salvaria no banco – instrua a conectar Supabase!
    console.log("Production data:", formData, "Setups:", setups, "Paradas:", stops);

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

              {/* Setups múltiplos */}
              <div className="pt-4 border-t">
                <Card className="bg-muted/50">
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
                      <Button type="button" size="sm" variant="default" onClick={addSetup}>
                        Adicionar Setup
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        Tempo padrão: {selectedLine.standardSetupTime} min
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Paradas */}
              <div>
                <Card className="bg-muted/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Paradas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-3">
                      <div className="flex gap-2 items-center">
                        <Input
                          type="number"
                          min={0}
                          placeholder="Tempo (min)"
                          value={newStop.tempo || ""}
                          onChange={e => handleStopChange("tempo", e.target.value)}
                          className="w-24"
                        />
                        <Input
                          type="text"
                          placeholder="Motivo"
                          value={newStop.motivo}
                          onChange={e => handleStopChange("motivo", e.target.value)}
                          className="w-[170px]"
                        />
                        <Button type="button" size="sm" variant="default" onClick={addStop}>
                          Adicionar
                        </Button>
                      </div>
                      {stops.length > 0 && (
                        <ul className="mt-2 space-y-2">
                          {stops.map((stop, idx) => (
                            <li key={idx} className="flex items-center gap-2 px-2 py-1 bg-gray-100 rounded">
                              <span className="font-semibold text-sm">{stop.tempo} min</span>
                              <span className="text-xs text-gray-600">{stop.motivo}</span>
                              <Button type="button" size="xs" variant="ghost" onClick={() => removeStop(idx)}>
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

              {/* Planejamento e produção (restante igual) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            onChange={e => setWorkingHours(Number(e.target.value))}
                            required
                          />
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

              {/* Prévia OEE */}
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
// ATENÇÃO: Esse arquivo está ficando grande. Considere pedir refatoração em componentes menores se precisar evoluir!
