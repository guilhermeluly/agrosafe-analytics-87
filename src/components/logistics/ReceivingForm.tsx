
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

type CargoType = 'bags' | 'pallets' | 'boxes' | 'bulk' | 'other';

interface ReceivingFormData {
  date: string;
  shift: string;
  sector: string;
  startTime: string;
  endTime: string;
  invoiceWeight: string;
  actualWeight: string;
  cargoType: CargoType;
  cargoQuantity: string;
  peopleCount: string;
  hasDamage: boolean;
  observations: string;
}

const initialFormData: ReceivingFormData = {
  date: format(new Date(), 'yyyy-MM-dd'),
  shift: '',
  sector: '',
  startTime: '',
  endTime: '',
  invoiceWeight: '',
  actualWeight: '',
  cargoType: 'bags',
  cargoQuantity: '',
  peopleCount: '',
  hasDamage: false,
  observations: '',
};

const ReceivingForm = () => {
  const [formData, setFormData] = useState<ReceivingFormData>(initialFormData);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, hasDamage: checked }));
  };

  const handleSelectChange = (value: string, name: keyof ReceivingFormData) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate the weight difference
    const invoiceWeight = parseFloat(formData.invoiceWeight) || 0;
    const actualWeight = parseFloat(formData.actualWeight) || 0;
    const difference = invoiceWeight - actualWeight;
    
    console.log('Form submitted:', formData);
    console.log('Weight difference:', difference, 'kg');
    
    toast({
      title: "Dados salvos com sucesso",
      description: `Registro de recebimento salvo. Diferença de peso: ${difference.toFixed(2)} kg`,
    });
  };

  // Calculate unloading time in minutes (if both times are set)
  const calculateUnloadingTime = (): number | null => {
    if (!formData.startTime || !formData.endTime) return null;
    
    const start = new Date(`1970-01-01T${formData.startTime}`);
    const end = new Date(`1970-01-01T${formData.endTime}`);
    
    // If end time is before start time, assume it's the next day
    const diffMs = end.getTime() - start.getTime();
    return Math.round(diffMs / 60000); // Convert ms to minutes
  };

  const unloadingTime = calculateUnloadingTime();

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
              <Label htmlFor="invoiceWeight">Peso na Nota Fiscal (kg)</Label>
              <Input
                id="invoiceWeight"
                name="invoiceWeight"
                type="number"
                value={formData.invoiceWeight}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="actualWeight">Peso Real Recebido (kg)</Label>
              <Input
                id="actualWeight"
                name="actualWeight"
                type="number"
                value={formData.actualWeight}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cargoType">Tipo de Carga</Label>
              <Select 
                onValueChange={(value) => handleSelectChange(value as CargoType, 'cargoType')}
                value={formData.cargoType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de carga" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bags">Bags</SelectItem>
                  <SelectItem value="pallets">Pallets</SelectItem>
                  <SelectItem value="boxes">Caixas</SelectItem>
                  <SelectItem value="bulk">Granel</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cargoQuantity">Quantidade</Label>
              <Input
                id="cargoQuantity"
                name="cargoQuantity"
                type="number"
                value={formData.cargoQuantity}
                onChange={handleChange}
                required
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

          {unloadingTime !== null && (
            <div className="mt-6 p-4 bg-muted rounded-md">
              <h3 className="font-semibold mb-2">Indicadores Calculados:</h3>
              <ul className="space-y-2">
                <li>Tempo de descarregamento: <span className="font-medium">{unloadingTime} minutos</span></li>
                {formData.actualWeight && formData.peopleCount && (
                  <li>
                    Média por pessoa: <span className="font-medium">
                      {(parseFloat(formData.actualWeight) / parseInt(formData.peopleCount)).toFixed(2)} kg/pessoa
                    </span>
                  </li>
                )}
                {formData.invoiceWeight && formData.actualWeight && (
                  <li>
                    Diferença de peso: <span className="font-medium">
                      {(parseFloat(formData.invoiceWeight) - parseFloat(formData.actualWeight)).toFixed(2)} kg
                    </span>
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

export default ReceivingForm;
