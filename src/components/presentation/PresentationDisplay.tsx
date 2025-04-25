import React from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, Users, BarChart3, PieChart, LineChart, CircleSlash, TruckIcon, Scale } from "lucide-react";
import { DateRange } from "react-day-picker";
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
import { LineTurnoCombo } from '../sidebar/types';

interface PresentationDisplayProps {
  dateRange: DateRange | undefined;
  currentCombination: LineTurnoCombo | undefined;
  onExitFullscreen: () => void;
  activeMetric: string;
  setActiveMetric: (metric: string) => void;
  selectedIndicators: string[];
  isPremium: boolean;
}

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

export function PresentationDisplay({
  dateRange,
  currentCombination,
  onExitFullscreen,
  activeMetric,
  setActiveMetric,
  selectedIndicators,
  isPremium
}: PresentationDisplayProps) {

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
          className="border-gray-300 text-gray-300 hover:bg-gray-800"
          onClick={onExitFullscreen}
        >
          Sair do Modo Apresentação
        </Button>
      </div>

      <Tabs value={activeMetric} onValueChange={setActiveMetric} className="space-y-8 landscape:flex-1 landscape:flex landscape:flex-col">
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
    </div>
  );
}
