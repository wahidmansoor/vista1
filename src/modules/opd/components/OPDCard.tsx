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
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl mb-4 transition-all hover:bg-white/15">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center text-left px-6 py-4 bg-white/5 hover:bg-white/10 font-semibold text-white rounded-t-xl transition-all"
      >
        <div className="flex items-center gap-2 text-white">{title}</div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-white/70" />
        ) : (
          <ChevronDown className="w-4 h-4 text-white/70" />
        )}
      </button>

      {open && <div className="p-6 text-white">{children}</div>}
    </div>
  );
}
