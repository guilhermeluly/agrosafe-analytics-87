
import React from 'react';
import { PlanSwitcher } from '@/components/PlanSwitcher';
import { PLANOS } from '@/config/planos';

export default function PlanSwitchPage() {
  return (
    <div className="container p-4">
      <h1 className="text-2xl font-bold mb-4">Alternar Plano</h1>
      <p className="text-gray-600 mb-6">
        Como administrador master, você pode simular diferentes planos para testar as funcionalidades disponíveis em cada nível de assinatura.
      </p>
      
      <div className="max-w-md">
        <PlanSwitcher />
      </div>
      
      <div className="mt-6 space-y-4">
        <h2 className="text-lg font-semibold">Comparação de Planos</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-2 px-4 border-b text-left">Recurso</th>
                {PLANOS.map(plano => (
                  <th key={plano.id} className="py-2 px-4 border-b text-center">{plano.nome}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-4 border-b">Máximo de Usuários</td>
                {PLANOS.map(plano => (
                  <td key={plano.id} className="py-2 px-4 border-b text-center">{plano.maxUsuarios}</td>
                ))}
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">Modo Apresentação</td>
                {PLANOS.map(plano => (
                  <td key={plano.id} className="py-2 px-4 border-b text-center">
                    {plano.modoApresentacao ? '✅' : '❌'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">Relatórios Automáticos</td>
                {PLANOS.map(plano => (
                  <td key={plano.id} className="py-2 px-4 border-b text-center">
                    {plano.autoRelatorios ? '✅' : '❌'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">Exportar CSV</td>
                {PLANOS.map(plano => (
                  <td key={plano.id} className="py-2 px-4 border-b text-center">
                    {plano.exportCSV ? '✅' : '❌'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">Análise Inteligente</td>
                {PLANOS.map(plano => (
                  <td key={plano.id} className="py-2 px-4 border-b text-center">
                    {plano.analiseInteligente ? '✅' : '❌'}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
