
import React from "react";
import AppLayout from "../../components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Edit, Upload } from "lucide-react";
import LogoUpload from "../../components/LogoUpload";
import { useEmpresa } from "../../context/EmpresaContext";

export default function LogoConfig() {
  const { toast } = useToast();
  const { empresa, updateLogo } = useEmpresa();
  
  const handleLogoUpdate = (logoUrl: string) => {
    updateLogo(logoUrl);
    toast({
      title: "Logo atualizado",
      description: "O logo da empresa foi atualizado com sucesso."
    });
  };

  return (
    <AppLayout title="Configuração de Logo">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Configuração de Logo
            </CardTitle>
            <CardDescription>
              Atualize o logo da empresa exibido no sistema.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex flex-col items-center justify-center p-6 border rounded-lg bg-muted/30">
                <h3 className="text-lg font-medium mb-4">Logo Atual</h3>
                <div className="w-72 h-36 flex items-center justify-center bg-white rounded-lg border p-4 mb-4">
                  {empresa.logo ? (
                    <img 
                      src={empresa.logo} 
                      alt="Logo da empresa" 
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <Upload className="h-12 w-12 mx-auto mb-2 opacity-30" />
                      <p>Nenhum logo configurado</p>
                    </div>
                  )}
                </div>
                
                <div className="w-full max-w-sm">
                  <LogoUpload onUploadComplete={handleLogoUpdate} />
                </div>
              </div>
              
              <div className="rounded-md border p-4 bg-amber-50 text-amber-800">
                <h3 className="font-medium mb-2">Observações importantes:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>O logo deve estar no formato PNG ou JPG/JPEG.</li>
                  <li>Para melhor visualização, recomendamos uma imagem com fundo transparente.</li>
                  <li>A largura ideal é entre 200px e 400px.</li>
                  <li>O logo será exibido na barra lateral, tela de login e relatórios.</li>
                  <li>Apenas usuários com nível de acesso Master Admin podem alterar o logo.</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
