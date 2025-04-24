import React, { useState } from 'react';
import AppLayout from '../../components/AppLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CompanySelector } from "@/components/CompanySelector";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Database, Trash2, Users, Settings, FileText, Download } from 'lucide-react';

// Mock data for companies
const MOCK_COMPANIES = [
  { id: '1', name: 'Empresa Alpha' },
  { id: '2', name: 'Indústria Beta' },
  { id: '3', name: 'Fábrica Gama' },
];

interface ResetOptions {
  productionData: boolean;
  userData: boolean;
  configData: boolean;
  allData: boolean;
}

export default function ResetData() {
  const { toast } = useToast();
  const [selectedCompanyId, setSelectedCompanyId] = useState('1');
  
  const [selectedOptions, setSelectedOptions] = useState<ResetOptions>({
    productionData: false,
    userData: false,
    configData: false,
    allData: false,
  });

  // Company info based on selected ID
  const selectedCompany = MOCK_COMPANIES.find(c => c.id === selectedCompanyId) || MOCK_COMPANIES[0];

  const handleOptionChange = (option: keyof ResetOptions) => {
    if (option === 'allData') {
      const newValue = !selectedOptions.allData;
      setSelectedOptions({
        productionData: newValue,
        userData: newValue,
        configData: newValue,
        allData: newValue,
      });
    } else {
      const newOptions = {
        ...selectedOptions,
        [option]: !selectedOptions[option],
      };
      
      // Update allData based on other selections
      newOptions.allData = 
        newOptions.productionData && 
        newOptions.userData && 
        newOptions.configData;
      
      setSelectedOptions(newOptions);
    }
  };

  const handleReset = async () => {
    try {
      // This would be an actual API call in production
      let resetItems = [];
      if (selectedOptions.productionData) resetItems.push("dados de produção");
      if (selectedOptions.userData) resetItems.push("dados de usuários");
      if (selectedOptions.configData) resetItems.push("configurações");
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: `Reset da ${selectedCompany.name} concluído`,
        description: `Os seguintes dados foram resetados: ${resetItems.join(", ")}.`,
      });
      
      setSelectedOptions({
        productionData: false,
        userData: false,
        configData: false,
        allData: false,
      });
    } catch (error) {
      toast({
        title: "Erro ao resetar dados",
        description: "Ocorreu um erro ao tentar resetar os dados.",
        variant: "destructive",
      });
    }
  };

  const handleExportData = () => {
    toast({
      title: "Exportação iniciada",
      description: `Os dados da empresa ${selectedCompany.name} estão sendo exportados para CSV.`
    });
  };

  return (
    <AppLayout title="Reset de Dados">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Reset de Dados por Empresa</h1>
        
        <CompanySelector />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-red-500" />
                Reset de Dados
              </CardTitle>
              <CardDescription>
                Selecione quais dados deseja limpar para a empresa {selectedCompany.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="option-production" 
                    checked={selectedOptions.productionData}
                    onCheckedChange={() => handleOptionChange('productionData')}
                  />
                  <div className="grid gap-1.5">
                    <Label htmlFor="option-production" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Dados de Produção
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Remove todos os registros de produção e movimentação
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="option-users" 
                    checked={selectedOptions.userData}
                    onCheckedChange={() => handleOptionChange('userData')}
                  />
                  <div className="grid gap-1.5">
                    <Label htmlFor="option-users" className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Usuários
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Remove todos os usuários, exceto o administrador principal
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="option-config" 
                    checked={selectedOptions.configData}
                    onCheckedChange={() => handleOptionChange('configData')}
                  />
                  <div className="grid gap-1.5">
                    <Label htmlFor="option-config" className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Configurações
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Remove configurações de linhas, turnos, veículos e motivos de parada
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 pt-2 border-t">
                  <Checkbox 
                    id="option-all" 
                    checked={selectedOptions.allData}
                    onCheckedChange={() => handleOptionChange('allData')}
                  />
                  <div className="grid gap-1.5">
                    <Label htmlFor="option-all" className="font-medium flex items-center gap-2">
                      <Database className="h-4 w-4" />
                      Todos os dados
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Limpa completamente todos os dados da empresa
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    disabled={!Object.values(selectedOptions).some(Boolean)}
                  >
                    Resetar Dados
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Esta ação não pode ser revertida</AlertDialogTitle>
                    <AlertDialogDescription>
                      Você está prestes a realizar o reset dos dados da empresa <strong>{selectedCompany.name}</strong>.
                      Esta ação não pode ser desfeita. Tem certeza que deseja continuar?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleReset} className="bg-red-600 hover:bg-red-700">
                      Sim, resetar dados
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              
              <Button variant="outline" onClick={handleExportData} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Exportar Dados Antes
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informações da Empresa</CardTitle>
              <CardDescription>
                Detalhes sobre a empresa selecionada
              </CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Nome da Empresa</dt>
                  <dd className="mt-1 text-sm text-gray-900">{selectedCompany.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">ID da Empresa</dt>
                  <dd className="mt-1 text-sm text-gray-900">{selectedCompany.id}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Banco de Dados</dt>
                  <dd className="mt-1 text-sm text-gray-900">db_{selectedCompany.id}_prod</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Ativo
                    </span>
                  </dd>
                </div>
              </dl>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Último backup: Hoje às 06:00
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
