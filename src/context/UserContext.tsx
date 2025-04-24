import React, { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "master_admin" | "admin" | "operator" | "viewer";

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isAuthenticated: boolean;
  photo?: string;
  companyId?: string;
  companyName?: string;
  companyDomain?: string;
  databaseId?: string;
  planoId?: string;
}

const defaultUser: UserInfo = {
  id: "",
  name: "",
  email: "",
  role: "viewer",
  isAuthenticated: false,
  planoId: "basico",
};

// Mock user data for demonstration
const mockUsers = [
  {
    id: "1",
    name: "Master Admin",
    email: "Guilhermeluly@hotmail.com",
    password: "052004236",
    role: "master_admin" as UserRole,
    photo: "/avatar-1.png",
    companyId: "0",
    companyName: "AgroSafe SE",
    companyDomain: "admin.agrosafese.com.br",
    databaseId: "db_admin_master",
  },
  {
    id: "2",
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    role: "admin" as UserRole,
    photo: "/avatar-2.png",
    companyId: "1",
    companyName: "Empresa Alpha",
    companyDomain: "alpha.agrosafese.com.br",
    databaseId: "db_alpha_001",
  },
  {
    id: "3",
    name: "Operator User",
    email: "operator@example.com",
    password: "operator123",
    role: "operator" as UserRole,
    photo: "/avatar-3.png",
    companyId: "1",
    companyName: "Empresa Alpha",
    companyDomain: "alpha.agrosafese.com.br",
    databaseId: "db_alpha_001",
  },
  {
    id: "4",
    name: "Viewer User",
    email: "viewer@example.com",
    password: "viewer123",
    role: "viewer" as UserRole,
    photo: "/avatar-4.png",
    companyId: "2",
    companyName: "Indústria Beta",
    companyDomain: "beta.agrosafese.com.br",
    databaseId: "db_beta_002",
  },
];

type UserContextType = {
  user: UserInfo;
  login: (email: string, password: string, rememberMe: boolean) => Promise<boolean>;
  logout: () => void;
  isAuthorized: (requiredRoles: UserRole[]) => boolean;
  updateUserPhoto: (photoUrl: string) => void;
  updateUserPassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  selectedCompanyId?: string;
  setSelectedCompanyId: (companyId: string) => void;
};

const UserContext = createContext<UserContextType | null>(null);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserInfo>(() => {
    const savedUser = localStorage.getItem('rememberedUser');
    return savedUser ? JSON.parse(savedUser) : defaultUser;
  });
  
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(
    user.role === 'master_admin' ? mockUsers[1].companyId || '' : user.companyId || ''
  );

  const login = async (email: string, password: string, rememberMe: boolean = false): Promise<boolean> => {
    const foundUser = mockUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      const userInfo = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
        isAuthenticated: true,
        photo: foundUser.photo,
        companyId: foundUser.companyId,
        companyName: foundUser.companyName,
        companyDomain: foundUser.companyDomain,
        databaseId: foundUser.databaseId,
        planoId: foundUser.id === "1" ? "completo" : foundUser.id === "2" ? "medio" : "basico",
      };
      setUser(userInfo);
      
      if (rememberMe) {
        localStorage.setItem('rememberedUser', JSON.stringify(userInfo));
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(defaultUser);
    localStorage.removeItem('rememberedUser');
  };

  const isAuthorized = (requiredRoles: UserRole[]): boolean => {
    if (!user.isAuthenticated) return false;
    
    // Master admin has access to everything
    if (user.role === "master_admin") return true;
    
    return requiredRoles.includes(user.role);
  };

  const updateUserPhoto = (photoUrl: string) => {
    setUser({ ...user, photo: photoUrl });
  };
  
  const updateUserPassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    // In a real app, this would call an API
    const userIndex = mockUsers.findIndex(u => u.email === user.email && u.password === currentPassword);
    
    if (userIndex >= 0) {
      // Update the mock user's password
      mockUsers[userIndex].password = newPassword;
      return true;
    }
    
    return false;
  };

  const contextValue: UserContextType = {
    user,
    login,
    logout,
    isAuthorized,
    updateUserPhoto,
    updateUserPassword,
    selectedCompanyId,
    setSelectedCompanyId
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser deve estar dentro do provider");
  return context;
}
