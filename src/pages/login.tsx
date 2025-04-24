import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useEmpresa } from "../context/EmpresaContext";
import { Card, CardContent, CardHeader, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { CompanySelector } from "@/components/CompanySelector";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, user } = useUser();
  const { empresa } = useEmpresa();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password, rememberMe);
      if (success) {
        toast({
          title: "Login bem-sucedido",
          description: "Você foi autenticado com sucesso.",
        });
        navigate("/home");
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

  const isMasterAdmin =
    user &&
    user.role === "admin" &&
    (user.email === "Guilhermeluly@hotmail.com" || user.email === "admin@example.com");

  const bgGradient = "linear-gradient(135deg, #e2d1c3 0%, #f8fafc 60%, #d6bcfa 100%)";

  return (
    <>
      <Helmet>
        <title>Login - AgroSafe</title>
      </Helmet>
      <div
        className="min-h-screen flex flex-col items-center justify-center"
        style={{ background: bgGradient }}
      >
        <div className="w-full max-w-md shadow-xl rounded-2xl bg-white/80 backdrop-blur-lg border-t-8 border-primary/50 animate-fade-in">
          <div className="flex flex-col items-center pt-10">
            {empresa.logo && (
              <img
                src={empresa.logo}
                alt="Logo do sistema"
                className="max-h-20 object-contain mb-3 drop-shadow-lg hover:scale-105 transition-transform"
                style={{ maxWidth: "60%" }}
                draggable={false}
              />
            )}
          </div>
          <Card className="w-full bg-transparent shadow-none border-none">
            <CardHeader className="space-y-1 text-center">
              <CardDescription className="text-lg text-neutral-600 mt-2">
                Sistema de monitoramento de desempenho operacional
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-0">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    autoComplete="username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11 text-lg bg-white/70"
                  />
                </div>
                <div>
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="********"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 text-lg bg-white/70"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rememberMe"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <Label htmlFor="rememberMe" className="text-sm">
                    Permanecer conectado
                  </Label>
                </div>
                {user.role === "master_admin" && <CompanySelector />}
                <Button
                  type="submit"
                  className="w-full h-11 text-lg font-semibold rounded-full bg-primary hover:bg-primary/90 shadow-md hover:scale-105 transition-transform"
                  disabled={isLoading}
                >
                  {isLoading ? "Entrando..." : "Entrar"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col pb-6">
              <div className="mt-8 text-xs text-gray-700">
                Desenvolvido por AgroSafe Serviços Empresariais LTDA
                <br />
                CNPJ 54.630.417/0001-67
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}
