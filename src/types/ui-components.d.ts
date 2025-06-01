declare module '@/components/ui/table' {
  export const Table: React.FC<React.HTMLAttributes<HTMLTableElement>>;
  export const TableBody: React.FC<React.HTMLAttributes<HTMLTableSectionElement>>;
  export const TableCell: React.FC<React.HTMLAttributes<HTMLTableCellElement>>;
  export const TableHead: React.FC<React.HTMLAttributes<HTMLTableCellElement>>;
  export const TableHeader: React.FC<React.HTMLAttributes<HTMLTableSectionElement>>;
  export const TableRow: React.FC<React.HTMLAttributes<HTMLTableRowElement>>;
}

declare module '@/components/ui/card' {
  export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>>;
  export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>>;
}
