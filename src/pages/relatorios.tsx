
import React, { useState } from 'react';
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineShiftFilter } from '@/components/filters/LineShiftFilter';
import AppLayout from '@/components/AppLayout';
import { DateRange } from 'react-day-picker';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Bell, BarChart3, PieChart, LineChart, CircleSlash } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from "recharts";
import { Switch } from "@/components/ui/switch";
import { useEmpresa } from "@/context/EmpresaContext";

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'];

// Sample data for charts
const barData = [
  { name: 'Jan', meta: 65, atual: 40 },
  { name: 'Fev', meta: 65, atual: 45 },
  { name: 'Mar', meta: 65, atual: 55 },
  { name: 'Abr', meta: 65, atual: 58 },
  { name: 'Mai', meta: 65, atual: 62 },
  { name: 'Jun', meta: 65, atual: 70 },
];

const lineData = [
  { name: 'Seg', disponibilidade: 85, desempenho: 78, qualidade: 90, oee: 60 },
  { name: 'Ter', disponibilidade: 82, desempenho: 80, qualidade: 92, oee: 61 },
  { name: 'Qua', disponibilidade: 88, desempenho: 85, qualidade: 91, oee: 68 },
  { name: 'Qui', disponibilidade: 90, desempenho: 87, qualidade: 94, oee: 74 },
  { name: 'Sex', disponibilidade: 87, desempenho: 84, qualidade: 93, oee: 68 },
];

const pieData = [
  { name: 'Manutenção', value: 30 },
  { name: 'Setup', value: 20 },
  { name: 'Troca Turno', value: 15 },
  { name: 'Falta Material', value: 25 },
  { name: 'Reunião', value: 10 },
];

export default function Relatorios() {
  const { empresa } = useEmpresa();
  const isPremium = empresa.planoId === "completo" || empresa.planoId === "medio";
  
  const [selectedLine, setSelectedLine] = useState('all');
  const [selectedShift, setSelectedShift] = useState('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date()
  });
  const [activeChart, setActiveChart] = useState('oee');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [scheduleReport, setScheduleReport] = useState(false);
  const [scheduleFrequency, setScheduleFrequency] = useState('diario');
  const [scheduleEmail, setScheduleEmail] = useState('');
  
  // Example data - in a real app, this would come from your backend
  const allLines = [
    { id: 'linha-1', name: 'Linha 1' },
    { id: 'linha-2', name: 'Linha 2' },
    { id: 'linha-3', name: 'Linha 3' },
  ];
  
  const allShifts = [
    { id: 'turno-1', name: 'Manhã' },
    { id: 'turno-2', name: 'Tarde' },
    { id: 'turno-3', name: 'Noite' },
  ];

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
  };

  return (
    <AppLayout title="Relatórios">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Relatórios e Análises</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filtros e Opções - Coluna Esquerda */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Filtros do Relatório</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <DateRangePicker 
                  className="w-full"
                  value={dateRange}
                  onChange={handleDateRangeChange}
                />
                <LineShiftFilter
                  selectedLine={selectedLine}
                  selectedShift={selectedShift}
                  onLineChange={setSelectedLine}
                  onShiftChange={setSelectedShift}
                  allLines={allLines}
                  allShifts={allShifts}
                />
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="auto-refresh" checked={autoRefresh} onCheckedChange={setAutoRefresh} />
                    <label htmlFor="auto-refresh" className="text-sm font-medium">
                      Auto Refresh (30s)
                    </label>
                  </div>
                  <Button size="sm" variant="outline" className="text-xs">
                    Atualizar
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Agendamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch id="schedule" checked={scheduleReport} onCheckedChange={setScheduleReport} />
                  <label htmlFor="schedule" className="text-sm font-medium">
                    Agendar Relatório
                  </label>
                </div>
                
                {scheduleReport && (
                  <div className="space-y-4 pt-2">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Frequência</label>
                      <Select value={scheduleFrequency} onValueChange={setScheduleFrequency}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecionar frequência" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="diario">Diário</SelectItem>
                          <SelectItem value="semanal">Semanal</SelectItem>
                          <SelectItem value="mensal">Mensal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-1 block">Email para envio</label>
                      <input 
                        type="email" 
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder="seu@email.com"
                        value={scheduleEmail}
                        onChange={(e) => setScheduleEmail(e.target.value)}
                      />
                    </div>
                    
                    <Button className="w-full bg-purple-600 hover:bg-purple-700">
                      <Bell className="w-4 h-4 mr-2" /> Agendar Relatório
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Gráficos e Resultados - Coluna Direita */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="shadow-md">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Visualização de Dados</CardTitle>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">Exportar PDF</Button>
                    <Button variant="outline" size="sm">Exportar CSV</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs value={activeChart} onValueChange={setActiveChart} className="space-y-4">
                  <TabsList className="bg-gray-100 p-1">
                    <TabsTrigger value="oee" className="flex items-center">
                      <BarChart3 className="h-4 w-4 mr-2" /> OEE Geral
                    </TabsTrigger>
                    <TabsTrigger value="componentes" className="flex items-center">
                      <LineChart className="h-4 w-4 mr-2" /> Componentes OEE
                    </TabsTrigger>
                    <TabsTrigger value="paradas" className="flex items-center">
                      <PieChart className="h-4 w-4 mr-2" /> Análise de Paradas
                    </TabsTrigger>
                    <TabsTrigger value="rejeitos" className="flex items-center">
                      <CircleSlash className="h-4 w-4 mr-2" /> Rejeitos
                    </TabsTrigger>
                  </TabsList>
                  
                  <div className="p-4 border rounded-md bg-white h-[400px]">
                    <TabsContent value="oee" className="h-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar name="Meta OEE (%)" dataKey="meta" fill="#8884d8" />
                          <Bar name="OEE Atual (%)" dataKey="atual" fill="#82ca9d" />
                        </BarChart>
                      </ResponsiveContainer>
                    </TabsContent>
                    
                    <TabsContent value="componentes" className="h-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsLineChart data={lineData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" name="Disponibilidade (%)" dataKey="disponibilidade" stroke="#8884d8" activeDot={{ r: 8 }} />
                          <Line type="monotone" name="Desempenho (%)" dataKey="desempenho" stroke="#82ca9d" />
                          <Line type="monotone" name="Qualidade (%)" dataKey="qualidade" stroke="#ffc658" />
                          <Line type="monotone" name="OEE (%)" dataKey="oee" stroke="#ff8042" strokeWidth={2} />
                        </RechartsLineChart>
                      </ResponsiveContainer>
                    </TabsContent>
                    
                    <TabsContent value="paradas" className="h-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => `${value} min`} />
                          <Legend />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </TabsContent>
                    
                    <TabsContent value="rejeitos" className="h-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                          { name: 'Produção Total', value: 1000 },
                          { name: 'Reprocesso', value: 50 },
                          { name: 'Rejeito', value: 30 },
                        ]} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" horizontal={true} />
                          <XAxis type="number" />
                          <YAxis type="category" dataKey="name" />
                          <Tooltip />
                          <Legend />
                          <Bar name="Quantidade (unidades)" dataKey="value" fill="#ffc658" />
                        </BarChart>
                      </ResponsiveContainer>
                    </TabsContent>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">OEE Atual</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">68.5%</div>
                  <div className="text-sm text-gray-500">Meta: 85%</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Disponibilidade</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">85.2%</div>
                  <div className="text-sm text-gray-500">↑ 2.1% vs período anterior</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Desempenho</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">92.3%</div>
                  <div className="text-sm text-gray-500">↑ 5.3% vs período anterior</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
