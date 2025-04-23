
import Head from "next/head";
import Header from "../components/Header";
import { Report } from "../components/Report";
import LogoDisplay from "../components/LogoDisplay";
import { useEmpresa } from "../context/EmpresaContext";

export default function Relatorios() {
  const { empresa } = useEmpresa();
  return (
    <>
      <Head><title>Relatórios</title></Head>
      <Header />
      <div className="flex justify-end p-2">
        <LogoDisplay altura={32} />
      </div>
      <Report />
    </>
  );
}
