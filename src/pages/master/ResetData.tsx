
import React, { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertTriangle, Trash2, DatabaseBackup } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Sample company data for demo
const companies = [
  { id: "empresa-1", name: "Empresa 1" },
  { id: "empresa-2", name: "Empresa 2" },
  { id: "empresa-3", name: "Empresa 3" }
];

export default function ResetData() {
  const { toast } = useToast();
  const [selectedCompany, setSelectedCompany] = useState<string>("all");
  const [resetProduction, setResetProduction] = useState(true);
  const [resetStops, setResetStops] = useState(true);
  const [resetLogistics, setResetLogistics] = useState(true);
  const [resetConfigs, setResetConfigs] = useState(false);
  const [resetUsers, setResetUsers] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [resetType, setResetType] = useState<"company" | "all" | "">("");

  const handleResetData = (type: "company" | "all") => {
    setResetType(type);
    setConfirmDialogOpen(true);
  };

  const executeReset = () => {
    if (confirmationText !== "CONFIRMAR") {
      toast({
        title: "Confirmação necessária",
        description: "Por favor digite CONFIRMAR para prosseguir com o reset de dados.",
        variant: "destructive"
      });
      return;
    }

    // Perform the reset operation
    toast({
      title: "Reset iniciado",
      description: resetType === "all" 
        ? "Todos os dados do sistema estão sendo resetados." 
        : `Os dados da empresa ${selectedCompany === "all" ? "todas" : companies.find(c => c.id === selectedCompany)?.name} estão sendo resetados.`,
    });

    // Reset the dialog state
    setConfirmationText("");
    setConfirmDialogOpen(false);
  };

  return (
    <AppLayout title="Reset de Dados">
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Gerenciamento de Reset de Dados</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Reset data for a specific company */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trash2 className="mr-2 h-5 w-5 text-red-500" />
                Reset por Empresa
              </CardTitle>
              <CardDescription>
                Limpe os dados de produção, paradas e logística de uma empresa específica.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Selecione a Empresa</Label>
                  <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione uma empresa" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as Empresas</SelectItem>
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4 pt-2">
                  <h3 className="font-medium">Opções de Reset:</h3>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="resetProduction">Dados de Produção</Label>
                    <Switch
                      id="resetProduction"
                      checked={resetProduction}
                      onCheckedChange={setResetProduction}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="resetStops">Registros de Paradas</Label>
                    <Switch
                      id="resetStops"
                      checked={resetStops}
                      onCheckedChange={setResetStops}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="resetLogistics">Dados de Logística</Label>
                    <Switch
                      id="resetLogistics"
                      checked={resetLogistics}
                      onCheckedChange={setResetLogistics}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="resetConfigs">Configurações da Empresa</Label>
                    <Switch
                      id="resetConfigs"
                      checked={resetConfigs}
                      onCheckedChange={setResetConfigs}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleResetData("company")} 
                variant="destructive" 
                className="w-full"
                disabled={!selectedCompany || (!resetProduction && !resetStops && !resetLogistics && !resetConfigs)}
              >
                Resetar Dados da Empresa
              </Button>
            </CardFooter>
          </Card>

          {/* Reset all data */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center">
                <DatabaseBackup className="mr-2 h-5 w-5 text-red-500" />
                Reset Completo do Sistema
              </CardTitle>
              <CardDescription>
                Atenção: esta opção irá resetar todos os dados do sistema.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-red-100 text-red-700 rounded-md flex items-start">
                  <AlertTriangle className="h-5 w-5 mr-2 shrink-0 mt-0.5" />
                  <p className="text-sm">
                    Esta operação é irreversível e irá remover todos os dados do sistema, incluindo empresas, usuários, 
                    configurações e dados de produção. Use com extrema cautela.
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <h3 className="font-medium">Opções de Reset:</h3>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="resetProductionAll">Dados de Produção (Todas as Empresas)</Label>
                    <Switch
                      id="resetProductionAll"
                      checked={resetProduction}
                      onCheckedChange={setResetProduction}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="resetUsers">Usuários e Permissões</Label>
                    <Switch
                      id="resetUsers"
                      checked={resetUsers}
                      onCheckedChange={setResetUsers}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleResetData("all")} variant="destructive" className="w-full">
                Resetar Todo o Sistema
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" /> Confirmar Reset de Dados
            </DialogTitle>
            <DialogDescription>
              {resetType === "all" ? (
                <p>Você está prestes a resetar TODOS os dados do sistema. Esta ação é irreversível.</p>
              ) : (
                <p>Você está prestes a resetar os dados {selectedCompany === "all" ? "de todas as empresas" : `da empresa selecionada (${companies.find(c => c.id === selectedCompany)?.name})`}.</p>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-3 bg-red-100 text-red-700 rounded-md">
              <p className="text-sm font-medium">
                Para confirmar, digite "CONFIRMAR" abaixo:
              </p>
            </div>
            <Input
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder="CONFIRMAR"
              className="border-red-300"
            />
          </div>
          
          <DialogFooter className="sm:justify-between">
            <Button 
              variant="outline" 
              onClick={() => setConfirmDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={executeReset}
              disabled={confirmationText !== "CONFIRMAR"}
            >
              Confirmar Reset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
