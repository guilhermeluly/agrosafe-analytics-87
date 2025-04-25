import React, { useState, useEffect } from "react";
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
import { useToast } from "@/hooks/use-toast";

const baseProductionData = {
  today: {
    all: {
      plannedProduction: 1000,
      actualProduction: 920,
      downtime: 45, // minutes
      plannedTime: 480, // minutes (8 hours)
      idealCycleTime: 0.4, // minutes per unit
      rework: 15,
      scrap: 25,
      lostPackages: 5,
    },
    line1: {
      plannedProduction: 500,
      actualProduction: 470,
      downtime: 20,
      plannedTime: 480,
      idealCycleTime: 0.4,
      rework: 8,
      scrap: 12,
      lostPackages: 2,
    },
    line2: {
      plannedProduction: 300,
      actualProduction: 290,
      downtime: 15,
      plannedTime: 480,
      idealCycleTime: 0.4,
      rework: 4,
      scrap: 8,
      lostPackages: 2,
    },
    line3: {
      plannedProduction: 200,
      actualProduction: 160,
      downtime: 10,
      plannedTime: 480,
      idealCycleTime: 0.4,
      rework: 3,
      scrap: 5,
      lostPackages: 1,
    },
  },
  yesterday: {
    all: {
      plannedProduction: 1000,
      actualProduction: 950,
      downtime: 30,
      plannedTime: 480,
      idealCycleTime: 0.4,
      rework: 10,
      scrap: 20,
      lostPackages: 3,
    },
    line1: {
      plannedProduction: 500,
      actualProduction: 480,
      downtime: 15,
      plannedTime: 480,
      idealCycleTime: 0.4,
      rework: 5,
      scrap: 10,
      lostPackages: 1,
    },
    line2: {
      plannedProduction: 300,
      actualProduction: 295,
      downtime: 10,
      plannedTime: 480,
      idealCycleTime: 0.4,
      rework: 3,
      scrap: 5,
      lostPackages: 1,
    },
    line3: {
      plannedProduction: 200,
      actualProduction: 175,
      downtime: 5,
      plannedTime: 480,
      idealCycleTime: 0.4,
      rework: 2,
      scrap: 5,
      lostPackages: 1,
    },
  },
  week: {
    all: {
      plannedProduction: 5000,
      actualProduction: 4800,
      downtime: 200,
      plannedTime: 2400,
      idealCycleTime: 0.4,
      rework: 70,
      scrap: 100,
      lostPackages: 20,
    },
    line1: {
      plannedProduction: 2500,
      actualProduction: 2400,
      downtime: 100,
      plannedTime: 2400,
      idealCycleTime: 0.4,
      rework: 35,
      scrap: 50,
      lostPackages: 10,
    },
    line2: {
      plannedProduction: 1500,
      actualProduction: 1450,
      downtime: 60,
      plannedTime: 2400,
      idealCycleTime: 0.4,
      rework: 20,
      scrap: 30,
      lostPackages: 6,
    },
    line3: {
      plannedProduction: 1000,
      actualProduction: 950,
      downtime: 40,
      plannedTime: 2400,
      idealCycleTime: 0.4,
      rework: 15,
      scrap: 20,
      lostPackages: 4,
    },
  },
  month: {
    all: {
      plannedProduction: 20000,
      actualProduction: 19200,
      downtime: 800,
      plannedTime: 9600,
      idealCycleTime: 0.4,
      rework: 300,
      scrap: 400,
      lostPackages: 80,
    },
    line1: {
      plannedProduction: 10000,
      actualProduction: 9600,
      downtime: 400,
      plannedTime: 9600,
      idealCycleTime: 0.4,
      rework: 150,
      scrap: 200,
      lostPackages: 40,
    },
    line2: {
      plannedProduction: 6000,
      actualProduction: 5800,
      downtime: 240,
      plannedTime: 9600,
      idealCycleTime: 0.4,
      rework: 90,
      scrap: 120,
      lostPackages: 24,
    },
    line3: {
      plannedProduction: 4000,
      actualProduction: 3800,
      downtime: 160,
      plannedTime: 9600,
      idealCycleTime: 0.4,
      rework: 60,
      scrap: 80,
      lostPackages: 16,
    },
  }
};

