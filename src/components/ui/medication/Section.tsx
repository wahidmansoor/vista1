import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SectionProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  variant?: 'default' | 'warning' | 'danger';
  className?: string;
}

export function Section({ title, icon, children, variant = 'default', className }: SectionProps) {
  return (
    <section className={cn("space-y-3", className)} aria-labelledby={title.toLowerCase().replace(/\s+/g, '-')}>
      <h3 
        id={title.toLowerCase().replace(/\s+/g, '-')}
        className={cn(
          "flex items-center gap-2 text-lg font-semibold",
          variant === 'warning' && "text-amber-700",
          variant === 'danger' && "text-red-700"
        )}
      >
        {icon}
        {title}
      </h3>
      <div className="prose max-w-none dark:prose-invert">
        {children}
      </div>
    </section>
  );
}
