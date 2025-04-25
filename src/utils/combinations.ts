
import { LineTurnoCombo } from "@/components/sidebar/types";

// This should be replaced with actual data from your backend
const productionLines = [
  { id: 'linha-1', name: 'Linha 1' },
  { id: 'linha-2', name: 'Linha 2' },
  { id: 'linha-3', name: 'Linha 3' },
];

const shifts = [
  { id: 'manha', name: 'Manhã' },
  { id: 'tarde', name: 'Tarde' },
  { id: 'noite', name: 'Noite' },
];

export const generateCombinations = (): LineTurnoCombo[] => {
  const combinations: LineTurnoCombo[] = [
    { id: 'global', name: 'Global (Todas as linhas e turnos)', linha: 'todas', turno: 'todos' }
  ];

  productionLines.forEach(line => {
    shifts.forEach(shift => {
      combinations.push({
        id: `${line.id}-${shift.id}`,
        name: `${line.name} - ${shift.name}`,
        linha: line.id,
        turno: shift.id
      });
    });
  });

  return combinations;
};

export const LOCAL_COMBINATIONS = generateCombinations();
