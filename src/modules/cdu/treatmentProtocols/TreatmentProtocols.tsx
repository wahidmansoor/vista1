import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import UnifiedProtocolCard from './UnifiedProtocolCard';
import ProtocolDetailsDialog from './components/ProtocolDetailsDialog';
import ProtocolLoadingSkeleton from './ProtocolLoadingSkeleton';
import ProtocolErrorState from './ProtocolErrorState';

import { TreatmentProtocol, Protocol } from '@/types/medical';
import {
  getAllGroupOptions,
  getProtocolsByTumorGroup,
} from '@/services/protocols';

export default function TreatmentProtocols() {
  const [groupOptions, setGroupOptions] = useState<
    { label: string; group: string; supergroup: string }[]
  >([]);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [selectedSupergroup, setSelectedSupergroup] = useState<string | null>(null);
  const [protocols, setProtocols] = useState<TreatmentProtocol[]>([]);
  const [selectedProtocol, setSelectedProtocol] = useState<TreatmentProtocol | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load combo box options
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoading(true);
        const options = await getAllGroupOptions();
        setGroupOptions(options);
      } catch (err) {
        setError('Failed to load tumour group options.');
      } finally {
        setLoading(false);
      }
    };
    fetchOptions();
  }, []);

  // Load protocols when group is selected
  useEffect(() => {
    if (selectedGroup) {
      setLoading(true);
      getProtocolsByTumorGroup(selectedGroup)
        .then((data: Protocol[]) => {
          const mappedProtocols: TreatmentProtocol[] = data.map((protocol) => ({
            id: protocol.id,
            name: protocol.name || '',
            protocol_code: protocol.code,
            short_name: protocol.name || '',
            cancer_types: protocol.tumour_group ? [protocol.tumour_group] : [],
            line_of_therapy: protocol.treatment_intent || 'unknown',
            treatment_intent: protocol.treatment_intent || 'unknown',
            eligibility_criteria: protocol.eligibility || { inclusion_criteria: [], exclusion_criteria: [] },
            treatment_schedule: protocol.treatment?.schedule || {},
            drugs: protocol.treatment?.drugs || [],
            contraindications: protocol.precautions || [],
            monitoring_requirements: protocol.monitoring?.ongoing || [],
            expected_outcomes: protocol.expected_outcomes || {},
            evidence_level: protocol.evidence_level || 'unknown',
            guideline_source: protocol.guideline_source || '',
            biomarker_requirements: protocol.biomarker_requirements || [],
            companion_diagnostics: protocol.companion_diagnostics || [],
            molecular_targets: protocol.molecular_targets || [],
            resistance_mechanisms: protocol.resistance_mechanisms || [],
            decision_support_level: protocol.decision_support_level || 'manual_only',
            automated_eligibility_check: protocol.automated_eligibility_check || false,
            alert_conditions: protocol.alert_conditions || [],
            drug_interactions: protocol.drug_interactions || [],
            quality_metrics: protocol.quality_metrics || [],
            regulatory_approvals: protocol.regulatory_approvals || [],
            clinical_trial_data: protocol.clinical_trial_data || [],
            cost_effectiveness_data: protocol.cost_effectiveness_data || {},
            implementation_complexity: protocol.implementation_complexity || 'low',
            resource_requirements: protocol.resource_requirements || [],
            training_requirements: protocol.training_requirements || [],
            last_updated: protocol.updated_at ? new Date(protocol.updated_at) : new Date(),
            version: protocol.version || '',
            is_active: protocol.is_active !== undefined ? protocol.is_active : true,
            deprecation_date: protocol.deprecation_date ? new Date(protocol.deprecation_date) : undefined,
            replacement_protocol_id: protocol.replacement_protocol_id || undefined,
            clinical_trial_eligible: protocol.clinical_trial_eligible || false,
            created_by: protocol.created_by || '',
            approved_by: protocol.approved_by || [],
            approval_date: protocol.approval_date ? new Date(protocol.approval_date) : undefined,
            review_cycle_months: protocol.review_cycle_months || 12,
            next_review_date: protocol.next_review_date ? new Date(protocol.next_review_date) : undefined,
          }));
          setProtocols(mappedProtocols);
        })
        .catch(() => {
          setError('Failed to load protocols for this group.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [selectedGroup]);

  if (loading) return <ProtocolLoadingSkeleton />;
  if (error) return <ProtocolErrorState error={error} type="error" />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-4"
    >
      <h1 className="text-3xl font-bold text-indigo-900 mb-6">
        Select a Cancer Type
      </h1>      {/* Combo Box */}
      <div className="max-w-xl mb-8">
        <select
          className="treatment-protocols-dropdown w-full p-4 rounded-lg border-2 border-indigo-300 bg-white text-gray-900 shadow-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 appearance-none cursor-pointer"
          defaultValue=""
          onChange={(e) => {
            const selected = groupOptions.find((opt) => opt.label === e.target.value);
            if (selected) {
              setSelectedGroup(selected.group);
              setSelectedSupergroup(selected.supergroup);
            }
          }}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23374151' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: 'right 0.5rem center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '1.5em 1.5em',
            paddingRight: '2.5rem'
          }}
        >
          <option value="" disabled>
            -- Select Tumour Group --
          </option>
          {groupOptions.map((opt) => (
            <option key={opt.label} value={opt.label}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Protocol Cards */}
      {selectedGroup && (
        <>
          <h2 className="text-2xl font-semibold text-indigo-800 mb-4">
            Protocols for {selectedGroup}
          </h2>
          {protocols.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
              No protocols found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {protocols.map((protocol) => (
                <div
                  key={protocol.protocol_code}
                  onClick={() => setSelectedProtocol(protocol)}
                >
                  <UnifiedProtocolCard protocol={protocol} />
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Protocol Dialog */}
      {selectedProtocol && (
        <ProtocolDetailsDialog
          protocol={selectedProtocol}
          open={!!selectedProtocol}
          onOpenChange={(open) => {
            if (!open) setSelectedProtocol(null);
          }}
        />
      )}
    </motion.div>
  );
}
