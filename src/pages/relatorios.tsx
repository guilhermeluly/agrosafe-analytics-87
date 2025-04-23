
import React from "react";
import { Helmet } from "react-helmet-async";
import { useEmpresa } from "../context/EmpresaContext";
import LogoDisplay from "../components/LogoDisplay";
import Header from "../components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Create a simple Report component
const Report = () => {
  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Relatórios de Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 mb-4">Selecione um período para visualizar os relatórios:</p>
          
          <div className="grid gap-4">
            <Card className="p-4 hover:bg-gray-50 cursor-pointer">
              <h3 className="font-bold">Relatório Diário</h3>
              <p className="text-sm text-gray-500">Indicadores das últimas 24 horas</p>
            </Card>
            
            <Card className="p-4 hover:bg-gray-50 cursor-pointer">
              <h3 className="font-bold">Relatório Semanal</h3>
              <p className="text-sm text-gray-500">Indicadores dos últimos 7 dias</p>
            </Card>
            
            <Card className="p-4 hover:bg-gray-50 cursor-pointer">
              <h3 className="font-bold">Relatório Mensal</h3>
              <p className="text-sm text-gray-500">Indicadores dos últimos 30 dias</p>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default function Relatorios() {
  const { empresa } = useEmpresa();
  
  return (
    <>
      <Helmet><title>Relatórios</title></Helmet>
      <Header />
      <div className="flex justify-end p-2">
        <LogoDisplay altura={32} />
      </div>
      <Report />
    </>
  );
}
