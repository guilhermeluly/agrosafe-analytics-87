
import React, { useState } from "react";
import AppLayout from "../components/AppLayout";
import { useUser } from "../context/UserContext";
import { useEmpresa } from "../context/EmpresaContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare } from "lucide-react";

export default function Admin() {
  const { user } = useUser();
  const { empresa, setEmpresa } = useEmpresa();
  const { toast } = useToast();
  const [supportMessage, setSupportMessage] = useState("");

  const handleSupportRequest = () => {
    // In a real app, this would send the message to the master admin
    toast({
      title: "Suporte solicitado",
      description: "Sua mensagem foi enviada para o administrador master.",
    });
    setSupportMessage("");
  };

  return (
    <AppLayout title="Admin">
      <Tabs defaultValue="general">
        <TabsList className="mb-4">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="support">Suporte Técnico</TabsTrigger>
          {user.role === "master_admin" && <TabsTrigger value="advanced">Avançado</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="support">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Suporte Técnico
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  placeholder="Descreva sua necessidade de suporte..."
                  value={supportMessage}
                  onChange={(e) => setSupportMessage(e.target.value)}
                  className="min-h-[150px]"
                />
                <Button 
                  onClick={handleSupportRequest}
                  className="w-full"
                  disabled={!supportMessage.trim()}
                >
                  Enviar Solicitação
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {user.role === "master_admin" && (
          <TabsContent value="advanced">
            <Card>
              <CardHeader>
                <CardTitle>Configurações Avançadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Database management would go here, visible only to master admin */}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </AppLayout>
  );
}
