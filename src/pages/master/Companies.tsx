
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, Database, Users } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UserRole } from '@/context/UserContext';

// Mock data for companies
const MOCK_COMPANIES = [
  { 
    id: '1', 
    name: 'Empresa Alpha', 
    email: 'contato@alpha.com', 
    domain: 'alpha.agrosafese.com.br',
    plan: 'completo', 
    active: true,
    createdAt: '2024-03-15',
    expiresAt: '2025-03-15',
    databaseId: 'db_alpha_001'
  },
  { 
    id: '2', 
    name: 'Indústria Beta', 
    email: 'admin@beta.com', 
    domain: 'beta.agrosafese.com.br',
    plan: 'medio', 
    active: true,
    createdAt: '2024-04-01',
    expiresAt: '2025-04-01',
    databaseId: 'db_beta_002'
  },
  { 
    id: '3', 
    name: 'Fábrica Gama', 
    email: 'info@gama.com', 
    domain: 'gama.agrosafese.com.br',
    plan: 'basico', 
    active: false,
    createdAt: '2024-02-10',
    expiresAt: '2024-05-10',
    databaseId: 'db_gama_003'
  }
];

// Mock users data
const MOCK_USERS = [
  {
    id: '1',
    name: 'Master Admin',
    email: 'Guilhermeluly@hotmail.com',
    role: 'master_admin' as UserRole,
    companyId: '0',
    companyName: 'AgroSafe SE',
    photo: '/avatar-1.png',
    lastLogin: '2025-04-22 14:32'
  },
  {
    id: '2',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin' as UserRole,
    companyId: '1',
    companyName: 'Empresa Alpha',
    photo: '/avatar-2.png',
    lastLogin: '2025-04-21 09:15'
  },
  {
    id: '3',
    name: 'Operator User',
    email: 'operator@example.com',
    role: 'operator' as UserRole,
    companyId: '1',
    companyName: 'Empresa Alpha',
    photo: '/avatar-3.png',
    lastLogin: '2025-04-20 17:45'
  },
  {
    id: '4',
    name: 'Viewer User',
    email: 'viewer@example.com',
    role: 'viewer' as UserRole,
    companyId: '2',
    companyName: 'Indústria Beta',
    photo: '/avatar-4.png',
    lastLogin: '2025-04-19 11:20'
  },
  {
    id: '5',
    name: 'Operador Beta',
    email: 'operador@beta.com',
    role: 'operator' as UserRole,
    companyId: '2',
    companyName: 'Indústria Beta',
    photo: '',
    lastLogin: '2025-04-18 10:30'
  }
];

