import { IconProp } from "@fortawesome/fontawesome-svg-core";


export interface Car {
  id: number;
  name: string;
  color: string;
}

export interface CarAnimationsProps {
  cars: Car[];
  onCarRemove: (carId: number) => void;
  onCarSelect: (carId: number | null) => void;
  selectedCarId: number | null;
  onCarStart:(carId: number) => void;
  animationDurations: { [carId: number]: number };
}
export interface PatchResponse {
  velocity: number;
  distance: number;
}

export interface InputProps {
  placeholder?: string;
  type?: "text" | "color";
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  id?: string;
  name?:string
}

export interface ButtonProps {
  navigateToLink?: string;
  onClick?: () => void;
  title: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  icon?: IconProp;
  disabled?: boolean;
}
export interface WinnerPopupProps {
  winner: { id: number; name: string; time: number } | null;
  onClose: () => void;
}