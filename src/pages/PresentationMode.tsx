import React, { useState, useEffect, useCallback } from "react";
import { DateRange } from "react-day-picker";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
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
  Settings,
  Users,
  TruckIcon,
  Scale
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
  { name: 'Seg', entrada: 15, saida: 12, kgPorHoraHomem: 250 },
  { name: 'Ter', entrada: 18, saida: 15, kgPorHoraHomem: 270 },
  { name: 'Qua', entrada: 14, saida: 16, kgPorHoraHomem: 240 },
  { name: 'Qui', entrada: 20, saida: 18, kgPorHoraHomem: 290 },
  { name: 'Sex', entrada: 16, saida: 14, kgPorHoraHomem: 260 },
];

const LOCAL_COMBINATIONS = [
  { id: 'linha1-turno1', name: 'Linha 1 - Turno 1', linha: 'linha-1', turno: 'manhã' },
  { id: 'linha1-turno2', name: 'Linha 1 - Turno 2', linha: 'linha-1', turno: 'tarde' },
  { id: 'linha1-turno3', name: 'Linha 1 - Turno 3', linha: 'linha-1', turno: 'noite' },
  { id: 'linha2-turno1', name: 'Linha 2 - Turno 1', linha: 'linha-2', turno: 'manhã' },
  { id: 'linha2-turno2', name: 'Linha 2 - Turno 2', linha: 'linha-2', turno: 'tarde' },
  { id: 'linha2-turno3', name: 'Linha 2 - Turno 3', linha: 'linha-2', turno: 'noite' },
  { id: 'linha3-turno1', name: 'Linha 3 - Turno 1', linha: 'linha-3', turno: 'manhã' },
  { id: 'linha3-turno2', name: 'Linha 3 - Turno 2', linha: 'linha-3', turno: 'tarde' },
  { id: 'linha3-turno3', name: 'Linha 3 - Turno 3', linha: 'linha-3', turno: 'noite' },
  { id: 'global', name: 'Global (Todas as linhas e turnos)', linha: 'todas', turno: 'todos' },
];

