
import React, { useRef } from "react";
import { useEmpresa } from "../context/EmpresaContext";

export default function LogoUpload() {
  const { empresa, setEmpresa } = useEmpresa();

  const upload = (
    e: React.ChangeEvent<HTMLInputElement>,
    qual: "logoCliente" | "logoAgroSafe"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setEmpresa({
        ...empresa,
        [qual]: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <div className="mb-3">
        <div>Logo da empresa:</div>
        {empresa.logoCliente && (
          <img src={empresa.logoCliente} alt="Preview Cliente" className="h-20 p-1" />
        )}
        <input type="file" accept="image/*" onChange={e => upload(e, "logoCliente")} />
      </div>
      <div>
        <div>Logo da <b>AgroSafe</b>:</div>
        {empresa.logoAgroSafe && (
          <img src={empresa.logoAgroSafe} alt="Preview AgroSafe" className="h-20 p-1" />
        )}
        <input type="file" accept="image/*" onChange={e => upload(e, "logoAgroSafe")} />
      </div>
    </div>
  );
}
