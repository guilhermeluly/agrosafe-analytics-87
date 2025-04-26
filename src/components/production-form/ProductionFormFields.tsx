import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StopsSection from './StopsSection';
import SetupTimesSectionComponent from './SetupTimesSection';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "@/hooks/use-toast";
import { SetupTime, StopTime } from '@/types';
import ScheduledBreaksSection from './UnscheduledBreaksSection';
import UnscheduledStopsSection from './UnscheduledStopsSection';

// Define the Setup interface to match what SetupTimesSection expects
interface Setup {
  startTime: string;
  endTime: string;
  description: string;
}

const ProductionFormFields: React.FC = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    shift: "",
    location: "",
    plannedProduction: 0,
    actualProduction: 0,
    rework: 0,
    scrap: 0,
    lostPackages: 0,
  });

  const [setupTimes, setSetupTimes] = useState<SetupTime[]>([]);
  const [stopTimes, setStopTimes] = useState<StopTime[]>([]);

  // Helper function to convert SetupTime to Setup
  const mapSetupTimeToSetup = (setupTime: SetupTime): Setup => {
    return {
      startTime: setupTime.horarioInicio || '',
      endTime: setupTime.horarioFim || '',
      description: setupTime.descricao
    };
  };

  // Helper function to convert Setup to SetupTime
  const mapSetupToSetupTime = (setup: Setup): SetupTime => {
    return {
      id: uuidv4(),
      tempo: 0, // Calculate time difference if needed
      descricao: setup.description,
      horarioInicio: setup.startTime,
      horarioFim: setup.endTime
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Dados registrados",
      description: "Os dados de produção foram salvos com sucesso.",
    });
  };

  const [unscheduledBreaks, setUnscheduledBreaks] = useState<{ startTime: string; endTime: string; description: string }[]>([]);
  const [unscheduledStops, setUnscheduledStops] = useState<{ startTime: string; endTime: string; description: string }[]>([]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Inserir Dados de Produção</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Data *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="shift">Turno *</Label>
              <Select
                value={formData.shift}
                onValueChange={(value) => setFormData({...formData, shift: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o turno" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manha">Manhã (06:00 - 14:00)</SelectItem>
                  <SelectItem value="tarde">Tarde (14:00 - 22:00)</SelectItem>
                  <SelectItem value="noite">Noite (22:00 - 06:00)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="location">Linha de Produção *</Label>
            <Select
              value={formData.location}
              onValueChange={(value) => setFormData({...formData, location: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma linha" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="linha1">Linha 1 - Cap. Nominal: 100 unidades/h</SelectItem>
                <SelectItem value="linha2">Linha 2 - Cap. Nominal: 150 unidades/h</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="plannedProduction">Produção Planejada (unidades) *</Label>
              <Input
                id="plannedProduction"
                type="number"
                value={formData.plannedProduction}
                onChange={(e) => setFormData({...formData, plannedProduction: Number(e.target.value)})}
                required
              />
            </div>
            <div>
              <Label htmlFor="actualProduction">Produção Real (unidades) *</Label>
              <Input
                id="actualProduction"
                type="number"
                value={formData.actualProduction}
                onChange={(e) => setFormData({...formData, actualProduction: Number(e.target.value)})}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="rework">Retrabalho</Label>
              <Input
                id="rework"
                type="number"
                value={formData.rework}
                onChange={(e) => setFormData({...formData, rework: Number(e.target.value)})}
              />
            </div>
            <div>
              <Label htmlFor="scrap">Refugo</Label>
              <Input
                id="scrap"
                type="number"
                value={formData.scrap}
                onChange={(e) => setFormData({...formData, scrap: Number(e.target.value)})}
              />
            </div>
            <div>
              <Label htmlFor="lostPackages">Embalagens Perdidas</Label>
              <Input
                id="lostPackages"
                type="number"
                value={formData.lostPackages}
                onChange={(e) => setFormData({...formData, lostPackages: Number(e.target.value)})}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <ScheduledBreaksSection 
        breaks={unscheduledBreaks}
        onAdd={(newBreak) => setUnscheduledBreaks([...unscheduledBreaks, newBreak])}
        onRemove={(index) => setUnscheduledBreaks(unscheduledBreaks.filter((_, i) => i !== index))}
      />

      <UnscheduledStopsSection 
        stops={unscheduledStops}
        onAdd={(newStop) => setUnscheduledStops([...unscheduledStops, newStop])}
        onRemove={(index) => setUnscheduledStops(unscheduledStops.filter((_, i) => i !== index))}
      />

      <SetupTimesSectionComponent 
        setups={setupTimes.map(mapSetupTimeToSetup)}
        onAdd={(setup) => setSetupTimes([...setupTimes, mapSetupToSetupTime(setup)])}
        onRemove={(index) => setSetupTimes(setupTimes.filter((_, i) => i !== index))}
      />

      <div className="flex justify-end">
        <Button type="submit" className="w-full md:w-auto">
          Registrar Produção
        </Button>
      </div>
    </form>
  );
};

export default ProductionFormFields;
