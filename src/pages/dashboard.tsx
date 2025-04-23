
import React from "react";
import { Helmet } from "react-helmet-async";
import { useEmpresa } from "../context/EmpresaContext";
import LogoDisplay from "../components/LogoDisplay";
import Header from "../components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "../context/UserContext";

// Sample production data - in a real app this would come from a database
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

// OEE Calculation functions
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

// Create the CardIndicador component
const CardIndicador = ({ label, value, color }: { label: string; value: string; color: string }) => {
  return (
    <Card className={`border-l-4 ${color}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
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
  
  // Calculate OEE values
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
  
  return (
    <>
      <Helmet><title>Dashboard - OEE</title></Helmet>
      <Header />
      <div className="flex justify-end p-2">
        <LogoDisplay altura={36} />
      </div>
      
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Dashboard OEE</h1>
        
        {user.role === "admin" || user.role === "operator" ? (
          <div className="mb-4">
            <Card className="bg-blue-50">
              <CardContent className="p-4">
                <p className="font-medium">Produção Atual: {productionData.actualProduction} unidades</p>
                <p>Meta: {productionData.plannedProduction} unidades</p>
                <div className="h-2.5 mt-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-2.5 bg-blue-600 rounded-full" 
                    style={{ width: `${(productionData.actualProduction / productionData.plannedProduction) * 100}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <CardIndicador 
            label="Disponibilidade" 
            value={`${availability.toFixed(1)}%`} 
            color="border-blue-500" 
          />
          <CardIndicador 
            label="Performance" 
            value={`${performance.toFixed(1)}%`} 
            color="border-green-500" 
          />
          <CardIndicador 
            label="Qualidade" 
            value={`${quality.toFixed(1)}%`} 
            color="border-purple-500" 
          />
          <CardIndicador 
            label="OEE" 
            value={`${oee.toFixed(1)}%`} 
            color="border-amber-500" 
          />
        </div>
        
        {user.role === "admin" && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Análise de Perdas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Perdas por Qualidade</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span>Retrabalho:</span>
                      <span className="font-medium">{productionData.rework} unidades</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Refugo:</span>
                      <span className="font-medium">{productionData.scrap} unidades</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Embalagens Perdidas:</span>
                      <span className="font-medium">{productionData.lostPackages} unidades</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Perdas por Tempo</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span>Tempo de Parada:</span>
                      <span className="font-medium">{productionData.downtime} minutos</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Eficiência de Ciclo:</span>
                      <span className="font-medium">{performance.toFixed(1)}%</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
