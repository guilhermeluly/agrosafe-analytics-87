
import React, { useState } from 'react';
import AppLayout from '../../components/AppLayout';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Smartphone, Download, RefreshCw, Upload } from 'lucide-react';

export default function MobileApp() {
  const { toast } = useToast();
  const [uploadingApk, setUploadingApk] = useState(false);
  const [isTestMode, setIsTestMode] = useState(false);
  const [isPushNotificationsEnabled, setIsPushNotificationsEnabled] = useState(true);
  const [isOfflineModeEnabled, setIsOfflineModeEnabled] = useState(true);
  const [isAutoUpdateEnabled, setIsAutoUpdateEnabled] = useState(true);
  
  const [apkVersion, setApkVersion] = useState("1.0.3");
  const [releaseNotes, setReleaseNotes] = useState("- Correção de bugs\n- Melhorias na sincronização offline\n- Adicionado suporte para múltiplas linhas");
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadingApk(true);
    
    // Simulate upload
    setTimeout(() => {
      setUploadingApk(false);
      setApkVersion("1.0.4");
      toast({
        title: "APK Enviado",
        description: "O arquivo APK foi enviado com sucesso."
      });
    }, 2000);
  };
  
  const handleReleaseNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReleaseNotes(e.target.value);
  };
  
  const handlePublishUpdate = () => {
    toast({
      title: "Atualização Publicada",
      description: `A versão ${apkVersion} foi publicada com sucesso.`
    });
  };
  
  const handleDownloadApk = () => {
    toast({
      title: "Download iniciado",
      description: "O APK está sendo preparado para download."
    });
    
    // In a real app, this would trigger a download or open a link
    setTimeout(() => {
      toast({
        title: "APK disponível",
        description: "O download do APK foi concluído com sucesso."
      });
    }, 2000);
  };
  
  return (
    <AppLayout title="Aplicativo Mobile">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Gerenciamento do Aplicativo Mobile</h1>
        <p className="text-muted-foreground">Configure e gerencie o aplicativo Android (APK) para seus usuários.</p>
      </div>
      
      <Tabs defaultValue="manage">
        <TabsList className="mb-6">
          <TabsTrigger value="manage">Gerenciar APK</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="manage">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Versão Atual</CardTitle>
                <CardDescription>
                  Informações sobre a versão atual do aplicativo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Versão:</span>
                    <span className="font-medium">{apkVersion}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Data de publicação:</span>
                    <span className="font-medium">22/04/2025</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Tamanho:</span>
                    <span className="font-medium">8.2 MB</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Downloads:</span>
                    <span className="font-medium">247</span>
                  </div>
                </div>
                
                <div>
                  <Label>Notas da versão</Label>
                  <div className="mt-2 p-3 border rounded-md text-sm whitespace-pre-line">
                    {releaseNotes}
                  </div>
                </div>
                
                <Button 
                  onClick={handleDownloadApk} 
                  className="w-full"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Baixar APK
                </Button>
                
                <div className="flex items-center justify-between mt-2">
                  <Label htmlFor="test-mode" className="cursor-pointer">Modo de teste</Label>
                  <Switch 
                    id="test-mode" 
                    checked={isTestMode}
                    onCheckedChange={setIsTestMode}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Enviar Nova Versão</CardTitle>
                <CardDescription>
                  Atualize o aplicativo para uma nova versão
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="apk-file">Arquivo APK</Label>
                  <Input 
                    id="apk-file" 
                    type="file" 
                    accept=".apk"
                    onChange={handleFileChange}
                  />
                  <p className="text-xs text-muted-foreground">
                    Selecione o arquivo APK assinado para upload
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="version-number">Número da versão</Label>
                  <Input 
                    id="version-number" 
                    placeholder="ex: 1.0.4" 
                    value={apkVersion}
                    onChange={(e) => setApkVersion(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="release-notes">Notas da versão</Label>
                  <textarea 
                    id="release-notes"
                    className="w-full min-h-[100px] p-2 border rounded-md"
                    value={releaseNotes}
                    onChange={handleReleaseNotesChange}
                  />
                </div>
                
                <Button 
                  onClick={handlePublishUpdate} 
                  className="w-full"
                  disabled={uploadingApk}
                >
                  {uploadingApk ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Publicar Atualização
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Instruções de Instalação</CardTitle>
              <CardDescription>
                Compartilhe estas instruções com os usuários para instalar o aplicativo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Instalação do APK</h3>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>Baixe o arquivo APK no seu dispositivo Android</li>
                    <li>Acesse as Configurações do seu dispositivo</li>
                    <li>Vá em Segurança (ou Privacidade)</li>
                    <li>Ative a opção "Fontes desconhecidas" ou "Instalar apps de fontes desconhecidas"</li>
                    <li>Localize o arquivo baixado e toque nele para iniciar a instalação</li>
                    <li>Siga as instruções na tela para completar a instalação</li>
                    <li>Após a instalação, abra o aplicativo e faça login com suas credenciais</li>
                  </ol>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">QR Code para Download</h3>
                  <div className="bg-gray-200 h-48 w-48 flex items-center justify-center rounded-md mb-4">
                    <Smartphone className="h-12 w-12 text-gray-400" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Escaneie este QR code com a câmera do seu dispositivo Android para baixar diretamente o aplicativo.
                  </p>
                  
                  <div className="mt-4">
                    <Button variant="outline" onClick={() => {
                      toast({
                        title: "QR Code gerado",
                        description: "Um novo QR code foi gerado para download."
                      });
                    }}>
                      Gerar novo QR Code
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Aplicativo</CardTitle>
              <CardDescription>
                Configure as funcionalidades e comportamentos do aplicativo mobile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Funcionalidades</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="offline-mode" className="mb-1 block">Modo Offline</Label>
                          <p className="text-sm text-muted-foreground">Permite registrar dados sem conexão</p>
                        </div>
                        <Switch 
                          id="offline-mode" 
                          checked={isOfflineModeEnabled}
                          onCheckedChange={setIsOfflineModeEnabled}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="push-notifications" className="mb-1 block">Notificações Push</Label>
                          <p className="text-sm text-muted-foreground">Envia alertas sobre atualizações e eventos</p>
                        </div>
                        <Switch 
                          id="push-notifications" 
                          checked={isPushNotificationsEnabled}
                          onCheckedChange={setIsPushNotificationsEnabled}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="auto-update" className="mb-1 block">Atualização Automática</Label>
                          <p className="text-sm text-muted-foreground">Notifica usuários sobre novas versões</p>
                        </div>
                        <Switch 
                          id="auto-update" 
                          checked={isAutoUpdateEnabled}
                          onCheckedChange={setIsAutoUpdateEnabled}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Cache e Armazenamento</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cache-days">Dias para manter cache offline</Label>
                        <Input 
                          id="cache-days" 
                          type="number" 
                          defaultValue="7" 
                          min="1"
                          max="30"
                        />
                        <p className="text-xs text-muted-foreground">
                          Número de dias que os dados ficam armazenados localmente
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="max-storage">Limite de armazenamento (MB)</Label>
                        <Input 
                          id="max-storage" 
                          type="number" 
                          defaultValue="50" 
                          min="10"
                        />
                        <p className="text-xs text-muted-foreground">
                          Espaço máximo usado para armazenamento de dados
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Sincronização</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="sync-interval">Intervalo de sincronização (minutos)</Label>
                        <Input 
                          id="sync-interval" 
                          type="number" 
                          defaultValue="15" 
                          min="5"
                        />
                        <p className="text-xs text-muted-foreground">
                          Frequência com que o app sincroniza dados com o servidor
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="wifi-only" className="mb-1 block">Sincronizar apenas em Wi-Fi</Label>
                          <p className="text-sm text-muted-foreground">Economiza dados móveis dos usuários</p>
                        </div>
                        <Switch id="wifi-only" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="background-sync" className="mb-1 block">Sincronização em segundo plano</Label>
                          <p className="text-sm text-muted-foreground">Sincroniza mesmo com o app fechado</p>
                        </div>
                        <Switch id="background-sync" defaultChecked />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Segurança</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="biometric" className="mb-1 block">Autenticação Biométrica</Label>
                          <p className="text-sm text-muted-foreground">Permite login com impressão digital</p>
                        </div>
                        <Switch id="biometric" defaultChecked />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="session-timeout">Timeout de sessão (minutos)</Label>
                        <Input 
                          id="session-timeout" 
                          type="number" 
                          defaultValue="30" 
                          min="1"
                        />
                        <p className="text-xs text-muted-foreground">
                          Tempo até que o usuário seja desconectado automaticamente
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={() => {
                  toast({
                    title: "Configurações salvas",
                    description: "As configurações do aplicativo foram atualizadas com sucesso."
                  });
                }} 
                className="mt-6"
              >
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Logs do Aplicativo</CardTitle>
              <CardDescription>
                Verifique os registros de instalação e uso do aplicativo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Logs de Instalação</h3>
                  <Button variant="outline" size="sm">Exportar CSV</Button>
                </div>
                
                <div className="border rounded-md overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-muted">
                        <th className="px-4 py-2 text-left">Data</th>
                        <th className="px-4 py-2 text-left">Usuário</th>
                        <th className="px-4 py-2 text-left">Empresa</th>
                        <th className="px-4 py-2 text-left">Versão</th>
                        <th className="px-4 py-2 text-left">Dispositivo</th>
                        <th className="px-4 py-2 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t">
                        <td className="px-4 py-2 text-sm">22/04/2025 14:23</td>
                        <td className="px-4 py-2 text-sm">João Silva</td>
                        <td className="px-4 py-2 text-sm">Empresa Alpha</td>
                        <td className="px-4 py-2 text-sm">1.0.3</td>
                        <td className="px-4 py-2 text-sm">Samsung Galaxy S22</td>
                        <td className="px-4 py-2 text-sm text-green-600">Sucesso</td>
                      </tr>
                      <tr className="border-t">
                        <td className="px-4 py-2 text-sm">21/04/2025 09:15</td>
                        <td className="px-4 py-2 text-sm">Maria Santos</td>
                        <td className="px-4 py-2 text-sm">Indústria Beta</td>
                        <td className="px-4 py-2 text-sm">1.0.3</td>
                        <td className="px-4 py-2 text-sm">Xiaomi Redmi Note 10</td>
                        <td className="px-4 py-2 text-sm text-green-600">Sucesso</td>
                      </tr>
                      <tr className="border-t">
                        <td className="px-4 py-2 text-sm">20/04/2025 17:42</td>
                        <td className="px-4 py-2 text-sm">Carlos Oliveira</td>
                        <td className="px-4 py-2 text-sm">Empresa Alpha</td>
                        <td className="px-4 py-2 text-sm">1.0.3</td>
                        <td className="px-4 py-2 text-sm">Motorola G60</td>
                        <td className="px-4 py-2 text-sm text-red-600">Falha</td>
                      </tr>
                      <tr className="border-t">
                        <td className="px-4 py-2 text-sm">19/04/2025 11:34</td>
                        <td className="px-4 py-2 text-sm">Ana Ferreira</td>
                        <td className="px-4 py-2 text-sm">Fábrica Gama</td>
                        <td className="px-4 py-2 text-sm">1.0.2</td>
                        <td className="px-4 py-2 text-sm">Samsung Galaxy A52</td>
                        <td className="px-4 py-2 text-sm text-green-600">Sucesso</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="flex justify-between items-center mt-8">
                  <h3 className="text-lg font-medium">Logs de Uso</h3>
                  <Button variant="outline" size="sm">Exportar CSV</Button>
                </div>
                
                <div className="border rounded-md overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-muted">
                        <th className="px-4 py-2 text-left">Data</th>
                        <th className="px-4 py-2 text-left">Usuário</th>
                        <th className="px-4 py-2 text-left">Empresa</th>
                        <th className="px-4 py-2 text-left">Ação</th>
                        <th className="px-4 py-2 text-left">Versão</th>
                        <th className="px-4 py-2 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t">
                        <td className="px-4 py-2 text-sm">22/04/2025 16:10</td>
                        <td className="px-4 py-2 text-sm">João Silva</td>
                        <td className="px-4 py-2 text-sm">Empresa Alpha</td>
                        <td className="px-4 py-2 text-sm">Inserção de Dados</td>
                        <td className="px-4 py-2 text-sm">1.0.3</td>
                        <td className="px-4 py-2 text-sm text-green-600">Sucesso</td>
                      </tr>
                      <tr className="border-t">
                        <td className="px-4 py-2 text-sm">22/04/2025 15:45</td>
                        <td className="px-4 py-2 text-sm">Maria Santos</td>
                        <td className="px-4 py-2 text-sm">Indústria Beta</td>
                        <td className="px-4 py-2 text-sm">Visualização de Relatório</td>
                        <td className="px-4 py-2 text-sm">1.0.3</td>
                        <td className="px-4 py-2 text-sm text-green-600">Sucesso</td>
                      </tr>
                      <tr className="border-t">
                        <td className="px-4 py-2 text-sm">22/04/2025 14:30</td>
                        <td className="px-4 py-2 text-sm">Carlos Oliveira</td>
                        <td className="px-4 py-2 text-sm">Empresa Alpha</td>
                        <td className="px-4 py-2 text-sm">Sincronização</td>
                        <td className="px-4 py-2 text-sm">1.0.3</td>
                        <td className="px-4 py-2 text-sm text-amber-600">Parcial</td>
                      </tr>
                      <tr className="border-t">
                        <td className="px-4 py-2 text-sm">22/04/2025 12:15</td>
                        <td className="px-4 py-2 text-sm">Ana Ferreira</td>
                        <td className="px-4 py-2 text-sm">Fábrica Gama</td>
                        <td className="px-4 py-2 text-sm">Exportação de Dados</td>
                        <td className="px-4 py-2 text-sm">1.0.3</td>
                        <td className="px-4 py-2 text-sm text-green-600">Sucesso</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t pt-4">
              <Button onClick={() => {
                toast({
                  title: "Logs limpos",
                  description: "Os logs antigos foram limpos com sucesso."
                });
              }}>
                Limpar Logs Antigos
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
