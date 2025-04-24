
import React, { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Target, BarChart2, CheckCheck, Gauge } from "lucide-react";

export default function GoalsSettings() {
  const { toast } = useToast();
  const [oeeGoal, setOeeGoal] = useState(65);
  const [productivityGoal, setProductivityGoal] = useState(80);
  const [qualityGoal, setQualityGoal] = useState(98);
  const [efficiencyGoal, setEfficiencyGoal] = useState(75);
  
  const handleSave = () => {
    toast({
      title: "Metas salvas",
      description: "As novas metas foram salvas com sucesso.",
    });
  };

  return (
    <AppLayout title="Definição de Metas - OEE Performance Hub">
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold mb-6 flex items-center">
          <Target className="mr-2 h-6 w-6 text-purple-600" />
          Definição de Metas
        </h1>
        
        <Tabs defaultValue="oee" className="space-y-6">
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="oee" className="flex items-center gap-2">
              <Gauge className="h-4 w-4" />
              Metas de OEE
            </TabsTrigger>
            <TabsTrigger value="production" className="flex items-center gap-2">
              <BarChart2 className="h-4 w-4" />
              Metas de Produção
            </TabsTrigger>
            <TabsTrigger value="quality" className="flex items-center gap-2">
              <CheckCheck className="h-4 w-4" />
              Metas de Qualidade
            </TabsTrigger>
            <TabsTrigger value="efficiency" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Outras Metas
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="oee">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Metas de OEE</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="oee-goal">Meta de OEE Geral (%)</Label>
                    <Input
                      id="oee-goal"
                      type="number"
                      min={0}
                      max={100}
                      value={oeeGoal}
                      onChange={(e) => setOeeGoal(Number(e.target.value))}
                      className="max-w-sm"
                    />
                    <p className="text-sm text-muted-foreground">
                      Meta a ser atingida para o índice OEE geral da empresa.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="disponibilidade-goal">Meta de Disponibilidade (%)</Label>
                      <Input
                        id="disponibilidade-goal"
                        type="number"
                        min={0}
                        max={100}
                        value={85}
                        className="max-w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="desempenho-goal">Meta de Desempenho (%)</Label>
                      <Input
                        id="desempenho-goal"
                        type="number"
                        min={0}
                        max={100}
                        value={90}
                        className="max-w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="qualidade-goal">Meta de Qualidade (%)</Label>
                      <Input
                        id="qualidade-goal"
                        type="number"
                        min={0}
                        max={100}
                        value={95}
                        className="max-w-full"
                      />
                    </div>
                  </div>
                  
                  <Button onClick={handleSave} className="mt-6">Salvar Metas de OEE</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="production">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Metas de Produção</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="productivity-goal">Meta de Produtividade (%)</Label>
                    <Input
                      id="productivity-goal"
                      type="number"
                      min={0}
                      max={100}
                      value={productivityGoal}
                      onChange={(e) => setProductivityGoal(Number(e.target.value))}
                      className="max-w-sm"
                    />
                    <p className="text-sm text-muted-foreground">
                      Meta de produtividade em relação à capacidade nominal.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="setup-time-goal">Meta de Tempo de Setup (min)</Label>
                      <Input
                        id="setup-time-goal"
                        type="number"
                        min={0}
                        value={15}
                        className="max-w-full"
                      />
                      <p className="text-sm text-muted-foreground">
                        Tempo máximo de setup desejado em minutos.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stop-time-goal">Meta de Tempo de Parada (%)</Label>
                      <Input
                        id="stop-time-goal"
                        type="number"
                        min={0}
                        max={100}
                        value={10}
                        className="max-w-full"
                      />
                      <p className="text-sm text-muted-foreground">
                        Percentual máximo de tempo de parada em relação ao tempo total disponível.
                      </p>
                    </div>
                  </div>
                  
                  <Button onClick={handleSave} className="mt-6">Salvar Metas de Produção</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="quality">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Metas de Qualidade</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="quality-goal">Meta de Qualidade (%)</Label>
                    <Input
                      id="quality-goal"
                      type="number"
                      min={0}
                      max={100}
                      value={qualityGoal}
                      onChange={(e) => setQualityGoal(Number(e.target.value))}
                      className="max-w-sm"
                    />
                    <p className="text-sm text-muted-foreground">
                      Percentual mínimo de produtos conformes.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="defect-goal">Meta de Defeitos (PPM)</Label>
                      <Input
                        id="defect-goal"
                        type="number"
                        min={0}
                        value={500}
                        className="max-w-full"
                      />
                      <p className="text-sm text-muted-foreground">
                        Meta de defeitos em Partes Por Milhão.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rework-goal">Meta de Retrabalho (%)</Label>
                      <Input
                        id="rework-goal"
                        type="number"
                        min={0}
                        max={100}
                        value={2}
                        className="max-w-full"
                      />
                      <p className="text-sm text-muted-foreground">
                        Percentual máximo aceitável de retrabalho.
                      </p>
                    </div>
                  </div>
                  
                  <Button onClick={handleSave} className="mt-6">Salvar Metas de Qualidade</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="efficiency">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Outras Metas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="efficiency-goal">Meta de Eficiência Energética (%)</Label>
                    <Input
                      id="efficiency-goal"
                      type="number"
                      min={0}
                      max={100}
                      value={efficiencyGoal}
                      onChange={(e) => setEfficiencyGoal(Number(e.target.value))}
                      className="max-w-sm"
                    />
                    <p className="text-sm text-muted-foreground">
                      Meta de eficiência energética em relação ao padrão do setor.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="maintenance-goal">Meta de MTBF (Horas)</Label>
                      <Input
                        id="maintenance-goal"
                        type="number"
                        min={0}
                        value={120}
                        className="max-w-full"
                      />
                      <p className="text-sm text-muted-foreground">
                        Tempo médio entre falhas (Mean Time Between Failures) em horas.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mttr-goal">Meta de MTTR (Minutos)</Label>
                      <Input
                        id="mttr-goal"
                        type="number"
                        min={0}
                        value={30}
                        className="max-w-full"
                      />
                      <p className="text-sm text-muted-foreground">
                        Tempo médio para reparo (Mean Time To Repair) em minutos.
                      </p>
                    </div>
                  </div>
                  
                  <Button onClick={handleSave} className="mt-6">Salvar Outras Metas</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
