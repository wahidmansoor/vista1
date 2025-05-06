import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

interface ErrorMessageProps {
  title?: string;
  message: string;
  className?: string;
  variant?: 'default' | 'destructive';
}

const ErrorMessage = ({ 
  title = "Error", 
  message, 
  className,
  variant = 'destructive'
}: ErrorMessageProps) => {
  return (
    <Alert variant={variant} className={cn("flex items-center gap-2", className)}>
      <AlertTriangle className="h-5 w-5" />
      <div>
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </div>
    </Alert>
  );
};

export default ErrorMessage;