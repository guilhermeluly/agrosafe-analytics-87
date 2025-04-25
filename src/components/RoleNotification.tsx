
import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription } from './ui/alert';
import { useUser } from '../context/UserContext';
import { AlertCircle } from 'lucide-react';

export function RoleNotification() {
  const { user } = useUser();
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    // Mostra a notificação somente quando o usuário está simulando outro papel
    if (user.originalRole && user.originalRole !== user.role) {
      setVisible(true);
      // Esconde após 10 segundos
      const timer = setTimeout(() => {
        setVisible(false);
      }, 10000);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [user.role, user.originalRole]);

  if (!visible) return null;

  const getRoleName = (role: string) => {
    switch (role) {
      case 'master_admin': return 'Administrador Master';
      case 'admin': return 'Administrador';
      case 'operator': return 'Operador';
      case 'viewer': return 'Visualizador';
      default: return role;
    }
  };

  return (
    <Alert className="mb-4 bg-amber-50 border-amber-200">
      <AlertCircle className="h-4 w-4 text-amber-500" />
      <AlertDescription className="text-amber-800">
        <b>Modo de simulação:</b> Você é um Admin Master visualizando como {getRoleName(user.role)}. 
        Use o seletor na barra lateral para voltar ao seu nível de acesso original.
      </AlertDescription>
    </Alert>
  );
}
