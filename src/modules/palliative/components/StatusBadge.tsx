import { cn } from "@/lib/utils";
import { CheckCircle, Clock, XCircle, AlertTriangle } from "lucide-react";

type Status = 'completed' | 'pending' | 'notStarted' | 'warning' | 'error';

interface StatusBadgeProps {
  status: Status;
  text?: string;
  className?: string;
  size?: 'sm' | 'md';
}

const statusConfig = {
  completed: {
    icon: CheckCircle,
    baseClass: "text-green-600 bg-green-50 border-green-200",
    defaultText: "Completed"
  },
  pending: {
    icon: Clock,
    baseClass: "text-yellow-600 bg-yellow-50 border-yellow-200",
    defaultText: "Pending"
  },
  notStarted: {
    icon: XCircle,
    baseClass: "text-gray-600 bg-gray-50 border-gray-200",
    defaultText: "Not Started"
  },
  warning: {
    icon: AlertTriangle,
    baseClass: "text-orange-600 bg-orange-50 border-orange-200",
    defaultText: "Warning"
  },
  error: {
    icon: AlertTriangle,
    baseClass: "text-red-600 bg-red-50 border-red-200",
    defaultText: "Error"
  }
};

const sizesConfig = {
  sm: "px-2 py-1 text-xs",
  md: "px-3 py-1.5 text-sm"
};

const StatusBadge = ({ 
  status, 
  text, 
  className,
  size = "md" 
}: StatusBadgeProps) => {
  const { icon: Icon, baseClass, defaultText } = statusConfig[status];
  const displayText = text || defaultText;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 font-medium border rounded-full",
        baseClass,
        sizesConfig[size],
        className
      )}
    >
      <Icon className={size === "sm" ? "w-3 h-3" : "w-4 h-4"} />
      <span>{displayText}</span>
    </div>
  );
};

export default StatusBadge;