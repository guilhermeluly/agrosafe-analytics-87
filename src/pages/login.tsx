
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

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, user } = useUser();
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

  // Usuários master admin padrão (ajuste conforme lógica real se mudar)
  const isMasterAdmin =
    user &&
    user.role === "admin" &&
    (user.email === "Guilhermeluly@hotmail.com" || user.email === "admin@example.com");

  return (
    <>
      <Helmet>
        <title>AgroSafe Analytics - Sistema de Indicadores</title>
      </Helmet>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="w-full max-w-md">
          <div className="mb-2 flex justify-center">
            <h1 className="text-2xl font-bold text-center text-primary">AgroSafe Analytics</h1>
          </div>
          <div className="mb-4 flex justify-center">
            {/* Exibe o logo principal do sistema */}
            {empresa.logo && (
              <img
                src={empresa.logo}
                alt="Logo do sistema"
                className="max-h-16 object-contain mb-2"
                style={{ maxWidth: 220 }}
                draggable={false}
              />
            )}
          </div>
          {/* Alerta para master admin */}
          {isMasterAdmin && (
            <div className="mb-4 text-center text-amber-700 bg-amber-100 border border-amber-200 px-2 py-1 rounded text-xs">
              Como Administrador Master, você pode editar o logo exibido nesta tela em:<br />
              <b>Menu &gt; Master &gt; Configuração de Logo</b>
            </div>
          )}
          <Card className="w-full shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl font-bold text-center">
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
                <p>Guilhermeluly@hotmail.com / 052004236 (Administrador Master)</p>
                <p>admin@example.com / admin123 (Administrador)</p>
                <p>operator@example.com / operator123 (Operador)</p>
                <p>viewer@example.com / viewer123 (Visualizador)</p>
              </div>
            </CardFooter>
          </Card>
          <div className="mt-6 text-center text-xs text-gray-600">
            Desenvolvido por AgroSafe Serviços Empresariais LTDA
            <br />
            CNPJ 54.630.417/0001-67
          </div>
        </div>
      </div>
    </>
  );
}
