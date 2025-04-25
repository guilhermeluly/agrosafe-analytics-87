
import React, { useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { useEmpresa } from '../context/EmpresaContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Building2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

// Lista de empresas para demonstração - em um sistema real, isso viria da API
const MOCK_COMPANIES = [
  { id: 'company1', name: 'Indústria ABC', planoId: 'completo' },
  { id: 'company2', name: 'Fábrica XYZ', planoId: 'medio' },
  { id: 'company3', name: 'Empresa 123', planoId: 'basico' },
];

export function CompanySelector() {
  const { user, selectedCompanyId, setSelectedCompanyId } = useUser();
  const { setEmpresa } = useEmpresa();

  // Só mostrar para admin master
  if (user.role !== 'master_admin') {
    return null;
  }

  const companyOptions = MOCK_COMPANIES.map(company => ({
    value: company.id,
    label: company.name
  }));

  const handleCompanySelect = (value: string) => {
    try {
      setSelectedCompanyId(value);
      const selectedCompany = MOCK_COMPANIES.find(c => c.id === value);
      
      if (selectedCompany) {
        const empresaInfo = {
          id: selectedCompany.id,
          nome: selectedCompany.name,
          planoId: selectedCompany.planoId,
          logo: "/logo_app.png",
          logoAgroSafe: "/logo_agrosafe.png",
          logoCliente: "/logo_app.png",
          exibeLogoAgroSafe: true,
          unidadeCapacidade: 'unidades/h' as const
        };
        setEmpresa(empresaInfo);
        toast({
          title: "Empresa alterada",
          description: `Visualizando dados da empresa: ${selectedCompany.name}`,
        });
      }
    } catch (error) {
      console.error("Erro ao selecionar empresa:", error);
      toast({
        variant: "destructive",
        title: "Erro ao selecionar empresa",
        description: "Não foi possível carregar os dados da empresa selecionada.",
      });
    }
  };

  return (
    <div className="mb-2 p-2 bg-gray-800 rounded-md border border-gray-700">
      <Label htmlFor="company-select" className="text-xs text-gray-300 mb-1 flex items-center gap-1">
        <Building2 size={14} />
        Visualizar Empresa
      </Label>
      <Select
        value={selectedCompanyId || ''}
        onValueChange={handleCompanySelect}
      >
        <SelectTrigger id="company-select" className="h-7 text-xs text-gray-200 bg-gray-700 hover:bg-gray-600">
          <SelectValue placeholder="Selecione uma empresa" />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 text-gray-200 border-gray-700 z-50">
          {companyOptions.map((company) => (
            <SelectItem key={company.value} value={company.value} className="hover:bg-gray-700">
              {company.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
