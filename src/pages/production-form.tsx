
import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Truck } from "lucide-react";
import ProductionFormFields from '@/components/production-form/ProductionFormFields';
import MovimentacaoFormFields from '@/components/production-form/MovimentacaoFormFields';

type FormType = "selector" | "production" | "logistics";

export default function ProductionForm() {
  const [formType, setFormType] = useState<FormType>("selector");

  const TypeSelector = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto p-4">
      <Card 
        className="cursor-pointer hover:border-primary transition-colors"
        onClick={() => setFormType("production")}
      >
        <CardContent className="flex flex-col items-center justify-center p-6 space-y-2">
          <FileText className="h-12 w-12 text-gray-600" />
          <h3 className="text-lg font-semibold">Dados de Produção</h3>
          <p className="text-sm text-gray-500 text-center">
            Registre informações sobre produção, setup, paradas e OEE
          </p>
        </CardContent>
      </Card>

      <Card 
        className="cursor-pointer hover:border-primary transition-colors"
        onClick={() => setFormType("logistics")}
      >
        <CardContent className="flex flex-col items-center justify-center p-6 space-y-2">
          <Truck className="h-12 w-12 text-gray-600" />
          <h3 className="text-lg font-semibold">Dados de Movimentação</h3>
          <p className="text-sm text-gray-500 text-center">
            Registre informações sobre expedição e recebimento
          </p>
        </CardContent>
      </Card>
    </div>
  );

  const renderForm = () => {
    switch (formType) {
      case "production":
        return (
          <div className="container mx-auto p-4">
            <div className="flex items-center mb-4">
              <button 
                onClick={() => setFormType("selector")}
                className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
              >
                ← Voltar
              </button>
            </div>
            <ProductionFormFields />
          </div>
        );
      case "logistics":
        return (
          <div className="container mx-auto p-4">
            <div className="flex items-center mb-4">
              <button 
                onClick={() => setFormType("selector")}
                className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
              >
                ← Voltar
              </button>
            </div>
            <MovimentacaoFormFields onSave={() => setFormType("selector")} />
          </div>
        );
      default:
        return <TypeSelector />;
    }
  };

  return (
    <AppLayout title="Registrar Dados">
      {renderForm()}
    </AppLayout>
  );
}
