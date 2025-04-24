
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface ShippingFormData {
  date: string;
  shift: string;
  sector: string;
  startTime: string;
  endTime: string;
  totalWeight: string;
  cargoType: string;
  setupTime: string;
  peopleCount: string;
  hasDamage: boolean;
  observations: string;
}

const initialFormData: ShippingFormData = {
  date: format(new Date(), 'yyyy-MM-dd'),
  shift: '',
  sector: '',
  startTime: '',
  endTime: '',
  totalWeight: '',
  cargoType: 'pallets',
  setupTime: '',
  peopleCount: '',
  hasDamage: false,
  observations: '',
};

const ShippingForm = () => {
  const [formData, setFormData] = useState<ShippingFormData>(initialFormData);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, hasDamage: checked }));
  };

  const handleSelectChange = (value: string, name: keyof ShippingFormData) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    
    toast({
      title: "Dados salvos com sucesso",
      description: "Registro de expedição salvo no sistema",
    });
  };

  // Calculate loading time in minutes (if both times are set)
  const calculateLoadingTime = (): number | null => {
    if (!formData.startTime || !formData.endTime) return null;
    
    const start = new Date(`1970-01-01T${formData.startTime}`);
    const end = new Date(`1970-01-01T${formData.endTime}`);
    
    // If end time is before start time, assume it's the next day
    const diffMs = end.getTime() - start.getTime();
    return Math.round(diffMs / 60000); // Convert ms to minutes
  };

  const loadingTime = calculateLoadingTime();

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <div className="flex">
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
                <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="shift">Turno</Label>
              <Select 
                onValueChange={(value) => handleSelectChange(value, 'shift')}
                value={formData.shift}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o turno" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Manhã</SelectItem>
                  <SelectItem value="afternoon">Tarde</SelectItem>
                  <SelectItem value="night">Noite</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sector">Linha ou Setor</Label>
              <Input
                id="sector"
                name="sector"
                value={formData.sector}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="startTime">Hora de Início</Label>
              <Input
                id="startTime"
                name="startTime"
                type="time"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endTime">Hora de Fim</Label>
              <Input
                id="endTime"
                name="endTime"
                type="time"
                value={formData.endTime}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="totalWeight">Peso Total (kg)</Label>
              <Input
                id="totalWeight"
                name="totalWeight"
                type="number"
                value={formData.totalWeight}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cargoType">Tipo de Carga</Label>
              <Select 
                onValueChange={(value) => handleSelectChange(value, 'cargoType')}
                value={formData.cargoType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de carga" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pallets">Pallets</SelectItem>
                  <SelectItem value="bags">Bags</SelectItem>
                  <SelectItem value="boxes">Caixas</SelectItem>
                  <SelectItem value="bulk">Granel</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="setupTime">Tempo de Setup Anterior (min)</Label>
              <Input
                id="setupTime"
                name="setupTime"
                type="number"
                value={formData.setupTime}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="peopleCount">Quantidade de Pessoas</Label>
              <Input
                id="peopleCount"
                name="peopleCount"
                type="number"
                value={formData.peopleCount}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="flex items-center space-x-2 pt-4">
              <Checkbox
                id="hasDamage"
                checked={formData.hasDamage}
                onCheckedChange={handleCheckboxChange}
              />
              <label
                htmlFor="hasDamage"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Avarias?
              </label>
            </div>
          </div>
          
          <div className="space-y-2 mt-6">
            <Label htmlFor="observations">Observações</Label>
            <Textarea
              id="observations"
              name="observations"
              value={formData.observations}
              onChange={handleChange}
              rows={3}
            />
          </div>

          {loadingTime !== null && (
            <div className="mt-6 p-4 bg-muted rounded-md">
              <h3 className="font-semibold mb-2">Indicadores Calculados:</h3>
              <ul className="space-y-2">
                <li>Tempo de carregamento: <span className="font-medium">{loadingTime} minutos</span></li>
                {formData.totalWeight && formData.peopleCount && (
                  <li>
                    Média por pessoa: <span className="font-medium">
                      {(parseFloat(formData.totalWeight) / parseInt(formData.peopleCount)).toFixed(2)} kg/pessoa
                    </span>
                  </li>
                )}
                {formData.setupTime && (
                  <li>
                    Tempo de setup: <span className="font-medium">{formData.setupTime} minutos</span>
                  </li>
                )}
              </ul>
            </div>
          )}
        </CardContent>
        
        <CardFooter>
          <Button type="submit" className="w-full">
            <Save className="mr-2 h-4 w-4" />
            Salvar Dados
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ShippingForm;
