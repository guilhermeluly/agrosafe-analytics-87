
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useEmpresa } from "../context/EmpresaContext";
import LogoUpload from "../components/LogoUpload";
import { PLANOS } from "../config/planos";
import Header from "../components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Simple mock of the database function since we can't import the original
const resetCompany = (companyId: string) => {
  console.log(`Reset company with ID: ${companyId}`);
  // In a real implementation, this would reset the company data
};

export default function Admin() {
  const [pwd, setPwd] = useState("");
  const { empresa, setEmpresa } = useEmpresa();

  function handlePlano(e: React.ChangeEvent<HTMLSelectElement>) {
    setEmpresa({ ...empresa, planoId: e.target.value });
  }

  function handleOpcionalAgrosafe(e: React.ChangeEvent<HTMLInputElement>) {
    setEmpresa({ ...empresa, exibeLogoAgroSafe: !!e.target.checked });
  }

  return (
    <>
      <Helmet><title>Admin</title></Helmet>
      <Header />
      <div className="p-4 max-w-lg mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Painel Administração</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <label className="block font-semibold mb-2">Selecione o Plano da Empresa:</label>
              <select value={empresa.planoId} onChange={handlePlano} className="w-full border p-2 rounded">
                {PLANOS.map(p =>
                  <option key={p.id} value={p.id}>{p.nome}</option>
                )}
              </select>
            </div>
            
            <LogoUpload />
            
            {empresa.planoId === "completo" && (
              <div className="mt-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={empresa.exibeLogoAgroSafe}
                    onChange={handleOpcionalAgrosafe}
                    className="rounded"
                  />{" "}
                  Exibir logo da <b>AgroSafe</b> junto ao logo do cliente
                </label>
              </div>
            )}

            <div className="mt-6 border-t pt-4">
              <h2 className="font-bold mb-2">Reset Master</h2>
              <div className="flex gap-2">
                <Input 
                  type="password" 
                  onChange={e => setPwd(e.target.value)} 
                  placeholder="Password"
                />
                <Button
                  variant="destructive"
                  onClick={() => pwd === "052004236" && resetCompany("andrealan")}
                >
                  Resetar Dados
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
