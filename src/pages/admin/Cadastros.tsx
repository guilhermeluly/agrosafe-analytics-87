
import React, { useState } from 'react';
import AppLayout from '../../components/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import RegistrySection from "@/components/production-form/RegistrySection";
import { Plus, Trash2, Save } from "lucide-react";

// Tipo comum para itens cadastráveis
interface CadastroItem {
  id: string;
  name: string;
  descricao?: string;
}

interface TipoParada extends CadastroItem {
  categoria: string;
}

interface Line {
  id: string;
  name: string;
  nominalCapacity: number;
  standardSetupTime: number;
}

interface Shift {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
}

interface TruckType {
  id: string;
  name: string;
  capacity: number;
}

export default function Cadastros() {
  const { toast } = useToast();

  // Estado para as linhas de produção
  const [productionLines, setProductionLines] = useState<Line[]>([
    { id: "1", name: "Linha 1", nominalCapacity: 120, standardSetupTime: 30 },
    { id: "2", name: "Linha 2", nominalCapacity: 150, standardSetupTime: 25 },
    { id: "3", name: "Embalagem", nominalCapacity: 200, standardSetupTime: 15 }
  ]);
  
  // Estado para os turnos
  const [shifts, setShifts] = useState<Shift[]>([
    { id: "1", name: "Manhã", startTime: "07:00", endTime: "15:00" },
    { id: "2", name: "Tarde", startTime: "15:00", endTime: "23:00" },
    { id: "3", name: "Noite", startTime: "23:00", endTime: "07:00" }
  ]);
  
  // Estado para os tipos de caminhão
  const [truckTypes, setTruckTypes] = useState<TruckType[]>([
    { id: '1', name: 'Carreta', capacity: 30000 },
    { id: '2', name: 'Truck Sider', capacity: 14000 },
    { id: '3', name: 'Truck Baú', capacity: 12000 },
    { id: '4', name: 'VUC', capacity: 3500 },
    { id: '5', name: '3/4', capacity: 4000 }
  ]);
  
  // Estado para os motivos de parada
  const [stopReasons, setStopReasons] = useState<TipoParada[]>([
    { id: "1", name: "Falta de matéria-prima", categoria: "Material" },
    { id: "2", name: "Manutenção corretiva", categoria: "Equipamento" },
    { id: "3", name: "Falta de operador", categoria: "Pessoal" },
    { id: "4", name: "Preparação de máquina", categoria: "Setup" },
    { id: "5", name: "Limpeza", categoria: "Qualidade" }
  ]);

  // Novos itens que serão adicionados
  const [newLine, setNewLine] = useState<Omit<Line, "id">>({ name: "", nominalCapacity: 100, standardSetupTime: 20 });
  const [newShift, setNewShift] = useState<Omit<Shift, "id">>({ name: "", startTime: "", endTime: "" });
  const [newTruckType, setNewTruckType] = useState<Omit<TruckType, "id">>({ name: "", capacity: 0 });
  const [newStopReason, setNewStopReason] = useState<Omit<TipoParada, "id">>({ name: "", categoria: "Material" });
  
  // Estado para o tipo de unidade
  const [unitType, setUnitType] = useState<"unidades" | "kg">("unidades");

  // Funções para adicionar novos itens
  const addLine = () => {
    if (!newLine.name) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "O nome da linha é obrigatório"
      });
      return;
    }
    
    const id = (productionLines.length + 1).toString();
    setProductionLines([...productionLines, { id, ...newLine }]);
    setNewLine({ name: "", nominalCapacity: 100, standardSetupTime: 20 });
    
    toast({
      title: "Linha cadastrada",
      description: "Nova linha de produção cadastrada com sucesso"
    });
  };
  
  const addShift = () => {
    if (!newShift.name || !newShift.startTime || !newShift.endTime) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Todos os campos do turno são obrigatórios"
      });
      return;
    }
    
    const id = (shifts.length + 1).toString();
    setShifts([...shifts, { id, ...newShift }]);
    setNewShift({ name: "", startTime: "", endTime: "" });
    
    toast({
      title: "Turno cadastrado",
      description: "Novo turno cadastrado com sucesso"
    });
  };
  
  const addTruckType = () => {
    if (!newTruckType.name || newTruckType.capacity <= 0) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Nome e capacidade são obrigatórios para o veículo"
      });
      return;
    }
    
    const id = (truckTypes.length + 1).toString();
    setTruckTypes([...truckTypes, { id, ...newTruckType }]);
    setNewTruckType({ name: "", capacity: 0 });
    
    toast({
      title: "Veículo cadastrado",
      description: "Novo tipo de veículo cadastrado com sucesso"
    });
  };
  
  const addStopReason = () => {
    if (!newStopReason.name || !newStopReason.categoria) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Nome e categoria são obrigatórios para o motivo de parada"
      });
      return;
    }
    
    const id = (stopReasons.length + 1).toString();
    setStopReasons([...stopReasons, { id, ...newStopReason }]);
    setNewStopReason({ name: "", categoria: "Material" });
    
    toast({
      title: "Motivo cadastrado",
      description: "Novo motivo de parada cadastrado com sucesso"
    });
  };

  // Funções para remover itens
  const removeLine = (id: string) => {
    setProductionLines(productionLines.filter(line => line.id !== id));
    toast({
      title: "Linha removida",
      description: "Linha de produção removida com sucesso"
    });
  };
  
  const removeShift = (id: string) => {
    setShifts(shifts.filter(shift => shift.id !== id));
    toast({
      title: "Turno removido",
      description: "Turno removido com sucesso"
    });
  };
  
  const removeTruckType = (id: string) => {
    setTruckTypes(truckTypes.filter(type => type.id !== id));
    toast({
      title: "Veículo removido",
      description: "Tipo de veículo removido com sucesso"
    });
  };
  
  const removeStopReason = (id: string) => {
    setStopReasons(stopReasons.filter(reason => reason.id !== id));
    toast({
      title: "Motivo removido",
      description: "Motivo de parada removido com sucesso"
    });
  };

  const saveAllData = () => {
    // Aqui normalmente enviaríamos os dados para uma API
    // No contexto dessa demonstração, apenas emitimos um toast
    toast({
      title: "Dados salvos",
      description: "Todos os cadastros foram salvos com sucesso"
    });
  };

  const exportToCsv = () => {
    // Implementação simplificada de exportação CSV
    // Em um caso real, seria necessário construir o CSV apropriadamente
    const allData = {
      productionLines,
      shifts,
      truckTypes,
      stopReasons
    };
    
    const jsonString = JSON.stringify(allData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = "cadastros.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Exportação concluída",
      description: "Dados exportados com sucesso"
    });
  };

  return (
    <AppLayout title="Cadastros">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Gerenciamento de Cadastros</h1>
          <div className="flex space-x-2">
            <Button onClick={saveAllData} className="flex items-center gap-2">
              <Save size={16} />
              Salvar Todos os Dados
            </Button>
            <Button onClick={exportToCsv} variant="outline" className="flex items-center gap-2">
              Exportar CSV
            </Button>
          </div>
        </div>

        <Tabs defaultValue="linhas">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl">
            <TabsTrigger value="linhas">Linhas/Locais</TabsTrigger>
            <TabsTrigger value="turnos">Turnos</TabsTrigger>
            <TabsTrigger value="veiculos">Tipos de Veículo</TabsTrigger>
            <TabsTrigger value="paradas">Motivos de Parada</TabsTrigger>
          </TabsList>

          <TabsContent value="linhas" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Cadastro de Linhas/Locais de Produção</CardTitle>
                <CardDescription>
                  Gerencie as linhas de produção, áreas e locais da empresa
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="new-line-name">Nome da Linha/Local</Label>
                      <Input
                        id="new-line-name"
                        placeholder="Ex: Linha 1, Setor B"
                        value={newLine.name}
                        onChange={e => setNewLine({...newLine, name: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="new-line-capacity">Capacidade Nominal</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="new-line-capacity"
                          type="number"
                          min={1}
                          value={newLine.nominalCapacity}
                          onChange={e => setNewLine({...newLine, nominalCapacity: Number(e.target.value)})}
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
                    </div>
                    
                    <div>
                      <Label htmlFor="new-line-setup">Tempo Padrão de Setup (min)</Label>
                      <Input
                        id="new-line-setup"
                        type="number"
                        min={1}
                        value={newLine.standardSetupTime}
                        onChange={e => setNewLine({...newLine, standardSetupTime: Number(e.target.value)})}
                      />
                    </div>
                  </div>
                  
                  <Button
                    onClick={addLine}
                    className="w-full md:w-auto flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Adicionar Linha/Local
                  </Button>
                  
                  {productionLines.length > 0 && (
                    <div className="mt-4 border rounded-md overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Capacidade</TableHead>
                            <TableHead>Setup (min)</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {productionLines.map(line => (
                            <TableRow key={line.id}>
                              <TableCell>{line.name}</TableCell>
                              <TableCell>{line.nominalCapacity} {unitType}/h</TableCell>
                              <TableCell>{line.standardSetupTime}</TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeLine(line.id)}
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="turnos" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Cadastro de Turnos</CardTitle>
                <CardDescription>
                  Gerencie os turnos de trabalho da empresa
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="new-shift-name">Nome do Turno</Label>
                      <Input
                        id="new-shift-name"
                        placeholder="Ex: Manhã, Tarde, Noite"
                        value={newShift.name}
                        onChange={e => setNewShift({...newShift, name: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="new-shift-start">Hora Inicial</Label>
                      <Input
                        id="new-shift-start"
                        type="time"
                        value={newShift.startTime}
                        onChange={e => setNewShift({...newShift, startTime: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="new-shift-end">Hora Final</Label>
                      <Input
                        id="new-shift-end"
                        type="time"
                        value={newShift.endTime}
                        onChange={e => setNewShift({...newShift, endTime: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <Button
                    onClick={addShift}
                    className="w-full md:w-auto flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Adicionar Turno
                  </Button>
                  
                  {shifts.length > 0 && (
                    <div className="mt-4 border rounded-md overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Início</TableHead>
                            <TableHead>Fim</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {shifts.map(shift => (
                            <TableRow key={shift.id}>
                              <TableCell>{shift.name}</TableCell>
                              <TableCell>{shift.startTime}</TableCell>
                              <TableCell>{shift.endTime}</TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeShift(shift.id)}
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="veiculos" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Cadastro de Tipos de Veículo</CardTitle>
                <CardDescription>
                  Gerencie os tipos de veículo para movimentação de carga
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="new-truck-name">Nome do Tipo de Veículo</Label>
                      <Input
                        id="new-truck-name"
                        placeholder="Ex: Carreta, Truck, VUC"
                        value={newTruckType.name}
                        onChange={e => setNewTruckType({...newTruckType, name: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="new-truck-capacity">Capacidade (kg)</Label>
                      <Input
                        id="new-truck-capacity"
                        type="number"
                        min={1}
                        value={newTruckType.capacity}
                        onChange={e => setNewTruckType({...newTruckType, capacity: Number(e.target.value)})}
                      />
                    </div>
                  </div>
                  
                  <Button
                    onClick={addTruckType}
                    className="w-full md:w-auto flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Adicionar Tipo de Veículo
                  </Button>
                  
                  {truckTypes.length > 0 && (
                    <div className="mt-4 border rounded-md overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Capacidade (kg)</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {truckTypes.map(type => (
                            <TableRow key={type.id}>
                              <TableCell>{type.name}</TableCell>
                              <TableCell>{type.capacity.toLocaleString()} kg</TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeTruckType(type.id)}
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="paradas" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Cadastro de Motivos de Parada</CardTitle>
                <CardDescription>
                  Gerencie os motivos de parada da produção
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="new-stop-name">Motivo da Parada</Label>
                      <Input
                        id="new-stop-name"
                        placeholder="Ex: Manutenção, Falta de material"
                        value={newStopReason.name}
                        onChange={e => setNewStopReason({...newStopReason, name: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="new-stop-category">Categoria</Label>
                      <select
                        id="new-stop-category"
                        value={newStopReason.categoria}
                        onChange={e => setNewStopReason({...newStopReason, categoria: e.target.value})}
                        className="w-full rounded-md border border-gray-300 bg-white h-10 px-3"
                      >
                        <option value="Material">Material</option>
                        <option value="Equipamento">Equipamento</option>
                        <option value="Pessoal">Pessoal</option>
                        <option value="Setup">Setup</option>
                        <option value="Qualidade">Qualidade</option>
                        <option value="Outros">Outros</option>
                      </select>
                    </div>
                  </div>
                  
                  <Button
                    onClick={addStopReason}
                    className="w-full md:w-auto flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Adicionar Motivo de Parada
                  </Button>
                  
                  {stopReasons.length > 0 && (
                    <div className="mt-4 border rounded-md overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Motivo</TableHead>
                            <TableHead>Categoria</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {stopReasons.map(reason => (
                            <TableRow key={reason.id}>
                              <TableCell>{reason.name}</TableCell>
                              <TableCell>{reason.categoria}</TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeStopReason(reason.id)}
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
