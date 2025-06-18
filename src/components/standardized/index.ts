/**
 * OncoVista Standardized Components
 * 
 * This barrel file exports all standardized components that modules should use
 * to ensure consistent UI patterns across the entire application.
 * 
 * Usage:
 * import { UniversalModuleLayout, ModuleCard, StandardButton } from '@/components/standardized';
 */

// Layout Components
export { 
  UniversalModuleLayout,
  ModuleCard,
  ModuleGrid,
  ModuleSection,
  type UniversalModuleLayoutProps,
  type ModuleCardProps,
  type ModuleGridProps,
  type ModuleSectionProps
} from '../Layout/UniversalModuleLayout';

// UI Components
export { 
  StandardButton,
  type StandardButtonProps 
} from '../ui/StandardButton';

export { 
  StandardInput,
  type StandardInputProps 
} from '../ui/StandardInput';

// Re-export existing shadcn/ui components with standardized naming
export { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '../ui/card';

export { 
  Button,
  type ButtonProps 
} from '../ui/button';

export { 
  Input
} from '../ui/input';

export { 
  Label 
} from '../ui/label';

export { 
  Textarea 
} from '../ui/textarea';

export { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '../ui/select';

export { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger 
} from '../ui/dialog';

export { 
  Badge,
  type BadgeProps 
} from '../ui/badge';

export { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger 
} from '../ui/tabs';
