
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, Plus, Trash2, ArrowRight } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

type TruckEntry = {
  id: string;
  startTime: string;
  endTime: string;
  pesoNota: number;
  pesoBalanca: number;
  numPessoas: number;
  observacoes: string;
  setupTime?: number;
};

type MovimentacaoData = {
  date: string;
  shift: string;
  tempoDisponivel: number;
  entries: TruckEntry[];
  status: "draft" | "completed";
};

interface MovimentacaoFormFieldsProps {
  onSave: (data: any) => void;
}

export default function MovimentacaoFormFields({ onSave }: MovimentacaoFormFieldsProps) {
  const { toast } = useToast();
  const [expedicaoData, setExpedicaoData] = useState<MovimentacaoData>({
    date: new Date().toISOString().split('T')[0],
    shift: "Manhã",
    tempoDisponivel: 480, // 8 hours in minutes
    entries: [],
    status: "draft"
  });
  
  const [descargaData, setDescargaData] = useState<MovimentacaoData>({
    date: new Date().toISOString().split('T')[0],
    shift: "Manhã",
    tempoDisponivel: 480, // 8 hours in minutes
    entries: [],
    status: "draft"
  });

  const [newExpedicao, setNewExpedicao] = useState<Omit<TruckEntry, "id">>({
    startTime: "",
    endTime: "",
    pesoNota: 0,
    pesoBalanca: 0,
    numPessoas: 1,
    observacoes: ""
  });

  const [newDescarga, setNewDescarga] = useState<Omit<TruckEntry, "id">>({
    startTime: "",
    endTime: "",
    pesoNota: 0,
    pesoBalanca: 0,
    numPessoas: 1,
    observacoes: ""
  });

  // Function to generate metrics
  const calculateMetrics = (data: MovimentacaoData) => {
    if (!data.entries.length) return { setupMedioMinutos: 0, pesoTotal: 0, eficiencia: 0 };
    
    let totalPeso = 0;
    let totalSetupTime = 0;
    
    data.entries.forEach(entry => {
      totalPeso += Number(entry.pesoBalanca) || 0;
      
      if (entry.startTime && entry.endTime) {
        const start = new Date(`2000-01-01T${entry.startTime}:00`);
        const end = new Date(`2000-01-01T${entry.endTime}:00`);
        const diffMinutes = (end.getTime() - start.getTime()) / 60000;
        totalSetupTime += diffMinutes;
      }
    });
    
    const setupMedio = totalSetupTime / data.entries.length;
    const eficiencia = (totalPeso / (data.tempoDisponivel / 60)) * 100; // kg per hour efficiency
    
    return {
      setupMedioMinutos: Math.round(setupMedio),
      pesoTotal: totalPeso,
      eficiencia: Math.round(eficiencia) / 100 // kg per minute
    };
  };

  // Calculate setup time for a single entry
  const calculateSetupTime = (startTime: string, endTime: string, numPessoas: number) => {
    if (!startTime || !endTime) return 0;
    
    const start = new Date(`2000-01-01T${startTime}:00`);
    const end = new Date(`2000-01-01T${endTime}:00`);
    const diffMinutes = (end.getTime() - start.getTime()) / 60000;
    
    return Math.round(diffMinutes / (numPessoas || 1));
  };

  // Add new entry to Expedição
  const addExpedicaoEntry = () => {
    if (!newExpedicao.startTime || !newExpedicao.endTime) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Hora inicial e final são obrigatórios"
      });
      return;
    }
    
    const setupTime = calculateSetupTime(newExpedicao.startTime, newExpedicao.endTime, newExpedicao.numPessoas);
    
    const newEntry: TruckEntry = {
      id: Date.now().toString(),
      ...newExpedicao,
      setupTime
    };
    
    setExpedicaoData(prev => ({
      ...prev,
      entries: [...prev.entries, newEntry]
    }));
    
    setNewExpedicao({
      startTime: "",
      endTime: "",
      pesoNota: 0,
      pesoBalanca: 0,
      numPessoas: 1,
      observacoes: ""
    });
    
    toast({
      title: "Caminhão adicionado",
      description: "Dados do caminhão foram adicionados à expedição"
    });
  };

  // Add new entry to Descarga
  const addDescargaEntry = () => {
    if (!newDescarga.startTime || !newDescarga.endTime) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Hora inicial e final são obrigatórios"
      });
      return;
    }
    
    const setupTime = calculateSetupTime(newDescarga.startTime, newDescarga.endTime, newDescarga.numPessoas);
    
    const newEntry: TruckEntry = {
      id: Date.now().toString(),
      ...newDescarga,
      setupTime
    };
    
    setDescargaData(prev => ({
      ...prev,
      entries: [...prev.entries, newEntry]
    }));
    
    setNewDescarga({
      startTime: "",
      endTime: "",
      pesoNota: 0,
      pesoBalanca: 0,
      numPessoas: 1,
      observacoes: ""
    });
    
    toast({
      title: "Caminhão adicionado",
      description: "Dados do caminhão foram adicionados ao descarregamento"
    });
  };

  // Remove entry
  const removeExpedicaoEntry = (id: string) => {
    setExpedicaoData(prev => ({
      ...prev,
      entries: prev.entries.filter(entry => entry.id !== id)
    }));
  };

  const removeDescargaEntry = (id: string) => {
    setDescargaData(prev => ({
      ...prev,
      entries: prev.entries.filter(entry => entry.id !== id)
    }));
  };

  // Save data actions
  const saveExpedicaoPartial = () => {
    const data = {
      ...expedicaoData,
      status: "draft",
      metrics: calculateMetrics(expedicaoData)
    };
    
    onSave({ type: "expedicao", data });
    
    toast({
      title: "Dados salvos parcialmente",
      description: "Os dados de expedição foram salvos como rascunho"
    });
  };

  const finalizeExpedicao = () => {
    if (expedicaoData.entries.length === 0) {
      toast({
        variant: "destructive",
        title: "Nenhum dado registrado",
        description: "Adicione pelo menos um caminhão antes de finalizar"
      });
      return;
    }
    
    const data = {
      ...expedicaoData,
      status: "completed",
      metrics: calculateMetrics(expedicaoData)
    };
    
    onSave({ type: "expedicao", data });
    
    toast({
      title: "Dados finalizados",
      description: "Os dados de expedição foram finalizados com sucesso"
    });
  };

  const saveDescargaPartial = () => {
    const data = {
      ...descargaData,
      status: "draft",
      metrics: calculateMetrics(descargaData)
    };
    
    onSave({ type: "descarga", data });
    
    toast({
      title: "Dados salvos parcialmente",
      description: "Os dados de descarregamento foram salvos como rascunho"
    });
  };

  const finalizeDescarga = () => {
    if (descargaData.entries.length === 0) {
      toast({
        variant: "destructive",
        title: "Nenhum dado registrado",
        description: "Adicione pelo menos um caminhão antes de finalizar"
      });
      return;
    }
    
    const data = {
      ...descargaData,
      status: "completed",
      metrics: calculateMetrics(descargaData)
    };
    
    onSave({ type: "descarga", data });
    
    toast({
      title: "Dados finalizados",
      description: "Os dados de descarregamento foram finalizados com sucesso"
    });
  };

  // UI Components for entry forms
  const ExpedicaoForm = () => {
    const metrics = calculateMetrics(expedicaoData);
    
    return (
      <Card className="mb-6">
        <CardHeader className="bg-vividPurple text-white rounded-t-lg">
          <CardTitle>Expedição</CardTitle>
          <CardDescription className="text-gray-100">
            Registro de carregamento de caminhões - {expedicaoData.entries.length} caminhões registrados
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="expedicao-date">Data *</Label>
              <Input
                id="expedicao-date"
                type="date"
                value={expedicaoData.date}
                onChange={(e) => setExpedicaoData(prev => ({...prev, date: e.target.value}))}
                required
                className="bg-white"
              />
            </div>
            <div>
              <Label htmlFor="expedicao-shift">Turno *</Label>
              <select
                id="expedicao-shift"
                value={expedicaoData.shift}
                onChange={(e) => setExpedicaoData(prev => ({...prev, shift: e.target.value}))}
                className="w-full rounded-md border bg-background px-3 py-2 border-gray-300"
                required
              >
                <option value="Manhã">Manhã</option>
                <option value="Tarde">Tarde</option>
                <option value="Noite">Noite</option>
              </select>
            </div>
            <div>
              <Label htmlFor="expedicao-tempoDisponivel">Tempo Disponível (min) *</Label>
              <Input
                id="expedicao-tempoDisponivel"
                type="number"
                value={expedicaoData.tempoDisponivel}
                onChange={(e) => setExpedicaoData(prev => ({...prev, tempoDisponivel: Number(e.target.value)}))}
                required
                className="bg-white"
              />
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-lg mb-4">Indicadores</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Tempo médio de setup</p>
                <p className="text-xl font-bold">{metrics.setupMedioMinutos} min</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Peso total expedido</p>
                <p className="text-xl font-bold">{metrics.pesoTotal} kg</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Eficiência</p>
                <p className="text-xl font-bold">{metrics.eficiencia} kg/min</p>
              </div>
            </div>
          </div>
          
          {/* Registered trucks table */}
          {expedicaoData.entries.length > 0 && (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Início</TableHead>
                    <TableHead>Fim</TableHead>
                    <TableHead>Tempo</TableHead>
                    <TableHead>Pessoas</TableHead>
                    <TableHead>Peso Nota</TableHead>
                    <TableHead>Peso Balança</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expedicaoData.entries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>{entry.startTime}</TableCell>
                      <TableCell>{entry.endTime}</TableCell>
                      <TableCell>{entry.setupTime || 0} min</TableCell>
                      <TableCell>{entry.numPessoas}</TableCell>
                      <TableCell>{entry.pesoNota} kg</TableCell>
                      <TableCell>{entry.pesoBalanca} kg</TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeExpedicaoEntry(entry.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          
          {/* New truck entry form */}
          <div className="bg-white p-4 border rounded-lg">
            <h3 className="font-medium mb-4">Adicionar Novo Caminhão</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="new-exp-startTime">Hora Início *</Label>
                <Input
                  id="new-exp-startTime"
                  type="time"
                  value={newExpedicao.startTime}
                  onChange={(e) => setNewExpedicao(prev => ({...prev, startTime: e.target.value}))}
                  className="bg-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="new-exp-endTime">Hora Fim *</Label>
                <Input
                  id="new-exp-endTime"
                  type="time"
                  value={newExpedicao.endTime}
                  onChange={(e) => setNewExpedicao(prev => ({...prev, endTime: e.target.value}))}
                  className="bg-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="new-exp-numPessoas">Nº de Pessoas *</Label>
                <Input
                  id="new-exp-numPessoas"
                  type="number"
                  min="1"
                  value={newExpedicao.numPessoas}
                  onChange={(e) => setNewExpedicao(prev => ({...prev, numPessoas: Number(e.target.value)}))}
                  className="bg-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="new-exp-pesoNota">Peso da Nota (kg) *</Label>
                <Input
                  id="new-exp-pesoNota"
                  type="number"
                  value={newExpedicao.pesoNota}
                  onChange={(e) => setNewExpedicao(prev => ({...prev, pesoNota: Number(e.target.value)}))}
                  className="bg-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="new-exp-pesoBalanca">Peso na Balança (kg) *</Label>
                <Input
                  id="new-exp-pesoBalanca"
                  type="number"
                  value={newExpedicao.pesoBalanca}
                  onChange={(e) => setNewExpedicao(prev => ({...prev, pesoBalanca: Number(e.target.value)}))}
                  className="bg-white"
                  required
                />
              </div>
              <div className="md:col-span-2 lg:col-span-3">
                <Label htmlFor="new-exp-observacoes">Observações</Label>
                <Textarea
                  id="new-exp-observacoes"
                  value={newExpedicao.observacoes}
                  onChange={(e) => setNewExpedicao(prev => ({...prev, observacoes: e.target.value}))}
                  rows={2}
                  className="bg-white"
                />
              </div>
              <div className="md:col-span-2 lg:col-span-3">
                <Button 
                  onClick={addExpedicaoEntry}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Adicionar Caminhão
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between gap-4 pt-4 border-t">
            <Button
              variant="outline"
              onClick={saveExpedicaoPartial}
              className="flex-1"
            >
              Salvar Parcialmente
            </Button>
            <Button
              onClick={finalizeExpedicao}
              className="flex-1 bg-vividPurple hover:bg-primary/90"
            >
              Finalizar Preenchimento
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const DescargaForm = () => {
    const metrics = calculateMetrics(descargaData);
    
    return (
      <Card>
        <CardHeader className="bg-blue-600 text-white rounded-t-lg">
          <CardTitle>Descarregamento</CardTitle>
          <CardDescription className="text-gray-100">
            Registro de descarregamento de caminhões - {descargaData.entries.length} caminhões registrados
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="descarga-date">Data *</Label>
              <Input
                id="descarga-date"
                type="date"
                value={descargaData.date}
                onChange={(e) => setDescargaData(prev => ({...prev, date: e.target.value}))}
                required
                className="bg-white"
              />
            </div>
            <div>
              <Label htmlFor="descarga-shift">Turno *</Label>
              <select
                id="descarga-shift"
                value={descargaData.shift}
                onChange={(e) => setDescargaData(prev => ({...prev, shift: e.target.value}))}
                className="w-full rounded-md border bg-background px-3 py-2 border-gray-300"
                required
              >
                <option value="Manhã">Manhã</option>
                <option value="Tarde">Tarde</option>
                <option value="Noite">Noite</option>
              </select>
            </div>
            <div>
              <Label htmlFor="descarga-tempoDisponivel">Tempo Disponível (min) *</Label>
              <Input
                id="descarga-tempoDisponivel"
                type="number"
                value={descargaData.tempoDisponivel}
                onChange={(e) => setDescargaData(prev => ({...prev, tempoDisponivel: Number(e.target.value)}))}
                required
                className="bg-white"
              />
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-lg mb-4">Indicadores</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Tempo médio de descarga</p>
                <p className="text-xl font-bold">{metrics.setupMedioMinutos} min</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Peso total recebido</p>
                <p className="text-xl font-bold">{metrics.pesoTotal} kg</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Eficiência</p>
                <p className="text-xl font-bold">{metrics.eficiencia} kg/min</p>
              </div>
            </div>
          </div>
          
          {/* Registered trucks table */}
          {descargaData.entries.length > 0 && (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Início</TableHead>
                    <TableHead>Fim</TableHead>
                    <TableHead>Tempo</TableHead>
                    <TableHead>Pessoas</TableHead>
                    <TableHead>Peso Nota</TableHead>
                    <TableHead>Peso Balança</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {descargaData.entries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>{entry.startTime}</TableCell>
                      <TableCell>{entry.endTime}</TableCell>
                      <TableCell>{entry.setupTime || 0} min</TableCell>
                      <TableCell>{entry.numPessoas}</TableCell>
                      <TableCell>{entry.pesoNota} kg</TableCell>
                      <TableCell>{entry.pesoBalanca} kg</TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeDescargaEntry(entry.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          
          {/* New truck entry form */}
          <div className="bg-white p-4 border rounded-lg">
            <h3 className="font-medium mb-4">Adicionar Novo Caminhão</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="new-desc-startTime">Hora Início *</Label>
                <Input
                  id="new-desc-startTime"
                  type="time"
                  value={newDescarga.startTime}
                  onChange={(e) => setNewDescarga(prev => ({...prev, startTime: e.target.value}))}
                  className="bg-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="new-desc-endTime">Hora Fim *</Label>
                <Input
                  id="new-desc-endTime"
                  type="time"
                  value={newDescarga.endTime}
                  onChange={(e) => setNewDescarga(prev => ({...prev, endTime: e.target.value}))}
                  className="bg-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="new-desc-numPessoas">Nº de Pessoas *</Label>
                <Input
                  id="new-desc-numPessoas"
                  type="number"
                  min="1"
                  value={newDescarga.numPessoas}
                  onChange={(e) => setNewDescarga(prev => ({...prev, numPessoas: Number(e.target.value)}))}
                  className="bg-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="new-desc-pesoNota">Peso da Nota (kg) *</Label>
                <Input
                  id="new-desc-pesoNota"
                  type="number"
                  value={newDescarga.pesoNota}
                  onChange={(e) => setNewDescarga(prev => ({...prev, pesoNota: Number(e.target.value)}))}
                  className="bg-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="new-desc-pesoBalanca">Peso na Balança (kg) *</Label>
                <Input
                  id="new-desc-pesoBalanca"
                  type="number"
                  value={newDescarga.pesoBalanca}
                  onChange={(e) => setNewDescarga(prev => ({...prev, pesoBalanca: Number(e.target.value)}))}
                  className="bg-white"
                  required
                />
              </div>
              <div className="md:col-span-2 lg:col-span-3">
                <Label htmlFor="new-desc-observacoes">Observações</Label>
                <Textarea
                  id="new-desc-observacoes"
                  value={newDescarga.observacoes}
                  onChange={(e) => setNewDescarga(prev => ({...prev, observacoes: e.target.value}))}
                  rows={2}
                  className="bg-white"
                />
              </div>
              <div className="md:col-span-2 lg:col-span-3">
                <Button 
                  onClick={addDescargaEntry}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Adicionar Caminhão
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between gap-4 pt-4 border-t">
            <Button
              variant="outline"
              onClick={saveDescargaPartial}
              className="flex-1"
            >
              Salvar Parcialmente
            </Button>
            <Button
              onClick={finalizeDescarga}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Finalizar Preenchimento
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      <ExpedicaoForm />
      <DescargaForm />
    </div>
  );
}
