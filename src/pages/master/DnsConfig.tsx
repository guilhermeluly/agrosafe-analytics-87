
import React, { useState } from "react";
import AppLayout from "../../components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Globe, Copy, Info } from "lucide-react";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function DnsConfig() {
  const { toast } = useToast();
  const [domain, setDomain] = useState("");
  const [subdomain, setSubdomain] = useState("");
  
  // Mock DNS records for demonstration
  const dnsRecords = {
    A: { host: "@", value: "34.95.203.118", ttl: "1800" },
    CNAME: { host: "www", value: "@", ttl: "1800" },
    TXT: { host: "@", value: "v=spf1 include:_spf.agrosafe.com.br ~all", ttl: "1800" }
  };
  
  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado",
      description: "Informação copiada para a área de transferência."
    });
  };
  
  const handleSaveDomain = () => {
    if (!domain) {
      toast({
        title: "Erro",
        description: "Por favor, insira um domínio válido.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Domínio salvo",
      description: `O domínio ${domain} foi configurado com sucesso.`
    });
  };
  
  const handleAddSubdomain = () => {
    if (!subdomain) {
      toast({
        title: "Erro",
        description: "Por favor, insira um subdomínio válido.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Subdomínio adicionado",
      description: `O subdomínio ${subdomain}.${domain} foi adicionado com sucesso.`
    });
    setSubdomain("");
  };

  return (
    <AppLayout title="Configuração de DNS">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-6 w-6" />
              Configuração de DNS
            </CardTitle>
            <CardDescription>
              Configure seu domínio personalizado para acessar o sistema.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="domain">Domínio Principal</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="domain"
                      placeholder="exemplo.com.br"
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                    />
                    <Button onClick={handleSaveDomain}>Salvar</Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Insira o domínio principal sem "www" ou "http://".
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="subdomain">Adicionar Subdomínio</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      id="subdomain"
                      placeholder="app"
                      value={subdomain}
                      onChange={(e) => setSubdomain(e.target.value)}
                    />
                    <span>.{domain || "exemplo.com.br"}</span>
                    <Button onClick={handleAddSubdomain} disabled={!domain}>
                      Adicionar
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="rounded-md border p-4 bg-muted/50">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Registros DNS necessários
                </h3>
                <p className="text-sm mb-4">
                  Configure os seguintes registros no seu provedor de DNS para que seu domínio aponte para o nosso servidor.
                </p>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left font-medium py-2">Tipo</th>
                        <th className="text-left font-medium py-2">Host</th>
                        <th className="text-left font-medium py-2">Valor</th>
                        <th className="text-left font-medium py-2">TTL</th>
                        <th className="text-left font-medium py-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2">A</td>
                        <td className="py-2">{dnsRecords.A.host}</td>
                        <td className="py-2">{dnsRecords.A.value}</td>
                        <td className="py-2">{dnsRecords.A.ttl}</td>
                        <td className="py-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleCopyToClipboard(dnsRecords.A.value)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">CNAME</td>
                        <td className="py-2">{dnsRecords.CNAME.host}</td>
                        <td className="py-2">{dnsRecords.CNAME.value}</td>
                        <td className="py-2">{dnsRecords.CNAME.ttl}</td>
                        <td className="py-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleCopyToClipboard(dnsRecords.CNAME.value)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2">TXT</td>
                        <td className="py-2">{dnsRecords.TXT.host}</td>
                        <td className="py-2">{dnsRecords.TXT.value}</td>
                        <td className="py-2">{dnsRecords.TXT.ttl}</td>
                        <td className="py-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleCopyToClipboard(dnsRecords.TXT.value)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="instructions">
                  <AccordionTrigger>
                    Instruções passo a passo para configuração
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 text-sm">
                      <div>
                        <h4 className="font-medium">1. Acesse o painel de controle do seu provedor de DNS</h4>
                        <p className="text-muted-foreground">
                          Entre no painel de administração do seu provedor de domínio (ex: Registro.br, GoDaddy, Hostgator).
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium">2. Localize a seção de gerenciamento de DNS</h4>
                        <p className="text-muted-foreground">
                          Geralmente chamada de "Gerenciar DNS", "Configurações de DNS" ou "Zona DNS".
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium">3. Adicione os registros listados acima</h4>
                        <p className="text-muted-foreground">
                          Crie cada um dos registros conforme especificado na tabela acima. É importante que os valores sejam inseridos exatamente como indicado.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium">4. Aguarde a propagação</h4>
                        <p className="text-muted-foreground">
                          Alterações nos registros DNS podem levar até 24-48 horas para se propagarem completamente pela internet.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium">5. Verifique a configuração</h4>
                        <p className="text-muted-foreground">
                          Após o período de propagação, acesse seu domínio para verificar se a configuração está funcionando corretamente.
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
