
import { LucideIcon } from "lucide-react";

export interface MenuItem {
  icon: LucideIcon;
  label: string;
  path: string;
  roles: string[];
  isNew?: boolean;
  isPremium?: boolean;
  onClick?: () => void;
}

export interface LineTurnoCombo {
  id: string;
  name: string;
  linha: string;
  turno: string;
}
