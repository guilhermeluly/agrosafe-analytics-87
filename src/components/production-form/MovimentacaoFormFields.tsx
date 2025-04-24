import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, Plus, Trash2, ArrowLeft } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import TruckTypeSelector, { TruckType } from './TruckTypeSelector';

const defaultTruckTypes: TruckType[] = [
  { id: '1', name: 'Carreta', capacity: 30000 },
  { id: '2', name: 'Truck Sider', capacity: 14000 },
  { id: '3', name: 'Truck Baú', capacity: 12000 },
  { id: '4', name: 'VUC', capacity: 3500 },
  { id: '5', name: '3/4', capacity: 4000 },
];

type VehicleEntry = {
  id: string;
  startTime: string;
  endTime: string;
  pesoNota: number;
  pesoBalanca: number;
  numPessoas: number;
  observacoes: string;
  setupTime?: number;
  truckType: string;
  placa: string;
};

type MovimentacaoData = {
  date: string;
  shift: string;
  tempoDisponivel: number;
  entries: VehicleEntry[];
  status: "draft" | "completed";
};

interface MovimentacaoFormFieldsProps {
  onSave: (data: any) => void;
}

export default function MovimentacaoFormFields({ onSave }: MovimentacaoFormFieldsProps) {
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState<"selector" | "expedicao" | "descarga">("selector");
  
  const [expedicaoData, setExpedicaoData] = useState<MovimentacaoData>({
    date: new Date().toISOString().split('T')[0],
    shift: "Manhã",
    tempoDisponivel: 480,
    entries: [],
    status: "draft"
  });
  
  const [descargaData, setDescargaData] = useState<MovimentacaoData>({
    date: new Date().toISOString().split('T')[0],
    shift: "Manhã",
    tempoDisponivel: 480,
    entries: [],
    status: "draft"
  });

  const [newExpedicao, setNewExpedicao] = useState<Omit<VehicleEntry, "id">>({
    startTime: "",
    endTime: "",
    pesoNota: 0,
    pesoBalanca: 0,
    numPessoas: 1,
    observacoes: "",
    truckType: "",
    placa: ""
  });

  const [newDescarga, setNewDescarga] = useState<Omit<VehicleEntry, "id">>({
    startTime: "",
    endTime: "",
    pesoNota: 0,
    pesoBalanca: 0,
    numPessoas: 1,
    observacoes: "",
    truckType: "",
    placa: ""
  });

  const calculateSetupTime = (startTime: string, endTime: string, numPessoas: number) => {
    if (!startTime || !endTime) return 0;
    
    const start = new Date(`2000-01-01T${startTime}:00`);
    const end = new Date(`2000-01-01T${endTime}:00`);
    const diffMinutes = (end.getTime() - start.getTime()) / 60000;
    
    return Math.round(diffMinutes / (numPessoas || 1));
  };

  const addExpedicaoEntry = () => {
    if (!newExpedicao.startTime || !newExpedicao.endTime || !newExpedicao.placa) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Hora inicial, final e placa do veículo são obrigatórios"
      });
      return;
    }
    
    const setupTime = calculateSetupTime(newExpedicao.startTime, newExpedicao.endTime, newExpedicao.numPessoas);
    
    const newEntry: VehicleEntry = {
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
      observacoes: "",
      truckType: "",
      placa: ""
    });
    
    toast({
      title: "Veículo adicionado",
      description: "Dados do veículo foram adicionados à expedição"
    });
  };

  const addDescargaEntry = () => {
    if (!newDescarga.startTime || !newDescarga.endTime || !newDescarga.placa) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Hora inicial, final e placa do veículo são obrigatórios"
      });
      return;
    }
    
    const setupTime = calculateSetupTime(newDescarga.startTime, newDescarga.endTime, newDescarga.numPessoas);
    
    const newEntry: VehicleEntry = {
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
      observacoes: "",
      truckType: "",
      placa: ""
    });
    
    toast({
      title: "Veículo adicionado",
      description: "Dados do veículo foram adicionados ao descarregamento"
    });
  };

  const TypeSelector = () => (
    <Card className="mb-6">
      <CardHeader className="bg-cyan-50 text-cyan-800 rounded-t-lg">
        <CardTitle>Selecione o Tipo de Operação</CardTitle>
        <CardDescription className="text-cyan-700">
          Escolha entre expedição (carregamento) ou recebimento (descarregamento)
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            onClick={() => setSelectedType("expedicao")}
            className="h-24 bg-green-600 hover:bg-green-700 text-white flex flex-col items-center justify-center space-y-2"
          >
            <span className="text-lg font-semibold">Expedição</span>
            <span className="text-sm">(Carregamento)</span>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <Button
            onClick={() => setSelectedType("descarga")}
            className="h-24 bg-blue-600 hover:bg-blue-700 text-white flex flex-col items-center justify-center space-y-2"
          >
            <span className="text-lg font-semibold">Recebimento</span>
            <span className="text-sm">(Descarregamento)</span>
            <ArrowLeft className="w-6 h-6" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderEntryForm = (
    type: "expedicao" | "descarga",
    data: MovimentacaoData,
    newEntry: Omit<VehicleEntry, "id">,
    setNewEntry: React.Dispatch<React.SetStateAction<Omit<VehicleEntry, "id">>>,
    addEntry: () => void,
    removeEntry: (id: string) => void
  ) => {
    const isExpedicao = type === "expedicao";
    const title = isExpedicao ? "Expedição (Carregamento)" : "Recebimento (Descarregamento)";
    const bgColor = isExpedicao ? "bg-green-500" : "bg-blue-600";
    
    return (
      <Card>
        <CardHeader className={`${bgColor} text-white rounded-t-lg`}>
          <CardTitle className="flex justify-between items-center">
            <span>{title}</span>
            <Button 
              variant="ghost" 
              onClick={() => setSelectedType("selector")}
              className="text-white hover:text-gray-100 flex items-center"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Voltar
            </Button>
          </CardTitle>
          <CardDescription className="text-gray-100">
            Registro de {isExpedicao ? "carregamento" : "descarregamento"} de veículos - {data.entries.length} veículos registrados
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor={`${type}-date`}>Data *</Label>
              <Input
                id={`${type}-date`}
                type="date"
                value={data.date}
                onChange={(e) => isExpedicao ? 
                  setExpedicaoData(prev => ({...prev, date: e.target.value})) :
                  setDescargaData(prev => ({...prev, date: e.target.value}))
                }
                required
                className="bg-white"
              />
            </div>
            <div>
              <Label htmlFor={`${type}-shift`}>Turno *</Label>
              <select
                id={`${type}-shift`}
                value={data.shift}
                onChange={(e) => isExpedicao ?
                  setExpedicaoData(prev => ({...prev, shift: e.target.value})) :
                  setDescargaData(prev => ({...prev, shift: e.target.value}))
                }
                className="w-full rounded-md border bg-background px-3 py-2 border-gray-300"
                required
              >
                <option value="Manhã">Manhã</option>
                <option value="Tarde">Tarde</option>
                <option value="Noite">Noite</option>
              </select>
            </div>
            <div>
              <Label htmlFor={`${type}-tempoDisponivel`}>Tempo Disponível (min) *</Label>
              <Input
                id={`${type}-tempoDisponivel`}
                type="number"
                value={data.tempoDisponivel}
                onChange={(e) => isExpedicao ?
                  setExpedicaoData(prev => ({...prev, tempoDisponivel: Number(e.target.value)})) :
                  setDescargaData(prev => ({...prev, tempoDisponivel: Number(e.target.value)}))
                }
                required
                className="bg-white"
              />
            </div>
          </div>
          
          {data.entries.length > 0 && (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Placa</TableHead>
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
                  {data.entries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>{defaultTruckTypes.find(t => t.id === entry.truckType)?.name || 'N/A'}</TableCell>
                      <TableCell>{entry.placa}</TableCell>
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
                          onClick={() => removeEntry(entry.id)}
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
          
          <div className="bg-white p-4 border rounded-lg">
            <h3 className="font-medium mb-4">Adicionar Novo Veículo</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor={`new-${type}-placa`}>Placa do Veículo *</Label>
                <Input
                  id={`new-${type}-placa`}
                  type="text"
                  value={newEntry.placa}
                  onChange={(e) => setNewEntry(prev => ({...prev, placa: e.target.value.toUpperCase()}))}
                  className="bg-white uppercase"
                  required
                  placeholder="ABC1234"
                  maxLength={7}
                />
              </div>
              <div>
                <Label htmlFor={`new-${type}-startTime`}>Hora Início *</Label>
                <Input
                  id={`new-${type}-startTime`}
                  type="time"
                  value={newEntry.startTime}
                  onChange={(e) => setNewEntry(prev => ({...prev, startTime: e.target.value}))}
                  className="bg-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor={`new-${type}-endTime`}>Hora Fim *</Label>
                <Input
                  id={`new-${type}-endTime`}
                  type="time"
                  value={newEntry.endTime}
                  onChange={(e) => setNewEntry(prev => ({...prev, endTime: e.target.value}))}
                  className="bg-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor={`new-${type}-numPessoas`}>Nº de Pessoas *</Label>
                <Input
                  id={`new-${type}-numPessoas`}
                  type="number"
                  min="1"
                  value={newEntry.numPessoas}
                  onChange={(e) => setNewEntry(prev => ({...prev, numPessoas: Number(e.target.value)}))}
                  className="bg-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor={`new-${type}-pesoNota`}>Peso da Nota (kg) *</Label>
                <Input
                  id={`new-${type}-pesoNota`}
                  type="number"
                  value={newEntry.pesoNota}
                  onChange={(e) => setNewEntry(prev => ({...prev, pesoNota: Number(e.target.value)}))}
                  className="bg-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor={`new-${type}-pesoBalanca`}>Peso na Balança (kg) *</Label>
                <Input
                  id={`new-${type}-pesoBalanca`}
                  type="number"
                  value={newEntry.pesoBalanca}
                  onChange={(e) => setNewEntry(prev => ({...prev, pesoBalanca: Number(e.target.value)}))}
                  className="bg-white"
                  required
                />
              </div>
              <div className="md:col-span-2 lg:col-span-3">
                <Label htmlFor={`new-${type}-observacoes`}>Observações</Label>
                <Textarea
                  id={`new-${type}-observacoes`}
                  value={newEntry.observacoes}
                  onChange={(e) => setNewEntry(prev => ({...prev, observacoes: e.target.value}))}
                  rows={2}
                  className="bg-white"
                />
              </div>
              <div className="md:col-span-2 lg:col-span-3">
                <TruckTypeSelector
                  selectedType={newEntry.truckType}
                  onTypeChange={(typeId) => setNewEntry(prev => ({ ...prev, truckType: typeId }))}
                />
              </div>
              <div className="md:col-span-2 lg:col-span-3">
                <Button 
                  onClick={addEntry}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Adicionar Veículo
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between gap-4 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                const data = {
                  type,
                  data: isExpedicao ? expedicaoData : descargaData,
                  status: "draft"
                };
                onSave(data);
                toast({
                  title: "Dados salvos parcialmente",
                  description: `Os dados de ${isExpedicao ? "expedição" : "descarregamento"} foram salvos como rascunho`
                });
              }}
              className="flex-1"
            >
              Salvar Parcialmente
            </Button>
            <Button
              onClick={() => {
                if ((isExpedicao ? expedicaoData : descargaData).entries.length === 0) {
                  toast({
                    variant: "destructive",
                    title: "Nenhum dado registrado",
                    description: "Adicione pelo menos um veículo antes de finalizar"
                  });
                  return;
                }
                
                const data = {
                  type,
                  data: isExpedicao ? expedicaoData : descargaData,
                  status: "completed"
                };
                
                onSave(data);
                
                toast({
                  title: "Dados finalizados",
                  description: `Os dados de ${isExpedicao ? "expedição" : "descarregamento"} foram finalizados com sucesso`
                });
              }}
              className={`flex-1 ${isExpedicao ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"}`}
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
      {selectedType === "selector" ? (
        <TypeSelector />
      ) : selectedType === "expedicao" ? (
        renderEntryForm(
          "expedicao",
          expedicaoData,
          newExpedicao,
          setNewExpedicao,
          addExpedicaoEntry,
          (id) => setExpedicaoData(prev => ({
            ...prev,
            entries: prev.entries.filter(entry => entry.id !== id)
          }))
        )
      ) : (
        renderEntryForm(
          "descarga",
          descargaData,
          newDescarga,
          setNewDescarga,
          addDescargaEntry,
          (id) => setDescargaData(prev => ({
            ...prev,
            entries: prev.entries.filter(entry => entry.id !== id)
          }))
        )
      )}
    </div>
  );
}
