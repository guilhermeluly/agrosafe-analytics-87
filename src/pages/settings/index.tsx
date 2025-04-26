
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Globe, RotateCcw } from "lucide-react";
import AppLayout from "@/components/AppLayout";

export default function Settings() {
  return (
    <AppLayout title="Configurações">
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Configurações do Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="general" className="space-y-4">
              <TabsList>
                <TabsTrigger value="general">Geral</TabsTrigger>
                <TabsTrigger value="dns">
                  <Globe className="w-4 h-4 mr-2" />
                  DNS
                </TabsTrigger>
                <TabsTrigger value="database">
                  <Database className="w-4 h-4 mr-2" />
                  Banco de Dados
                </TabsTrigger>
                <TabsTrigger value="reset">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset de Dados
                </TabsTrigger>
              </TabsList>

              <TabsContent value="general">
                <Card>
                  <CardHeader>
                    <CardTitle>Configurações Gerais</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Conteúdo das configurações gerais */}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="dns">
                <Card>
                  <CardHeader>
                    <CardTitle>Configurações de DNS</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Conteúdo das configurações de DNS */}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="database">
                <Card>
                  <CardHeader>
                    <CardTitle>Configurações do Banco de Dados</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Conteúdo das configurações do banco de dados */}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reset">
                <Card>
                  <CardHeader>
                    <CardTitle>Reset de Dados</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Conteúdo do reset de dados */}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
