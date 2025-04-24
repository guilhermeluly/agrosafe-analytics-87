
import React, { useState } from 'react';
import AppLayout from '../../components/AppLayout';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { PLANOS } from '../../config/planos';

// Mock data
const MOCK_COMPANIES = [
  { 
    id: '1', 
    name: 'Empresa Alpha', 
    email: 'contato@alpha.com', 
    domain: 'alpha.agrosafese.com.br',
    plan: 'completo', 
    active: true,
    createdAt: '2024-03-15',
    expiresAt: '2025-03-15'
  },
  { 
    id: '2', 
    name: 'Indústria Beta', 
    email: 'admin@beta.com', 
    domain: 'beta.agrosafese.com.br',
    plan: 'medio', 
    active: true,
    createdAt: '2024-04-01',
    expiresAt: '2025-04-01'
  },
  { 
    id: '3', 
    name: 'Fábrica Gama', 
    email: 'info@gama.com', 
    domain: 'gama.agrosafese.com.br',
    plan: 'basico', 
    active: false,
    createdAt: '2024-02-10',
    expiresAt: '2024-05-10'
  }
];

export default function Companies() {
  const { toast } = useToast();
  const [companies, setCompanies] = useState(MOCK_COMPANIES);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const [newCompany, setNewCompany] = useState({
    name: '',
    email: '',
    domain: '',
    plan: 'basico',
    expiresAt: ''
  });
  
  const handleAddCompany = () => {
    // Validation
    if (!newCompany.name || !newCompany.email || !newCompany.domain || !newCompany.expiresAt) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha todos os campos obrigatórios.',
        variant: 'destructive'
      });
      return;
    }
    
    // Add new company to the list
    const newId = (companies.length + 1).toString();
    const domainFormatted = newCompany.domain.includes('.') 
      ? newCompany.domain 
      : `${newCompany.domain}.agrosafese.com.br`;
      
    setCompanies([
      ...companies, 
      { 
        id: newId, 
        name: newCompany.name, 
        email: newCompany.email,
        domain: domainFormatted,
        plan: newCompany.plan,
        active: true,
        createdAt: new Date().toISOString().split('T')[0],
        expiresAt: newCompany.expiresAt
      }
    ]);
    
    // Reset form and close dialog
    setNewCompany({
      name: '',
      email: '',
      domain: '',
      plan: 'basico',
      expiresAt: ''
    });
    setIsAddDialogOpen(false);
    
    toast({
      title: 'Empresa adicionada',
      description: 'A empresa foi adicionada com sucesso.'
    });
  };
  
  const toggleCompanyStatus = (id: string) => {
    setCompanies(companies.map(company => 
      company.id === id ? { ...company, active: !company.active } : company
    ));
    
    const company = companies.find(c => c.id === id);
    const newStatus = company?.active ? 'desativada' : 'ativada';
    
    toast({
      title: `Empresa ${newStatus}`,
      description: `A empresa foi ${newStatus} com sucesso.`
    });
  };
  
  const handleExtendExpiration = (id: string) => {
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    
    setCompanies(companies.map(company => 
      company.id === id ? { ...company, expiresAt: oneYearFromNow.toISOString().split('T')[0] } : company
    ));
    
    toast({
      title: 'Prazo estendido',
      description: 'O prazo de expiração foi estendido por mais 1 ano.'
    });
  };
  
  return (
    <AppLayout title="Gerenciamento de Empresas">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gerenciamento de Empresas</h1>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Adicionar Empresa</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Adicionar Nova Empresa</DialogTitle>
              <DialogDescription>
                Preencha as informações para cadastrar uma nova empresa no sistema.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="company-name">Nome da Empresa</Label>
                <Input 
                  id="company-name" 
                  value={newCompany.name}
                  onChange={(e) => setNewCompany({...newCompany, name: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="company-email">Email de Contato</Label>
                <Input 
                  id="company-email" 
                  type="email"
                  value={newCompany.email}
                  onChange={(e) => setNewCompany({...newCompany, email: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="company-domain">Subdomínio</Label>
                <div className="flex">
                  <Input 
                    id="company-domain" 
                    placeholder="empresa"
                    value={newCompany.domain}
                    onChange={(e) => setNewCompany({...newCompany, domain: e.target.value})}
                    className="rounded-r-none"
                  />
                  <div className="bg-muted flex items-center px-3 rounded-r-md">
                    .agrosafese.com.br
                  </div>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="company-plan">Plano</Label>
                <Select 
                  defaultValue={newCompany.plan}
                  onValueChange={(value) => setNewCompany({...newCompany, plan: value})}
                >
                  <SelectTrigger id="company-plan">
                    <SelectValue placeholder="Selecione o plano" />
                  </SelectTrigger>
                  <SelectContent>
                    {PLANOS.map(plano => (
                      <SelectItem key={plano.id} value={plano.id}>
                        {plano.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="company-expires">Data de Expiração</Label>
                <Input 
                  id="company-expires" 
                  type="date"
                  value={newCompany.expiresAt}
                  onChange={(e) => setNewCompany({...newCompany, expiresAt: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleAddCompany}>Adicionar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid gap-6">
        {companies.map(company => (
          <Card key={company.id} className={company.active ? '' : 'border-red-200 bg-red-50'}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{company.name}</CardTitle>
                  <CardDescription>{company.domain}</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm ${company.active ? 'text-green-600' : 'text-red-600'}`}>
                    {company.active ? 'Ativo' : 'Inativo'}
                  </span>
                  <Switch 
                    checked={company.active} 
                    onCheckedChange={() => toggleCompanyStatus(company.id)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-2">
                <div>
                  <p className="text-sm text-muted-foreground">Email de Contato</p>
                  <p>{company.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Plano</p>
                  <p className="capitalize">{PLANOS.find(p => p.id === company.plan)?.nome || company.plan}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Expiração</p>
                  <p>{company.expiresAt}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <div className="text-sm text-muted-foreground">
                Criado em: {company.createdAt}
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleExtendExpiration(company.id)}
                >
                  Estender Prazo
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    toast({
                      title: "Acesso ao painel",
                      description: "Redirecionando para o painel da empresa."
                    });
                  }}
                >
                  Acessar Painel
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    toast({
                      title: "Histórico de pagamentos",
                      description: "Exibindo histórico de pagamentos."
                    });
                  }}
                >
                  Pagamentos
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </AppLayout>
  );
}
