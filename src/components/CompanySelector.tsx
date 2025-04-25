
import React from 'react';
import { useUser } from '../context/UserContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Building2 } from 'lucide-react';

const MOCK_COMPANIES = [
  { id: '1', name: 'Empresa Alpha' },
  { id: '2', name: 'Indústria Beta' },
  { id: '3', name: 'Fábrica Gama' },
];

export function CompanySelector() {
  const { user, selectedCompanyId, setSelectedCompanyId } = useUser();

  if (user.role !== 'master_admin') {
    return null;
  }

  return (
    <div className="mb-4 p-3 bg-gray-800 rounded-md border border-gray-700">
      <Label htmlFor="company-select" className="text-gray-300 mb-2 flex items-center gap-2">
        <Building2 size={16} />
        Visualizar Empresa
      </Label>
      <Select
        value={selectedCompanyId}
        onValueChange={setSelectedCompanyId}
      >
        <SelectTrigger id="company-select" className="w-full">
          <SelectValue placeholder="Selecione uma empresa" />
        </SelectTrigger>
        <SelectContent>
          {MOCK_COMPANIES.map((company) => (
            <SelectItem key={company.id} value={company.id}>
              {company.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
