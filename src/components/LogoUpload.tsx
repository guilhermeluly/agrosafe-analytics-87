
import React, { useRef } from "react";
import { useEmpresa } from "../context/EmpresaContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function LogoUpload() {
  const { empresa, setEmpresa } = useEmpresa();
  const { toast } = useToast();

  const upload = (
    e: React.ChangeEvent<HTMLInputElement>,
    qual: "logoCliente" | "logoAgroSafe"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setEmpresa({
        ...empresa,
        [qual]: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    // In a real app, you would save to a backend here
    toast({
      title: "Logos salvas",
      description: "As imagens foram salvas com sucesso.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="font-medium">Logo da empresa:</div>
        <div className="flex items-center gap-4">
          {empresa.logoCliente && (
            <img src={empresa.logoCliente} alt="Preview Cliente" className="h-20 p-1 border rounded" />
          )}
          <div className="flex flex-col gap-2">
            <input 
              type="file" 
              accept="image/*" 
              onChange={e => upload(e, "logoCliente")} 
              className="text-sm" 
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="font-medium">Logo da <b>AgroSafe</b>:</div>
        <div className="flex items-center gap-4">
          {empresa.logoAgroSafe && (
            <img src={empresa.logoAgroSafe} alt="Preview AgroSafe" className="h-20 p-1 border rounded" />
          )}
          <div className="flex flex-col gap-2">
            <input 
              type="file" 
              accept="image/*" 
              onChange={e => upload(e, "logoAgroSafe")} 
              className="text-sm" 
            />
          </div>
        </div>
      </div>
      
      <Button onClick={handleSave} className="mt-4">
        Salvar Logos
      </Button>
    </div>
  );
}
