
/**
 * Service to handle APK downloads and versioning
 */

// Mock APK data - in a real application, this would be retrieved from an API
export interface ApkVersion {
  version: string;
  fileName: string;
  size: string;
  date: string;
  downloadUrl: string;
  releaseNotes: string[];
}

const CURRENT_APK: ApkVersion = {
  version: "1.0.3",
  fileName: "agrosafe-oee-1.0.3.apk",
  size: "8.2 MB",
  date: "2025-04-22",
  downloadUrl: "/downloads/agrosafe-oee-1.0.3.apk",
  releaseNotes: [
    "Correção de bugs",
    "Melhorias na sincronização offline",
    "Adicionado suporte para múltiplas linhas"
  ]
};

/**
 * Downloads the APK file
 * In a real application, this would trigger a file download
 */
export const downloadApk = async (): Promise<boolean> => {
  return new Promise((resolve) => {
    // Simulate download delay
    setTimeout(() => {
      console.log(`Downloading APK: ${CURRENT_APK.fileName}`);
      resolve(true);
    }, 2000);
  });
};

/**
 * Retrieves the current APK version information
 */
export const getCurrentApkVersion = (): ApkVersion => {
  return CURRENT_APK;
};

/**
 * Checks if a new version is available
 * In a real application, this would check with a server
 */
export const checkForUpdates = async (): Promise<{ hasUpdate: boolean, version?: string }> => {
  return new Promise((resolve) => {
    // Simulate API call delay
    setTimeout(() => {
      resolve({ hasUpdate: false });
    }, 1000);
  });
};

/**
 * Gets installation instructions
 */
export const getInstallationInstructions = (): string[] => {
  return [
    "Baixe o arquivo APK no seu dispositivo Android",
    "Acesse as Configurações do seu dispositivo",
    "Vá em Segurança (ou Privacidade)",
    "Ative a opção \"Fontes desconhecidas\" ou \"Instalar apps de fontes desconhecidas\"",
    "Localize o arquivo baixado e toque nele para iniciar a instalação",
    "Siga as instruções na tela para completar a instalação",
    "Após a instalação, abra o aplicativo e faça login com suas credenciais"
  ];
};
