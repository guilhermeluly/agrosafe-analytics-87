
import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import LogoDisplay from "../components/LogoDisplay";
import { useEmpresa } from "../context/EmpresaContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const { empresa } = useEmpresa();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-end mb-4">
          <LogoDisplay altura={36} />
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Bem-vindo ao OEE Performance Hub</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-gray-600 mb-4">
              Sistema de monitoramento de desempenho operacional para sua empresa.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <Card className="p-4 hover:bg-gray-50 cursor-pointer">
                <Link to="/dashboard" className="block">
                  <h3 className="font-bold text-xl mb-2">Dashboard</h3>
                  <p className="text-gray-500">
                    Visualize seus indicadores de desempenho em tempo real
                  </p>
                </Link>
              </Card>

              <Card className="p-4 hover:bg-gray-50 cursor-pointer">
                <Link to="/relatorios" className="block">
                  <h3 className="font-bold text-xl mb-2">Relatórios</h3>
                  <p className="text-gray-500">
                    Acesse relatórios detalhados de performance
                  </p>
                </Link>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
