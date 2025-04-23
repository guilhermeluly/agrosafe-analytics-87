
import React, { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "admin" | "operator" | "viewer";

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isAuthenticated: boolean;
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
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    role: "admin" as UserRole,
  },
  {
    id: "2",
    name: "Operator User",
    email: "operator@example.com",
    password: "operator123",
    role: "operator" as UserRole,
  },
  {
    id: "3",
    name: "Viewer User",
    email: "viewer@example.com",
    password: "viewer123",
    role: "viewer" as UserRole,
  },
];

type UserContextType = {
  user: UserInfo;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthorized: (requiredRoles: UserRole[]) => boolean;
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
    return requiredRoles.includes(user.role);
  };

  return (
    <UserContext.Provider value={{ user, login, logout, isAuthorized }}>
      {children}
    </UserContext.Provider>
  );
};

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser deve estar dentro do provider");
  return context;
}
