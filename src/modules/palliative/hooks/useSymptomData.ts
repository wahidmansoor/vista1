import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export interface SymptomData {
  id: string;
  symptom_name: string;
  severity_level: 'Mild' | 'Moderate' | 'Severe';
  management: string;
  category_tag?: string;
  evidence_grade?: string;
  source_reference?: string;
  is_red_flag?: boolean;
  preferred_route?: string;
  route_note?: string;
  created_at: string;
  updated_at: string;
  version: number;
  status: 'active' | 'archived' | 'draft';
}

export function useSymptomData(filters?: {
  category?: string;
  severity?: string;
  search?: string;
}) {
  const [data, setData] = useState<SymptomData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const fetchData = async () => {
      let query = supabase
        .from("palliative_symptoms")
        .select("*")
        .eq("status", "active");

      if (filters?.category) {
        query = query.eq("category_tag", filters.category);
      }

      if (filters?.severity) {
        query = query.eq("severity_level", filters.severity);
      }

      if (filters?.search) {
        query = query.ilike("symptom_name", `%${filters.search}%`);
      }

      const { data, error } = await query.order("symptom_name");

      if (error) setError(error.message);
      else setData(data as SymptomData[]);

      setLoading(false);
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters?.category, filters?.severity, filters?.search]);

  return { data, loading, error };
}