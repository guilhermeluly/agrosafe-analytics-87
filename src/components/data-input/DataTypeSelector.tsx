
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Truck } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { getPlanoById } from "@/config/planos";

interface DataTypeSelectorProps {
  value: "normal" | "historical";
  onChange: (type: "normal" | "historical") => void;
}

const DataTypeSelector = ({ value, onChange }: DataTypeSelectorProps) => {
  return (
    <div className="flex items-center space-x-2">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as "normal" | "historical")}
        className="border rounded px-2 py-1 text-sm bg-white dark:bg-gray-800"
      >
        <option value="normal">Dados Atuais</option>
        <option value="historical">Dados Históricos</option>
      </select>
    </div>
  );
};

export default DataTypeSelector;
