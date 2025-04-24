
import React from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Truck, Settings } from "lucide-react";
import LoginForm from '@/components/auth/LoginForm';
import { useAuth } from '@/contexts/AuthContext';
import LogoutButton from '@/components/auth/LogoutButton';
import ReceivingForm from '@/components/logistics/ReceivingForm';
import ShippingForm from '@/components/logistics/ShippingForm';
import LogisticsIndicators from '@/components/logistics/LogisticsIndicators';

const Index = () => {
  const { isAuthenticated, login } = useAuth();

  const handleLoginSuccess = () => {
    login();
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Sistema de Gestão de Produção</CardTitle>
            <CardDescription>Faça login para acessar o sistema</CardDescription>
          </CardHeader>
        </Card>
        
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center">
          <div>
            <CardTitle className="text-2xl">Sistema de Gestão de Produção</CardTitle>
            <CardDescription>Selecione um módulo para começar</CardDescription>
          </div>
          <LogoutButton />
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Inserir Dados</CardTitle>
            <CardDescription>Registro de informações de produção</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/production">
              <Button className="w-full">Acessar</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Cadastros</CardTitle>
            <CardDescription>Gerenciar locais, tempos e produções nominais</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/registrations">
              <Button className="w-full">Acessar</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Logística
              </CardTitle>
              <CardDescription>Gerenciar recebimento e expedição</CardDescription>
            </div>
            <div className="bg-primary/10 text-primary text-xs rounded-full px-2 py-1">
              Novo
            </div>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full" 
              onClick={() => document.getElementById('logistics-tab')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Acessar
            </Button>
          </CardContent>
        </Card>
      </div>

      <div id="logistics-tab" className="mt-10">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Módulo de Logística</CardTitle>
            <CardDescription>
              Gerenciamento de operações de recebimento e expedição
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="receiving" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="receiving">Recebimento</TabsTrigger>
                <TabsTrigger value="shipping">Expedição</TabsTrigger>
                <TabsTrigger value="indicators">Indicadores</TabsTrigger>
              </TabsList>
              <TabsContent value="receiving">
                <ReceivingForm />
              </TabsContent>
              <TabsContent value="shipping">
                <ShippingForm />
              </TabsContent>
              <TabsContent value="indicators">
                <LogisticsIndicators />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <p className="text-center text-sm text-muted-foreground">
          Entre em contato com o administrador para obter suporte técnico.
        </p>
      </div>
    </div>
  );
};

export default Index;
