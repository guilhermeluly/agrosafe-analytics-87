
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import MovimentacaoFormFields from './MovimentacaoFormFields';
import { useUser } from '@/context/UserContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';

interface LogisticsFormContainerProps {
  onSave: (data: any) => void;
}

export function LogisticsFormContainer({ onSave }: LogisticsFormContainerProps) {
  const { user, selectedCompanyId } = useUser();
  const companyId = user.role === 'master_admin' ? selectedCompanyId : user.companyId;
  
  // Check if the user is an admin or master_admin
  const isAuthorized = user.role === 'admin' || user.role === 'master_admin';

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {isAuthorized ? (
          <MovimentacaoFormFields onSave={onSave} />
        ) : (
          <Alert variant="destructive">
            <ShieldAlert className="h-5 w-5" />
            <AlertTitle>Acesso Restrito</AlertTitle>
            <AlertDescription>
              O cadastro de dados de movimentação está disponível apenas para administradores.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
