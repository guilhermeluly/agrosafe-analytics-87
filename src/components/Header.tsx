
import React from "react";
import { Link } from "react-router-dom";
import { useEmpresa } from "../context/EmpresaContext";

const Header = () => {
  const { empresa } = useEmpresa();
  
  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">OEE Performance Hub</div>
        
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link to="/" className="hover:text-gray-300">Home</Link>
            </li>
            <li>
              <Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link>
            </li>
            <li>
              <Link to="/relatorios" className="hover:text-gray-300">Relatórios</Link>
            </li>
            <li>
              <Link to="/admin" className="hover:text-gray-300">Admin</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
