
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Shift {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
}
interface Line {
  id: string;
  name: string;
  nominalCapacity: number;
  standardSetupTime: number;
}
type UnitType = "unidades" | "kg";
interface ProductionFormFieldsProps {
  formData: any;
  setFormData: (f: any) => void;
  formErrors: {[key: string]: string};
  setFormErrors: (f: any) => void;
  allLines: Line[];
  shifts: Shift[];
  newLineName: string;
  setNewLineName: (v: string) => void;
  newLineCapacity: number;
  setNewLineCapacity: (v: number) => void;
  newLineSetup: number;
  setNewLineSetup: (v: number) => void;
  handleAddLine: () => void;
  setUnitType: (v: UnitType) => void;
  unitType: UnitType;
}

export default function ProductionFormFields({
  formData,
  setFormData,
  formErrors,
  setFormErrors,
  allLines,
  shifts,
  newLineName,
  setNewLineName,
  newLineCapacity,
  setNewLineCapacity,
  newLineSetup,
  setNewLineSetup,
  handleAddLine,
  setUnitType,
  unitType,
}: ProductionFormFieldsProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: name === "date" ? value : Number(value) || value
    }));
    if (formErrors[name]) setFormErrors((f: any) => ({...f, [name]: ""}));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6">
      <div className="space-y-2">
        <Label htmlFor="date" className={formErrors.date ? "text-destructive" : ""}>Data *</Label>
        <Input
          id="date"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          required
          className={`accent-vividPurple bg-white ${formErrors.date ? "border-destructive" : ""}`}
        />
        {formErrors.date && <p className="text-xs text-destructive">{formErrors.date}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="shift" className={formErrors.shift ? "text-destructive" : ""}>Turno *</Label>
        <select
          id="shift"
          name="shift"
          value={formData.shift}
          onChange={handleChange}
          className={`w-full rounded-md border bg-background px-3 py-2 border-gray-300 ${formErrors.shift ? "border-destructive" : ""}`}
          required
        >
          {shifts.map(shift => (
            <option key={shift.id} value={shift.name}>{shift.name}</option>
          ))}
        </select>
        {formErrors.shift && <p className="text-xs text-destructive">{formErrors.shift}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="location" className={formErrors.location ? "text-destructive" : ""}>Linha/Local *</Label>
        <select
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className={`w-full rounded-md border bg-background px-3 py-2 border-gray-300 ${formErrors.location ? "border-destructive" : ""}`}
          required
        >
          {allLines.map(line => (
            <option key={line.id} value={line.name}>
              {line.name} - Cap: {line.nominalCapacity} {unitType}/h
            </option>
          ))}
        </select>
        {formErrors.location && <p className="text-xs text-destructive">{formErrors.location}</p>}
        <div className="flex flex-col space-y-2 mt-2">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Novo local"
              value={newLineName}
              onChange={e => setNewLineName(e.target.value)}
              className="w-full md:w-28"
            />
            <Input
              type="number"
              min={1}
              placeholder="Capac."
              value={newLineCapacity}
              onChange={e => setNewLineCapacity(Number(e.target.value))}
              className="w-20"
            />
            <select
              value={unitType}
              onChange={e => setUnitType(e.target.value as UnitType)}
              className="w-24 h-10 rounded-md border border-gray-300 bg-white px-2"
            >
              <option value="unidades">un/h</option>
              <option value="kg">kg/h</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min={1}
              placeholder="Setup (min)"
              value={newLineSetup}
              onChange={e => setNewLineSetup(Number(e.target.value))}
              className="w-32"
            />
            <Button type="button" size="sm" onClick={handleAddLine} className="bg-vividPurple hover:bg-secondaryPurple">
              Adicionar Local
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Capacidade nominal em {unitType}/hora e tempo padrão de setup (min).
          </p>
        </div>
      </div>
    </div>
  );
}