const baseDowntimeData = {
  today: {
    all: [
      { name: 'Manutenção', minutes: 25, percentage: 25 },
      { name: 'Troca de Produto', minutes: 15, percentage: 15 },
      { name: 'Quebra', minutes: 20, percentage: 20 },
      { name: 'Setup', minutes: 10, percentage: 10 },
      { name: 'Falta de Material', minutes: 30, percentage: 30 },
    ],
    line1: [
      { name: 'Manutenção', minutes: 10, percentage: 20 },
      { name: 'Troca de Produto', minutes: 8, percentage: 16 },
      { name: 'Quebra', minutes: 12, percentage: 24 },
      { name: 'Setup', minutes: 5, percentage: 10 },
      { name: 'Falta de Material', minutes: 15, percentage: 30 },
    ],
    line2: [
      { name: 'Manutenção', minutes: 8, percentage: 27 },
      { name: 'Troca de Produto', minutes: 5, percentage: 17 },
      { name: 'Quebra', minutes: 6, percentage: 20 },
      { name: 'Setup', minutes: 3, percentage: 10 },
      { name: 'Falta de Material', minutes: 8, percentage: 26 },
    ],
    line3: [
      { name: 'Manutenção', minutes: 7, percentage: 30 },
      { name: 'Troca de Produto', minutes: 2, percentage: 10 },
      { name: 'Quebra', minutes: 2, percentage: 10 },
      { name: 'Setup', minutes: 2, percentage: 10 },
      { name: 'Falta de Material', minutes: 7, percentage: 40 },
    ],
  },
  yesterday: {
    all: [
      { name: 'Manutenção', minutes: 15, percentage: 20 },
      { name: 'Troca de Produto', minutes: 10, percentage: 13 },
      { name: 'Quebra', minutes: 15, percentage: 20 },
      { name: 'Setup', minutes: 12, percentage: 16 },
      { name: 'Falta de Material', minutes: 23, percentage: 31 },
    ],
    line1: [
      { name: 'Manutenção', minutes: 8, percentage: 20 },
      { name: 'Troca de Produto', minutes: 5, percentage: 13 },
      { name: 'Quebra', minutes: 8, percentage: 20 },
      { name: 'Setup', minutes: 6, percentage: 16 },
      { name: 'Falta de Material', minutes: 12, percentage: 31 },
    ],
    line2: [
      { name: 'Manutenção', minutes: 5, percentage: 20 },
      { name: 'Troca de Produto', minutes: 3, percentage: 13 },
      { name: 'Quebra', minutes: 5, percentage: 20 },
      { name: 'Setup', minutes: 4, percentage: 16 },
      { name: 'Falta de Material', minutes: 8, percentage: 31 },
    ],
    line3: [
      { name: 'Manutenção', minutes: 2, percentage: 20 },
      { name: 'Troca de Produto', minutes: 2, percentage: 13 },
      { name: 'Quebra', minutes: 2, percentage: 20 },
      { name: 'Setup', minutes: 2, percentage: 16 },
      { name: 'Falta de Material', minutes: 3, percentage: 31 },
    ],
  },
  week: {
    all: [
      { name: 'Manutenção', minutes: 100, percentage: 22 },
      { name: 'Troca de Produto', minutes: 80, percentage: 18 },
      { name: 'Quebra', minutes: 90, percentage: 20 },
      { name: 'Setup', minutes: 50, percentage: 11 },
      { name: 'Falta de Material', minutes: 130, percentage: 29 },
    ],
    line1: [
      { name: 'Manutenção', minutes: 50, percentage: 22 },
      { name: 'Troca de Produto', minutes: 40, percentage: 18 },
      { name: 'Quebra', minutes: 45, percentage: 20 },
      { name: 'Setup', minutes: 25, percentage: 11 },
      { name: 'Falta de Material', minutes: 65, percentage: 29 },
    ],
    line2: [
      { name: 'Manutenção', minutes: 30, percentage: 22 },
      { name: 'Troca de Produto', minutes: 24, percentage: 18 },
      { name: 'Quebra', minutes: 27, percentage: 20 },
      { name: 'Setup', minutes: 15, percentage: 11 },
      { name: 'Falta de Material', minutes: 39, percentage: 29 },
    ],
    line3: [
      { name: 'Manutenção', minutes: 20, percentage: 22 },
      { name: 'Troca de Produto', minutes: 16, percentage: 18 },
      { name: 'Quebra', minutes: 18, percentage: 20 },
      { name: 'Setup', minutes: 10, percentage: 11 },
      { name: 'Falta de Material', minutes: 26, percentage: 29 },
    ],
  },
  month: {
    all: [
      { name: 'Manutenção', minutes: 400, percentage: 23 },
      { name: 'Troca de Produto', minutes: 320, percentage: 18 },
      { name: 'Quebra', minutes: 360, percentage: 20 },
      { name: 'Setup', minutes: 200, percentage: 11 },
      { name: 'Falta de Material', minutes: 520, percentage: 28 },
    ],
    line1: [
      { name: 'Manutenção', minutes: 200, percentage: 23 },
      { name: 'Troca de Produto', minutes: 160, percentage: 18 },
      { name: 'Quebra', minutes: 180, percentage: 20 },
      { name: 'Setup', minutes: 100, percentage: 11 },
      { name: 'Falta de Material', minutes: 260, percentage: 28 },
    ],
    line2: [
      { name: 'Manutenção', minutes: 120, percentage: 23 },
      { name: 'Troca de Produto', minutes: 96, percentage: 18 },
      { name: 'Quebra', minutes: 108, percentage: 20 },
      { name: 'Setup', minutes: 60, percentage: 11 },
      { name: 'Falta de Material', minutes: 156, percentage: 28 },
    ],
    line3: [
      { name: 'Manutenção', minutes: 80, percentage: 23 },
      { name: 'Troca de Produto', minutes: 64, percentage: 18 },
      { name: 'Quebra', minutes: 72, percentage: 20 },
      { name: 'Setup', minutes: 40, percentage: 11 },
      { name: 'Falta de Material', minutes: 104, percentage: 28 },
    ],
  }
};

