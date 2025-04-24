
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import MovimentacaoFormFields from './MovimentacaoFormFields';
import { useUser } from '@/context/UserContext';

interface LogisticsFormContainerProps {
  onSave: (data: any) => void;
}

export function LogisticsFormContainer({ onSave }: LogisticsFormContainerProps) {
  const { user, selectedCompanyId } = useUser();
  const companyId = user.role === 'master_admin' ? selectedCompanyId : user.companyId;

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        <MovimentacaoFormFields onSave={onSave} />
      </div>
    </div>
  );
}
