/**
 * Treatment Planner Component
 * A modern React component for cancer treatment protocol matching
 * 
 * Features:
 * - Disease details input (cancer type, stage, treatment intent)
 * - Mathematical protocol matching from Supabase cd_protocols table
 * - Clean protocol display with summary, precautions, and treatment info
 * - Dark mode support
 * - TypeScript + Tailwind CSS + ShadCN UI
 * 
 * @version 1.0.0
 * @author Treatment Planning System
 */

import React, { useState, useEffect } from 'react';
import { Search, AlertCircle, CheckCircle, XCircle, Loader2, FileText, Users, Calendar, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import supabase from '@/lib/supabaseClient';
import { getTumorGroups } from '@/types/protocol';
import type { Protocol } from '@/types/protocol';

// TypeScript interfaces for the component
interface TreatmentPlannerState {
  cancerType: string;
  stage: string;
  treatmentIntent: string;
  isLoading: boolean;
  protocols: Protocol[];
  tumourGroups: string[];
}

interface ProtocolDisplayProps {
  protocol: Protocol;
  index: number;
}

// Treatment intent options
const TREATMENT_INTENTS = [
  { value: 'curative', label: 'Curative' },
  { value: 'palliative', label: 'Palliative' },
  { value: 'adjuvant', label: 'Adjuvant' },
  { value: 'neoadjuvant', label: 'Neoadjuvant' },
  { value: 'maintenance', label: 'Maintenance' },
];

// Cancer stage options
const CANCER_STAGES = [
  { value: 'I', label: 'Stage I' },
  { value: 'II', label: 'Stage II' },
  { value: 'III', label: 'Stage III' },
  { value: 'IV', label: 'Stage IV' },
  { value: 'unknown', label: 'Unknown/Not Applicable' },
];

// Protocol Card Component
const ProtocolCard: React.FC<ProtocolDisplayProps> = ({ protocol, index }) => {
  const safeJsonParse = (jsonString: string | null | undefined, defaultValue: any = []) => {
    if (!jsonString) return defaultValue;
    try {
      return JSON.parse(jsonString);
    } catch {
      return defaultValue;
    }
  };  const summary = typeof protocol.summary === 'string' ? safeJsonParse(protocol.summary) : protocol.summary;
  const precautions = protocol.precautions || [];
  const treatment = protocol.treatment;

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500 dark:border-l-blue-400">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {protocol.name || protocol.code || 'Unnamed Protocol'}
            </CardTitle>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900 dark:text-blue-300">
                <Users className="w-3 h-3 mr-1" />
                {protocol.tumour_group}
              </Badge>
              {protocol.treatment_intent && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-300">
                  <Calendar className="w-3 h-3 mr-1" />
                  {protocol.treatment_intent}
                </Badge>
              )}
              {protocol.tumour_supergroup && (
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900 dark:text-purple-300">
                  {protocol.tumour_supergroup}
                </Badge>
              )}
            </div>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 font-mono">
            #{index + 1}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Summary Section */}
        {summary && Object.keys(summary).length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h4 className="flex items-center font-medium text-gray-900 dark:text-gray-100 mb-3">
              <FileText className="w-4 h-4 mr-2 text-blue-500" />
              Protocol Summary
            </h4>
            <div className="space-y-2 text-sm">
              {summary.indication && (
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Indication:</span>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">{summary.indication}</span>
                </div>
              )}
              {summary.cycle_length && (
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Cycle Length:</span>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">{summary.cycle_length}</span>
                </div>
              )}
              {summary.administration_route && (
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Route:</span>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">{summary.administration_route}</span>
                </div>
              )}
            </div>
          </div>
        )}        {/* Precautions Section */}
        {precautions && Array.isArray(precautions) && precautions.length > 0 && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <h4 className="flex items-center font-medium text-amber-900 dark:text-amber-200 mb-3">
              <Shield className="w-4 h-4 mr-2" />
              Precautions & Contraindications
            </h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-amber-800 dark:text-amber-300">Precautions:</span>
                <ul className="ml-4 mt-1 list-disc list-inside text-amber-700 dark:text-amber-400">
                  {precautions.map((item: string, idx: number) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}        {/* Treatment Information */}
        {treatment && (treatment.drugs || treatment.protocol) && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <h4 className="flex items-center font-medium text-green-900 dark:text-green-200 mb-3">
              <CheckCircle className="w-4 h-4 mr-2" />
              Treatment Details
            </h4>
            <div className="space-y-2 text-sm">
              {treatment.protocol && (
                <div>
                  <span className="font-medium text-green-800 dark:text-green-300">Protocol:</span>
                  <span className="ml-2 text-green-700 dark:text-green-400">{treatment.protocol}</span>
                </div>
              )}
              {treatment.drugs && Array.isArray(treatment.drugs) && treatment.drugs.length > 0 && (
                <div>
                  <span className="font-medium text-green-800 dark:text-green-300">Drugs:</span>
                  <div className="ml-2 mt-1">
                    {treatment.drugs.map((drug: any, idx: number) => (
                      <div key={idx} className="text-green-700 dark:text-green-400 mb-1">
                        <strong>{drug.name}</strong>
                        {drug.dose && <span> - {drug.dose}</span>}
                        {drug.route && <span> ({drug.route})</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}        {/* Protocol Summary */}
        {protocol.summary && (
          <div className="text-sm text-gray-600 dark:text-gray-400 border-t pt-3">
            <strong className="text-gray-700 dark:text-gray-300">Summary:</strong> {protocol.summary}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Main TreatmentPlanner Component
const TreatmentPlanner: React.FC = () => {
  const { toast } = useToast();
  const [state, setState] = useState<TreatmentPlannerState>({
    cancerType: '',
    stage: '',
    treatmentIntent: '',
    isLoading: false,
    protocols: [],
    tumourGroups: [],
  });

  // Load tumour groups on mount
  useEffect(() => {
    const loadTumourGroups = async () => {
      try {
        const groups = await getTumorGroups();
        setState(prev => ({ ...prev, tumourGroups: groups }));
      } catch (error) {
        console.error('Failed to load tumour groups:', error);
        toast({
          title: "Warning",
          description: "Could not load cancer types. Please refresh the page.",
          variant: "destructive"
        });
      }
    };

    loadTumourGroups();
  }, [toast]);  // Fetch matching protocols from Supabase with flexible case-insensitive search
  const fetchProtocols = async () => {
    if (!state.cancerType || !state.treatmentIntent) {
      toast({
        title: "Missing Information",
        description: "Please select both cancer type and treatment intent to search for protocols.",
        variant: "destructive"
      });
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, protocols: [] }));

    try {
      // Enhanced debug logging for search parameters
      console.log('🔍 Search Parameters:');
      console.log('Cancer Type:', state.cancerType);
      console.log('Treatment Intent:', state.treatmentIntent);
      console.log('Stage:', state.stage || 'Not selected');

      // Build flexible case-insensitive query using .ilike()
      let query = supabase
        .from('cd_protocols')
        .select('*')
        .ilike('tumour_group', `%${state.cancerType}%`)
        .ilike('treatment_intent', `%${state.treatmentIntent}%`);

      // Optionally include stage filter if selected
      if (state.stage) {
        query = query.ilike('stage', `%${state.stage}%`);
        console.log('📊 Including stage filter:', state.stage);
      }

      console.log('🔎 Executing flexible case-insensitive database query...');

      const { data, error } = await query;

      if (error) {
        console.error('❌ Database query error:', error);
        throw new Error(error.message);
      }

      console.log('✅ Query Results:', data?.length || 0, 'protocols found');
      console.log('📋 Found protocols:', data?.map(p => ({ 
        code: p.code, 
        tumour_group: p.tumour_group, 
        treatment_intent: p.treatment_intent 
      })) || []);

      setState(prev => ({ ...prev, protocols: data || [], isLoading: false }));

      // Updated toast message with actual count
      toast({
        title: "Search Complete",
        description: `Flexible case-insensitive search complete. Found ${data?.length || 0} matching protocols.`,
        variant: "default"
      });

    } catch (error) {
      console.error('❌ Error fetching protocols:', error);
      setState(prev => ({ ...prev, isLoading: false }));
      toast({
        title: "Search Failed",
        description: "An error occurred while searching for protocols. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handle input changes
  const handleInputChange = (field: keyof TreatmentPlannerState, value: string) => {
    setState(prev => ({
      ...prev,
      [field]: value,
      // Reset protocols when inputs change
      protocols: field === 'cancerType' || field === 'treatmentIntent' ? [] : prev.protocols
    }));
  };

  // Clear all data
  const handleClearAll = () => {
    setState(prev => ({
      ...prev,
      cancerType: '',
      stage: '',
      treatmentIntent: '',
      protocols: []
    }));
    toast({
      title: "Data Cleared",
      description: "All form data has been cleared",
      variant: "default"
    });
  };

  const canSearch = state.cancerType && state.treatmentIntent;
  const hasResults = state.protocols.length > 0;

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
            <Search className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Treatment Planner
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Find optimal cancer treatment protocols based on disease characteristics
            </p>
          </div>
        </div>
        <Button 
          variant="outline" 
          onClick={handleClearAll}
          className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20"
        >
          <XCircle className="w-4 h-4 mr-2" />
          Clear All
        </Button>
      </div>

      {/* Search Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl">Disease & Treatment Parameters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Cancer Type */}
            <div>
              <label htmlFor="cancer-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cancer Type *
              </label>
              <select
                id="cancer-type"
                value={state.cancerType}
                onChange={(e) => handleInputChange('cancerType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Select Cancer Type</option>
                {state.tumourGroups.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </div>

            {/* Stage */}
            <div>
              <label htmlFor="stage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Stage
              </label>
              <select
                id="stage"
                value={state.stage}
                onChange={(e) => handleInputChange('stage', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Select Stage</option>
                {CANCER_STAGES.map((stage) => (
                  <option key={stage.value} value={stage.value}>
                    {stage.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Treatment Intent */}
            <div>
              <label htmlFor="treatment-intent" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Treatment Intent *
              </label>
              <select
                id="treatment-intent"
                value={state.treatmentIntent}
                onChange={(e) => handleInputChange('treatmentIntent', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Select Treatment Intent</option>
                {TREATMENT_INTENTS.map((intent) => (
                  <option key={intent.value} value={intent.value}>
                    {intent.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Search Button */}
          <div className="flex justify-center">
            <Button
              onClick={fetchProtocols}
              disabled={!canSearch || state.isLoading}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-3 text-lg font-medium shadow-lg transition-all duration-300"
            >
              {state.isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Searching Protocols...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Find Treatment Protocols
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Status */}
      {!canSearch && (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please select both <strong>Cancer Type</strong> and <strong>Treatment Intent</strong> to search for matching protocols.
          </AlertDescription>
        </Alert>
      )}

      {/* Results Section */}
      {hasResults && (
        <div className="space-y-6">
          {/* Results Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Matching Protocols
            </h2>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900 dark:text-blue-300 text-lg px-3 py-1">
              {state.protocols.length} Protocol{state.protocols.length !== 1 ? 's' : ''} Found
            </Badge>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {state.protocols.map((protocol, index) => (
              <ProtocolCard key={protocol.id || index} protocol={protocol} index={index} />
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {canSearch && !state.isLoading && state.protocols.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                No Protocols Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md">
                No treatment protocols match your current selection. Try adjusting your search criteria or check if the cancer type and treatment intent combination is available.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TreatmentPlanner;
