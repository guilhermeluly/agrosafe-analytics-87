
import React, { useState } from 'react';
import AppLayout from '../components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductionFormFields } from "@/components/production-form/ProductionFormFields";
import { StopsSection } from "@/components/production-form/StopsSection";
import { SetupTimesSection } from "@/components/production-form/SetupTimesSection";
import { LogisticsFormContainer } from "@/components/production-form/LogisticsFormContainer";
import { DataTypeSelector } from "@/components/data-input/DataTypeSelector";
import { Button } from "@/components/ui/button";
import { ImportCSV } from "@/components/ImportCSV";

const ProductionForm = () => {
  const [selectedTab, setSelectedTab] = useState("production");
  const [dataType, setDataType] = useState<"normal" | "historical">("normal");
  
  return (
    <AppLayout title="Registrar Dados">
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Registrar Dados de Produção</h1>
          <div className="flex items-center gap-2">
            <DataTypeSelector 
              value={dataType} 
              onChange={setDataType} 
            />
            <ImportCSV />
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Formulário de Registro</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="production">Produção</TabsTrigger>
                <TabsTrigger value="stops">Paradas</TabsTrigger>
                <TabsTrigger value="setup">Setup</TabsTrigger>
                <TabsTrigger value="logistics">Logística</TabsTrigger>
              </TabsList>
              <TabsContent value="production">
                <ProductionFormFields dataType={dataType} />
              </TabsContent>
              <TabsContent value="stops">
                <StopsSection dataType={dataType} />
              </TabsContent>
              <TabsContent value="setup">
                <SetupTimesSection dataType={dataType} />
              </TabsContent>
              <TabsContent value="logistics">
                <LogisticsFormContainer />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default ProductionForm;
