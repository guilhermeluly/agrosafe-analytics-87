
import React from 'react';
import { useUser } from '../context/UserContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Building2 } from 'lucide-react';

export function CompanySelector() {
  const { user, selectedCompanyId, setSelectedCompanyId } = useUser();

  if (user.role !== 'master_admin') {
    return null;
  }

  return (
    <div className="mb-2 p-2 bg-gray-800 rounded-md border border-gray-700">
      <Label htmlFor="company-select" className="text-xs text-gray-300 mb-1 flex items-center gap-1">
        <Building2 size={14} />
        Visualizar Empresa
      </Label>
      <Select
        value={selectedCompanyId}
        onValueChange={setSelectedCompanyId}
      >
        <SelectTrigger id="company-select" className="w-full h-8 text-sm">
          <SelectValue placeholder="Selecione uma empresa" />
        </SelectTrigger>
        <SelectContent>
          {/* Dynamic content from API */}
        </SelectContent>
      </Select>
    </div>
  );
}
