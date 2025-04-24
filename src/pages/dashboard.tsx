import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useEmpresa } from "../context/EmpresaContext";
import LogoDisplay from "../components/LogoDisplay";
import AppLayout from "../components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "../context/UserContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ArrowDownIcon, ArrowUpIcon, ClockIcon, BarChart3, PieChartIcon, Filter } from "lucide-react";

const productionData = {
  plannedProduction: 1000,
  actualProduction: 920,
  downtime: 45, // minutes
  plannedTime: 480, // minutes (8 hours)
  idealCycleTime: 0.4, // minutes per unit
  rework: 15,
  scrap: 25,
  lostPackages: 5,
};

const downtimeData = [
  { name: 'Manutenção', minutes: 25, percentage: 25 },
  { name: 'Troca de Produto', minutes: 15, percentage: 15 },
  { name: 'Quebra', minutes: 20, percentage: 20 },
  { name: 'Setup', minutes: 10, percentage: 10 },
  { name: 'Falta de Material', minutes: 30, percentage: 30 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const calculateAvailability = (plannedTime: number, downtime: number) => {
  return ((plannedTime - downtime) / plannedTime) * 100;
};

const calculatePerformance = (actualProduction: number, plannedTime: number, downtime: number, idealCycleTime: number) => {
  const operatingTime = plannedTime - downtime;
  const theoreticalProduction = operatingTime / idealCycleTime;
  return (actualProduction / theoreticalProduction) * 100;
};

const calculateQuality = (actualProduction: number, rework: number, scrap: number, lostPackages: number) => {
  const goodUnits = actualProduction - (rework + scrap + lostPackages);
  return (goodUnits / actualProduction) * 100;
};

const calculateOEE = (availability: number, performance: number, quality: number) => {
  return (availability * performance * quality) / 10000; // Divide by 10000 to convert from percentages
};

const CardIndicador = ({ label, value, color, icon }: { label: string; value: string; color: string; icon: React.ReactNode }) => {
  return (
    <Card className={`border-l-4 ${color}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium">{label}</CardTitle>
          <div className="text-muted-foreground">{icon}</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
};

export default function Dashboard() {
  const { empresa } = useEmpresa();
  const { user } = useUser();
  const [timeFilter, setTimeFilter] = useState("today");
  const [lineFilter, setLineFilter] = useState("all");
  const [showTooltip, setShowTooltip] = useState(false);

  const availability = calculateAvailability(
    productionData.plannedTime,
    productionData.downtime
  );
  
  const performance = calculatePerformance(
    productionData.actualProduction,
    productionData.plannedTime,
    productionData.downtime,
    productionData.idealCycleTime
  );
  
  const quality = calculateQuality(
    productionData.actualProduction,
    productionData.rework,
    productionData.scrap,
    productionData.lostPackages
  );
  
  const oee = calculateOEE(availability, performance, quality);

  const productionTrends = [
    { name: 'Seg', plan: 1000, actual: 950 },
    { name: 'Ter', plan: 1000, actual: 920 },
    { name: 'Qua', plan: 1000, actual: 980 },
    { name: 'Qui', plan: 1000, actual: 890 },
    { name: 'Sex', plan: 1000, actual: 940 },
    { name: 'Sáb', plan: 500, actual: 480 },
    { name: 'Dom', plan: 500, actual: 520 },
  ];

  const setupsCount = 3;

  return (
    <AppLayout title="Dashboard - OEE">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard OEE</h1>
        <LogoDisplay altura={36} />
      </div>
      
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <div className="flex items-center">
          <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
          <span className="text-sm mr-2">Período:</span>
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-[180px] h-8">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Hoje</SelectItem>
              <SelectItem value="yesterday">Ontem</SelectItem>
              <SelectItem value="week">Esta semana</SelectItem>
              <SelectItem value="month">Este mês</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center ml-4">
          <span className="text-sm mr-2">Linha:</span>
          <Select value={lineFilter} onValueChange={setLineFilter}>
            <SelectTrigger className="w-[180px] h-8">
              <SelectValue placeholder="Linha" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="line1">Linha 1</SelectItem>
              <SelectItem value="line2">Linha 2</SelectItem>
              <SelectItem value="line3">Linha 3</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center ml-auto">
          <button
            type="button"
            className="rounded-md px-3 py-1 bg-muted-foreground text-white font-medium opacity-60 cursor-not-allowed relative"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            disabled
            tabIndex={-1}
          >
            + Novo Indicador
            {showTooltip &&
              <span className="absolute z-10 left-1/2 -translate-x-1/2 top-full mt-1 px-2 py-1 bg-black text-white text-xs rounded shadow">
                Em breve!
              </span>
            }
          </button>
        </div>
      </div>
      
      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="downtime">Análise de Paradas</TabsTrigger>
          <TabsTrigger value="production">Produção</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <CardIndicador 
              label="Disponibilidade" 
              value={`${availability.toFixed(1)}%`} 
              color="border-blue-500"
              icon={<ClockIcon className="h-4 w-4" />}
            />
            <CardIndicador 
              label="Performance" 
              value={`${performance.toFixed(1)}%`} 
              color="border-green-500"
              icon={<BarChart3 className="h-4 w-4" />}
            />
            <CardIndicador 
              label="Qualidade" 
              value={`${quality.toFixed(1)}%`} 
              color="border-purple-500"
              icon={<PieChartIcon className="h-4 w-4" />}
            />
            <CardIndicador 
              label="OEE" 
              value={`${oee.toFixed(1)}%`} 
              color="border-amber-500"
              icon={<BarChart3 className="h-4 w-4" />}
            />
            <CardIndicador
              label="Setups"
              value={`${setupsCount}`}
              color="border-vividPurple"
              icon={<span className="font-bold text-vividPurple text-lg">S</span>}
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Produção vs Meta</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={productionTrends}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="plan" name="Meta" fill="#8884d8" />
                    <Bar dataKey="actual" name="Produção Real" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Causas de Parada</CardTitle>
                <CardDescription>
                  Principais motivos de parada de produção
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={downtimeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="minutes"
                    >
                      {downtimeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          {(user.role === "admin" || user.role === "operator") && (
            <div className="mt-6">
              <Card className="bg-blue-50">
                <CardContent className="p-4">
                  <p className="font-medium">Produção Atual: {productionData.actualProduction} kg</p>
                  <p>Meta: {productionData.plannedProduction} kg</p>
                  <div className="h-2.5 mt-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-2.5 bg-blue-600 rounded-full" 
                      style={{ width: `${(productionData.actualProduction / productionData.plannedProduction) * 100}%` }}
                    ></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="downtime">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Motivos de Parada</CardTitle>
                <CardDescription>Distribuição do tempo de parada por causas</CardDescription>
              </CardHeader>
              <CardContent className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={downtimeData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="minutes" name="Minutos" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Tempo de Parada por Dia</CardTitle>
                <CardDescription>Evolução dos tempos de parada</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <h4 className="font-medium">Tempo Total de Parada</h4>
                      <span className="font-bold text-red-500">{productionData.downtime} minutos</span>
                    </div>
                    <div className="h-2 bg-red-100 rounded-full">
                      <div 
                        className="h-2 bg-red-500 rounded-full" 
                        style={{ width: `${(productionData.downtime / productionData.plannedTime) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {((productionData.downtime / productionData.plannedTime) * 100).toFixed(1)}% do tempo total planejado
                    </p>
                  </div>
                  
                  {downtimeData.map((reason, index) => (
                    <div key={reason.name} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                          <span>{reason.name}</span>
                        </div>
                        <span className="font-medium">{reason.minutes} min</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full">
                        <div 
                          className="h-2 rounded-full" 
                          style={{ 
                            width: `${(reason.minutes / productionData.downtime) * 100}%`,
                            backgroundColor: COLORS[index % COLORS.length]
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="production">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Produção vs Meta</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={productionTrends}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="plan" name="Meta" fill="#8884d8" />
                    <Bar dataKey="actual" name="Produção Real" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Perdas por Qualidade</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Retrabalho:</span>
                      <div className="flex items-center">
                        <span className="font-medium">{productionData.rework} kg</span>
                        <ArrowUpIcon className="h-4 w-4 text-red-500 ml-1" />
                      </div>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full">
                      <div 
                        className="h-2 bg-orange-400 rounded-full" 
                        style={{ width: `${(productionData.rework / productionData.actualProduction) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Refugo:</span>
                      <div className="flex items-center">
                        <span className="font-medium">{productionData.scrap} kg</span>
                        <ArrowDownIcon className="h-4 w-4 text-green-500 ml-1" />
                      </div>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full">
                      <div 
                        className="h-2 bg-red-500 rounded-full" 
                        style={{ width: `${(productionData.scrap / productionData.actualProduction) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Embalagens Perdidas:</span>
                      <div className="flex items-center">
                        <span className="font-medium">{productionData.lostPackages} kg</span>
                        <ArrowUpIcon className="h-4 w-4 text-red-500 ml-1" />
                      </div>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full">
                      <div 
                        className="h-2 bg-yellow-500 rounded-full" 
                        style={{ width: `${(productionData.lostPackages / productionData.actualProduction) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t">
                    <div className="flex justify-between">
                      <span className="font-semibold">Total de Perdas:</span>
                      <span className="font-bold">
                        {productionData.rework + productionData.scrap + productionData.lostPackages} kg
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {((productionData.rework + productionData.scrap + productionData.lostPackages) / productionData.actualProduction * 100).toFixed(1)}% da produção total
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
