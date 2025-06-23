import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8"
};

const LoadingSpinner = ({ size = "md", className }: LoadingSpinnerProps) => {
  return (
    <Loader2 
      className={cn(
        "animate-spin text-gray-400",
        sizes[size],
        className
      )} 
    />
  );
};

export default LoadingSpinner;