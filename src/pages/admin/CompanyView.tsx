
import React from 'react';
import { CompanySelector } from '@/components/CompanySelector';

export default function CompanyViewPage() {
  return (
    <div className="container p-4">
      <h1 className="text-2xl font-bold mb-4">Visualizar Empresa</h1>
      <p className="text-gray-600 mb-6">
        Como administrador master, você pode alternar entre diferentes empresas para visualizar e gerenciar seus dados.
      </p>
      
      <div className="max-w-md">
        <CompanySelector />
      </div>
    </div>
  );
}
