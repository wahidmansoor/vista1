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
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl mb-4 transition-all hover:bg-white/15 hover:border-white/30">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center text-left px-4 py-3 bg-gradient-to-r from-[#004D61]/20 to-[#005B8F]/20 hover:from-[#004D61]/30 hover:to-[#005B8F]/30 font-semibold text-white rounded-t-xl transition-all"
      >
        <div className="flex items-center gap-2">{title}</div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-white" />
        ) : (
          <ChevronDown className="w-4 h-4 text-white" />
        )}
      </button>

      {open && <div className="p-4 text-white">{children}</div>}
    </div>
  );
}
