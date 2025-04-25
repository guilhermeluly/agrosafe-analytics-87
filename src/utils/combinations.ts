
import { LineTurnoCombo } from "@/components/sidebar/types";

export const LOCAL_COMBINATIONS: LineTurnoCombo[] = [
  { id: 'linha1-turno1', name: 'Linha 1 - Turno 1', linha: 'linha-1', turno: 'manhã' },
  { id: 'linha1-turno2', name: 'Linha 1 - Turno 2', linha: 'linha-1', turno: 'tarde' },
  { id: 'linha1-turno3', name: 'Linha 1 - Turno 3', linha: 'linha-1', turno: 'noite' },
  { id: 'linha2-turno1', name: 'Linha 2 - Turno 1', linha: 'linha-2', turno: 'manhã' },
  { id: 'linha2-turno2', name: 'Linha 2 - Turno 2', linha: 'linha-2', turno: 'tarde' },
  { id: 'linha2-turno3', name: 'Linha 2 - Turno 3', linha: 'linha-2', turno: 'noite' },
  { id: 'linha3-turno1', name: 'Linha 3 - Turno 1', linha: 'linha-3', turno: 'manhã' },
  { id: 'linha3-turno2', name: 'Linha 3 - Turno 2', linha: 'linha-3', turno: 'tarde' },
  { id: 'linha3-turno3', name: 'Linha 3 - Turno 3', linha: 'linha-3', turno: 'noite' },
  { id: 'global', name: 'Global (Todas as linhas e turnos)', linha: 'todas', turno: 'todos' },
];
