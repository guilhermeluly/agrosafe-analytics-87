import React, { useState } from "react";
import AppLayout from "../components/AppLayout";
import { useEmpresa } from "../context/EmpresaContext";
import LogoUpload from "../components/LogoUpload";
import { PLANOS } from "../config/planos";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

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

const resetCompany = (companyId: string) => {
  console.log(`Reset company with ID: ${companyId}`);
  // In a real implementation, this would reset the company data
};

export default function Admin() {
  const [pwd, setPwd] = useState("");
  const { empresa, setEmpresa } = useEmpresa();
  const { toast } = useToast();
  
  const [lines, setLines] = useState<Line[]>([
    { id: "1", name: "Linha 1", nominalCapacity: 100, standardSetupTime: 15 },
    { id: "2", name: "Linha 2", nominalCapacity: 150, standardSetupTime: 20 },
    { id: "3", name: "Linha 3", nominalCapacity: 120, standardSetupTime: 18 }
  ]);
  
  const [shifts, setShifts] = useState<Shift[]>([
    { id: "1", name: "Manhã", startTime: "06:00", endTime: "14:00" },
    { id: "2", name: "Tarde", startTime: "14:00", endTime: "22:00" },
    { id: "3", name: "Noite", startTime: "22:00", endTime: "06:00" }
  ]);
  
  const [newLine, setNewLine] = useState<Omit<Line, "id">>({ 
    name: "", nominalCapacity: 0, standardSetupTime: 0 
  });
  
  const [newShift, setNewShift] = useState<Omit<Shift, "id">>({ 
    name: "", startTime: "", endTime: "" 
  });

  function handlePlano(e: React.ChangeEvent<HTMLSelectElement>) {
    setEmpresa({ ...empresa, planoId: e.target.value });
  }

  function handleOpcionalAgrosafe(e: React.ChangeEvent<HTMLInputElement>) {
    setEmpresa({ ...empresa, exibeLogoAgroSafe: !!e.target.checked });
  }
  
  const handleAddLine = () => {
    if (!newLine.name || newLine.nominalCapacity <= 0) {
      toast({
        title: "Dados incompletos",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    
    const newId = (lines.length + 1).toString();
    setLines([...lines, { ...newLine, id: newId }]);
    setNewLine({ name: "", nominalCapacity: 0, standardSetupTime: 0 });
    
    toast({
      title: "Linha adicionada",
      description: "Nova linha adicionada com sucesso."
    });
  };
  
  const handleAddShift = () => {
    if (!newShift.name || !newShift.startTime || !newShift.endTime) {
      toast({
        title: "Dados incompletos",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    
    const newId = (shifts.length + 1).toString();
    setShifts([...shifts, { ...newShift, id: newId }]);
    setNewShift({ name: "", startTime: "", endTime: "" });
    
    toast({
      title: "Turno adicionado",
      description: "Novo turno adicionado com sucesso."
    });
  };
  
  const handleDeleteLine = (id: string) => {
    setLines(lines.filter(line => line.id !== id));
    toast({
      title: "Linha removida",
      description: "Linha removida com sucesso."
    });
  };
  
  const handleDeleteShift = (id: string) => {
    setShifts(shifts.filter(shift => shift.id !== id));
    toast({
      title: "Turno removido",
      description: "Turno removido com sucesso."
    });
  };

  return (
    <AppLayout title="Admin">
      <Tabs defaultValue="company">
        <TabsList className="mb-4">
          <TabsTrigger value="company">Empresa</TabsTrigger>
          <TabsTrigger value="lines">Linhas de Produção</TabsTrigger>
          <TabsTrigger value="shifts">Turnos</TabsTrigger>
          <TabsTrigger value="reset">Reset Master</TabsTrigger>
        </TabsList>
        
        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>Configurações da Empresa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <label className="block font-semibold mb-2">Selecione o Plano da Empresa:</label>
                <select value={empresa.planoId} onChange={handlePlano} className="w-full border p-2 rounded">
                  {PLANOS.map(p =>
                    <option key={p.id} value={p.id}>{p.nome}</option>
                  )}
                </select>
              </div>
              
              <div className="mb-6">
                <label className="block font-semibold mb-2">Unidade de Capacidade:</label>
                <select 
                  value={empresa.unidadeCapacidade} 
                  onChange={e => setEmpresa({ ...empresa, unidadeCapacidade: e.target.value as "unidades/h" | "kg/h" })} 
                  className="w-full border p-2 rounded"
                >
                  <option value="unidades/h">Unidades por hora (un/h)</option>
                  <option value="kg/h">Quilogramas por hora (kg/h)</option>
                </select>
              </div>
              
              <LogoUpload />
              
              {empresa.planoId === "completo" && (
                <div className="mt-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={empresa.exibeLogoAgroSafe}
                      onChange={handleOpcionalAgrosafe}
                      className="rounded"
                    />{" "}
                    Exibir logo da <b>AgroSafe</b> junto ao logo do cliente
                  </label>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="lines">
          <Card>
            <CardHeader>
              <CardTitle>Linhas de Produção</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-6">
                  {lines.map(line => (
                    <div key={line.id} className="flex items-center justify-between p-3 border rounded">
                      <div className="grid grid-cols-3 gap-4 flex-1">
                        <div>
                          <span className="text-sm font-medium">Nome:</span>
                          <div>{line.name}</div>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Capacidade Nominal:</span>
                          <div>{line.nominalCapacity} un/hora</div>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Tempo de Setup:</span>
                          <div>{line.standardSetupTime} minutos</div>
                        </div>
                      </div>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteLine(line.id)}
                      >
                        Remover
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div className="pt-6 border-t">
                  <h3 className="text-lg font-medium mb-3">Adicionar Nova Linha</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="lineName">Nome da Linha</Label>
                      <Input
                        id="lineName"
                        value={newLine.name}
                        onChange={(e) => setNewLine({...newLine, name: e.target.value})}
                        placeholder="Ex: Linha 4"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="capacity">Capacidade Nominal (un/hora)</Label>
                      <Input
                        id="capacity"
                        type="number"
                        value={newLine.nominalCapacity || ""}
                        onChange={(e) => setNewLine({...newLine, nominalCapacity: Number(e.target.value)})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="setupTime">Tempo Padrão Setup (min)</Label>
                      <Input
                        id="setupTime"
                        type="number"
                        value={newLine.standardSetupTime || ""}
                        onChange={(e) => setNewLine({...newLine, standardSetupTime: Number(e.target.value)})}
                      />
                    </div>
                  </div>
                  <Button onClick={handleAddLine} className="mt-4">
                    Adicionar Linha
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="shifts">
          <Card>
            <CardHeader>
              <CardTitle>Turnos de Trabalho</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-6">
                  {shifts.map(shift => (
                    <div key={shift.id} className="flex items-center justify-between p-3 border rounded">
                      <div className="grid grid-cols-3 gap-4 flex-1">
                        <div>
                          <span className="text-sm font-medium">Nome:</span>
                          <div>{shift.name}</div>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Início:</span>
                          <div>{shift.startTime}</div>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Término:</span>
                          <div>{shift.endTime}</div>
                        </div>
                      </div>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteShift(shift.id)}
                      >
                        Remover
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div className="pt-6 border-t">
                  <h3 className="text-lg font-medium mb-3">Adicionar Novo Turno</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="shiftName">Nome do Turno</Label>
                      <Input
                        id="shiftName"
                        value={newShift.name}
                        onChange={(e) => setNewShift({...newShift, name: e.target.value})}
                        placeholder="Ex: Madrugada"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="startTime">Horário de Início</Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={newShift.startTime}
                        onChange={(e) => setNewShift({...newShift, startTime: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="endTime">Horário de Término</Label>
                      <Input
                        id="endTime"
                        type="time"
                        value={newShift.endTime}
                        onChange={(e) => setNewShift({...newShift, endTime: e.target.value})}
                      />
                    </div>
                  </div>
                  <Button onClick={handleAddShift} className="mt-4">
                    Adicionar Turno
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reset">
          <Card>
            <CardHeader>
              <CardTitle>Reset Master</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Esta seção é apenas para administradores master. 
                  Utilize com cautela, pois irá resetar dados da empresa.
                </p>
                <div className="flex gap-2">
                  <Input 
                    type="password" 
                    onChange={e => setPwd(e.target.value)} 
                    placeholder="Senha Master"
                  />
                  <Button
                    variant="destructive"
                    onClick={() => pwd === "052004236" && resetCompany("andrealan")}
                  >
                    Resetar Dados
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
