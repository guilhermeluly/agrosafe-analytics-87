
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useEmpresa } from "../context/EmpresaContext";
import { useUser } from "../context/UserContext";
import AppLayout from "../components/AppLayout";
import LogoDisplay from "../components/LogoDisplay";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  BarChart4, 
  Calendar, 
  Download, 
  FileText, 
  Mail, 
  Tv, 
  Clock,
  Filter,
  BarChart3,
  Plus,
  Trash2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LOCAL_COMBINATIONS } from "@/utils/combinations";

// Mock data for the reports
const REPORT_PERIODS = [
  { id: "daily", name: "Diário" },
  { id: "weekly", name: "Semanal" },
  { id: "monthly", name: "Mensal" },
  { id: "custom", name: "Período Personalizado" }
];

// Mock data for production lines and shifts
const PRODUCTION_LINES = LOCAL_COMBINATIONS.filter(combo => combo.id !== 'global')
  .map(combo => ({ id: combo.id, name: combo.name }));

const SHIFTS = [
  { id: "1", name: "Turno 1" },
  { id: "2", name: "Turno 2" },
  { id: "3", name: "Turno 3" },
  { id: "4", name: "Turno Comercial" }
];

const REPORT_TYPES = [
  { id: "oee", name: "OEE - Performance", icon: BarChart4 },
  { id: "production", name: "Produção e Perdas", icon: BarChart3 },
  { id: "downtime", name: "Análise de Paradas", icon: Clock },
  { id: "setup", name: "Tempos de Setup", icon: Clock }
];

// Mock chart data
const chartData = [
  { name: 'Jan', meta: 65, atual: 40 },
  { name: 'Fev', meta: 65, atual: 45 },
  { name: 'Mar', meta: 65, atual: 55 },
  { name: 'Abr', meta: 65, atual: 58 },
  { name: 'Mai', meta: 65, atual: 62 },
  { name: 'Jun', meta: 65, atual: 70 },
];

