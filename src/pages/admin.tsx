
import React from "react";
import AppLayout from "../components/AppLayout";
import { useEmpresa } from "../context/EmpresaContext";
import LogoUpload from "../components/LogoUpload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

export default function Admin() {
  const { empresa, setEmpresa } = useEmpresa();

  return (
    <AppLayout title="Admin">
      <Tabs defaultValue="company">
        <TabsList className="mb-4">
          <TabsTrigger value="company">Empresa</TabsTrigger>
        </TabsList>
        
        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>Configurações da Empresa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <label className="block font-semibold mb-2">Unidade de Capacidade:</label>
                <select 
                  value={empresa.unidadeCapacidade} 
                  onChange={e => setEmpresa({ ...empresa, unidadeCapacidade: e.target.value as "unidades/h" | "kg/h" })} 
                  className="w-full border p-2 rounded"
                >
                  <option value="unidades/h">Unidades por hora (un/h)</option>
                  <option value="kg/h">Quilogramas por hora (kg/h)</option>
                </select>
              </div>
              
              <LogoUpload />
              
              {empresa.planoId === "completo" && (
                <div className="mt-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={empresa.exibeLogoAgroSafe}
                      onChange={(e) => setEmpresa({ ...empresa, exibeLogoAgroSafe: !!e.target.checked })}
                      className="rounded"
                    />{" "}
                    Exibir logo da <b>AgroSafe</b> junto ao logo do cliente
                  </label>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
