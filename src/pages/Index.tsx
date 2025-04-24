
import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import LogoDisplay from "../components/LogoDisplay";
import { useEmpresa } from "../context/EmpresaContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart2, FileText } from "lucide-react";
import AppLayout from "../components/AppLayout";

const Index = () => {
  // const { empresa } = useEmpresa(); // não precisamos mais do nome do cliente

  return (
    <AppLayout title="">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          {/* <h1 className="text-2xl font-bold">Bem-vindo ao {empresa.nome} - Indicadores</h1> */}
          <h1 className="text-2xl font-bold">Bem-vindo ao sistema</h1>
          <LogoDisplay altura={36} />
        </div>

        <Card className="mb-8 shadow-md">
          <CardHeader>
            <CardTitle>Sistema de Monitoramento de Desempenho</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-gray-600 mb-4">
              Sistema de monitoramento de desempenho operacional para sua empresa. Acesse as principais funcionalidades abaixo:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <Card className="p-4 hover:bg-gray-50 cursor-pointer transition-colors border-l-4 border-blue-500 shadow-sm">
                <Link to="/production-form" className="block">
                  <div className="flex items-center mb-2">
                    <FileText className="mr-2 text-blue-500" size={24} />
                    <h3 className="font-bold text-xl">Inserir Dados</h3>
                  </div>
                  <p className="text-gray-500">
                    Cadastre informações de produção e paradas para monitoramento de OEE
                  </p>
                </Link>
              </Card>

              <Card className="p-4 hover:bg-gray-50 cursor-pointer transition-colors border-l-4 border-green-500 shadow-sm">
                <Link to="/dashboard" className="block">
                  <div className="flex items-center mb-2">
                    <BarChart2 className="mr-2 text-green-500" size={24} />
                    <h3 className="font-bold text-xl">Dashboard</h3>
                  </div>
                  <p className="text-gray-500">
                    Visualize seus indicadores de desempenho em tempo real
                  </p>
                </Link>
              </Card>
            </div>
            
            <div className="mt-6">
              <Button variant="default" asChild className="w-full">
                <Link to="/production-form">
                  Acessar Inserção de Dados
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Index;
