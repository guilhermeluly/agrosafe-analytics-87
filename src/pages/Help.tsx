
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import AppLayout from "@/components/AppLayout";

export default function Help() {
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Solicitação enviada",
      description: "Nossa equipe entrará em contato em breve.",
    });
  };

  const assuntos = [
    "Dúvida",
    "Problema Técnico",
    "Sugestão",
    "Outro"
  ];

  return (
    <AppLayout title="Suporte Técnico">
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Suporte Técnico</CardTitle>
            <CardDescription>
              Preencha o formulário abaixo para entrar em contato com nossa equipe de suporte.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input id="name" placeholder="Seu nome completo" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" type="email" placeholder="seu@email.com" required />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Assunto</Label>
                <select 
                  id="subject" 
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  required
                >
                  <option value="">Selecione o assunto</option>
                  {assuntos.map((assunto) => (
                    <option key={assunto} value={assunto}>{assunto}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Mensagem</Label>
                <Textarea
                  id="message"
                  placeholder="Descreva detalhadamente sua solicitação..."
                  className="min-h-[150px]"
                  required
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                  Enviar Solicitação
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
