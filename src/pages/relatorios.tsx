
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineShiftFilter } from "@/components/filters/LineShiftFilter";
import AppLayout from "@/components/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ReportSettings } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BarChart2, Mail, Download, FileText, Calendar } from "lucide-react";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";

const mockLines = [
  { id: "linha1", name: "Linha 1" },
  { id: "linha2", name: "Linha 2" },
  { id: "linha3", name: "Linha 3" }
];

const mockShifts = [
  { id: "turno1", name: "Manhã" },
  { id: "turno2", name: "Tarde" },
  { id: "turno3", name: "Noite" }
];

const mockIndicators = [
  { id: "oee", name: "OEE", category: "productivity" },
  { id: "disponibilidade", name: "Disponibilidade", category: "productivity" },
  { id: "performance", name: "Performance", category: "productivity" },
  { id: "qualidade", name: "Qualidade", category: "productivity" },
  { id: "throughput", name: "Throughput", category: "productivity" },
  { id: "tempo_setup", name: "Tempo de Setup", category: "productivity" },
  { id: "tempo_parada", name: "Tempo de Parada", category: "stoppage" },
  { id: "motivos_parada", name: "Motivos de Parada", category: "stoppage" },
  { id: "logistica_tempo_carga", name: "Tempo de Carga", category: "logistics" },
  { id: "logistica_tempo_descarga", name: "Tempo de Descarga", category: "logistics" }
];

