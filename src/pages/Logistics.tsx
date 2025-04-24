
import React from 'react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import ReceivingForm from '@/components/logistics/ReceivingForm';
import ShippingForm from '@/components/logistics/ShippingForm';
import LogisticsIndicators from '@/components/logistics/LogisticsIndicators';

const Logistics = () => {
  return (
    <div className="container mx-auto py-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">Módulo de Logística</CardTitle>
          <CardDescription>
            Gerenciamento de operações de recebimento e expedição
          </CardDescription>
        </CardHeader>
      </Card>

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
    </div>
  );
};

export default Logistics;