export default function PresentationMode() {
  const { empresa } = useEmpresa();
  const isPremium = empresa.planoId === "completo" || empresa.planoId === "medio";
  
  const [fullscreen, setFullscreen] = useState(false);
  const [activeMetric, setActiveMetric] = useState("oee");
  const [autoRotate, setAutoRotate] = useState(true);
  const [rotationInterval, setRotationInterval] = useState(15); // seconds
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date()
  });
  const [dataScope, setDataScope] = useState("global");
  const [selectedCombinations, setSelectedCombinations] = useState<string[]>(['global']);
  const [currentCombinationIndex, setCurrentCombinationIndex] = useState(0);
  
  const allTabs = [
    { id: "oee", label: "OEE Geral", icon: <BarChart3 className="h-4 w-4 mr-2" /> },
    { id: "componentes", label: "Componentes OEE", icon: <LineChart className="h-4 w-4 mr-2" /> },
    { id: "paradas", label: "Análise de Paradas", icon: <PieChart className="h-4 w-4 mr-2" /> },
    { id: "rejects", label: "Rejeitos e Reprocesso", icon: <CircleSlash className="h-4 w-4 mr-2" /> },
    ...(isPremium ? [
      { id: "movimentacao", label: "Caminhões", icon: <TruckIcon className="h-4 w-4 mr-2" /> },
      { id: "produtividade", label: "Kg/Hora/Homem", icon: <Scale className="h-4 w-4 mr-2" /> }
    ] : [])
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
  
  useEffect(() => {
    if (fullscreen && autoRotate && selectedCombinations.length > 1) {
      const combinationTimer = setInterval(() => {
        setCurrentCombinationIndex(prevIndex => (prevIndex + 1) % selectedCombinations.length);
      }, rotationInterval * 2000); // Rotate combinations at a slower rate
      
      return () => clearInterval(combinationTimer);
    }
  }, [fullscreen, autoRotate, rotationInterval, selectedCombinations]);
  
  const getCurrentCombination = useCallback(() => {
    if (selectedCombinations.length === 0) return LOCAL_COMBINATIONS.find(c => c.id === 'global');
    
    const combinationId = selectedCombinations[currentCombinationIndex];
    return LOCAL_COMBINATIONS.find(c => c.id === combinationId) || LOCAL_COMBINATIONS.find(c => c.id === 'global');
  }, [selectedCombinations, currentCombinationIndex]);
  
  const currentCombination = getCurrentCombination();

  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (range?.from) {
      setDateRange(range);
    }
  };

  const handleCombinationToggle = (id: string) => {
    setSelectedCombinations(prev => {
      if (id === 'global') {
        return ['global'];
      }
      
      const newSelection = prev.includes('global') && id !== 'global' 
        ? prev.filter(i => i !== 'global') 
        : [...prev];
      
      if (newSelection.includes(id)) {
        return newSelection.filter(i => i !== id);
      } else {
        return [...newSelection, id];
      }
    });
  };

  if (fullscreen) {
    return (
      <div className="bg-black text-white min-h-screen p-6 landscape:flex landscape:flex-col">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard de Indicadores</h1>
            <div className="flex items-center gap-2 text-gray-300 mt-2">
              <Calendar className="h-4 w-4" />
              <span>
                {dateRange?.from?.toLocaleDateString()} - {dateRange?.to?.toLocaleDateString()}
              </span>
              <div className="w-px h-4 bg-gray-600 mx-2"></div>
              <MapPin className="h-4 w-4" />
              <span>{currentCombination?.name || 'Global'}</span>
              {currentCombination?.id === 'global' ? (
                <div className="ml-2 px-2 py-0.5 bg-blue-800 text-xs rounded-full">Dados consolidados</div>
              ) : (
                <>
                  <div className="w-px h-4 bg-gray-600 mx-2"></div>
                  <Users className="h-4 w-4" />
                  <span>Turno: {currentCombination?.turno}</span>
                </>
              )}
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
        
        <Tabs defaultValue="oee" className="space-y-8 landscape:flex-1 landscape:flex landscape:flex-col" value={activeMetric} onValueChange={setActiveMetric}>
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
          
          <div className="landscape:flex-1">
            <TabsContent value="oee" className="h-[70vh] landscape:h-full flex items-center justify-center">
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
            
            <TabsContent value="componentes" className="h-[70vh] landscape:h-full flex items-center justify-center">
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
            
            <TabsContent value="paradas" className="h-[70vh] landscape:h-full flex items-center justify-center">
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
            
            <TabsContent value="rejects" className="h-[70vh] landscape:h-full flex items-center justify-center">
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
              <>
                <TabsContent value="movimentacao" className="h-[70vh] landscape:h-full flex items-center justify-center">
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
                      <Bar name="Caminhões Entrada" dataKey="entrada" fill="#8884d8" />
                      <Bar name="Caminhões Saída" dataKey="saida" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </TabsContent>
                
                <TabsContent value="produtividade" className="h-[70vh] landscape:h-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={movimentacaoData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                      <XAxis dataKey="name" stroke="#fff" />
                      <YAxis stroke="#fff" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#333', border: 'none', color: '#fff' }} 
                        labelStyle={{ color: '#fff' }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        name="Kg/Hora/Homem" 
                        dataKey="kgPorHoraHomem" 
                        stroke="#ffc658" 
                        strokeWidth={2}
                        activeDot={{ r: 8 }} 
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </TabsContent>
              </>
            )}
          </div>
        </Tabs>
        
        <div className="absolute bottom-6 left-6 text-sm text-gray-400 flex items-center">
          <Clock className="h-3 w-3 mr-1" /> 
          Modo de Apresentação - {allTabs.find(t => t.id === activeMetric)?.label} - {currentCombination?.name || 'Global'}
          {selectedCombinations.length > 1 && (
            <span className="ml-2">({currentCombinationIndex + 1}/{selectedCombinations.length})</span>
          )}
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
                  onChange={handleDateRangeChange}
                />
              </div>
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Escopo de Dados - Combinações de Linha e Turno</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {LOCAL_COMBINATIONS.map(combination => (
                    <div key={combination.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`combine-${combination.id}`}
                        checked={selectedCombinations.includes(combination.id)}
                        onCheckedChange={() => handleCombinationToggle(combination.id)}
                      />
                      <label 
                        htmlFor={`combine-${combination.id}`}
                        className="text-sm cursor-pointer"
                      >
                        {combination.name}
                      </label>
                    </div>
                  ))}
                </div>

                {selectedCombinations.length === 0 && (
                  <div className="text-sm text-red-500">
                    Selecione pelo menos uma combinação.
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Intervalo de Rotação de Indicadores (segundos)</h3>
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
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Tempo de Exibição por Combinação (segundos)</h3>
                  <Select value={(rotationInterval * 2).toString()} onValueChange={value => setRotationInterval(Number(value) / 2)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tempo por combinação" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="20">20 segundos</SelectItem>
                      <SelectItem value="30">30 segundos</SelectItem>
                      <SelectItem value="60">1 minuto</SelectItem>
                      <SelectItem value="120">2 minutos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="autoRotate"
                  checked={autoRotate}
                  onCheckedChange={(checked) => setAutoRotate(checked as boolean)}
                />
                <label htmlFor="autoRotate" className="text-sm font-medium">
                  Rotação automática de indicadores e combinações
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
          disabled={selectedCombinations.length === 0}
        >
          Iniciar Apresentação em Tela Cheia
          <ArrowLeftRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </AppLayout>
  );
}
