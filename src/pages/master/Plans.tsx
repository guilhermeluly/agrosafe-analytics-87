
import React, { useState } from 'react';
import AppLayout from '../../components/AppLayout';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PLANOS } from '../../config/planos';

interface Plan {
  id: string;
  nome: string;
  preco: number;
  maxUsuarios: number;
  modoApresentacao: boolean;
  autoRelatorios: boolean;
  exportCSV: boolean;
  analiseInteligente: boolean;
  logoCliente: boolean;
  logoAgroSafe: boolean;
  logoAgroSafeOpcional: boolean;
  testDays: number;
  active: boolean;
  obs: string;
}

const PLANS_WITH_PRICES: Plan[] = PLANOS.map(plano => ({
  ...plano,
  preco: plano.id === 'basico' ? 199 : plano.id === 'medio' ? 399 : 599,
  testDays: 3,
  active: true
}));

export default function Plans() {
  const { toast } = useToast();
  const [plans, setPlans] = useState<Plan[]>(PLANS_WITH_PRICES);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);
  
  const handleOpenEditDialog = (plan: Plan) => {
    setCurrentPlan({...plan});
    setIsEditDialogOpen(true);
  };
  
  const handleUpdatePlan = () => {
    if (!currentPlan) return;
    
    setPlans(plans.map(plan => 
      plan.id === currentPlan.id ? currentPlan : plan
    ));
    
    setIsEditDialogOpen(false);
    
    toast({
      title: 'Plano atualizado',
      description: `O plano ${currentPlan.nome} foi atualizado com sucesso.`
    });
  };
  
  const togglePlanStatus = (id: string) => {
    setPlans(plans.map(plan => 
      plan.id === id ? { ...plan, active: !plan.active } : plan
    ));
    
    const plan = plans.find(p => p.id === id);
    const newStatus = plan?.active ? 'desativado' : 'ativado';
    
    toast({
      title: `Plano ${newStatus}`,
      description: `O plano ${plan?.nome} foi ${newStatus}.`
    });
  };
  
  return (
    <AppLayout title="Gerenciamento de Planos">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Gerenciamento de Planos</h1>
        <p className="text-muted-foreground">Configure os planos e funcionalidades disponíveis para cada nível de assinatura.</p>
      </div>
      
      <Tabs defaultValue="plans" className="mb-6">
        <TabsList>
          <TabsTrigger value="plans">Planos</TabsTrigger>
          <TabsTrigger value="features">Funcionalidades</TabsTrigger>
          <TabsTrigger value="payment">Pagamentos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="plans" className="space-y-6">
          {plans.map(plan => (
            <Card key={plan.id} className={!plan.active ? 'border-red-200 bg-red-50' : ''}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{plan.nome}</CardTitle>
                    <CardDescription>ID: {plan.id}</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm ${plan.active ? 'text-green-600' : 'text-red-600'}`}>
                      {plan.active ? 'Ativo' : 'Inativo'}
                    </span>
                    <Switch 
                      checked={plan.active} 
                      onCheckedChange={() => togglePlanStatus(plan.id)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Detalhes do Plano</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between py-1 border-b">
                        <span className="text-muted-foreground">Preço mensal</span>
                        <span className="font-medium">R$ {plan.preco.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b">
                        <span className="text-muted-foreground">Usuários máximos</span>
                        <span className="font-medium">{plan.maxUsuarios}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b">
                        <span className="text-muted-foreground">Dias de teste</span>
                        <span className="font-medium">{plan.testDays}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b">
                        <span className="text-muted-foreground">Observações</span>
                        <span className="font-medium text-sm">{plan.obs}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Recursos Incluídos</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between py-1 border-b">
                        <span className="text-muted-foreground">Modo Apresentação</span>
                        <span className={plan.modoApresentacao ? 'text-green-600' : 'text-red-600'}>
                          {plan.modoApresentacao ? 'Sim' : 'Não'}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b">
                        <span className="text-muted-foreground">Relatórios Automáticos</span>
                        <span className={plan.autoRelatorios ? 'text-green-600' : 'text-red-600'}>
                          {plan.autoRelatorios ? 'Sim' : 'Não'}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b">
                        <span className="text-muted-foreground">Exportação CSV</span>
                        <span className={plan.exportCSV ? 'text-green-600' : 'text-red-600'}>
                          {plan.exportCSV ? 'Sim' : 'Não'}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b">
                        <span className="text-muted-foreground">Análise Inteligente</span>
                        <span className={plan.analiseInteligente ? 'text-green-600' : 'text-red-600'}>
                          {plan.analiseInteligente ? 'Sim' : 'Não'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h3 className="text-lg font-medium mb-3">Configurações de Logo</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-muted-foreground">Logo do Cliente</span>
                      <span className={plan.logoCliente ? 'text-green-600' : 'text-red-600'}>
                        {plan.logoCliente ? 'Sim' : 'Não'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-muted-foreground">Logo da AgroSafe</span>
                      <span className={plan.logoAgroSafe ? 'text-green-600' : 'text-red-600'}>
                        {plan.logoAgroSafe ? 'Sim' : 'Não'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-muted-foreground">Logo AgroSafe Opcional</span>
                      <span className={plan.logoAgroSafeOpcional ? 'text-green-600' : 'text-red-600'}>
                        {plan.logoAgroSafeOpcional ? 'Sim' : 'Não'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end pt-2">
                <Button 
                  onClick={() => handleOpenEditDialog(plan)}
                >
                  Editar Plano
                </Button>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="features">
          <Card>
            <CardHeader>
              <CardTitle>Configuração de Funcionalidades</CardTitle>
              <CardDescription>
                Defina quais funcionalidades estão disponíveis em cada plano
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Funcionalidade</th>
                      <th className="text-center py-3 px-4">Básico</th>
                      <th className="text-center py-3 px-4">Médio</th>
                      <th className="text-center py-3 px-4">Completo</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 px-4">Dashboard OEE</td>
                      <td className="text-center py-3 px-4">
                        <Switch checked={true} disabled />
                      </td>
                      <td className="text-center py-3 px-4">
                        <Switch checked={true} disabled />
                      </td>
                      <td className="text-center py-3 px-4">
                        <Switch checked={true} disabled />
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">Relatórios Básicos</td>
                      <td className="text-center py-3 px-4">
                        <Switch checked={true} disabled />
                      </td>
                      <td className="text-center py-3 px-4">
                        <Switch checked={true} disabled />
                      </td>
                      <td className="text-center py-3 px-4">
                        <Switch checked={true} disabled />
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">Exportação de Dados (CSV)</td>
                      <td className="text-center py-3 px-4">
                        <Switch checked={false} onCheckedChange={() => {
                          toast({
                            title: 'Funcionalidade atualizada',
                            description: 'As alterações serão aplicadas a todos os planos deste nível.'
                          });
                        }} />
                      </td>
                      <td className="text-center py-3 px-4">
                        <Switch checked={true} onCheckedChange={() => {
                          toast({
                            title: 'Funcionalidade atualizada',
                            description: 'As alterações serão aplicadas a todos os planos deste nível.'
                          });
                        }} />
                      </td>
                      <td className="text-center py-3 px-4">
                        <Switch checked={true} onCheckedChange={() => {
                          toast({
                            title: 'Funcionalidade atualizada',
                            description: 'As alterações serão aplicadas a todos os planos deste nível.'
                          });
                        }} />
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">Relatórios Automáticos</td>
                      <td className="text-center py-3 px-4">
                        <Switch checked={false} onCheckedChange={() => {
                          toast({
                            title: 'Funcionalidade atualizada',
                            description: 'As alterações serão aplicadas a todos os planos deste nível.'
                          });
                        }} />
                      </td>
                      <td className="text-center py-3 px-4">
                        <Switch checked={true} onCheckedChange={() => {
                          toast({
                            title: 'Funcionalidade atualizada',
                            description: 'As alterações serão aplicadas a todos os planos deste nível.'
                          });
                        }} />
                      </td>
                      <td className="text-center py-3 px-4">
                        <Switch checked={true} onCheckedChange={() => {
                          toast({
                            title: 'Funcionalidade atualizada',
                            description: 'As alterações serão aplicadas a todos os planos deste nível.'
                          });
                        }} />
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">Análise Inteligente</td>
                      <td className="text-center py-3 px-4">
                        <Switch checked={false} onCheckedChange={() => {
                          toast({
                            title: 'Funcionalidade atualizada',
                            description: 'As alterações serão aplicadas a todos os planos deste nível.'
                          });
                        }} />
                      </td>
                      <td className="text-center py-3 px-4">
                        <Switch checked={true} onCheckedChange={() => {
                          toast({
                            title: 'Funcionalidade atualizada',
                            description: 'As alterações serão aplicadas a todos os planos deste nível.'
                          });
                        }} />
                      </td>
                      <td className="text-center py-3 px-4">
                        <Switch checked={true} onCheckedChange={() => {
                          toast({
                            title: 'Funcionalidade atualizada',
                            description: 'As alterações serão aplicadas a todos os planos deste nível.'
                          });
                        }} />
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">Modo Apresentação (TV)</td>
                      <td className="text-center py-3 px-4">
                        <Switch checked={false} onCheckedChange={() => {
                          toast({
                            title: 'Funcionalidade atualizada',
                            description: 'As alterações serão aplicadas a todos os planos deste nível.'
                          });
                        }} />
                      </td>
                      <td className="text-center py-3 px-4">
                        <Switch checked={false} onCheckedChange={() => {
                          toast({
                            title: 'Funcionalidade atualizada',
                            description: 'As alterações serão aplicadas a todos os planos deste nível.'
                          });
                        }} />
                      </td>
                      <td className="text-center py-3 px-4">
                        <Switch checked={true} onCheckedChange={() => {
                          toast({
                            title: 'Funcionalidade atualizada',
                            description: 'As alterações serão aplicadas a todos os planos deste nível.'
                          });
                        }} />
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">Logo AgroSafe Opcional</td>
                      <td className="text-center py-3 px-4">
                        <Switch checked={false} onCheckedChange={() => {
                          toast({
                            title: 'Funcionalidade atualizada',
                            description: 'As alterações serão aplicadas a todos os planos deste nível.'
                          });
                        }} />
                      </td>
                      <td className="text-center py-3 px-4">
                        <Switch checked={false} onCheckedChange={() => {
                          toast({
                            title: 'Funcionalidade atualizada',
                            description: 'As alterações serão aplicadas a todos os planos deste nível.'
                          });
                        }} />
                      </td>
                      <td className="text-center py-3 px-4">
                        <Switch checked={true} onCheckedChange={() => {
                          toast({
                            title: 'Funcionalidade atualizada',
                            description: 'As alterações serão aplicadas a todos os planos deste nível.'
                          });
                        }} />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6">
                <Button onClick={() => {
                  toast({
                    title: 'Configurações salvas',
                    description: 'As configurações de funcionalidades foram salvas com sucesso.'
                  });
                }}>
                  Salvar Configurações
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Pagamento</CardTitle>
              <CardDescription>
                Configure integrações de pagamento e opções de cobrança
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Preços dos Planos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price-basic">Plano Básico (R$)</Label>
                      <Input 
                        id="price-basic" 
                        type="number" 
                        defaultValue="199" 
                        min="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price-medium">Plano Médio (R$)</Label>
                      <Input 
                        id="price-medium" 
                        type="number" 
                        defaultValue="399" 
                        min="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price-full">Plano Completo (R$)</Label>
                      <Input 
                        id="price-full" 
                        type="number" 
                        defaultValue="599" 
                        min="0"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Período de Teste</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="trial-days">Dias de teste gratuito</Label>
                      <Input 
                        id="trial-days" 
                        type="number" 
                        defaultValue="3" 
                        min="0"
                        max="30"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="trial-limit">Limite de empresas em teste</Label>
                      <Input 
                        id="trial-limit" 
                        type="number" 
                        defaultValue="50" 
                        min="0"
                      />
                    </div>
                    <div className="flex items-end space-x-2">
                      <Switch id="trial-enabled" defaultChecked />
                      <Label htmlFor="trial-enabled">Período de teste ativo</Label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Integrações de Pagamento</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch id="payment-stripe" />
                      <Label htmlFor="payment-stripe">Integração com Stripe</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="payment-paypal" />
                      <Label htmlFor="payment-paypal">Integração com PayPal</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="payment-manual" defaultChecked />
                      <Label htmlFor="payment-manual">Pagamento Manual (transferência/boleto)</Label>
                    </div>
                  </div>
                </div>
                
                <Button onClick={() => {
                  toast({
                    title: 'Configurações de pagamento salvas',
                    description: 'As configurações de pagamento foram atualizadas com sucesso.'
                  });
                }}>
                  Salvar Configurações
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {currentPlan && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Editar Plano {currentPlan.nome}</DialogTitle>
              <DialogDescription>
                Altere as configurações e recursos disponíveis neste plano.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Nome do Plano</Label>
                  <Input 
                    id="edit-name" 
                    value={currentPlan.nome}
                    onChange={(e) => setCurrentPlan({...currentPlan, nome: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-price">Preço (R$)</Label>
                  <Input 
                    id="edit-price" 
                    type="number"
                    value={currentPlan.preco}
                    onChange={(e) => setCurrentPlan({...currentPlan, preco: Number(e.target.value)})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-users">Máximo de Usuários</Label>
                  <Input 
                    id="edit-users" 
                    type="number"
                    value={currentPlan.maxUsuarios}
                    onChange={(e) => setCurrentPlan({...currentPlan, maxUsuarios: Number(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-trial">Dias de Teste</Label>
                  <Input 
                    id="edit-trial" 
                    type="number"
                    value={currentPlan.testDays}
                    onChange={(e) => setCurrentPlan({...currentPlan, testDays: Number(e.target.value)})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-obs">Observações</Label>
                <Input 
                  id="edit-obs" 
                  value={currentPlan.obs}
                  onChange={(e) => setCurrentPlan({...currentPlan, obs: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="edit-presentation">Modo Apresentação</Label>
                    <Switch 
                      id="edit-presentation"
                      checked={currentPlan.modoApresentacao}
                      onCheckedChange={(checked) => setCurrentPlan({...currentPlan, modoApresentacao: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="edit-auto-reports">Relatórios Automáticos</Label>
                    <Switch 
                      id="edit-auto-reports"
                      checked={currentPlan.autoRelatorios}
                      onCheckedChange={(checked) => setCurrentPlan({...currentPlan, autoRelatorios: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="edit-csv">Exportação CSV</Label>
                    <Switch 
                      id="edit-csv"
                      checked={currentPlan.exportCSV}
                      onCheckedChange={(checked) => setCurrentPlan({...currentPlan, exportCSV: checked})}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="edit-analysis">Análise Inteligente</Label>
                    <Switch 
                      id="edit-analysis"
                      checked={currentPlan.analiseInteligente}
                      onCheckedChange={(checked) => setCurrentPlan({...currentPlan, analiseInteligente: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="edit-client-logo">Logo do Cliente</Label>
                    <Switch 
                      id="edit-client-logo"
                      checked={currentPlan.logoCliente}
                      onCheckedChange={(checked) => setCurrentPlan({...currentPlan, logoCliente: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="edit-agrosafe-logo">Logo AgroSafe</Label>
                    <Switch 
                      id="edit-agrosafe-logo"
                      checked={currentPlan.logoAgroSafe}
                      onCheckedChange={(checked) => setCurrentPlan({...currentPlan, logoAgroSafe: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="edit-optional-logo">Logo AgroSafe Opcional</Label>
                    <Switch 
                      id="edit-optional-logo"
                      checked={currentPlan.logoAgroSafeOpcional}
                      onCheckedChange={(checked) => setCurrentPlan({...currentPlan, logoAgroSafeOpcional: checked})}
                    />
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleUpdatePlan}>Salvar Alterações</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </AppLayout>
  );
}