export default function Companies() {
  const { toast } = useToast();
  const [companies, setCompanies] = useState(MOCK_COMPANIES);
  const [users, setUsers] = useState(MOCK_USERS);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [expandedCompanies, setExpandedCompanies] = useState<string[]>([]);
  
  const [newCompany, setNewCompany] = useState({
    name: '',
    email: '',
    domain: '',
    plan: 'basico',
    expiresAt: '',
    databaseId: ''
  });
  
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'viewer' as UserRole,
    companyId: ''
  });
  
  const toggleExpand = (companyId: string) => {
    setExpandedCompanies(prev => 
      prev.includes(companyId)
        ? prev.filter(id => id !== companyId)
        : [...prev, companyId]
    );
  };
  
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
    
    // Generate a database ID based on company name
    const databaseId = `db_${newCompany.domain.split('.')[0]}_${newId.padStart(3, '0')}`;
      
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
        expiresAt: newCompany.expiresAt,
        databaseId: databaseId
      }
    ]);
    
    // Reset form and close dialog
    setNewCompany({
      name: '',
      email: '',
      domain: '',
      plan: 'basico',
      expiresAt: '',
      databaseId: ''
    });
    setIsAddDialogOpen(false);
    
    toast({
      title: 'Empresa adicionada',
      description: 'A empresa foi adicionada com sucesso.'
    });
  };
  
  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.password || !newUser.companyId) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha todos os campos obrigatórios.',
        variant: 'destructive'
      });
      return;
    }
    
    // Não permitir adicionar outro usuário master_admin
    if (newUser.role === 'master_admin') {
      toast({
        title: 'Operação não permitida',
        description: 'Apenas um usuário Master Admin é permitido no sistema.',
        variant: 'destructive'
      });
      return;
    }
    
    // Add new user
    const newId = (users.length + 1).toString();
    const company = companies.find(c => c.id === newUser.companyId);
    
    setUsers([
      ...users,
      {
        id: newId,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        companyId: newUser.companyId,
        companyName: company?.name || '',
        photo: '',
        lastLogin: 'Nunca'
      }
    ]);
    
    // Reset form and close dialog
    setNewUser({
      name: '',
      email: '',
      password: '',
      role: 'viewer',
      companyId: ''
    });
    setIsAddUserDialogOpen(false);
    
    toast({
      title: 'Usuário adicionado',
      description: 'O usuário foi adicionado com sucesso.'
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
  
  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(user => user.id !== id));
    
    toast({
      title: 'Usuário removido',
      description: 'O usuário foi removido com sucesso.'
    });
  };
  
  const getUsersByCompany = (companyId: string) => {
    return users.filter(user => user.companyId === companyId);
  };
  
  return (
    <AppLayout title="Gerenciamento de Empresas">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gerenciamento de Empresas e Usuários</h1>
        
        <div className="flex gap-2">
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
          
          <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Adicionar Usuário</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Adicionar Novo Usuário</DialogTitle>
                <DialogDescription>
                  Preencha as informações para cadastrar um novo usuário no sistema.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="user-name">Nome Completo</Label>
                  <Input 
                    id="user-name" 
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="user-email">Email</Label>
                  <Input 
                    id="user-email" 
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="user-password">Senha Inicial</Label>
                  <Input 
                    id="user-password" 
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="user-role">Função</Label>
                  <Select 
                    defaultValue={newUser.role}
                    onValueChange={(value: UserRole) => setNewUser({...newUser, role: value})}
                  >
                    <SelectTrigger id="user-role">
                      <SelectValue placeholder="Selecione a função" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="operator">Operador</SelectItem>
                      <SelectItem value="viewer">Visualizador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="user-company">Empresa</Label>
                  <Select 
                    value={newUser.companyId}
                    onValueChange={(value) => setNewUser({...newUser, companyId: value})}
                  >
                    <SelectTrigger id="user-company">
                      <SelectValue placeholder="Selecione a empresa" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map(company => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>Cancelar</Button>
                <Button onClick={handleAddUser}>Adicionar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="grid gap-6">
        {companies.map(company => (
          <Card key={company.id} className={company.active ? '' : 'border-red-200 bg-red-50'}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {company.name}
                  </CardTitle>
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-2">
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
                <div>
                  <p className="text-sm text-muted-foreground">Banco de Dados</p>
                  <p className="flex items-center">
                    <Database className="h-4 w-4 mr-1" /> 
                    {company.databaseId}
                  </p>
                </div>
              </div>
              
              <Collapsible
                open={expandedCompanies.includes(company.id)}
                onOpenChange={() => toggleExpand(company.id)}
                className="mt-4 border-t pt-4"
              >
                <CollapsibleTrigger asChild>
                  <div className="flex items-center justify-between cursor-pointer hover:bg-muted p-2 rounded-md">
                    <div className="flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      <span className="font-medium">Usuários desta empresa</span>
                      <span className="ml-2 bg-muted-foreground/20 px-2 py-0.5 rounded-full text-xs">
                        {getUsersByCompany(company.id).length}
                      </span>
                    </div>
                    {expandedCompanies.includes(company.id) ? 
                      <ChevronUp className="h-5 w-5" /> : 
                      <ChevronDown className="h-5 w-5" />
                    }
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="mt-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Usuário</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Função</TableHead>
                          <TableHead>Último acesso</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getUsersByCompany(company.id).map(user => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={user.photo} />
                                  <AvatarFallback>
                                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                {user.name}
                              </div>
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell className="capitalize">
                              {user.role.replace('_', ' ')}
                            </TableCell>
                            <TableCell>{user.lastLogin}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    toast({
                                      title: 'Redefinição de senha',
                                      description: 'Email enviado com instruções de redefinição.'
                                    });
                                  }}
                                >
                                  Redefinir Senha
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => handleDeleteUser(user.id)}
                                >
                                  Remover
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    
                    {getUsersByCompany(company.id).length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        Nenhum usuário cadastrado para esta empresa.
                      </div>
                    )}
                    
                    <div className="mt-4 flex justify-end">
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedCompanyId(company.id);
                          setNewUser(prev => ({ ...prev, companyId: company.id }));
                          setIsAddUserDialogOpen(true);
                        }}
                      >
                        Adicionar Usuário
                      </Button>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
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
