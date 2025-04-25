export interface MenuItem {
  icon: any;
  label: string;
  path: string;
  title?: string;
  roles: string[];
  isNew?: boolean;
  isPremium?: boolean;
  onClick?: () => void;
  submenu?: {
    title: string;
    href: string;
    roles: string[];
  }[];
}

// Production form types
export interface SetupTime {
  id: string;
  tempo: number;
  descricao: string;
  horarioInicio: string;
  horarioFim: string;
}

export interface StopTime {
  id: string;
  tempo: number;
  motivo: string;
  horarioInicio: string;
  horarioFim: string;
}
