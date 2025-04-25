
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProductionFormFieldsProps {
  formData: {
    date: string;
    shift: string;
    location: string;
    plannedProduction: number;
    actualProduction: number;
    rework: number;
    scrap: number;
    lostPackages: number;
    setupTime: number;
    observations: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  formErrors: {[key: string]: string};
  setFormErrors: React.Dispatch<React.SetStateAction<{[key: string]: string}>>;
  allLines: { id: string; name: string; nominalCapacity: number; standardSetupTime: number }[];
  shifts: { id: string; name: string; startTime: string; endTime: string }[];
  unitType: "unidades" | "kg";
}

const ProductionFormFields: React.FC<ProductionFormFieldsProps> = ({
  formData,
  setFormData,
  formErrors,
  setFormErrors,
  allLines,
  shifts,
  unitType
}) => {
  const handleInputChange = (name: string, value: string | number) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 bg-white rounded-xl p-3 md:p-5 border mb-2 shadow">
      <div>
        <Label htmlFor="date" className={`font-bold text-vividPurple ${formErrors.date ? "text-destructive" : ""}`}>
          Data *
        </Label>
        <Input
          id="date"
          name="date"
          type="date"
          value={formData.date}
          onChange={e => handleInputChange("date", e.target.value)}
          required
          className={`bg-softGray ${formErrors.date ? "border-destructive" : ""}`}
        />
        {formErrors.date && <p className="text-xs text-destructive">{formErrors.date}</p>}
      </div>
      <div>
        <Label htmlFor="shift" className={`font-bold text-vividPurple ${formErrors.shift ? "text-destructive" : ""}`}>
          Turno *
        </Label>
        <Select
          value={formData.shift}
          onValueChange={value => handleInputChange("shift", value)}
        >
          <SelectTrigger className={`bg-softGray ${formErrors.shift ? "border-destructive" : ""}`}>
            <SelectValue placeholder="Selecione um turno" />
          </SelectTrigger>
          <SelectContent>
            {shifts.map(shift => (
              <SelectItem key={shift.id} value={shift.name}>
                {shift.name} ({shift.startTime} - {shift.endTime})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {formErrors.shift && <p className="text-xs text-destructive">{formErrors.shift}</p>}
      </div>
      <div>
        <Label htmlFor="location" className={`font-bold text-vividPurple ${formErrors.location ? "text-destructive" : ""}`}>
          Linha de Produção *
        </Label>
        <Select
          value={formData.location}
          onValueChange={value => handleInputChange("location", value)}
        >
          <SelectTrigger className={`bg-softGray ${formErrors.location ? "border-destructive" : ""}`}>
            <SelectValue placeholder="Selecione uma linha de produção" />
          </SelectTrigger>
          <SelectContent>
            {allLines.map(line => (
              <SelectItem key={line.id} value={line.name}>
                {line.name} - Cap. Nominal: {line.nominalCapacity} {unitType}/h
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {formErrors.location && <p className="text-xs text-destructive">{formErrors.location}</p>}
      </div>

      {/* Save button - Changed to blue color */}
      <Button 
        type="submit" 
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        Salvar Dados
      </Button>
    </div>
  );
};

export default ProductionFormFields;
