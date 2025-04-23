
import React, { useRef } from "react";
import { useEmpresa } from "../context/EmpresaContext";
import { useUser } from "../context/UserContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface LogoUploadProps {
  onUploadComplete?: (logoUrl: string) => void;
}

export default function LogoUpload({ onUploadComplete }: LogoUploadProps) {
  const { empresa, setEmpresa } = useEmpresa();
  const { user, updateUserPhoto } = useUser();
  const { toast } = useToast();
  const userInitials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();

  const uploadCompanyLogo = (
    e: React.ChangeEvent<HTMLInputElement>,
    qual: "logoCliente" | "logoAgroSafe"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const logoUrl = reader.result as string;
      setEmpresa({
        ...empresa,
        [qual]: logoUrl,
      });
      
      if (qual === "logoCliente" && onUploadComplete) {
        onUploadComplete(logoUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const uploadUserPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      updateUserPhoto(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    // In a real app, you would save to a backend here
    toast({
      title: "Configurações salvas",
      description: "As imagens foram salvas com sucesso.",
    });
  };

  return (
    <Tabs defaultValue="company">
      <TabsList className="mb-4">
        <TabsTrigger value="company">Logos da Empresa</TabsTrigger>
        <TabsTrigger value="user">Foto do Perfil</TabsTrigger>
      </TabsList>
      
      <TabsContent value="company" className="space-y-4">
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
                onChange={e => uploadCompanyLogo(e, "logoCliente")} 
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
                onChange={e => uploadCompanyLogo(e, "logoAgroSafe")} 
                className="text-sm" 
              />
            </div>
          </div>
        </div>
        
        <Button onClick={handleSave} className="mt-4">
          Salvar Logos
        </Button>
      </TabsContent>
      
      <TabsContent value="user" className="space-y-4">
        <div className="space-y-4">
          <div className="font-medium">Sua foto de perfil:</div>
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.photo} alt={user.name} />
              <AvatarFallback className="text-2xl">{userInitials}</AvatarFallback>
            </Avatar>
            
            <div className="flex flex-col gap-2">
              <input 
                type="file" 
                accept="image/*" 
                onChange={uploadUserPhoto} 
                className="text-sm" 
              />
              <p className="text-xs text-muted-foreground">
                Recomendado: Imagem quadrada, pelo menos 200x200 pixels
              </p>
            </div>
          </div>
          
          <Button onClick={handleSave} className="mt-4">
            Salvar Foto de Perfil
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
}