const baseProductionTrends = {
  today: {
    all: [
      { name: '8h', plan: 125, actual: 120 },
      { name: '10h', plan: 125, actual: 115 },
      { name: '12h', plan: 125, actual: 130 },
      { name: '14h', plan: 125, actual: 110 },
      { name: '16h', plan: 125, actual: 125 },
      { name: '18h', plan: 125, actual: 118 },
      { name: '20h', plan: 125, actual: 122 },
      { name: '22h', plan: 125, actual: 130 },
    ],
    line1: [
      { name: '8h', plan: 65, actual: 62 },
      { name: '10h', plan: 65, actual: 60 },
      { name: '12h', plan: 65, actual: 68 },
      { name: '14h', plan: 65, actual: 58 },
      { name: '16h', plan: 65, actual: 65 },
      { name: '18h', plan: 65, actual: 61 },
      { name: '20h', plan: 65, actual: 64 },
      { name: '22h', plan: 65, actual: 67 },
    ],
    line2: [
      { name: '8h', plan: 35, actual: 34 },
      { name: '10h', plan: 35, actual: 33 },
      { name: '12h', plan: 35, actual: 37 },
      { name: '14h', plan: 35, actual: 32 },
      { name: '16h', plan: 35, actual: 35 },
      { name: '18h', plan: 35, actual: 35 },
      { name: '20h', plan: 35, actual: 35 },
      { name: '22h', plan: 35, actual: 36 },
    ],
    line3: [
      { name: '8h', plan: 25, actual: 24 },
      { name: '10h', plan: 25, actual: 22 },
      { name: '12h', plan: 25, actual: 25 },
      { name: '14h', plan: 25, actual: 20 },
      { name: '16h', plan: 25, actual: 25 },
      { name: '18h', plan: 25, actual: 23 },
      { name: '20h', plan: 25, actual: 23 },
      { name: '22h', plan: 25, actual: 27 },
    ],
  },
  yesterday: {
    all: [
      { name: '8h', plan: 125, actual: 122 },
      { name: '10h', plan: 125, actual: 120 },
      { name: '12h', plan: 125, actual: 128 },
      { name: '14h', plan: 125, actual: 118 },
      { name: '16h', plan: 125, actual: 126 },
      { name: '18h', plan: 125, actual: 124 },
      { name: '20h', plan: 125, actual: 125 },
      { name: '22h', plan: 125, actual: 127 },
    ],
    line1: [
      { name: '8h', plan: 65, actual: 64 },
      { name: '10h', plan: 65, actual: 63 },
      { name: '12h', plan: 65, actual: 67 },
      { name: '14h', plan: 65, actual: 62 },
      { name: '16h', plan: 65, actual: 66 },
      { name: '18h', plan: 65, actual: 65 },
      { name: '20h', plan: 65, actual: 65 },
      { name: '22h', plan: 65, actual: 66 },
    ],
    line2: [
      { name: '8h', plan: 35, actual: 35 },
      { name: '10h', plan: 35, actual: 34 },
      { name: '12h', plan: 35, actual: 36 },
      { name: '14h', plan: 35, actual: 33 },
      { name: '16h', plan: 35, actual: 35 },
      { name: '18h', plan: 35, actual: 35 },
      { name: '20h', plan: 35, actual: 35 },
      { name: '22h', plan: 35, actual: 35 },
    ],
    line3: [
      { name: '8h', plan: 25, actual: 23 },
      { name: '10h', plan: 25, actual: 23 },
      { name: '12h', plan: 25, actual: 25 },
      { name: '14h', plan: 25, actual: 23 },
      { name: '16h', plan: 25, actual: 25 },
      { name: '18h', plan: 25, actual: 24 },
      { name: '20h', plan: 25, actual: 25 },
      { name: '22h', plan: 25, actual: 26 },
    ],
  },
  week: {
    all: [
      { name: 'Seg', plan: 1000, actual: 950 },
      { name: 'Ter', plan: 1000, actual: 920 },
      { name: 'Qua', plan: 1000, actual: 980 },
      { name: 'Qui', plan: 1000, actual: 890 },
      { name: 'Sex', plan: 1000, actual: 940 },
      { name: 'Sáb', plan: 500, actual: 480 },
      { name: 'Dom', plan: 500, actual: 520 },
    ],
    line1: [
      { name: 'Seg', plan: 500, actual: 480 },
      { name: 'Ter', plan: 500, actual: 470 },
      { name: 'Qua', plan: 500, actual: 490 },
      { name: 'Qui', plan: 500, actual: 460 },
      { name: 'Sex', plan: 500, actual: 480 },
      { name: 'Sáb', plan: 250, actual: 240 },
      { name: 'Dom', plan: 250, actual: 260 },
    ],
    line2: [
      { name: 'Seg', plan: 300, actual: 290 },
      { name: 'Ter', plan: 300, actual: 280 },
      { name: 'Qua', plan: 300, actual: 295 },
      { name: 'Qui', plan: 300, actual: 270 },
      { name: 'Sex', plan: 300, actual: 290 },
      { name: 'Sáb', plan: 150, actual: 145 },
      { name: 'Dom', plan: 150, actual: 155 },
    ],
    line3: [
      { name: 'Seg', plan: 200, actual: 180 },
      { name: 'Ter', plan: 200, actual: 170 },
      { name: 'Qua', plan: 200, actual: 195 },
      { name: 'Qui', plan: 200, actual: 160 },
      { name: 'Sex', plan: 200, actual: 170 },
      { name: 'Sáb', plan: 100, actual: 95 },
      { name: 'Dom', plan: 100, actual: 105 },
    ],
  },
  month: {
    all: [
      { name: 'Sem 1', plan: 5000, actual: 4800 },
      { name: 'Sem 2', plan: 5000, actual: 4700 },
      { name: 'Sem 3', plan: 5000, actual: 4900 },
      { name: 'Sem 4', plan: 5000, actual: 4800 },
    ],
    line1: [
      { name: 'Sem 1', plan: 2500, actual: 2400 },
      { name: 'Sem 2', plan: 2500, actual: 2350 },
      { name: 'Sem 3', plan: 2500, actual: 2450 },
      { name: 'Sem 4', plan: 2500, actual: 2400 },
    ],
    line2: [
      { name: 'Sem 1', plan: 1500, actual: 1450 },
      { name: 'Sem 2', plan: 1500, actual: 1400 },
      { name: 'Sem 3', plan: 1500, actual: 1470 },
      { name: 'Sem 4', plan: 1500, actual: 1450 },
    ],
    line3: [
      { name: 'Sem 1', plan: 1000, actual: 950 },
      { name: 'Sem 2', plan: 1000, actual: 920 },
      { name: 'Sem 3', plan: 1000, actual: 980 },
      { name: 'Sem 4', plan: 1000, actual: 950 },
    ],
  }
};

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
  const [productionData, setProductionData] = useState(baseProductionData.today.all);
  const [downtimeData, setDowntimeData] = useState(baseDowntimeData.today.all);
  const [productionTrends, setProductionTrends] = useState(baseProductionTrends.today.all);
  const { toast } = useToast();
  
  useEffect(() => {
    const newProductionData = baseProductionData[timeFilter as keyof typeof baseProductionData][lineFilter as keyof typeof baseProductionData.today];
    const newDowntimeData = baseDowntimeData[timeFilter as keyof typeof baseDowntimeData][lineFilter as keyof typeof baseDowntimeData.today];
    const newProductionTrends = baseProductionTrends[timeFilter as keyof typeof baseProductionTrends][lineFilter as keyof typeof baseProductionTrends.today];
    
    setProductionData(newProductionData);
    setDowntimeData(newDowntimeData);
    setProductionTrends(newProductionTrends);
    
    toast({
      title: "Filtros atualizados",
      description: `Período: ${timeFilter}, Linha: ${lineFilter}`,
    });
  }, [timeFilter, lineFilter, toast]);

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

  const setupsCount = timeFilter === "today" ? 3 : 
                     timeFilter === "yesterday" ? 2 :
                     timeFilter === "week" ? 12 :
                     timeFilter === "month" ? 45 : 3;

  return (
    <AppLayout title="Dashboard - OEE">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard OEE - {empresa.nome}</h1>
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
