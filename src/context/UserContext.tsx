
import React, { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "master_admin" | "admin" | "operator" | "viewer";

interface UserContextType {
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    companyId: string;
    isAuthenticated: boolean;
    photo: string;
    originalRole?: UserRole; // Adicionado para guardar o papel original
  };
  login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  logout: () => void;
  isAuthorized: (allowedRoles: UserRole[]) => boolean;
  updateUserPhoto: (photoUrl: string) => void;
  updateUserPassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  selectedCompanyId: string | null;
  setSelectedCompanyId: (id: string | null) => void;
  switchUserRole: (role: UserRole) => void; // Nova função para trocar papel
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser deve ser usado dentro de um UserProvider");
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState({
    id: "",
    name: "",
    email: "",
    role: "viewer" as UserRole,
    companyId: "",
    isAuthenticated: false,
    photo: "",
    originalRole: undefined as UserRole | undefined,
  });

  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);

  // Simula login com usuários mockados
  const login = async (email: string, password: string, rememberMe?: boolean): Promise<boolean> => {
    // Dados mockados para testes
    const mockUsers = [
      {
        id: "1",
        name: "Admin Master",
        email: "master@example.com",
        password: "123456",
        role: "master_admin" as UserRole,
        companyId: "all",
        photo: "/avatar.png"
      },
      {
        id: "2",
        name: "Administrador",
        email: "admin@example.com",
        password: "123456",
        role: "admin" as UserRole,
        companyId: "company1",
        photo: "/avatar.png"
      },
      {
        id: "3",
        name: "Operador",
        email: "operator@example.com",
        password: "123456",
        role: "operator" as UserRole,
        companyId: "company1",
        photo: ""
      },
      {
        id: "4",
        name: "Visualizador",
        email: "viewer@example.com",
        password: "123456",
        role: "viewer" as UserRole,
        companyId: "company1",
        photo: ""
      }
    ];

    const foundUser = mockUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser({
        ...userWithoutPassword,
        isAuthenticated: true,
        originalRole: userWithoutPassword.role
      });
      
      // Se for master_admin, seleciona a primeira empresa por padrão
      if (foundUser.role === "master_admin") {
        setSelectedCompanyId("company1");
      }
      
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser({
      id: "",
      name: "",
      email: "",
      role: "viewer",
      companyId: "",
      isAuthenticated: false,
      photo: "",
      originalRole: undefined
    });
    setSelectedCompanyId(null);
  };

  const isAuthorized = (allowedRoles: UserRole[]): boolean => {
    if (!user.isAuthenticated) return false;
    return allowedRoles.includes(user.role);
  };

  const updateUserPhoto = (photoUrl: string) => {
    setUser({ ...user, photo: photoUrl });
  };

  // Nova função para alterar a senha do usuário
  const updateUserPassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    // Em um sistema real, aqui teria uma chamada para a API para alterar a senha
    // Para demonstração, vamos apenas simular uma verificação do password atual
    
    // Dados mockados para testes
    const mockUsers = [
      {
        id: "1",
        email: "master@example.com",
        password: "123456",
      },
      {
        id: "2",
        email: "admin@example.com",
        password: "123456",
      },
      {
        id: "3",
        email: "operator@example.com",
        password: "123456",
      },
      {
        id: "4",
        email: "viewer@example.com",
        password: "123456",
      }
    ];
    
    // Verificar se a senha atual está correta
    const foundUser = mockUsers.find(u => u.email === user.email && u.password === currentPassword);
    
    if (foundUser) {
      // Em um sistema real, aqui atualizaria a senha no banco de dados
      // Para demonstração, apenas retornamos sucesso
      return true;
    }
    
    return false;
  };

  // Nova função para trocar o papel do usuário
  const switchUserRole = (role: UserRole) => {
    const originalRole = user.originalRole || user.role;
    
    setUser({
      ...user,
      role,
      originalRole  // Mantém o papel original para poder voltar depois
    });
  };

  return (
    <UserContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthorized,
        updateUserPhoto,
        updateUserPassword,
        selectedCompanyId,
        setSelectedCompanyId,
        switchUserRole
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
