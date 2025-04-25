
import React from 'react';
import { useUser } from '../context/UserContext';
import { Combobox } from './ui/combobox';
import { Label } from './ui/label';
import { Building2 } from 'lucide-react';

export function CompanySelector() {
  const { user, selectedCompanyId, setSelectedCompanyId } = useUser();

  if (user.role !== 'master_admin') {
    return null;
  }

  // Format company options for the combobox - ensure this is never undefined
  const companyOptions = [
    { value: 'company1', label: 'Company 1' },
    { value: 'company2', label: 'Company 2' },
    // In a real implementation, this would come from API
  ];

  const handleCompanySelect = (value: string) => {
    if (setSelectedCompanyId && typeof setSelectedCompanyId === 'function') {
      setSelectedCompanyId(value);
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
