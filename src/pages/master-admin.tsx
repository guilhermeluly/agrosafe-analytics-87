
import React, { useState } from "react";
import AppLayout from "../components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { PLANOS } from "../config/planos";

// Mock data structures
interface Company {
  id: string;
  name: string;
  email: string;
  plan: string;
  active: boolean;
}

export default function MasterAdmin() {
  const { toast } = useToast();
  
  // Mock companies data
  const [companies, setCompanies] = useState<Company[]>([
    { id: "1", name: "Indústria ABC", email: "contato@abc.com", plan: "basico", active: true },
    { id: "2", name: "Fábrica XYZ", email: "admin@xyz.com", plan: "completo", active: true },
    { id: "3", name: "Empresa 123", email: "info@123.com", plan: "intermediario", active: false }
  ]);
  
  // New company form state
  const [newCompany, setNewCompany] = useState<Omit<Company, "id" | "active">>({
    name: "",
    email: "",
    plan: "basico"
  });
  
  // Download APK functionality (mock)
  const downloadApk = () => {
    toast({
      title: "Download iniciado",
      description: "O APK está sendo preparado para download."
    });
    
    // In a real app, this would trigger a download or open a link
    setTimeout(() => {
      toast({
        title: "APK disponível",
        description: "O download do APK foi concluído com sucesso."
      });
    }, 2000);
  };
  
  const addCompany = () => {
    if (!newCompany.name || !newCompany.email) {
      toast({
        title: "Dados incompletos",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    
    const newId = (companies.length + 1).toString();
    setCompanies([...companies, { ...newCompany, id: newId, active: true }]);
    setNewCompany({ name: "", email: "", plan: "basico" });
    
    toast({
      title: "Empresa adicionada",
      description: "Nova empresa adicionada com sucesso."
    });
  };
  
  const toggleCompanyStatus = (id: string) => {
    setCompanies(companies.map(company => 
      company.id === id ? { ...company, active: !company.active } : company
    ));
    
    const company = companies.find(c => c.id === id);
    const newStatus = company?.active ? "desativada" : "ativada";
    
    toast({
      title: `Empresa ${newStatus}`,
      description: `A empresa foi ${newStatus} com sucesso.`
    });
  };
  
  const resetCompany = (id: string) => {
    // In a real app, this would reset the company's data
    toast({
      title: "Empresa resetada",
      description: "Os dados da empresa foram resetados com sucesso."
    });
  };
  
  return (
    <AppLayout title="Admin Master">
      <Tabs defaultValue="companies">
        <TabsList className="mb-4">
          <TabsTrigger value="companies">Empresas</TabsTrigger>
          <TabsTrigger value="app">Aplicativo</TabsTrigger>
        </TabsList>
        
        <TabsContent value="companies">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de Empresas</CardTitle>
              <CardDescription>
                Gerencie as empresas cadastradas no sistema.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4">
                  {companies.map(company => (
                    <div key={company.id} className="flex items-center justify-between p-3 border rounded">
                      <div className="grid grid-cols-4 gap-4 flex-1">
                        <div>
                          <span className="text-sm font-medium">Nome:</span>
                          <div>{company.name}</div>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Email:</span>
                          <div className="text-sm">{company.email}</div>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Plano:</span>
                          <div>{PLANOS.find(p => p.id === company.plan)?.nome || company.plan}</div>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Status:</span>
                          <div className={company.active ? "text-green-600" : "text-red-600"}>
                            {company.active ? "Ativo" : "Inativo"}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant={company.active ? "destructive" : "default"}
                          size="sm"
                          onClick={() => toggleCompanyStatus(company.id)}
                        >
                          {company.active ? "Desativar" : "Ativar"}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => resetCompany(company.id)}
                        >
                          Reset
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="pt-6 border-t">
                  <h3 className="text-lg font-medium mb-3">Adicionar Nova Empresa</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Nome da Empresa</Label>
                      <Input
                        id="companyName"
                        value={newCompany.name}
                        onChange={(e) => setNewCompany({...newCompany, name: e.target.value})}
                        placeholder="Nome da empresa"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="companyEmail">Email</Label>
                      <Input
                        id="companyEmail"
                        type="email"
                        value={newCompany.email}
                        onChange={(e) => setNewCompany({...newCompany, email: e.target.value})}
                        placeholder="email@empresa.com"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="companyPlan">Plano</Label>
                      <select 
                        id="companyPlan"
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                        value={newCompany.plan}
                        onChange={(e) => setNewCompany({...newCompany, plan: e.target.value})}
                      >
                        {PLANOS.map(plano => (
                          <option key={plano.id} value={plano.id}>
                            {plano.nome}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <Button onClick={addCompany} className="mt-4">
                    Adicionar Empresa
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="app">
          <Card>
            <CardHeader>
              <CardTitle>App Mobile</CardTitle>
              <CardDescription>
                Gerencie a aplicação móvel para os usuários.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border rounded p-6 text-center space-y-4">
                  <h3 className="text-lg font-medium">Download do Aplicativo</h3>
                  <p className="text-sm text-muted-foreground">
                    Clique no botão abaixo para baixar a versão mais recente do aplicativo Android (APK).
                  </p>
                  <Button onClick={downloadApk} size="lg" className="mt-2">
                    Baixar APK
                  </Button>
                </div>
                
                <div className="border rounded p-6">
                  <h3 className="text-lg font-medium mb-4">Instruções de Instalação</h3>
                  <ol className="space-y-2 list-decimal list-inside text-sm">
                    <li>Baixe o arquivo APK no seu dispositivo Android</li>
                    <li>Habilite a instalação de fontes desconhecidas nas configurações do dispositivo</li>
                    <li>Localize o arquivo baixado e toque nele para iniciar a instalação</li>
                    <li>Siga as instruções na tela para completar a instalação</li>
                    <li>Após instalado, abra o aplicativo e faça login com suas credenciais</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
