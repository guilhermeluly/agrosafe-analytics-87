
import React from 'react';
import AppLayout from '../components/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function Help() {
  return (
    <AppLayout title="Ajuda">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Central de Ajuda</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Bem-vindo à Central de Ajuda</CardTitle>
            <CardDescription>
              Encontre respostas para as perguntas mais frequentes sobre o sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Esta seção contém informações para ajudá-lo a utilizar o sistema de forma eficiente.
              Se você não encontrar a resposta que procura, entre em contato com o suporte técnico.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <div className="flex-1 p-4 border rounded-md text-center">
                <h3 className="font-medium">Contato de Suporte</h3>
                <p className="text-sm mt-2">suporte@agrosafese.com.br</p>
                <p className="text-sm">+55 (11) 1234-5678</p>
              </div>
              <div className="flex-1 p-4 border rounded-md text-center">
                <h3 className="font-medium">Horário de Atendimento</h3>
                <p className="text-sm mt-2">Segunda à Sexta</p>
                <p className="text-sm">8:00 às 18:00</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Accordion type="single" collapsible className="mb-8">
          <AccordionItem value="item-1">
            <AccordionTrigger>Como inserir dados de produção?</AccordionTrigger>
            <AccordionContent>
              <p className="mb-2">Para inserir dados de produção, siga os passos:</p>
              <ol className="list-decimal pl-6 space-y-1">
                <li>Acesse o menu "Inserir Dados" no painel lateral</li>
                <li>Selecione a data, turno e linha de produção</li>
                <li>Preencha os dados de produção planejada e real</li>
                <li>Adicione informações sobre perdas, setup e paradas</li>
                <li>Clique em "Salvar Dados" para registrar</li>
              </ol>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2">
            <AccordionTrigger>Como gerar relatórios?</AccordionTrigger>
            <AccordionContent>
              <p className="mb-2">Para gerar relatórios:</p>
              <ol className="list-decimal pl-6 space-y-1">
                <li>Acesse o menu "Relatórios" no painel lateral</li>
                <li>Selecione o tipo de relatório desejado</li>
                <li>Defina o período e demais filtros</li>
                <li>Clique em "Gerar Relatório"</li>
                <li>Você pode exportar o relatório em PDF ou CSV</li>
              </ol>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-3">
            <AccordionTrigger>O que é OEE?</AccordionTrigger>
            <AccordionContent>
              <p>
                OEE (Overall Equipment Effectiveness) é um indicador que mede a eficácia global do equipamento. 
                É calculado multiplicando três componentes:
              </p>
              <ul className="list-disc pl-6 my-2 space-y-1">
                <li><strong>Disponibilidade:</strong> tempo de operação real dividido pelo tempo planejado</li>
                <li><strong>Performance:</strong> velocidade real dividida pela velocidade ideal</li>
                <li><strong>Qualidade:</strong> quantidade de produtos bons dividida pela quantidade total produzida</li>
              </ul>
              <p>OEE = Disponibilidade × Performance × Qualidade</p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-4">
            <AccordionTrigger>Como agendar o envio automático de relatórios?</AccordionTrigger>
            <AccordionContent>
              <p className="mb-2">Para configurar o envio automático:</p>
              <ol className="list-decimal pl-6 space-y-1">
                <li>Acesse o menu "Relatórios" no painel lateral</li>
                <li>Vá para a aba "Agendamento"</li>
                <li>Selecione o tipo de relatório, frequência e horário</li>
                <li>Defina o método de envio (e-mail ou Telegram)</li>
                <li>Informe os destinatários e formato desejado</li>
                <li>Clique em "Salvar Agendamento"</li>
              </ol>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-5">
            <AccordionTrigger>Como usar o modo apresentação para TVs?</AccordionTrigger>
            <AccordionContent>
              <p className="mb-2">O modo apresentação é ideal para exibir indicadores em monitores ou TVs:</p>
              <ol className="list-decimal pl-6 space-y-1">
                <li>Acesse o menu "Relatórios" no painel lateral</li>
                <li>Vá para a aba "Modo Apresentação"</li>
                <li>Selecione os indicadores que deseja exibir</li>
                <li>Defina o intervalo de rotação em segundos</li>
                <li>Filtre por linha se necessário</li>
                <li>Clique em "Iniciar Modo Apresentação"</li>
                <li>Uma nova janela será aberta com o modo apresentação</li>
              </ol>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-6">
            <AccordionTrigger>Como alterar minha foto de perfil?</AccordionTrigger>
            <AccordionContent>
              <p className="mb-2">Para alterar sua foto de perfil:</p>
              <ol className="list-decimal pl-6 space-y-1">
                <li>Acesse o menu "Configurações" (se você for administrador)</li>
                <li>Na tela de configurações, vá para a aba "Foto do Perfil"</li>
                <li>Clique no botão para escolher um arquivo</li>
                <li>Selecione uma imagem do seu computador</li>
                <li>Clique em "Salvar Foto de Perfil"</li>
              </ol>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </AppLayout>
  );
}
