
import Head from "next/head";
import Header from "../components/Header";
import CardIndicador from "../components/CardIndicador";
import LogoDisplay from "../components/LogoDisplay";
import { useEmpresa } from "../context/EmpresaContext";

export default function Dashboard() {
  const { empresa } = useEmpresa();
  return (
    <>
      <Head><title>Dashboard</title></Head>
      <Header />
      <div className="flex justify-end p-2">
        <LogoDisplay altura={36} />
      </div>
      <div className="p-4 grid grid-cols-4 gap-4">
        <CardIndicador label="Disponibilidade" value="92.3%" />
        <CardIndicador label="Performance" value="88.7%" />
        <CardIndicador label="Qualidade" value="96.5%" />
        <CardIndicador label="OEE" value="79.2%" />
      </div>
    </>
  );
}
