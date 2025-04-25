
import React, { useState } from 'react';
import AppLayout from '../components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductionFormFields from "@/components/production-form/ProductionFormFields";
import StopsSection from "@/components/production-form/StopsSection";
import SetupTimesSection from "@/components/production-form/SetupTimesSection";
import LogisticsFormContainer from "@/components/production-form/LogisticsFormContainer";
import DataTypeSelector from "@/components/data-input/DataTypeSelector";
import { Button } from "@/components/ui/button";
import { ImportCSV } from "@/components/ImportCSV";
import { SetupTime, StopTime } from "@/types";
import { v4 as uuidv4 } from 'uuid';

const ProductionForm = () => {
  const [selectedTab, setSelectedTab] = useState("production");
  const [dataType, setDataType] = useState<"normal" | "historical">("normal");
  
  // Additional state for form fields
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    shift: "",
    location: "",
    plannedProduction: 0,
    actualProduction: 0,
    rework: 0,
    scrap: 0,
    lostPackages: 0,
    setupTime: 0,
    observations: "",
  });
  
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  
  // For StopsSection component
  const [stops, setStops] = useState<StopTime[]>([]);
  const stopReasons = [
    "Manutenção Corretiva", 
    "Manutenção Preventiva", 
    "Falta de Material", 
    "Falta de Operador",
    "Falta de Energia",
    "Ajuste de Processo",
    "Outro"
  ];
  
  const addStop = (stop: Omit<StopTime, "id">) => {
    setStops([...stops, { ...stop, id: uuidv4() }]);
  };
  
  const removeStop = (idx: number) => {
    setStops(stops.filter((_, i) => i !== idx));
  };
  
  // For SetupTimesSection component
  const [setups, setSetups] = useState<SetupTime[]>([]);
  const standardSetupTime = 30; // Default setup time in minutes
  
  const addSetup = (setup: Omit<SetupTime, "id">) => {
    setSetups([...setups, { ...setup, id: uuidv4() }]);
  };
  
  const removeSetup = (idx: number) => {
    setSetups(setups.filter((_, i) => i !== idx));
  };
  
  // For LogisticsFormContainer component
  const [loadingTime, setLoadingTime] = useState(15); // Default loading time in minutes
  const [unloadingTime, setUnloadingTime] = useState(10); // Default unloading time in minutes
  
  // Mock data for ProductionFormFields
  const allLines = [
    { id: "1", name: "Linha 1", nominalCapacity: 1000, standardSetupTime: 30 },
    { id: "2", name: "Linha 2", nominalCapacity: 1200, standardSetupTime: 25 },
    { id: "3", name: "Linha 3", nominalCapacity: 800, standardSetupTime: 35 }
  ];
  
  const shifts = [
    { id: "1", name: "Turno 1", startTime: "06:00", endTime: "14:00" },
    { id: "2", name: "Turno 2", startTime: "14:00", endTime: "22:00" },
    { id: "3", name: "Turno 3", startTime: "22:00", endTime: "06:00" }
  ];
  
  const unitType = "unidades";
  
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
                <ProductionFormFields 
                  formData={formData}
                  setFormData={setFormData}
                  formErrors={formErrors}
                  setFormErrors={setFormErrors}
                  allLines={allLines}
                  shifts={shifts}
                  unitType={unitType}
                />
              </TabsContent>
              <TabsContent value="stops">
                <StopsSection 
                  stops={stops}
                  stopReasons={stopReasons}
                  addStop={addStop}
                  removeStop={removeStop}
                />
              </TabsContent>
              <TabsContent value="setup">
                <SetupTimesSection 
                  setups={setups}
                  addSetup={addSetup}
                  removeSetup={removeSetup}
                  standardSetupTime={standardSetupTime}
                />
              </TabsContent>
              <TabsContent value="logistics">
                <LogisticsFormContainer 
                  loadingTime={loadingTime}
                  setLoadingTime={setLoadingTime}
                  unloadingTime={unloadingTime}
                  setUnloadingTime={setUnloadingTime}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default ProductionForm;
