
import React from 'react';
import { useUser, UserRole } from '../context/UserContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Shield } from 'lucide-react';

export function RoleSwitcher() {
  const { user, switchUserRole } = useUser();

  // Só mostrar para admin master
  if (user.role !== 'master_admin') {
    return null;
  }

  const roles: { value: UserRole; label: string }[] = [
    { value: 'master_admin', label: 'Administrador Master' },
    { value: 'admin', label: 'Administrador' },
    { value: 'operator', label: 'Operador' },
    { value: 'viewer', label: 'Visualizador' }
  ];

  return (
    <div className="mb-2 p-2 bg-gray-800 rounded-md border border-gray-700">
      <Label htmlFor="role-select" className="text-xs text-gray-300 mb-1 flex items-center gap-1">
        <Shield size={14} />
        Alternar Nível de Acesso
      </Label>
      <Select
        value={user.role}
        onValueChange={(value) => switchUserRole(value as UserRole)}
      >
        <SelectTrigger id="role-select" className="h-7 text-xs text-gray-200 bg-gray-700 hover:bg-gray-600">
          <SelectValue placeholder="Selecione um nível" />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 text-gray-200 border-gray-700">
          {roles.map((role) => (
            <SelectItem key={role.value} value={role.value} className="hover:bg-gray-700">
              {role.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
