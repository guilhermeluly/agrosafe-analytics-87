
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
}

const defaultUser: UserInfo = {
  id: "",
  name: "",
  email: "",
  role: "viewer",
  isAuthenticated: false,
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
  },
  {
    id: "2",
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    role: "admin" as UserRole,
    photo: "/avatar-2.png",
  },
  {
    id: "3",
    name: "Operator User",
    email: "operator@example.com",
    password: "operator123",
    role: "operator" as UserRole,
    photo: "/avatar-3.png",
  },
  {
    id: "4",
    name: "Viewer User",
    email: "viewer@example.com",
    password: "viewer123",
    role: "viewer" as UserRole,
    photo: "/avatar-4.png",
  },
];

type UserContextType = {
  user: UserInfo;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthorized: (requiredRoles: UserRole[]) => boolean;
  updateUserPhoto: (photoUrl: string) => void;
  updateUserPassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
};

const UserContext = createContext<UserContextType | null>(null);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserInfo>(defaultUser);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - in a real app, this would call an API
    const foundUser = mockUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      setUser({
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
        isAuthenticated: true,
        photo: foundUser.photo,
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(defaultUser);
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

  return (
    <UserContext.Provider value={{ user, login, logout, isAuthorized, updateUserPhoto, updateUserPassword }}>
      {children}
    </UserContext.Provider>
  );
};

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser deve estar dentro do provider");
  return context;
}
