
import React, { useState } from 'react';
import AppLayout from '../../components/AppLayout';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserRole } from '../../context/UserContext';

// Mock users
const MOCK_USERS = [
  {
    id: '1',
    name: 'Master Admin',
    email: 'master@example.com',
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
  }
];

// Mock companies for the select dropdown
const MOCK_COMPANIES = [
  { id: '0', name: 'AgroSafe SE' },
  { id: '1', name: 'Empresa Alpha' },
  { id: '2', name: 'Indústria Beta' },
  { id: '3', name: 'Fábrica Gama' }
];

export default function Users() {
  const { toast } = useToast();
  const [users, setUsers] = useState(MOCK_USERS);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'viewer' as UserRole,
    companyId: ''
  });
  
  const handleAddUser = () => {
    // Validation
    if (!newUser.name || !newUser.email || !newUser.password || !newUser.companyId) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha todos os campos obrigatórios.',
        variant: 'destructive'
      });
      return;
    }
    
    // Add new user
    const newId = (users.length + 1).toString();
    const company = MOCK_COMPANIES.find(c => c.id === newUser.companyId);
    
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
    setIsAddDialogOpen(false);
    
    toast({
      title: 'Usuário adicionado',
      description: 'O usuário foi adicionado com sucesso.'
    });
  };
  
  const handleResetPassword = () => {
    if (!selectedUser) return;
    
    toast({
      title: 'Senha redefinida',
      description: 'Um email com instruções foi enviado para o usuário.'
    });
    
    setIsResetDialogOpen(false);
  };
  
  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(user => user.id !== id));
    
    toast({
      title: 'Usuário removido',
      description: 'O usuário foi removido com sucesso.'
    });
  };
  
  // Filter users based on search query
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.companyName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <AppLayout title="Gerenciamento de Usuários">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gerenciamento de Usuários</h1>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Adicionar Usuário</Button>
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
                    <SelectItem value="master_admin">Administrador Master</SelectItem>
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
                    {MOCK_COMPANIES.map(company => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleAddUser}>Adicionar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Redefinir Senha</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja redefinir a senha deste usuário? Um email com instruções será enviado.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setIsResetDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleResetPassword}>Confirmar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Filtrar Usuários</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input 
                placeholder="Buscar por nome, email ou empresa..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="w-full md:w-64">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por empresa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_companies">Todas as empresas</SelectItem>
                  {MOCK_COMPANIES.map(company => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-64">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por função" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_roles">Todas as funções</SelectItem>
                  <SelectItem value="master_admin">Administrador Master</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="operator">Operador</SelectItem>
                  <SelectItem value="viewer">Visualizador</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid gap-4">
        {filteredUsers.map(user => (
          <Card key={user.id} className="relative overflow-hidden">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4 items-center md:items-start">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user.photo} alt={user.name} />
                  <AvatarFallback className="text-lg">
                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 text-center md:text-left">
                  <h3 className="font-medium text-lg">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Função</p>
                      <p className="capitalize">{user.role.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Empresa</p>
                      <p>{user.companyName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Último acesso</p>
                      <p>{user.lastLogin}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-row md:flex-col gap-2 mt-2 md:mt-0">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSelectedUser(user.id);
                      setIsResetDialogOpen(true);
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
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhum usuário encontrado com os filtros selecionados.</p>
        </div>
      )}
    </AppLayout>
  );
}
