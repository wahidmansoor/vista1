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
    <Card className="border shadow-sm h-full flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-lg leading-tight flex-1 min-w-0">{symptom.symptom_name}</CardTitle>
          <span
            className={clsx(
              "px-2 py-1 rounded text-xs font-semibold whitespace-nowrap shrink-0 mt-0.5",
              symptom.severity_level === "Mild" && "bg-green-100 text-green-700",
              symptom.severity_level === "Moderate" && "bg-yellow-100 text-yellow-700",
              symptom.severity_level === "Severe" && "bg-red-100 text-red-700"
            )}
          >
            {symptom.severity_level}
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pt-0 flex flex-col">
        <div className="prose prose-sm max-w-none flex-1 mb-4">
          <div
            className="text-sm leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: parsedManagement,
            }}
          />
        </div>
        
        <div className="space-y-2 mt-auto pt-2 border-t border-gray-100">
          {symptom.is_red_flag && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 px-2 py-1 rounded">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span className="font-medium text-sm">Red Flag</span>
            </div>
          )}
          
          {symptom.preferred_route && (
            <div className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
              <span className="font-semibold">Route:</span> {symptom.preferred_route}
              {symptom.route_note && (
                <div className="mt-1 italic text-gray-500">{symptom.route_note}</div>
              )}
            </div>
          )}
          
          {symptom.evidence_grade && (
            <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
              <span className="font-semibold">Evidence:</span> {symptom.evidence_grade}
            </div>
          )}
        </div>
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
    <div className="w-full">
      {/* Search Section */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <Input
            type="text"
            placeholder="Search symptoms..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4"
            aria-label="Search symptoms"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </span>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        {/* Multi-line TabsList to prevent horizontal overflow */}
        <div className="mb-6">
          <TabsList 
            aria-label="Symptom groups"
            className="flex flex-wrap h-auto p-1 bg-gray-100 rounded-lg gap-1"
          >
            {symptomNames.length > 0 ? (
              symptomNames.map((name) => (
                <TabsTrigger 
                  key={name} 
                  value={name}
                  className="px-3 py-2 text-sm font-medium rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm flex-shrink-0"
                >
                  {name}
                </TabsTrigger>
              ))
            ) : (
              <TabsTrigger 
                value="none" 
                disabled 
                className="px-3 py-2 text-sm font-medium text-gray-400"
              >
                No Symptoms
              </TabsTrigger>
            )}
          </TabsList>
        </div>

        {/* Content Section */}
        {symptomNames.length === 0 && (
          <TabsContent value="none" className="mt-6">
            <div className="text-center py-16 text-gray-500">
              <div className="max-w-sm mx-auto">
                <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Symptoms Found</h3>
                <p className="text-gray-500">No active symptoms are currently recorded in the system.</p>
              </div>
            </div>
          </TabsContent>
        )}

        {symptomNames.map((name) => (
          <TabsContent key={name} value={name} className="mt-6">
            {/* Improved grid with consistent card heights and better alignment */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 auto-rows-fr">
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