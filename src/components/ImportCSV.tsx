
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FileUp, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ImportCSV() {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const downloadTemplate = () => {
    // Creating CSV template content
    const csvContent = 
`data,turno,linha,producao_planejada,producao_real,retrabalho,refugo,pacotes_perdidos,tempo_setup,observacoes
2025-04-20,Manhã,Linha 1,1000,950,10,15,5,30,Exemplo de registro
2025-04-20,Tarde,Linha 2,1200,1150,5,10,2,15,`;

    // Creating a blob and downloading it
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "modelo_importacao.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    toast({
      title: "Modelo baixado",
      description: "O modelo de CSV foi baixado com sucesso."
    });
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "Arquivo não selecionado",
        description: "Por favor, selecione um arquivo CSV para importar.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    // Simulating file upload process
    setTimeout(() => {
      setIsUploading(false);
      setFile(null);
      
      toast({
        title: "Importação concluída",
        description: "Seus dados foram importados com sucesso."
      });
    }, 2000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <FileUp className="h-4 w-4" />
          Importar CSV
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Importar dados via CSV</DialogTitle>
          <DialogDescription>
            Faça upload de um arquivo CSV para importar dados de produção em lote.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between">
            <p className="text-sm">
              Baixe o modelo de CSV para garantir que seu arquivo esteja no formato correto.
            </p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={downloadTemplate}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Baixar modelo
            </Button>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="csv-file">Selecione o arquivo CSV</Label>
            <Input
              id="csv-file"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="cursor-pointer"
            />
            {file && (
              <p className="text-xs text-muted-foreground mt-1">
                Arquivo selecionado: {file.name}
              </p>
            )}
          </div>
          
          <div className="bg-muted/50 rounded p-3 text-sm">
            <h4 className="font-medium mb-2">Instruções de importação:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>O arquivo deve estar no formato CSV separado por vírgulas</li>
              <li>A primeira linha deve conter os cabeçalhos conforme o modelo</li>
              <li>A data deve estar no formato YYYY-MM-DD</li>
              <li>Valores numéricos devem usar ponto como separador decimal</li>
            </ul>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            onClick={handleUpload} 
            disabled={!file || isUploading}
            className="gap-2"
          >
            {isUploading ? "Importando..." : "Importar dados"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
