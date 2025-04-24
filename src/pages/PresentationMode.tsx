
import React, { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, PieChart, LineChart, ArrowLeftRight, ArrowLeft } from "lucide-react";
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

export default function PresentationMode() {
  const [fullscreen, setFullscreen] = useState(false);
  const [activeMetric, setActiveMetric] = useState("oee");

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

  if (fullscreen) {
    return (
      <div className="bg-black text-white min-h-screen p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Dashboard de Indicadores</h1>
          <Button 
            variant="outline" 
            className="border-white text-white hover:bg-gray-800"
            onClick={toggleFullscreen}
          >
            Sair do Modo Apresentação
          </Button>
        </div>
        
        <Tabs defaultValue="oee" className="space-y-8" onValueChange={setActiveMetric}>
          <TabsList className="bg-gray-800 p-1 w-full md:w-fit flex justify-center">
            <TabsTrigger value="oee" className="data-[state=active]:bg-purple-600">OEE Geral</TabsTrigger>
            <TabsTrigger value="componentes" className="data-[state=active]:bg-purple-600">Componentes OEE</TabsTrigger>
            <TabsTrigger value="paradas" className="data-[state=active]:bg-purple-600">Análise de Paradas</TabsTrigger>
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
        </Tabs>
        
        <div className="absolute bottom-6 left-6 text-sm text-gray-400">
          Modo de Apresentação - Dashboard {activeMetric.toUpperCase()}
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

        <Card className="shadow-lg">
          <CardHeader className="bg-purple-900 text-white">
            <CardTitle>Escolha o Modo de Apresentação</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="mb-6 text-gray-600">
              O modo apresentação permite visualizar os principais indicadores em tela cheia, ideal para reuniões e apresentações.
              Selecione o tipo de visualização e clique em "Iniciar Apresentação" para prosseguir.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="border shadow-sm hover:shadow-md transition-all cursor-pointer">
                <CardHeader className="bg-blue-50 pb-2">
                  <CardTitle className="text-base flex items-center">
                    <BarChart3 className="h-4 w-4 mr-2 text-blue-600" />
                    Indicadores OEE
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="text-sm text-gray-600">
                    Visualize o desempenho do OEE geral ao longo do tempo.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border shadow-sm hover:shadow-md transition-all cursor-pointer">
                <CardHeader className="bg-green-50 pb-2">
                  <CardTitle className="text-base flex items-center">
                    <LineChart className="h-4 w-4 mr-2 text-green-600" />
                    Componentes do OEE
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="text-sm text-gray-600">
                    Analise os componentes individuais do OEE: disponibilidade, desempenho e qualidade.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border shadow-sm hover:shadow-md transition-all cursor-pointer">
                <CardHeader className="bg-amber-50 pb-2">
                  <CardTitle className="text-base flex items-center">
                    <PieChart className="h-4 w-4 mr-2 text-amber-600" />
                    Análise de Paradas
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="text-sm text-gray-600">
                    Visualize a distribuição e impacto das diferentes paradas.
                  </p>
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
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
