
export interface ProductionData {
  id?: string;
  date: string;
  shift: string;
  location: string;
  plannedProduction: number;
  actualProduction: number;
  rework: number;
  scrap: number;
  lostPackages: number;
  setupTime: number;
  observations?: string;
  companyId?: string;
  databaseId?: string;
}

export interface ReportSettings {
  frequency: 'diario'|'semanal'|'mensal'|'intervalo';
  hour: string;
  method: 'email'|'telegram';
  recipients: string[];
  customDates?: string[];
  filters?: { location?: string; shift?: string };
  companyId?: string;
  reportSections?: string[];
}

export interface User {
  id?: string;
  name: string;
  email: string;
  role: 'admin'|'editor'|'viewer';
  companyId?: string;
  companyName?: string;
  companyDomain?: string;
  databaseId?: string;
}

// Nova estrutura para empresa e plano
export interface Empresa {
  id: string;
  nome: string;
  planoId: string;
  logoCliente?: string;
  logoAgroSafe?: string;
  exibeLogoAgroSafe?: boolean;
  dominio?: string;
  databaseId?: string;
  ativo?: boolean;
}

export interface SetupStandard {
  location: string;
  maxTimeMinutes: number;
}

// Consistent type definitions for SetupTime and StopTime
export interface SetupTime { 
  id: string;
  tempo: number;
  descricao: string;
  horarioInicio?: string;
  horarioFim?: string;
}

export interface StopTime { 
  id: string;
  tempo: number; 
  motivo: string;
  horarioInicio?: string;
  horarioFim?: string;
}

export interface ScheduledBreak {
  id: string;
  startTime: string;
  endTime: string;
  description: string;
}
