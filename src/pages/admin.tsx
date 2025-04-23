
import Head from "next/head";
import Header from "../components/Header";
import { resetCompany } from "../database";
import { useState } from "react";
import { useEmpresa } from "../context/EmpresaContext";
import LogoUpload from "../components/LogoUpload";
import { PLANOS } from "../config/planos";

export default function Admin() {
  const [pwd, setPwd] = useState("");
  const { empresa, setEmpresa } = useEmpresa();

  function handlePlano(e) {
    setEmpresa({ ...empresa, planoId: e.target.value });
  }

  function handleOpcionalAgrosafe(e) {
    setEmpresa({ ...empresa, exibeLogoAgroSafe: !!e.target.checked });
  }

  return (
    <>
      <Head><title>Admin</title></Head>
      <Header />
      <div className="p-4 max-w-lg mx-auto">
        <h2>Painel Administração</h2>
        <div className="mb-6">
          <label className="block font-semibold">Selecione o Plano da Empresa:</label>
          <select value={empresa.planoId} onChange={handlePlano} className="border p-2">
            {PLANOS.map(p=>
              <option key={p.id} value={p.id}>{p.nome}</option>
            )}
          </select>
        </div>
        <LogoUpload />
        {empresa.planoId === "completo" && (
          <div className="mt-2">
            <label>
              <input
                type="checkbox"
                checked={empresa.exibeLogoAgroSafe}
                onChange={handleOpcionalAgrosafe}
              />{" "}
              Exibir logo da <b>AgroSafe</b> junto ao logo do cliente
            </label>
          </div>
        )}

        <div className="mt-6">
          <h2>Reset Master</h2>
          <input type="password" onChange={e=>setPwd(e.target.value)} className="border px-1"/>
          <button
            className="ml-2 px-3 py-1 bg-red-500 text-white rounded"
            onClick={()=>pwd==="052004236"&&resetCompany("andrealan")}
          >Resetar Dados</button>
        </div>
      </div>
    </>
  );
}
