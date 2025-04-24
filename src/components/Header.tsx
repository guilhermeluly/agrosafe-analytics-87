
import React from "react";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useEmpresa } from "../context/EmpresaContext";
import { Button } from "@/components/ui/button";

const Header = () => {
  const { user, logout } = useUser();
  const { empresa } = useEmpresa();
  
  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-xl font-bold mb-2 md:mb-0">OEE Performance Hub</div>
        
        {user.isAuthenticated ? (
          <>
            <nav className="mb-2 md:mb-0">
              <ul className="flex space-x-4">
                <li>
                  <Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link>
                </li>
                
                {(user.role === "admin" || user.role === "operator") && (
                  <li>
                    <Link to="/production-form" className="hover:text-gray-300">Inserir Dados</Link>
                  </li>
                )}
                
                <li>
                  <Link to="/relatorios" className="hover:text-gray-300">Relatórios</Link>
                </li>
                
                {user.role === "admin" && (
                  <li>
                    <Link to="/admin" className="hover:text-gray-300">Admin</Link>
                  </li>
                )}
              </ul>
            </nav>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm">
                <span className="opacity-75">Usuário:</span> {user.name} 
                <span className="ml-2 px-2 py-1 bg-blue-700 rounded-full text-xs uppercase">{user.role}</span>
              </div>
              <Button variant="outline" size="sm" onClick={logout}>
                Sair
              </Button>
            </div>
          </>
        ) : (
          <Link to="/login">
            <Button variant="outline" size="sm">
              Login
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
