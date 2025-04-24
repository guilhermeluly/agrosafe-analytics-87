
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface MovimentacaoFormFieldsProps {
  onSave: (data: any) => void;
}

export default function MovimentacaoFormFields({ onSave }: MovimentacaoFormFieldsProps) {
  const [activeTab, setActiveTab] = useState<"expedicao" | "descarga">("expedicao");
  const [formData, setFormData] = useState({
    expedicao: {
      date: new Date().toISOString().split('T')[0],
      startTime: "",
      endTime: "",
      shift: "Manhã",
      pesoNota: 0,
      pesoBalanca: 0,
      numPessoas: 1,
      tempoDisponivel: 0,
      reprocesso: 0,
      setupMedio: 0,
      observacoes: ""
    },
    descarga: {
      date: new Date().toISOString().split('T')[0],
      startTime: "",
      endTime: "",
      shift: "Manhã",
      pesoNota: 0,
      pesoBalanca: 0,
      numPessoas: 1,
      tempoDisponivel: 0,
      reprocesso: 0,
      setupMedio: 0,
      observacoes: ""
    }
  });

  const handleChange = (type: "expedicao" | "descarga", field: string, value: any) => {
    setFormData({
      ...formData,
      [type]: {
        ...formData[type],
        [field]: value
      }
    });
  };

  const calculateSetupAvg = (type: "expedicao" | "descarga") => {
    const data = formData[type];
    if (data.startTime && data.endTime) {
      const start = new Date(`2000-01-01T${data.startTime}:00`);
      const end = new Date(`2000-01-01T${data.endTime}:00`);
      const diffMinutes = (end.getTime() - start.getTime()) / 60000;
      const setupMedio = Math.round(diffMinutes / (data.numPessoas || 1));
      
      handleChange(type, "setupMedio", setupMedio);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData[activeTab]);
  };

  const buildForm = (type: "expedicao" | "descarga") => {
    const data = formData[type];
    const title = type === "expedicao" ? "Expedição" : "Descarregamento";
    
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor={`${type}-date`}>Data *</Label>
            <Input
              id={`${type}-date`}
              type="date"
              value={data.date}
              onChange={(e) => handleChange(type, "date", e.target.value)}
              required
              className="bg-white"
            />
          </div>
          <div>
            <Label htmlFor={`${type}-shift`}>Turno *</Label>
            <select
              id={`${type}-shift`}
              value={data.shift}
              onChange={(e) => handleChange(type, "shift", e.target.value)}
              className="w-full rounded-md border bg-background px-3 py-2 border-gray-300"
              required
            >
              <option value="Manhã">Manhã</option>
              <option value="Tarde">Tarde</option>
              <option value="Noite">Noite</option>
            </select>
          </div>
          <div>
            <Label htmlFor={`${type}-tempoDisponivel`}>Tempo Disponível (min) *</Label>
            <Input
              id={`${type}-tempoDisponivel`}
              type="number"
              value={data.tempoDisponivel}
              onChange={(e) => handleChange(type, "tempoDisponivel", Number(e.target.value))}
              required
              className="bg-white"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor={`${type}-startTime`}>Hora Início *</Label>
            <Input
              id={`${type}-startTime`}
              type="time"
              value={data.startTime}
              onChange={(e) => {
                handleChange(type, "startTime", e.target.value);
                if (data.endTime) calculateSetupAvg(type);
              }}
              required
              className="bg-white"
            />
          </div>
          <div>
            <Label htmlFor={`${type}-endTime`}>Hora Fim *</Label>
            <Input
              id={`${type}-endTime`}
              type="time"
              value={data.endTime}
              onChange={(e) => {
                handleChange(type, "endTime", e.target.value);
                if (data.startTime) calculateSetupAvg(type);
              }}
              required
              className="bg-white"
            />
          </div>
          <div>
            <Label htmlFor={`${type}-numPessoas`}>Nº de Pessoas *</Label>
            <Input
              id={`${type}-numPessoas`}
              type="number"
              min="1"
              value={data.numPessoas}
              onChange={(e) => {
                handleChange(type, "numPessoas", Number(e.target.value));
                if (data.startTime && data.endTime) calculateSetupAvg(type);
              }}
              required
              className="bg-white"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`${type}-pesoNota`}>Peso da Nota (kg) *</Label>
            <Input
              id={`${type}-pesoNota`}
              type="number"
              value={data.pesoNota}
              onChange={(e) => handleChange(type, "pesoNota", Number(e.target.value))}
              required
              className="bg-white"
            />
          </div>
          <div>
            <Label htmlFor={`${type}-pesoBalanca`}>Peso na Balança (kg) *</Label>
            <Input
              id={`${type}-pesoBalanca`}
              type="number"
              value={data.pesoBalanca}
              onChange={(e) => handleChange(type, "pesoBalanca", Number(e.target.value))}
              required
              className="bg-white"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`${type}-reprocesso`}>Reprocesso Gerado (kg)</Label>
            <Input
              id={`${type}-reprocesso`}
              type="number"
              value={data.reprocesso}
              onChange={(e) => handleChange(type, "reprocesso", Number(e.target.value))}
              className="bg-white"
            />
          </div>
          <div>
            <Label htmlFor={`${type}-setupMedio`}>Tempo Médio de Setup (min)</Label>
            <Input
              id={`${type}-setupMedio`}
              type="number"
              value={data.setupMedio}
              readOnly
              className="bg-gray-100"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor={`${type}-observacoes`}>Observações</Label>
          <Textarea
            id={`${type}-observacoes`}
            value={data.observacoes}
            onChange={(e) => handleChange(type, "observacoes", e.target.value)}
            rows={3}
            className="bg-white"
          />
        </div>
        
        <Button
          type="submit"
          className="w-full h-12 text-lg font-bold rounded-full bg-vividPurple hover:bg-primary/90 shadow-lg flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          Salvar Dados de {title}
        </Button>
      </form>
    );
  };

  return (
    <Card className="shadow-lg border-2 border-vividPurple bg-softGray">
      <CardContent className="pt-6">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "expedicao" | "descarga")}>
          <TabsList className="w-full mb-4">
            <TabsTrigger value="expedicao" className="flex-1">Expedição</TabsTrigger>
            <TabsTrigger value="descarga" className="flex-1">Descarregamento</TabsTrigger>
          </TabsList>
          
          <TabsContent value="expedicao">
            <CardTitle className="mb-4 text-vividPurple">Dados de Expedição</CardTitle>
            {buildForm("expedicao")}
          </TabsContent>
          
          <TabsContent value="descarga">
            <CardTitle className="mb-4 text-vividPurple">Dados de Descarregamento</CardTitle>
            {buildForm("descarga")}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