export default function Relatorios() {
  const { toast } = useToast();
  const [selectedLine, setSelectedLine] = useState("all");
  const [selectedShift, setSelectedShift] = useState("all");
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>([]);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  
  // Schedule state
  const [scheduleSettings, setScheduleSettings] = useState<ReportSettings>({
    frequency: "diario",
    hour: "08:00",
    method: "email",
    recipients: [],
    filters: { location: selectedLine, shift: selectedShift },
    reportSections: []
  });

  // Email input state
  const [emailInput, setEmailInput] = useState("");

  // Sections to include in report
  const reportSections = [
    { id: "production", name: "Produção" },
    { id: "stops", name: "Paradas" },
    { id: "setup", name: "Setup" },
    { id: "logistics", name: "Logística" }
  ];
  
  const toggleIndicator = (id: string) => {
    setSelectedIndicators(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id) 
        : [...prev, id]
    );
  };

  const toggleReportSection = (id: string) => {
    setScheduleSettings(prev => {
      const currentSections = prev.reportSections || [];
      const newSections = currentSections.includes(id)
        ? currentSections.filter(s => s !== id)
        : [...currentSections, id];
      
      return {
        ...prev,
        reportSections: newSections
      };
    });
  };
  
  const handleAddEmail = () => {
    if (emailInput && !scheduleSettings.recipients.includes(emailInput)) {
      setScheduleSettings({
        ...scheduleSettings,
        recipients: [...scheduleSettings.recipients, emailInput]
      });
      setEmailInput("");
    }
  };
  
  const handleRemoveEmail = (email: string) => {
    setScheduleSettings({
      ...scheduleSettings,
      recipients: scheduleSettings.recipients.filter(r => r !== email)
    });
  };
  
  const handleScheduleSave = () => {
    toast({
      title: "Agendamento salvo",
      description: "O relatório será enviado conforme programação definida."
    });
    setScheduleOpen(false);
  };
  
  const downloadReport = () => {
    if (selectedIndicators.length === 0) {
      toast({
        title: "Selecione indicadores",
        description: "Por favor, selecione pelo menos um indicador para gerar o relatório.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Download iniciado",
      description: "Seu relatório está sendo gerado e será baixado em breve."
    });
  };
  
  const previewReport = () => {
    if (selectedIndicators.length === 0) {
      toast({
        title: "Selecione indicadores",
        description: "Por favor, selecione pelo menos um indicador para visualizar o relatório.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Visualização gerada",
      description: "Visualização do relatório sendo carregada."
    });
  };
  
  return (
    <AppLayout title="Relatórios">
      <div className="container mx-auto py-6">
        <Tabs defaultValue="create">
          <TabsList className="mb-6">
            <TabsTrigger value="create">Gerar Relatório</TabsTrigger>
            <TabsTrigger value="scheduled">Relatórios Agendados</TabsTrigger>
          </TabsList>
          
          <TabsContent value="create">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-1 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Filtros do Relatório</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="date-range" className="mb-2 block font-medium">Período</Label>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <DateRangePicker 
                          value={dateRange}
                          onChange={setDateRange}
                          className="w-full"
                        />
                      </div>
                    </div>
                    
                    <LineShiftFilter
                      selectedLine={selectedLine}
                      selectedShift={selectedShift}
                      onLineChange={setSelectedLine}
                      onShiftChange={setSelectedShift}
                      allLines={mockLines}
                      allShifts={mockShifts}
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Indicadores</CardTitle>
                    <CardDescription>Selecione os indicadores para o relatório</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3">
                      <h3 className="text-sm font-medium text-gray-500 mt-2">Produtividade</h3>
                      {mockIndicators.filter(i => i.category === "productivity").map(indicator => (
                        <div key={indicator.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`indicator-${indicator.id}`}
                            checked={selectedIndicators.includes(indicator.id)}
                            onCheckedChange={() => toggleIndicator(indicator.id)}
                          />
                          <Label htmlFor={`indicator-${indicator.id}`}>{indicator.name}</Label>
                        </div>
                      ))}
                      
                      <h3 className="text-sm font-medium text-gray-500 mt-4">Paradas</h3>
                      {mockIndicators.filter(i => i.category === "stoppage").map(indicator => (
                        <div key={indicator.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`indicator-${indicator.id}`}
                            checked={selectedIndicators.includes(indicator.id)}
                            onCheckedChange={() => toggleIndicator(indicator.id)}
                          />
                          <Label htmlFor={`indicator-${indicator.id}`}>{indicator.name}</Label>
                        </div>
                      ))}
                      
                      <h3 className="text-sm font-medium text-gray-500 mt-4">Logística</h3>
                      {mockIndicators.filter(i => i.category === "logistics").map(indicator => (
                        <div key={indicator.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`indicator-${indicator.id}`}
                            checked={selectedIndicators.includes(indicator.id)}
                            onCheckedChange={() => toggleIndicator(indicator.id)}
                          />
                          <Label htmlFor={`indicator-${indicator.id}`}>{indicator.name}</Label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <div className="flex flex-col gap-3">
                  <Button onClick={previewReport} className="w-full gap-2">
                    <FileText className="h-4 w-4" />
                    Visualizar
                  </Button>
                  <Button onClick={downloadReport} className="w-full gap-2">
                    <Download className="h-4 w-4" />
                    Baixar Relatório
                  </Button>
                  <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full gap-2">
                        <Mail className="h-4 w-4" />
                        Agendar Envio
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Agendar Envio de Relatório</DialogTitle>
                        <DialogDescription>
                          Configure a frequência e métodos de envio para o relatório.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label>Frequência</Label>
                          <Select 
                            value={scheduleSettings.frequency} 
                            onValueChange={(val) => setScheduleSettings({
                              ...scheduleSettings, 
                              frequency: val as "diario"|"semanal"|"mensal"|"intervalo"
                            })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a frequência" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="diario">Diário</SelectItem>
                              <SelectItem value="semanal">Semanal</SelectItem>
                              <SelectItem value="mensal">Mensal</SelectItem>
                              <SelectItem value="intervalo">Intervalo personalizado</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="grid gap-2">
                          <Label>Horário de envio</Label>
                          <Input 
                            type="time"
                            value={scheduleSettings.hour}
                            onChange={(e) => setScheduleSettings({
                              ...scheduleSettings, 
                              hour: e.target.value
                            })}
                          />
                        </div>
                        
                        <div className="grid gap-2">
                          <Label>Seções a incluir no relatório</Label>
                          <div className="space-y-2 border rounded-md p-3">
                            {reportSections.map(section => (
                              <div key={section.id} className="flex items-center space-x-2">
                                <Checkbox 
                                  id={`section-${section.id}`}
                                  checked={(scheduleSettings.reportSections || []).includes(section.id)}
                                  onCheckedChange={() => toggleReportSection(section.id)}
                                />
                                <Label htmlFor={`section-${section.id}`}>{section.name}</Label>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="grid gap-2">
                          <Label>Método de envio</Label>
                          <Select 
                            value={scheduleSettings.method} 
                            onValueChange={(val) => setScheduleSettings({
                              ...scheduleSettings, 
                              method: val as "email"|"telegram"
                            })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o método de envio" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="telegram">Telegram</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {scheduleSettings.method === "email" && (
                          <div className="grid gap-2">
                            <Label>Destinatários</Label>
                            <div className="flex gap-2">
                              <Input 
                                type="email" 
                                placeholder="Email"
                                value={emailInput}
                                onChange={(e) => setEmailInput(e.target.value)}
                              />
                              <Button type="button" onClick={handleAddEmail} className="shrink-0">
                                Adicionar
                              </Button>
                            </div>
                            <div className="mt-2">
                              {scheduleSettings.recipients.map(email => (
                                <div key={email} className="flex items-center justify-between py-1 px-3 bg-muted rounded mb-1">
                                  <span className="text-sm">{email}</span>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => handleRemoveEmail(email)}
                                  >
                                    &times;
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {scheduleSettings.method === "telegram" && (
                          <div className="grid gap-2">
                            <Label>Chat ID ou Username do Telegram</Label>
                            <Input placeholder="@username ou chat_id" />
                          </div>
                        )}
                        
                        <div className="grid gap-2">
                          <div className="flex items-center space-x-2">
                            <Switch id="ai-summary" />
                            <Label htmlFor="ai-summary">Incluir resumo por IA</Label>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            A IA analisará os dados e incluirá insights relevantes no corpo do email.
                          </p>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setScheduleOpen(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={handleScheduleSave}>
                          Salvar agendamento
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <Card className="h-full">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Visualização do Relatório</CardTitle>
                    <BarChart2 className="h-5 w-5 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    {selectedIndicators.length > 0 ? (
                      <div className="space-y-8">
                        {selectedIndicators.map(id => {
                          const indicator = mockIndicators.find(i => i.id === id);
                          return (
                            <div key={id} className="border rounded-lg p-6">
                              <h3 className="font-medium text-lg mb-4">{indicator?.name}</h3>
                              <div className="h-64 bg-muted rounded flex items-center justify-center">
                                <p className="text-muted-foreground">Visualização do gráfico: {indicator?.name}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="h-96 flex items-center justify-center">
                        <div className="text-center">
                          <BarChart2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                          <p className="text-muted-foreground">
                            Selecione indicadores para visualizar o relatório
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="scheduled">
            <Card>
              <CardHeader>
                <CardTitle>Relatórios Agendados</CardTitle>
                <CardDescription>
                  Gerencie seus relatórios programados para envio automático.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/40 rounded-lg p-8 text-center">
                  <p className="text-muted-foreground">
                    Nenhum relatório agendado encontrado.
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => {
                      setScheduleOpen(true);
                    }}
                  >
                    Agendar novo relatório
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
