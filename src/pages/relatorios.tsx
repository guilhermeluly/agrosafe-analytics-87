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
import { 
  BarChart4, 
  Calendar, 
  Download, 
  FileText, 
  Mail, 
  Tv, 
  Clock,
  Filter,
  BarChart3
} from "lucide-react";

// Mock data for the reports
const REPORT_PERIODS = [
  { id: "daily", name: "Diário" },
  { id: "weekly", name: "Semanal" },
  { id: "monthly", name: "Mensal" },
  { id: "custom", name: "Período Personalizado" }
];

// Mock data for production lines and shifts
const PRODUCTION_LINES = [
  { id: "1", name: "Linha de Produção 1" },
  { id: "2", name: "Linha de Produção 2" },
  { id: "3", name: "Linha de Produção 3" },
  { id: "4", name: "Linha de Ensaque Umbra" },
  { id: "5", name: "Peletizadora Linha 1" }
];

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

export default function Relatorios() {
  const { empresa } = useEmpresa();
  const { user } = useUser();
  const { toast } = useToast();
  const isMasterOrAdmin = user.role === "master_admin" || user.role === "admin";
  
  const [selectedReportType, setSelectedReportType] = useState("oee");
  const [selectedPeriod, setSelectedPeriod] = useState("daily");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedLine, setSelectedLine] = useState("");
  const [selectedShift, setSelectedShift] = useState("");
  
  const handleGenerateReport = () => {
    toast({
      title: "Gerando relatório",
      description: "Seu relatório está sendo gerado, aguarde um momento."
    });
    
    // Simulate report generation
    setTimeout(() => {
      toast({
        title: "Relatório gerado",
        description: "O relatório foi gerado com sucesso."
      });
    }, 1500);
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
  
  const handleScheduleReport = () => {
    toast({
      title: "Agendamento salvo",
      description: "O agendamento do relatório foi salvo com sucesso."
    });
  };
  
  const handlePresentationMode = () => {
    toast({
      title: "Modo apresentação",
      description: "O modo apresentação será aberto em uma nova janela."
    });
  };
  
  return (
    <AppLayout title="Relatórios">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Relatórios de Performance</h1>
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
                        <SelectItem key={type.id} value={type.id} className="flex items-center">
                          <div className="flex items-center">
                            <type.icon className="mr-2" size={16} />
                            <span>{type.name}</span>
                          </div>
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
                  <Label htmlFor="production-line">Linha de Produção</Label>
                  <Select 
                    value={selectedLine}
                    onValueChange={setSelectedLine}
                  >
                    <SelectTrigger id="production-line">
                      <SelectValue placeholder="Todas as linhas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as linhas</SelectItem>
                      {PRODUCTION_LINES.map(line => (
                        <SelectItem key={line.id} value={line.id}>
                          {line.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="shift">Turno</Label>
                  <Select 
                    value={selectedShift}
                    onValueChange={setSelectedShift}
                  >
                    <SelectTrigger id="shift">
                      <SelectValue placeholder="Todos os turnos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os turnos</SelectItem>
                      {SHIFTS.map(shift => (
                        <SelectItem key={shift.id} value={shift.id}>
                          {shift.name}
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
                  {selectedLine && `Linha: ${PRODUCTION_LINES.find(l => l.id === selectedLine)?.name}`}
                  {selectedShift && selectedLine && " | "}
                  {selectedShift && `Turno: ${SHIFTS.find(s => s.id === selectedShift)?.name}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center bg-gray-100 rounded-md mb-6">
                  <div className="text-center text-muted-foreground">
                    <BarChart4 className="mx-auto h-12 w-12 mb-2" />
                    <p>Selecione os filtros e clique em "Gerar Relatório" para visualizar</p>
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
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="schedule-type">Tipo de Relatório</Label>
                    <Select defaultValue="oee">
                      <SelectTrigger id="schedule-type">
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
                    <Label htmlFor="schedule-frequency">Frequência</Label>
                    <Select defaultValue="daily">
                      <SelectTrigger id="schedule-frequency">
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
                    <Label htmlFor="schedule-time">Horário de Envio</Label>
                    <Input
                      id="schedule-time"
                      type="time"
                      defaultValue="08:00"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="schedule-line">Linha de Produção</Label>
                    <Select defaultValue="">
                      <SelectTrigger id="schedule-line">
                        <SelectValue placeholder="Todas as linhas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all_lines">Todas as linhas</SelectItem>
                        {PRODUCTION_LINES.map(line => (
                          <SelectItem key={line.id} value={line.id}>
                            {line.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="schedule-method">Método de Envio</Label>
                    <Select defaultValue="email">
                      <SelectTrigger id="schedule-method">
                        <SelectValue placeholder="Selecione o método" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">E-mail</SelectItem>
                        <SelectItem value="telegram">Telegram</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="schedule-recipients">Destinatários (separados por vírgula)</Label>
                    <Input
                      id="schedule-recipients"
                      placeholder="email1@exemplo.com, email2@exemplo.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="schedule-format">Formato</Label>
                    <Select defaultValue="pdf">
                      <SelectTrigger id="schedule-format">
                        <SelectValue placeholder="Selecione o formato" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="both">Ambos (PDF e CSV)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button 
                    onClick={handleScheduleReport} 
                    className="w-full mt-8"
                  >
                    Salvar Agendamento
                  </Button>
                </div>
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
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="presentation-indicators">Indicadores</Label>
                      <Select defaultValue="all">
                        <SelectTrigger id="presentation-indicators">
                          <SelectValue placeholder="Selecione os indicadores" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos os indicadores</SelectItem>
                          <SelectItem value="oee">OEE e componentes</SelectItem>
                          <SelectItem value="production">Produção e metas</SelectItem>
                          <SelectItem value="downtime">Paradas e perdas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="presentation-interval">Intervalo de rotação (segundos)</Label>
                      <Input
                        id="presentation-interval"
                        type="number"
                        defaultValue="30"
                        min="10"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="presentation-filter">Filtrar por linha</Label>
                      <Select defaultValue="">
                        <SelectTrigger id="presentation-filter">
                          <SelectValue placeholder="Todas as linhas" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all_lines">Todas as linhas</SelectItem>
                          {PRODUCTION_LINES.map(line => (
                            <SelectItem key={line.id} value={line.id}>
                              {line.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex flex-col justify-center items-center bg-gray-100 rounded-md p-6">
                    <Tv className="h-16 w-16 mb-4 text-blue-500" />
                    <h3 className="text-lg font-medium mb-2">Modo Apresentação para TVs</h3>
                    <p className="text-sm text-muted-foreground text-center mb-4">
                      Exibe seus indicadores principais em rotação automática, ideal para monitores em áreas comuns.
                    </p>
                    <Button 
                      onClick={handlePresentationMode} 
                      className="w-full max-w-xs"
                    >
                      <Tv className="mr-2 h-4 w-4" />
                      Iniciar Modo Apresentação
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </AppLayout>
  );
}
