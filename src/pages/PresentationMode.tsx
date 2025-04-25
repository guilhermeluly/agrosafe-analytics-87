
import React, { useState, useEffect, useCallback } from "react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart3, 
  PieChart, 
  LineChart, 
  ArrowLeftRight, 
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Layers,
  CircleSlash,
  Settings
} from "lucide-react";
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
import { useEmpresa } from "@/context/EmpresaContext";

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'];

// Sample data - in a real implementation this would come from an API
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

const rejectData = [
  { name: 'Produção Total', value: 1000 },
  { name: 'Reprocesso', value: 50 },
  { name: 'Rejeito', value: 30 },
];

const movimentacaoData = [
  { name: 'Seg', entrada: 15, saida: 12 },
  { name: 'Ter', entrada: 18, saida: 15 },
  { name: 'Qua', entrada: 14, saida: 16 },
  { name: 'Qui', entrada: 20, saida: 18 },
  { name: 'Sex', entrada: 16, saida: 14 },
];

export default function PresentationMode() {
  const { empresa } = useEmpresa();
  const isPremium = empresa.planoId === "completo" || empresa.planoId === "medio";
  
  const [fullscreen, setFullscreen] = useState(false);
  const [activeMetric, setActiveMetric] = useState("oee");
  const [autoRotate, setAutoRotate] = useState(true);
  const [rotationInterval, setRotationInterval] = useState(15); // seconds
  const [dateRange, setDateRange] = useState({ from: new Date(), to: new Date() });
  const [dataScope, setDataScope] = useState("global");
  const [location, setLocation] = useState("todos");
  const [shift, setShift] = useState("todos");
  
  const allTabs = [
    { id: "oee", label: "OEE Geral", icon: <BarChart3 className="h-4 w-4 mr-2" /> },
    { id: "componentes", label: "Componentes OEE", icon: <LineChart className="h-4 w-4 mr-2" /> },
    { id: "paradas", label: "Análise de Paradas", icon: <PieChart className="h-4 w-4 mr-2" /> },
    { id: "rejects", label: "Rejeitos e Reprocesso", icon: <CircleSlash className="h-4 w-4 mr-2" /> },
    ...(isPremium ? [{ id: "movimentacao", label: "Movimentação", icon: <Layers className="h-4 w-4 mr-2" /> }] : [])
  ];
  
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setFullscreen(false);
      }
    }
  };

  const handleExitPresentation = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    window.history.back();
  };
  
  // Auto rotation functionality
  useEffect(() => {
    if (fullscreen && autoRotate) {
      const timer = setInterval(() => {
        setActiveMetric(prevMetric => {
          const currentIndex = allTabs.findIndex(tab => tab.id === prevMetric);
          const nextIndex = (currentIndex + 1) % allTabs.length;
          return allTabs[nextIndex].id;
        });
      }, rotationInterval * 1000);
      
      return () => clearInterval(timer);
    }
  }, [fullscreen, autoRotate, rotationInterval, allTabs]);
  
  const getScopeLabel = useCallback(() => {
    let scopeText = "Global";
    
    if (dataScope === "local") {
      scopeText = `Local: ${location === "todos" ? "Todos" : location}`;
    }
    
    if (dataScope === "turno") {
      scopeText = `Turno: ${shift === "todos" ? "Todos" : shift}`;
    }
    
    return scopeText;
  }, [dataScope, location, shift]);

  if (fullscreen) {
    return (
      <div className="bg-black text-white min-h-screen p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard de Indicadores</h1>
            <div className="flex items-center gap-2 text-gray-300 mt-2">
              <Calendar className="h-4 w-4" />
              <span>
                {dateRange.from.toLocaleDateString()} - {dateRange.to.toLocaleDateString()}
              </span>
              <div className="w-px h-4 bg-gray-600 mx-2"></div>
              <MapPin className="h-4 w-4" />
              <span>{getScopeLabel()}</span>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="border-white text-white hover:bg-gray-800"
            onClick={toggleFullscreen}
          >
            Sair do Modo Apresentação
          </Button>
        </div>
        
        <Tabs defaultValue="oee" className="space-y-8" value={activeMetric} onValueChange={setActiveMetric}>
          <TabsList className="bg-gray-800 p-1 w-full md:w-fit flex justify-center">
            {allTabs.map(tab => (
              <TabsTrigger 
                key={tab.id}
                value={tab.id} 
                className="data-[state=active]:bg-purple-600 flex items-center"
              >
                {tab.icon}
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value="oee" className="h-[70vh] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                <XAxis dataKey="name" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#333', border: 'none', color: '#fff' }} 
                  labelStyle={{ color: '#fff' }}
                />
                <Legend />
                <Bar name="Meta OEE (%)" dataKey="meta" fill="#8884d8" />
                <Bar name="OEE Atual (%)" dataKey="atual" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="componentes" className="h-[70vh] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={lineData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                <XAxis dataKey="name" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#333', border: 'none' }} 
                  labelStyle={{ color: '#fff' }}
                />
                <Legend />
                <Line type="monotone" name="Disponibilidade (%)" dataKey="disponibilidade" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" name="Desempenho (%)" dataKey="desempenho" stroke="#82ca9d" />
                <Line type="monotone" name="Qualidade (%)" dataKey="qualidade" stroke="#ffc658" />
                <Line type="monotone" name="OEE (%)" dataKey="oee" stroke="#ff8042" strokeWidth={2} />
              </RechartsLineChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="paradas" className="h-[70vh] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={200}
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
          
          <TabsContent value="rejects" className="h-[70vh] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rejectData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#555" horizontal={true} />
                <XAxis type="number" stroke="#fff" />
                <YAxis type="category" dataKey="name" stroke="#fff" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#333', border: 'none', color: '#fff' }} 
                  labelStyle={{ color: '#fff' }}
                />
                <Legend />
                <Bar name="Quantidade (unidades)" dataKey="value" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          
          {isPremium && (
            <TabsContent value="movimentacao" className="h-[70vh] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={movimentacaoData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                  <XAxis dataKey="name" stroke="#fff" />
                  <YAxis stroke="#fff" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#333', border: 'none', color: '#fff' }} 
                    labelStyle={{ color: '#fff' }}
                  />
                  <Legend />
                  <Bar name="Entradas (cargas)" dataKey="entrada" fill="#8884d8" />
                  <Bar name="Saídas (cargas)" dataKey="saida" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
          )}
        </Tabs>
        
        <div className="absolute bottom-6 left-6 text-sm text-gray-400 flex items-center">
          <Clock className="h-3 w-3 mr-1" /> 
          Modo de Apresentação - Indicador {allTabs.find(t => t.id === activeMetric)?.label} - {getScopeLabel()}
        </div>
      </div>
    );
  }

  return (
    <AppLayout title="Modo Apresentação - OEE Performance Hub">
      <div className="container mx-auto py-6 px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Modo Apresentação</h1>
          <Button onClick={handleExitPresentation} variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Voltar
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="shadow-lg col-span-1 lg:col-span-2">
            <CardHeader className="bg-purple-900 text-white">
              <CardTitle>Configurações do Modo Apresentação</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Período de Análise</h3>
                <DateRangePicker
                  className="w-full"
                  value={dateRange}
                  onChange={setDateRange}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Escopo de Dados</h3>
                  <Select value={dataScope} onValueChange={setDataScope}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o escopo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="global">Global</SelectItem>
                      <SelectItem value="local">Por Local</SelectItem>
                      <SelectItem value="turno">Por Turno</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {dataScope === "local" && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Local</h3>
                    <Select value={location} onValueChange={setLocation}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o local" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos</SelectItem>
                        <SelectItem value="linha-1">Linha 1</SelectItem>
                        <SelectItem value="linha-2">Linha 2</SelectItem>
                        <SelectItem value="linha-3">Linha 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                {dataScope === "turno" && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Turno</h3>
                    <Select value={shift} onValueChange={setShift}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o turno" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos</SelectItem>
                        <SelectItem value="manhã">Manhã</SelectItem>
                        <SelectItem value="tarde">Tarde</SelectItem>
                        <SelectItem value="noite">Noite</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Intervalo de Rotação (segundos)</h3>
                  <Select value={rotationInterval.toString()} onValueChange={value => setRotationInterval(Number(value))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tempo de rotação" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 segundos</SelectItem>
                      <SelectItem value="15">15 segundos</SelectItem>
                      <SelectItem value="30">30 segundos</SelectItem>
                      <SelectItem value="60">1 minuto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="autoRotate"
                  checked={autoRotate}
                  onChange={(e) => setAutoRotate(e.target.checked)}
                  className="rounded border-gray-300 text-purple-600 focus:border-purple-300 focus:ring focus:ring-offset-0 focus:ring-purple-200 focus:ring-opacity-50"
                />
                <label htmlFor="autoRotate" className="text-sm font-medium">
                  Rotação automática de indicadores
                </label>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg">
            <CardHeader className="bg-purple-900 text-white">
              <CardTitle>Indicadores Disponíveis</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {allTabs.map(tab => (
                  <div key={tab.id} className="flex items-center space-x-3 p-2 border rounded-md">
                    <div className="bg-purple-100 p-2 rounded-full">
                      {tab.icon}
                    </div>
                    <span className="font-medium">{tab.label}</span>
                  </div>
                ))}
              </div>
              
              {!isPremium && (
                <div className="mt-4 bg-amber-50 border-l-4 border-amber-400 p-4 text-sm">
                  <p className="font-medium">Indicadores de movimentação disponíveis apenas nos planos Médio e Completo.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
            
        <Button 
          className="w-full bg-purple-600 hover:bg-purple-700"
          size="lg"
          onClick={toggleFullscreen}
        >
          Iniciar Apresentação em Tela Cheia
          <ArrowLeftRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </AppLayout>
  );
}
