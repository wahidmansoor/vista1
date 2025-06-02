declare module 'lucide-react' {
  import { ComponentType, SVGAttributes } from 'react';
  
  export interface LucideProps extends SVGAttributes<SVGElement> {
    size?: string | number;
    color?: string;
    strokeWidth?: string | number;
    absoluteStrokeWidth?: boolean;
  }

  export type LucideIcon = ComponentType<LucideProps>;

  export const AlertOctagon: LucideIcon;
  export const ArrowLeft: LucideIcon;
  export const RefreshCcw: LucideIcon;
  export const ChevronDown: LucideIcon;
  export const LifeBuoy: LucideIcon;
}
