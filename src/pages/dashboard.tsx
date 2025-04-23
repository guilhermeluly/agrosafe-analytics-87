
import React from "react";
import { Helmet } from "react-helmet-async";
import { useEmpresa } from "../context/EmpresaContext";
import LogoDisplay from "../components/LogoDisplay";
import Header from "../components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Create the CardIndicador component
const CardIndicador = ({ label, value }: { label: string; value: string }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
};

export default function Dashboard() {
  const { empresa } = useEmpresa();
  
  return (
    <>
      <Helmet><title>Dashboard</title></Helmet>
      <Header />
      <div className="flex justify-end p-2">
        <LogoDisplay altura={36} />
      </div>
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <CardIndicador label="Disponibilidade" value="92.3%" />
        <CardIndicador label="Performance" value="88.7%" />
        <CardIndicador label="Qualidade" value="96.5%" />
        <CardIndicador label="OEE" value="79.2%" />
      </div>
    </>
  );
}
