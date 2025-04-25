
import React from 'react';
import { useUser } from '../context/UserContext';
import { Combobox } from './ui/combobox';
import { Label } from './ui/label';
import { Building2 } from 'lucide-react';
import { useEmpresa } from '../context/EmpresaContext';

const MOCK_COMPANIES = [
  { id: 'company1', name: 'Indústria ABC', planoId: 'completo' },
  { id: 'company2', name: 'Fábrica XYZ', planoId: 'medio' },
  { id: 'company3', name: 'Empresa 123', planoId: 'basico' },
];

export function CompanySelector() {
  const { user, selectedCompanyId, setSelectedCompanyId } = useUser();
  const { setEmpresa } = useEmpresa();

  if (user.role !== 'master_admin') {
    return null;
  }

  const companyOptions = MOCK_COMPANIES.map(company => ({
    value: company.id,
    label: company.name
  }));

  const handleCompanySelect = (value: string) => {
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
        unidadeCapacidade: 'unidades/h'
      };
      setEmpresa(empresaInfo);
    }
  };

  return (
    <div className="mb-2 p-2 bg-gray-800 rounded-md border border-gray-700">
      <Label htmlFor="company-select" className="text-xs text-gray-300 mb-1 flex items-center gap-1">
        <Building2 size={14} />
        Visualizar Empresa
      </Label>
      <Combobox
        options={companyOptions}
        value={selectedCompanyId || ''}
        onSelect={handleCompanySelect}
        placeholder="Selecione uma empresa"
        className="h-7 text-xs text-gray-200 bg-gray-700 hover:bg-gray-600"
      />
    </div>
  );
}
