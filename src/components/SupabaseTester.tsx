import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { AlertTriangle, CircleCheck } from "lucide-react";
import { Badge } from "./ui/badge";

interface Props {
  module: "opd" | "chemotherapy" | "inpatient" | "palliative" | "tools";
}

const moduleTableMap: Record<Props["module"], string> = {
  opd: "opd_cases",
  chemotherapy: "protocols",
  inpatient: "inpatient_cases",
  palliative: "palliative_notes",
  tools: "tools_metadata",
};

export const SupabaseTester: React.FC<Props> = ({ module }) => {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [tableName, setTableName] = useState<string>("");

  useEffect(() => {
    const testConnection = async () => {
      const table = moduleTableMap[module];
      setTableName(table);

      try {
        const { data, error } = await supabase.from(table).select("*").limit(1);
        if (error || !data) throw error;
        setStatus("success");
      } catch {
        setStatus("error");
      }
    };

    testConnection();
  }, [module]);

  return (
    <div className="flex items-center gap-3 p-3 mt-4 rounded-md bg-gray-100 dark:bg-gray-800 text-sm">      {status === "success" ? (
        <CircleCheck className="text-green-500 w-5 h-5" />
      ) : status === "error" ? (
        <AlertTriangle className="text-red-500 w-5 h-5" />
      ) : (
        <div className="animate-pulse w-5 h-5 rounded-full bg-yellow-400" />
      )}
      <div>
        {status === "success" ? (
          <span>
            Supabase connected to <Badge variant="secondary">{tableName}</Badge>
          </span>
        ) : status === "error" ? (
          <span className="text-red-500">
            Supabase error – cannot fetch from <code>{tableName}</code>
          </span>
        ) : (
          <span className="text-yellow-600">
            Testing connection to <code>{tableName}</code>...
          </span>
        )}
      </div>
    </div>
  );
};
