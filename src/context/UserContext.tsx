import React, { createContext, useContext, useState, ReactNode } from "react";
import { PLANOS } from "@/config/planos";
import { toast } from "@/components/ui/use-toast";

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
    originalRole?: UserRole;
  };
  login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  logout: () => void;
  isAuthorized: (allowedRoles: UserRole[]) => boolean;
  updateUserPhoto: (photoUrl: string) => void;
  updateUserPassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  selectedCompanyId: string | null;
  setSelectedCompanyId: (id: string | null) => void;
  switchUserRole: (role: UserRole) => void;
  switchPlan: (planId: string) => void;
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

  const login = async (email: string, password: string, rememberMe?: boolean): Promise<boolean> => {
    const mockUsers = [
      {
        id: "1",
        name: "Guilherme Admin",
        email: "Guilhermeluly@hotmail.com",
        password: "052004236",
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

  const updateUserPassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
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
    
    const foundUser = mockUsers.find(u => u.email === user.email && u.password === currentPassword);
    
    if (foundUser) {
      return true;
    }
    
    return false;
  };

  const switchUserRole = (role: UserRole) => {
    // Save the original role if we're switching for the first time
    const originalRole = user.originalRole || user.role;
    
    setUser({
      ...user,
      role,
      // Keep the original role tracking
      originalRole: role !== originalRole ? originalRole : undefined
    });
  };

  const switchPlan = (planId: string) => {
    // This function now just signals that a plan switch was attempted
    // The actual plan switching happens in the PlanSwitcher component
    // which updates the empresa context
    
    const planName = PLANOS.find(p => p.id === planId)?.nome || planId;
    
    toast({
      title: "Tentativa de alteração de plano",
      description: `Para alterar o plano para ${planName}, use o componente PlanSwitcher.`
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
        switchUserRole,
        switchPlan
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
