
import { LucideIcon } from "lucide-react";

export interface MenuItem {
  icon: LucideIcon;
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
    onClick?: () => void;
  }[];
}

export interface LineTurnoCombo {
  id: string;
  name: string;
  linha: string;
  turno: string;
}

export interface PresentationIndicator {
  id: string;
  label: string;
  category: 'oee' | 'productivity' | 'logistics';
  isPremium?: boolean;
}

export interface LoadHandlingTime {
  loading: number;     // Time spent loading in minutes
  unloading: number;   // Time spent unloading in minutes
  shiftDuration: number; // Total shift duration in minutes
  operatorCount: number; // Number of operators involved
}

export interface SetupMetrics {
  averageSetupTime: number;    // Average setup time in minutes
  totalSetups: number;         // Total number of setups
  setupTimePerLine: Record<string, number>; // Setup time by line
}

export interface ChartDisplayOptions {
  showValues: boolean;
  showGrid: boolean;
  darkMode: boolean;
  showTrendline: boolean;
  dataSource?: string;
}
