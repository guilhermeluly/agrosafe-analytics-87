
import { LucideIcon } from "lucide-react";

export interface MenuItem {
  icon: LucideIcon;
  label: string;
  path: string;
  roles: string[];
  isNew?: boolean;
  onClick?: () => void;
}

