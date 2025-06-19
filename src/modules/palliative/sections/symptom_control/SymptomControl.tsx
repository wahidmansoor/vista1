import React, { useMemo, useEffect, useState } from "react";
import { useSymptomData } from "../../hooks/useSymptomData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Loader2, Search } from "lucide-react";
import { marked } from "marked";
import clsx from "clsx";

// Utility to group symptoms by name
function groupBy<T, K extends keyof any>(arr: T[], key: (item: T) => K) {
  return arr.reduce((acc, item) => {
    const group = key(item);
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {} as Record<K, T[]>);
}

// Define explicit TypeScript interface for Symptom
interface Symptom {
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

// Performance optimized SymptomCard component with memoized markdown rendering
interface SymptomCardProps {
  symptom: Symptom;
}

const SymptomCard: React.FC<SymptomCardProps> = ({ symptom }) => {
  // Memoize markdown parsing for performance
  const parsedManagement = useMemo(() => {
    return marked.parse(symptom.management || "");
  }, [symptom.management]);

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg">{symptom.symptom_name}</CardTitle>
          <span
            className={clsx(
              "px-2 py-1 rounded text-xs font-semibold",
              symptom.severity_level === "Mild" && "bg-green-100 text-green-700",
              symptom.severity_level === "Moderate" && "bg-yellow-100 text-yellow-700",
              symptom.severity_level === "Severe" && "bg-red-100 text-red-700"
            )}
          >
            {symptom.severity_level}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none mb-2">
          <div
            dangerouslySetInnerHTML={{
              __html: parsedManagement,
            }}
          />
        </div>
        {symptom.is_red_flag && (
          <div className="flex items-center gap-2 mt-2 text-red-600">
            <AlertTriangle className="w-4 h-4" />
            <span className="font-medium">Red Flag</span>
          </div>
        )}
        {symptom.preferred_route && (
          <div className="mt-2 text-xs text-gray-500">
            <span className="font-semibold">Preferred Route:</span> {symptom.preferred_route}
            {symptom.route_note && (
              <span className="ml-2 italic">{symptom.route_note}</span>
            )}
          </div>
        )}
        {symptom.evidence_grade && (
          <div className="mt-2 text-xs text-blue-500">
            <span className="font-semibold">Evidence:</span> {symptom.evidence_grade}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const SymptomControl: React.FC = () => {
  const [search, setSearch] = useState("");
  const [selectedTab, setSelectedTab] = useState<string>(""); // State-based dynamic tab selection
  const { data, loading, error } = useSymptomData({
    search: search.trim() ? search : undefined,
  });

  // Type-safe data handling with explicit Symptom interface
  const activeData: Symptom[] = Array.isArray(data) ? data.filter((s) => s.status === "active") : [];
  const grouped = useMemo(
    () => groupBy(activeData, (s) => s.symptom_name),
    [activeData]
  );
  const symptomNames: string[] = Object.keys(grouped);

  // Dynamic tab selection based on loaded data
  useEffect(() => {
    if (symptomNames.length > 0 && !selectedTab) {
      setSelectedTab(symptomNames[0]);
    } else if (symptomNames.length === 0) {
      setSelectedTab("");
    }
  }, [symptomNames, selectedTab]);

  // Debug log for Supabase data
  useEffect(() => {
    console.log("Fetched Supabase symptoms:", data);
  }, [data]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader2 className="animate-spin w-8 h-8 text-gray-400" />
        <span className="ml-3 text-gray-500">Loading symptoms...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center py-16">
        <AlertTriangle className="w-8 h-8 text-red-500 mb-2" />
        <span className="text-red-600 font-medium">Error: {error}</span>
      </div>
    );
  }

  if (!Array.isArray(data)) {
    return (
      <div className="flex flex-col items-center py-16">
        <AlertTriangle className="w-8 h-8 text-red-500 mb-2" />
        <span className="text-red-600 font-medium">Unexpected data format from Supabase.</span>
      </div>
    );
  }

  return (
    <div className="palliative-section max-w-5xl mx-auto">      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Search symptoms..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
            aria-label="Search symptoms"
          />
          {/* Fixed search input icon - show Search icon when not loading, Loader2 when loading */}
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </span>
        </div>
      </div>      {/* Dynamic tabs with state-based selection */}      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList 
          aria-label="Symptom groups"
          className="flex flex-wrap gap-2 justify-start h-auto"
        >
          {symptomNames.length > 0 ? (
            symptomNames.map((name) => (
              <TabsTrigger 
                key={name} 
                value={name}
                className="min-w-[120px] flex-1 sm:flex-none text-center"
              >
                {name}
              </TabsTrigger>
            ))
          ) : (
            <TabsTrigger 
              value="none" 
              disabled
              className="min-w-[120px] text-center"
            >
              No Symptoms
            </TabsTrigger>
          )}
        </TabsList>

        {symptomNames.length === 0 && (
          <TabsContent value="none">
            <div className="text-center py-16 text-gray-500">
              No active symptoms recorded
            </div>
          </TabsContent>
        )}

        {symptomNames.map((name) => (
          <TabsContent key={name} value={name}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Performance optimized rendering using SymptomCard component */}
              {grouped[name].map((symptom: Symptom) => (
                <SymptomCard key={symptom.id} symptom={symptom} />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default SymptomControl;
