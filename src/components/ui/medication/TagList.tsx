import { cn } from "@/lib/utils";

interface TagListProps {
  items?: string[];
  emptyText?: string;
  variant?: 'default' | 'outline' | 'warning' | 'success';
  className?: string;
}

export function TagList({ items = [], emptyText = 'None provided', variant = 'default', className }: TagListProps) {
  if (!items?.length) {
    return <p className="text-gray-500 dark:text-gray-400 text-sm italic">{emptyText}</p>;
  }

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {items.map((item, i) => (
        <span
          key={i}
          className={cn(
            "px-2 py-1 text-sm rounded-full",
            variant === 'default' && "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
            variant === 'outline' && "border border-gray-200 dark:border-gray-700",
            variant === 'warning' && "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200",
            variant === 'success' && "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
          )}
        >
          {item}
        </span>
      ))}
    </div>
  );
}
