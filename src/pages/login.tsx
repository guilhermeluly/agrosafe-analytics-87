
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useEmpresa } from "../context/EmpresaContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import LogoDisplay from "../components/LogoDisplay";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useUser();
  const { empresa } = useEmpresa();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password);
      
      if (success) {
        toast({
          title: "Login bem-sucedido",
          description: "Você foi autenticado com sucesso.",
        });
        navigate("/production-form");
      } else {
        toast({
          variant: "destructive",
          title: "Falha na autenticação",
          description: "Email ou senha incorretos.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro durante o login.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>{empresa.nome} - Indicadores de Produção</title></Helmet>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="w-full max-w-md">
          <div className="mb-6 flex justify-center">
            <LogoDisplay altura={80} />
          </div>
          
          <Card className="w-full shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">
                {empresa.nome} - Indicadores
              </CardTitle>
              <CardDescription className="text-center">
                Sistema de monitoramento de desempenho operacional
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-10"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Entrando..." : "Entrar"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col">
              <div className="text-center text-sm text-gray-500 space-y-1">
                <p className="font-medium">Demonstração - Use uma das contas:</p>
                <p>master@example.com / master123 (Administrador Master)</p>
                <p>admin@example.com / admin123 (Administrador)</p>
                <p>operator@example.com / operator123 (Operador)</p>
                <p>viewer@example.com / viewer123 (Visualizador)</p>
              </div>
            </CardFooter>
          </Card>
          
          <div className="mt-6 text-center text-xs text-gray-600">
            Desenvolvido por AgroSafe Serviços Empresariais LTDA<br/>
            CNPJ 54.630.417/0001-67
          </div>
        </div>
      </div>
    </>
  );
}
