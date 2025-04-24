
import React from 'react';
import AppLayout from '@/components/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RegistrySection from '@/components/production-form/RegistrySection';
import TruckTypesRegistry from '@/components/registries/TruckTypesRegistry';
import ShiftsRegistry from '@/components/registries/ShiftsRegistry';
import StopReasonsRegistry from '@/components/registries/StopReasonsRegistry';
import { Clock, Truck, Factory, Pause } from 'lucide-react';

export default function Cadastros() {
  return (
    <AppLayout title="Cadastros - OEE Performance Hub">
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Cadastros do Sistema</h1>
        
        <Tabs defaultValue="lines" className="space-y-4">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 gap-4">
            <TabsTrigger value="lines" className="flex items-center gap-2">
              <Factory className="h-4 w-4" />
              Linhas e Locais
            </TabsTrigger>
            <TabsTrigger value="shifts" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Turnos
            </TabsTrigger>
            <TabsTrigger value="trucks" className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Tipos de Veículos
            </TabsTrigger>
            <TabsTrigger value="stopReasons" className="flex items-center gap-2">
              <Pause className="h-4 w-4" />
              Motivos de Parada
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="lines">
            <Card>
              <CardHeader>
                <CardTitle>Cadastro de Linhas e Locais</CardTitle>
              </CardHeader>
              <CardContent>
                <RegistrySection
                  customLines={[]}
                  setCustomLines={() => {}}
                  productionLines={[]}
                  unitType="unidades"
                  setUnitType={() => {}}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="shifts">
            <Card>
              <CardHeader>
                <CardTitle>Cadastro de Turnos</CardTitle>
              </CardHeader>
              <CardContent>
                <ShiftsRegistry />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="trucks">
            <Card>
              <CardHeader>
                <CardTitle>Cadastro de Tipos de Veículos</CardTitle>
              </CardHeader>
              <CardContent>
                <TruckTypesRegistry />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stopReasons">
            <Card>
              <CardHeader>
                <CardTitle>Cadastro de Motivos de Parada</CardTitle>
              </CardHeader>
              <CardContent>
                <StopReasonsRegistry />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
