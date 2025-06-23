import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function OPDCard({
  title,
  children,
}: {
  title: React.ReactNode;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border rounded shadow-sm bg-white mb-4 transition-all">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center text-left px-4 py-2 bg-blue-100 hover:bg-blue-200 font-semibold text-blue-800"
      >
        <div className="flex items-center gap-2">{title}</div>
        {open ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>

      {open && <div className="p-4">{children}</div>}
    </div>
  );
}
