
import React from 'react';
import { RoleSwitcher } from '@/components/RoleSwitcher';
import { RoleNotification } from '@/components/RoleNotification';

export default function RoleSwitchPage() {
  return (
    <div className="container p-4">
      <h1 className="text-2xl font-bold mb-4">Alternar Nível de Acesso</h1>
      <p className="text-gray-600 mb-6">
        Como administrador master, você pode simular diferentes níveis de acesso para testar a visualização e funcionalidades disponíveis para cada tipo de usuário.
      </p>
      
      <div className="max-w-md">
        <RoleSwitcher />
      </div>
      
      <div className="mt-6">
        <RoleNotification />
      </div>
    </div>
  );
}
