
import React from 'react';
import AppLayout from '@/components/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/context/UserContext';
import { Database, Server, HardDrive, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

const Database = () => {
  const { user } = useUser();
  const isAdmin = user.role === 'admin' || user.role === 'master_admin';

  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Banco de Dados</h1>
        
        {isAdmin ? (
          <Tabs defaultValue="overview">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="connections">Conexões</TabsTrigger>
              <TabsTrigger value="backup">Backup</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Server className="h-5 w-5 text-blue-500" />
                      Status do Servidor
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      <p>Online - Funcionando normalmente</p>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">Último reinício: 7 dias atrás</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Database className="h-5 w-5 text-purple-500" />
                      Armazenamento
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Utilizado</span>
                        <span>8.2 GB / 20 GB</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="bg-purple-500 h-full rounded-full" style={{ width: '41%' }}></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <HardDrive className="h-5 w-5 text-orange-500" />
                      Último Backup
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-medium">12/04/2025 - 03:00</p>
                    <p className="text-sm text-muted-foreground">Próximo backup agendado: 13/04/2025</p>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Estatísticas do Banco de Dados</CardTitle>
                  <CardDescription>
                    Informações gerais sobre o uso do banco de dados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Registros Totais</p>
                        <p className="text-2xl font-bold">12,482</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Tabelas</p>
                        <p className="text-2xl font-bold">24</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Queries/min</p>
                        <p className="text-2xl font-bold">128</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Uptime</p>
                        <p className="text-2xl font-bold">99.98%</p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-medium mb-2">Tabelas mais utilizadas</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span>movimentacao_caminhoes</span>
                          <span className="text-sm text-muted-foreground">3,241 registros</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>producao_diaria</span>
                          <span className="text-sm text-muted-foreground">2,815 registros</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>paradas_producao</span>
                          <span className="text-sm text-muted-foreground">1,982 registros</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="connections">
              <Card>
                <CardHeader>
                  <CardTitle>Conexões do Banco de Dados</CardTitle>
                  <CardDescription>
                    Gerenciamento de conexões ativas e configurações de acesso
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Conteúdo da aba de conexões...</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="backup">
              <Card>
                <CardHeader>
                  <CardTitle>Sistema de Backup</CardTitle>
                  <CardDescription>
                    Configurações de backup e restauração de dados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Conteúdo da aba de backup...</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          <Alert variant="destructive">
            <AlertTriangle className="h-5 w-5" />
            <AlertDescription>
              Você não tem permissão para acessar as configurações do banco de dados. Esta seção é restrita a administradores.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </AppLayout>
  );
};

export default Database;