export default function Relatorios() {
  const { empresa } = useEmpresa();
  const { user } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMasterOrAdmin = user.role === "master_admin" || user.role === "admin";
  
  const [selectedReportType, setSelectedReportType] = useState("oee");
  const [selectedPeriod, setSelectedPeriod] = useState("daily");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedLine, setSelectedLine] = useState("");
  const [selectedShift, setSelectedShift] = useState("");
  const [schedules, setSchedules] = useState<any[]>([{ id: 1, email: "", frequency: "daily", type: "oee", time: "08:00" }]);
  
  const handleGenerateReport = () => {
    toast({
      title: "Relatório gerado",
      description: "O relatório foi gerado com sucesso."
    });
  };
  
  const handleExportReport = (format: string) => {
    toast({
      title: `Exportando para ${format.toUpperCase()}`,
      description: `O relatório está sendo exportado no formato ${format.toUpperCase()}.`
    });
  };
  
  const handleSendReport = () => {
    toast({
      title: "Envio de relatório",
      description: "Configure o envio automático na aba de agendamento."
    });
  };
  
  const handleAddSchedule = () => {
    setSchedules([
      ...schedules, 
      { 
        id: schedules.length + 1, 
        email: "", 
        frequency: "daily", 
        type: "oee", 
        time: "08:00" 
      }
    ]);
  };
  
  const handleRemoveSchedule = (id: number) => {
    setSchedules(schedules.filter(s => s.id !== id));
  };
  
  const handleScheduleReport = () => {
    toast({
      title: "Agendamentos salvos",
      description: `Foram salvos ${schedules.length} agendamentos de relatórios.`
    });
  };
  
  const handlePresentationMode = () => {
    navigate("/presentation-mode");
  };
  
  return (
    <AppLayout title="Relatórios">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Relatórios</h1>
        <LogoDisplay altura={32} />
      </div>
      
      <Tabs defaultValue="generate">
        <TabsList className="mb-6">
          <TabsTrigger value="generate">Gerar Relatório</TabsTrigger>
          <TabsTrigger value="schedule">Agendamento</TabsTrigger>
          {isMasterOrAdmin && (
            <TabsTrigger value="presentation">Modo Apresentação</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="generate">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Filtros</CardTitle>
                <CardDescription>
                  Selecione os filtros para o relatório
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="report-type">Tipo de Relatório</Label>
                  <Select 
                    defaultValue={selectedReportType}
                    onValueChange={setSelectedReportType}
                  >
                    <SelectTrigger id="report-type">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {REPORT_TYPES.map(type => (
                        <SelectItem key={type.id} value={type.id} className="flex items-center gap-2">
                          <type.icon className="h-4 w-4" />
                          <span>{type.name}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="report-period">Período</Label>
                  <Select 
                    defaultValue={selectedPeriod}
                    onValueChange={setSelectedPeriod}
                  >
                    <SelectTrigger id="report-period">
                      <SelectValue placeholder="Selecione o período" />
                    </SelectTrigger>
                    <SelectContent>
                      {REPORT_PERIODS.map(period => (
                        <SelectItem key={period.id} value={period.id}>
                          {period.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {selectedPeriod === "custom" && (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="start-date">Data Inicial</Label>
                      <Input 
                        id="start-date" 
                        type="date" 
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end-date">Data Final</Label>
                      <Input 
                        id="end-date" 
                        type="date" 
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="production-line">Linha/Turno</Label>
                  <Select 
                    value={selectedLine}
                    onValueChange={setSelectedLine}
                  >
                    <SelectTrigger id="production-line">
                      <SelectValue placeholder="Todas as linhas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as combinações</SelectItem>
                      {PRODUCTION_LINES.map(line => (
                        <SelectItem key={line.id} value={line.id}>
                          {line.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  onClick={handleGenerateReport} 
                  className="w-full mt-6"
                >
                  Gerar Relatório
                </Button>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>
                  {REPORT_TYPES.find(r => r.id === selectedReportType)?.name || "Relatório"} 
                  {selectedPeriod !== "custom" ? ` ${REPORT_PERIODS.find(p => p.id === selectedPeriod)?.name}` : ""}
                </CardTitle>
                <CardDescription>
                  {selectedLine && selectedLine !== 'all' && 
                    `Linha/Turno: ${PRODUCTION_LINES.find(l => l.id === selectedLine)?.name}`}
                  {selectedLine === 'all' && "Todas as combinações"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center bg-gray-50 rounded-md mb-6">
                  <div className="w-full h-full p-4">
                    {/* Simplified example chart - would be a real chart in production */}
                    <div className="h-full flex">
                      <div className="flex-1 grid place-items-center">
                        <div>
                          <div className="mb-4 text-center font-medium">OEE por Período</div>
                          <div className="h-56 w-full bg-blue-100 rounded-lg grid place-items-center">
                            <div className="text-5xl font-bold text-blue-700">87%</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 grid place-items-center">
                        <div>
                          <div className="mb-4 text-center font-medium">Comparação com Metas</div>
                          <div className="space-y-6">
                            <div>
                              <div className="flex justify-between text-sm">
                                <span>Disponibilidade</span>
                                <span className="font-medium">92%</span>
                              </div>
                              <div className="h-2 bg-gray-200 rounded-full mt-1">
                                <div className="h-2 bg-blue-600 rounded-full" style={{width: "92%"}}></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-sm">
                                <span>Performance</span>
                                <span className="font-medium">85%</span>
                              </div>
                              <div className="h-2 bg-gray-200 rounded-full mt-1">
                                <div className="h-2 bg-green-600 rounded-full" style={{width: "85%"}}></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-sm">
                                <span>Qualidade</span>
                                <span className="font-medium">96%</span>
                              </div>
                              <div className="h-2 bg-gray-200 rounded-full mt-1">
                                <div className="h-2 bg-purple-600 rounded-full" style={{width: "96%"}}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" onClick={() => handleExportReport('pdf')}>
                    <FileText className="mr-2 h-4 w-4" />
                    Exportar PDF
                  </Button>
                  <Button variant="outline" onClick={() => handleExportReport('csv')}>
                    <Download className="mr-2 h-4 w-4" />
                    Exportar CSV
                  </Button>
                  <Button variant="outline" onClick={handleSendReport}>
                    <Mail className="mr-2 h-4 w-4" />
                    Enviar por E-mail
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Agendar Envio de Relatórios</CardTitle>
              <CardDescription>
                Configure o envio automático de relatórios por e-mail ou Telegram
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[60vh] pr-4">
                <div className="space-y-6">
                  {schedules.map((schedule, index) => (
                    <div 
                      key={schedule.id} 
                      className="p-4 border rounded-md bg-gray-50 relative"
                    >
                      <div className="absolute top-2 right-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7"
                          onClick={() => handleRemoveSchedule(schedule.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                      
                      <div className="text-sm font-medium mb-4">
                        Agendamento #{index + 1}
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor={`schedule-type-${schedule.id}`}>Tipo de Relatório</Label>
                            <Select defaultValue={schedule.type}>
                              <SelectTrigger id={`schedule-type-${schedule.id}`}>
                                <SelectValue placeholder="Selecione o tipo" />
                              </SelectTrigger>
                              <SelectContent>
                                {REPORT_TYPES.map(type => (
                                  <SelectItem key={type.id} value={type.id}>
                                    {type.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor={`schedule-frequency-${schedule.id}`}>Frequência</Label>
                            <Select defaultValue={schedule.frequency}>
                              <SelectTrigger id={`schedule-frequency-${schedule.id}`}>
                                <SelectValue placeholder="Selecione a frequência" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="daily">Diário</SelectItem>
                                <SelectItem value="weekly">Semanal</SelectItem>
                                <SelectItem value="monthly">Mensal</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor={`schedule-time-${schedule.id}`}>Horário de Envio</Label>
                            <Input
                              id={`schedule-time-${schedule.id}`}
                              type="time"
                              defaultValue={schedule.time}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor={`schedule-method-${schedule.id}`}>Método de Envio</Label>
                            <Select defaultValue="email">
                              <SelectTrigger id={`schedule-method-${schedule.id}`}>
                                <SelectValue placeholder="Selecione o método" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="email">E-mail</SelectItem>
                                <SelectItem value="telegram">Telegram</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor={`schedule-recipients-${schedule.id}`}>Destinatários (separados por vírgula)</Label>
                            <Input
                              id={`schedule-recipients-${schedule.id}`}
                              placeholder="email1@exemplo.com, email2@exemplo.com"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor={`schedule-format-${schedule.id}`}>Formato</Label>
                            <Select defaultValue="pdf">
                              <SelectTrigger id={`schedule-format-${schedule.id}`}>
                                <SelectValue placeholder="Selecione o formato" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pdf">PDF</SelectItem>
                                <SelectItem value="csv">CSV</SelectItem>
                                <SelectItem value="both">Ambos (PDF e CSV)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              <div className="flex gap-4 mt-6">
                <Button 
                  onClick={handleAddSchedule}
                  variant="outline"
                  className="flex-1"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Agendamento
                </Button>
                
                <Button 
                  onClick={handleScheduleReport}
                  className="flex-1"
                >
                  Salvar Agendamentos
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {isMasterOrAdmin && (
          <TabsContent value="presentation">
            <Card>
              <CardHeader>
                <CardTitle>Modo Apresentação</CardTitle>
                <CardDescription>
                  Configure a apresentação automática de indicadores para telas e TVs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center p-8">
                  <Tv className="h-16 w-16 mx-auto mb-4 text-blue-500" />
                  <h3 className="text-lg font-medium mb-2">Modo Apresentação para TVs</h3>
                  <p className="text-sm text-muted-foreground text-center mb-6 max-w-md mx-auto">
                    Configure e exiba seus indicadores principais em rotação automática, 
                    ideal para monitores em áreas comuns ou salas de controle.
                  </p>
                  <Button 
                    onClick={handlePresentationMode} 
                    className="w-full max-w-xs"
                    size="lg"
                  >
                    <Tv className="mr-2 h-4 w-4" />
                    Configurar Modo Apresentação
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </AppLayout>
  );
}
