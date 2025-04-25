
import React from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, Users, BarChart3, PieChart, LineChart, CircleSlash, TruckIcon, Scale, Info } from "lucide-react";
import { DateRange } from "react-day-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Cell,
  ReferenceLine
} from "recharts";
import { LineTurnoCombo } from '../sidebar/types';

interface ChartDisplayOptions {
  showValues: boolean;
  showGrid: boolean;
  darkMode: boolean;
  showTrendline: boolean;
}

interface PresentationDisplayProps {
  dateRange: DateRange | undefined;
  currentCombination: LineTurnoCombo | undefined;
  onExitFullscreen: () => void;
  activeMetric: string;
  setActiveMetric: (metric: string) => void;
  selectedIndicators: string[];
  isPremium: boolean;
  chartOptions?: ChartDisplayOptions;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'];

// Same mock data as before...
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

// Calculate average for trendline
const calculateAverage = (data: any[], key: string): number => {
  if (!data || !data.length) return 0;
  return data.reduce((sum, item) => sum + (item[key] || 0), 0) / data.length;
};

export function PresentationDisplay({
  dateRange,
  currentCombination,
  onExitFullscreen,
  activeMetric,
  setActiveMetric,
  selectedIndicators,
  isPremium,
  chartOptions = {
    showValues: true,
    showGrid: true,
    darkMode: true,
    showTrendline: false
  }
}: PresentationDisplayProps) {
  const [aspectRatio, setAspectRatio] = React.useState<string>("16:9");

  const getAspectRatioStyle = () => {
    switch (aspectRatio) {
      case "16:9":
        return { paddingBottom: "56.25%" };
      case "4:3":
        return { paddingBottom: "75%" };
      case "1:1":
        return { paddingBottom: "100%" };
      default:
        return { paddingBottom: "56.25%" };
    }
  };

  const bgColor = chartOptions.darkMode ? "bg-black" : "bg-white";
  const textColor = chartOptions.darkMode ? "text-white" : "text-gray-800";
  const chartBgColor = chartOptions.darkMode ? "#111" : "#f8f8f8";
  const gridColor = chartOptions.darkMode ? "#333" : "#ddd";
  const tooltipStyle = chartOptions.darkMode 
    ? { backgroundColor: '#333', border: 'none', color: '#fff' }
    : { backgroundColor: '#fff', border: '1px solid #ddd', color: '#333' };

  const allTabs = [
    { id: "oee", label: "OEE Geral", icon: <BarChart3 className="h-4 w-4 mr-2" />, source: "Dados de Produção" },
    { id: "componentes", label: "Componentes OEE", icon: <LineChart className="h-4 w-4 mr-2" />, source: "Análise de Performance" },
    { id: "paradas", label: "Análise de Paradas", icon: <PieChart className="h-4 w-4 mr-2" />, source: "Registro de Paradas" },
    { id: "rejects", label: "Rejeitos e Reprocesso", icon: <CircleSlash className="h-4 w-4 mr-2" />, source: "Controle de Qualidade" },
    ...(isPremium ? [
      { id: "movimentacao", label: "Caminhões", icon: <TruckIcon className="h-4 w-4 mr-2" />, source: "Logística de Transporte" },
      { id: "produtividade", label: "Kg/Hora/Homem", icon: <Scale className="h-4 w-4 mr-2" />, source: "RH e Produtividade" }
    ] : [])
  ];

  const currentTab = allTabs.find(tab => tab.id === activeMetric);

  return (
    <div className={`${bgColor} ${textColor} min-h-screen p-6`}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Dashboard de Indicadores</h1>
          <div className={`flex items-center gap-2 ${chartOptions.darkMode ? 'text-gray-300' : 'text-gray-600'} mt-2`}>
            <Calendar className="h-4 w-4" />
            <span>
              {dateRange?.from?.toLocaleDateString()} - {dateRange?.to?.toLocaleDateString()}
            </span>
            <div className={`w-px h-4 ${chartOptions.darkMode ? 'bg-gray-600' : 'bg-gray-300'} mx-2`}></div>
            <MapPin className="h-4 w-4" />
            <span>{currentCombination?.name || 'Global'}</span>
            {currentCombination?.id === 'all-all' ? (
              <div className={`ml-2 px-2 py-0.5 ${chartOptions.darkMode ? 'bg-blue-800' : 'bg-blue-100 text-blue-800'} text-xs rounded-full`}>Dados consolidados</div>
            ) : (
              <>
                <div className={`w-px h-4 ${chartOptions.darkMode ? 'bg-gray-600' : 'bg-gray-300'} mx-2`}></div>
                <Users className="h-4 w-4" />
                <span>Turno: {currentCombination?.turno}</span>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Select value={aspectRatio} onValueChange={setAspectRatio}>
            <SelectTrigger className={`w-[100px] ${chartOptions.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}>
              <SelectValue placeholder="Aspect Ratio" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="16:9">16:9</SelectItem>
              <SelectItem value="4:3">4:3</SelectItem>
              <SelectItem value="1:1">1:1</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            className={chartOptions.darkMode ? 'border-gray-300 text-gray-300 hover:bg-gray-800' : 'border-gray-600 text-gray-600 hover:bg-gray-100'}
            onClick={onExitFullscreen}
          >
            Sair do Modo Apresentação
          </Button>
        </div>
      </div>

      <div 
        className="relative w-full"
        style={getAspectRatioStyle()}
      >
        <div className="absolute inset-0">
          <Tabs value={activeMetric} onValueChange={setActiveMetric} className="h-full flex flex-col">
            <TabsList className={`${chartOptions.darkMode ? 'bg-gray-800' : 'bg-gray-200'} p-1 w-full md:w-fit flex justify-center`}>
              {allTabs.filter(tab => selectedIndicators.includes(tab.id)).map(tab => (
                <TabsTrigger 
                  key={tab.id}
                  value={tab.id} 
                  className={`data-[state=active]:${chartOptions.darkMode ? 'bg-purple-600' : 'bg-purple-500 text-white'} flex items-center`}
                >
                  {tab.icon}
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {currentTab && (
              <div className={`${chartOptions.darkMode ? 'bg-gray-800 bg-opacity-60' : 'bg-gray-100'} px-3 py-1 rounded-md flex items-center justify-center mt-2 text-sm`}>
                <Info className={`h-3 w-3 mr-1 ${chartOptions.darkMode ? 'text-blue-300' : 'text-blue-500'}`} /> 
                Fonte de dados: <span className="font-semibold ml-1">{currentTab.source}</span>
              </div>
            )}
            
            <div className="flex-1 relative">
              <TabsContent value="oee" className="absolute inset-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    {chartOptions.showGrid && (
                      <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    )}
                    <XAxis dataKey="name" stroke={chartOptions.darkMode ? '#fff' : '#333'} />
                    <YAxis stroke={chartOptions.darkMode ? '#fff' : '#333'} />
                    <Tooltip 
                      contentStyle={tooltipStyle}
                      labelStyle={{ color: chartOptions.darkMode ? '#fff' : '#333' }}
                      formatter={(value) => chartOptions.showValues ? value : ''}
                    />
                    <Legend />
                    <Bar name="Meta OEE (%)" dataKey="meta" fill="#8884d8" />
                    <Bar name="OEE Atual (%)" dataKey="atual" fill="#82ca9d" />
                    {chartOptions.showTrendline && (
                      <ReferenceLine y={calculateAverage(barData, 'atual')} 
                        label="Média" 
                        stroke={chartOptions.darkMode ? "#ff7c7c" : "#ff5252"} 
                        strokeDasharray="3 3" 
                      />
                    )}
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value="componentes" className="absolute inset-0">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={lineData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    {chartOptions.showGrid && (
                      <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    )}
                    <XAxis dataKey="name" stroke={chartOptions.darkMode ? '#fff' : '#333'} />
                    <YAxis stroke={chartOptions.darkMode ? '#fff' : '#333'} />
                    <Tooltip 
                      contentStyle={tooltipStyle}
                      labelStyle={{ color: chartOptions.darkMode ? '#fff' : '#333' }}
                      formatter={(value) => chartOptions.showValues ? value : ''}
                    />
                    <Legend />
                    <Line type="monotone" name="Disponibilidade (%)" dataKey="disponibilidade" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" name="Desempenho (%)" dataKey="desempenho" stroke="#82ca9d" />
                    <Line type="monotone" name="Qualidade (%)" dataKey="qualidade" stroke="#ffc658" />
                    <Line type="monotone" name="OEE (%)" dataKey="oee" stroke="#ff8042" strokeWidth={2} />
                    {chartOptions.showTrendline && (
                      <ReferenceLine y={calculateAverage(lineData, 'oee')} 
                        label="Média OEE" 
                        stroke={chartOptions.darkMode ? "#ff7c7c" : "#ff5252"} 
                        strokeDasharray="3 3" 
                      />
                    )}
                  </RechartsLineChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value="paradas" className="absolute inset-0">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius="80%"
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => chartOptions.showValues ? `${name}: ${(percent * 100).toFixed(0)}%` : name}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} min`} contentStyle={tooltipStyle} />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value="rejects" className="absolute inset-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={rejectData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} layout="vertical">
                    {chartOptions.showGrid && (
                      <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={true} />
                    )}
                    <XAxis type="number" stroke={chartOptions.darkMode ? '#fff' : '#333'} />
                    <YAxis type="category" dataKey="name" stroke={chartOptions.darkMode ? '#fff' : '#333'} />
                    <Tooltip 
                      contentStyle={tooltipStyle}
                      labelStyle={{ color: chartOptions.darkMode ? '#fff' : '#333' }}
                      formatter={(value) => chartOptions.showValues ? value : ''}
                    />
                    <Legend />
                    <Bar name="Quantidade (unidades)" dataKey="value" fill="#ffc658">
                      {chartOptions.showValues && rejectData.map((entry, index) => (
                        <text
                          key={`text-${index}`}
                          x={entry.value + 5}
                          y={index * 40 + 20}
                          fill={chartOptions.darkMode ? "#fff" : "#333"}
                          textAnchor="start"
                        >
                          {entry.value}
                        </text>
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
              
              {isPremium && (
                <>
                  <TabsContent value="movimentacao" className="absolute inset-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={movimentacaoData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        {chartOptions.showGrid && (
                          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                        )}
                        <XAxis dataKey="name" stroke={chartOptions.darkMode ? '#fff' : '#333'} />
                        <YAxis stroke={chartOptions.darkMode ? '#fff' : '#333'} />
                        <Tooltip 
                          contentStyle={tooltipStyle}
                          labelStyle={{ color: chartOptions.darkMode ? '#fff' : '#333' }}
                          formatter={(value) => chartOptions.showValues ? value : ''}
                        />
                        <Legend />
                        <Bar name="Caminhões Entrada" dataKey="entrada" fill="#8884d8" />
                        <Bar name="Caminhões Saída" dataKey="saida" fill="#82ca9d" />
                        {chartOptions.showTrendline && (
                          <ReferenceLine y={calculateAverage(movimentacaoData, 'entrada')} 
                            label="Média Entrada" 
                            stroke={chartOptions.darkMode ? "#ff7c7c" : "#ff5252"} 
                            strokeDasharray="3 3" 
                          />
                        )}
                      </BarChart>
                    </ResponsiveContainer>
                  </TabsContent>
                  
                  <TabsContent value="produtividade" className="absolute inset-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart data={movimentacaoData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        {chartOptions.showGrid && (
                          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                        )}
                        <XAxis dataKey="name" stroke={chartOptions.darkMode ? '#fff' : '#333'} />
                        <YAxis stroke={chartOptions.darkMode ? '#fff' : '#333'} />
                        <Tooltip 
                          contentStyle={tooltipStyle}
                          labelStyle={{ color: chartOptions.darkMode ? '#fff' : '#333' }}
                          formatter={(value) => chartOptions.showValues ? value : ''}
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
                        {chartOptions.showTrendline && (
                          <ReferenceLine y={calculateAverage(movimentacaoData, 'kgPorHoraHomem')} 
                            label="Média" 
                            stroke={chartOptions.darkMode ? "#ff7c7c" : "#ff5252"} 
                            strokeDasharray="3 3" 
                          />
                        )}
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </TabsContent>
                </>
              )}
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
