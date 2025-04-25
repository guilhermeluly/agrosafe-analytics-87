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
