import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertTriangle, Package2, Shield, BookOpen, Pill } from "lucide-react";
import { Protocol, Test, DoseModification, PreMedication, SupportiveCare, SupportiveCareItem, Medication, MonitoringItem } from "@/types/protocolUpdated";
import TreatmentTab from "../TreatmentTab";
import TestsSectionTab from "../TestsSectionTab";
import DoseModificationsTab from "../DoseModificationsTab";

interface ProtocolDetailsDialogProps {
  protocol: Protocol;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface OverviewSectionProps {
  overview?: string;
}

const OverviewSection: React.FC<OverviewSectionProps> = ({ overview }) => (
  <div>
    <h3 className="font-semibold text-lg mb-2">Overview</h3>
    {overview ? (
      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{overview}</p>
    ) : (
      <p className="text-muted-foreground">No overview information.</p>
    )}
  </div>
);

interface InfoTabProps {
  lastReviewed?: string;
  version?: string;
  status?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

const InfoTab: React.FC<InfoTabProps> = ({
  lastReviewed,
  version,
  status,
  createdBy,
  updatedBy,
  createdAt,
  updatedAt
}) => (
  <div className="space-y-4">
    {version && (
      <div>
        <h3 className="font-semibold text-lg mb-2">Version</h3>
        <p>{version}</p>
      </div>
    )}
    {status && (
      <div>
        <h3 className="font-semibold text-lg mb-2">Status</h3>
        <p>{status}</p>
      </div>
    )}
    {lastReviewed && (
      <div>
        <h3 className="font-semibold text-lg mb-2">Last Reviewed</h3>
        <p>{new Date(lastReviewed).toLocaleDateString()}</p>
      </div>
    )}
    {(createdBy || createdAt) && (
      <div>
        <h3 className="font-semibold text-lg mb-2">Created</h3>
        {createdBy && <p>By: {createdBy}</p>}
        {createdAt && <p>On: {new Date(createdAt).toLocaleDateString()}</p>}
      </div>
    )}
    {(updatedBy || updatedAt) && (
      <div>
        <h3 className="font-semibold text-lg mb-2">Last Updated</h3>
        {updatedBy && <p>By: {updatedBy}</p>}
        {updatedAt && <p>On: {new Date(updatedAt).toLocaleDateString()}</p>}
      </div>
    )}
  </div>
);

// Add this helper function after the interface declarations
const getTagColor = (tag: string, idx?: number) => {
  const t = tag.toLowerCase();

  if (t.includes('her2')) return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200';
  if (t.includes('triple')) return 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200';
  if (t.includes('immuno')) return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200';
  if (t.includes('checkpoint')) return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200';
  if (t.includes('platinum')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
  if (t.includes('metastatic')) return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';

  return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
};

const ProtocolDetailsDialog: React.FC<ProtocolDetailsDialogProps> = ({ protocol, open, onOpenChange }) => {
  // Set up data with fallbacks for each section
  const monitoring = React.useMemo(() => protocol.monitoring || { baseline: [], ongoing: [] }, [protocol.monitoring]);
  const treatment = React.useMemo(() => protocol.treatment || { drugs: [] }, [protocol.treatment]);  const tests = React.useMemo(() => {
    if (Array.isArray(protocol.tests)) {
      return { baseline: [], monitoring: [] };
    }
    return protocol.tests || { baseline: [], monitoring: [] };
  }, [protocol.tests]);
  
  const doseModifications = React.useMemo(() => {
    const mods = protocol.dose_modifications || {};
    return {
      hematological: mods.hematological || [],
      nonHematological: mods.nonHematological || [],
      renal: mods.renal || [],
      hepatic: mods.hepatic || []
    };
  }, [protocol.dose_modifications]);

  const toxicityMonitoring = React.useMemo(() => 
    protocol.toxicity_monitoring || {
      expected_toxicities: [],
      monitoring_parameters: '',
      frequency_details: '',
      thresholds_for_action: {}
    },
    [protocol.toxicity_monitoring]
  );

  const supportiveCare = React.useMemo(() => 
    protocol.supportive_care || {
      required: [],
      optional: [],
      monitoring: []
    },
    [protocol.supportive_care]
  );

  const interactions = React.useMemo(() => 
    protocol.interactions || {
      drugs_to_avoid: [],
      contraindications: [],
      precautions_with_other_drugs: []
    },
    [protocol.interactions]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{protocol.code || "Protocol Details"}</DialogTitle>
          <DialogDescription>
            {protocol.summary || "Treatment protocol details"}
          </DialogDescription>        </DialogHeader>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-4 flex flex-wrap">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="treatment">Treatment</TabsTrigger>
            <TabsTrigger value="tests">Tests</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            <TabsTrigger value="doseModifications">Dose Modifications</TabsTrigger>
            <TabsTrigger value="safety" className="text-red-600">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Safety
            </TabsTrigger>
            <TabsTrigger value="support">
              <Pill className="w-4 h-4 mr-2" />
              Support Care
            </TabsTrigger>
            <TabsTrigger value="emergency">
              <Shield className="w-4 h-4 mr-2" />
              Emergency
            </TabsTrigger>
            <TabsTrigger value="toxicity">Toxicity</TabsTrigger>
            <TabsTrigger value="interactions">Interactions</TabsTrigger>
            <TabsTrigger value="references">
              <BookOpen className="w-4 h-4 mr-2" />
              References
            </TabsTrigger>
            <TabsTrigger value="supportiveCare">Supportive Care</TabsTrigger>
            <TabsTrigger value="info">Info</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Tabs defaultValue="summary" className="w-full mt-4">
              <TabsList className="mb-4 bg-muted p-1 rounded-md grid grid-cols-3 w-full">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="cycle">Cycle + Tags</TabsTrigger>
                <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
              </TabsList>

              {/* Summary Panel */}
              <TabsContent value="summary" className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-md shadow">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-200 text-lg mb-1">Tumour Classification</h3>
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    Group: <strong>{protocol.tumour_group}</strong><br />
                    Supergroup: <strong>{protocol.tumour_supergroup || 'N/A'}</strong>
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow border">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg mb-1">Protocol Summary</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {protocol.summary || 'No summary provided.'}
                  </p>
                </div>
              </TabsContent>

              {/* Cycle Info + Tags Panel */}
              <TabsContent value="cycle" className="space-y-4">
                {protocol.cycle_info && (
                  <div className="bg-indigo-50 dark:bg-indigo-900 p-4 rounded-md shadow">
                    <h3 className="font-semibold text-indigo-900 dark:text-indigo-200 text-lg mb-1">Cycle Information</h3>
                    <p className="text-sm text-indigo-800 dark:text-indigo-300 whitespace-pre-line">
                      {Array.isArray(protocol.cycle_info) ? protocol.cycle_info.join(', ') : (protocol.cycle_info as any)?.schedule}
                    </p>
                  </div>
                )}

                {protocol.tags && protocol.tags.length > 0 && (
                  <div className="bg-violet-50 dark:bg-violet-900 p-4 rounded-md shadow">
                    <h3 className="font-semibold text-violet-900 dark:text-violet-200 text-lg mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {protocol.tags?.map((tag: string, idx: number) => (
                        <span key={idx} className={`px-2 py-1 text-xs rounded-full font-medium ${getTagColor(tag, idx)}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Eligibility Panel */}
              <TabsContent value="eligibility" className="space-y-4">
  <h3 className="font-semibold text-green-900 dark:text-green-200 text-lg mb-2">
    Eligibility Criteria
  </h3>

  {(() => {
    const normalizeEligibility = (eligibility: any) => {
      if (!eligibility) return { inclusion_criteria: [], exclusion_criteria: [] };

      if (Array.isArray(eligibility)) {
        return { inclusion_criteria: eligibility, exclusion_criteria: [] };
      }

      if (typeof eligibility === 'object') {
        return {
          inclusion_criteria: eligibility.inclusion_criteria || [],
          exclusion_criteria: eligibility.exclusion_criteria || [],
        };
      }

      return { inclusion_criteria: [], exclusion_criteria: [] };
    };

    const { inclusion_criteria, exclusion_criteria } = normalizeEligibility(protocol.eligibility);

    return (
      <>
        <div>
          <h4 className="font-semibold text-sm mb-1 text-green-800 dark:text-green-300">
            Inclusion Criteria
          </h4>
          {inclusion_criteria.length > 0 ? (
            <ul className="list-disc list-inside space-y-1">
              {inclusion_criteria.map((item: any, idx: number) => (
                <li key={`incl-${idx}`} className="text-gray-700 dark:text-gray-300">
                  {typeof item === 'string' ? item : item?.criterion ?? '[Invalid entry]'}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">
              No inclusion criteria specified.
            </p>
          )}
        </div>

        <div>
          <h4 className="font-semibold text-sm mt-4 mb-1 text-red-800 dark:text-red-300">
            Exclusion Criteria
          </h4>
          {exclusion_criteria.length > 0 ? (
            <ul className="list-disc list-inside space-y-1">
              {exclusion_criteria.map((item: any, idx: number) => (
                <li key={`excl-${idx}`} className="text-gray-700 dark:text-gray-300">
                  {typeof item === 'string' ? item : item?.criterion ?? '[Invalid entry]'}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">
              No exclusion criteria specified.
            </p>
          )}
        </div>
      </>
    );
  })()}
</TabsContent>
            </Tabs>
          </TabsContent>
          <TabsContent value="treatment" className="space-y-4">
  <h3 className="text-xl font-bold text-indigo-800 dark:text-indigo-300">Treatment Drugs</h3>
  {treatment?.drugs?.length > 0 ? (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {treatment.drugs.map((drug: any, idx: number) => (        <div
          key={idx}
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-md hover:shadow-lg transition drug-card"
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100 drug-name">
              {drug.name || 'Unnamed Drug'}
            </h4>
            {drug.drug_class && (
              <span className="text-xs px-2 py-1 bg-indigo-100 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-100 rounded-full">
                {drug.drug_class}
              </span>
            )}
          </div>

          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
            {drug.dose && (
              <li>
                <span className="font-medium text-gray-900 dark:text-white">Dose:</span> {drug.dose}
              </li>
            )}
            {drug.administration && (
              <li>
                <span className="font-medium text-gray-900 dark:text-white">Administration:</span> {drug.administration}
              </li>
            )}
            {drug.timing && (
              <li>
                <span className="font-medium text-gray-900 dark:text-white">Schedule:</span> {drug.timing}
              </li>
            )}
          </ul>

          {drug.special_notes && drug.special_notes.length > 0 && (
            <div className="mt-3 bg-indigo-50 dark:bg-indigo-800/20 border-l-4 border-indigo-500 pl-3 pr-2 py-2 rounded">
              <h5 className="text-sm font-semibold text-indigo-700 dark:text-indigo-300 mb-1">Special Notes</h5>
              <ul className="list-disc list-inside text-sm text-indigo-900 dark:text-indigo-100 space-y-1">
                {drug.special_notes.map((note: string, i: number) => (
                  <li key={i}>{note}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  ) : (
    <p className="text-muted-foreground">No treatment drugs specified.</p>
  )}
</TabsContent>          <TabsContent value="tests">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Baseline Tests</h3>                {tests?.baseline && tests.baseline.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {tests.baseline.map((test: any, idx: number) => (
                      <li key={idx}>{typeof test === 'object' ? test.name || JSON.stringify(test) : test}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No baseline tests specified.</p>
                )}
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">Monitoring Tests</h3>
                {tests?.monitoring && tests.monitoring.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {tests.monitoring.map((test: any, idx: number) => (
                      <li key={idx}>{typeof test === 'object' ? test.name || JSON.stringify(test) : test}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No monitoring tests specified.</p>
                )}
              </div>
            </div>
          </TabsContent><TabsContent value="monitoring">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Baseline Monitoring</h3>
                {monitoring.baseline?.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {monitoring.baseline.map((item: MonitoringItem, idx: number) => (
                      <li key={idx}>{item.parameter}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No baseline monitoring specified.</p>
                )}
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">Ongoing Monitoring</h3>
                {monitoring.ongoing?.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {monitoring.ongoing.map((item: MonitoringItem, idx: number) => (
                      <li key={idx}>{item.parameter}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No ongoing monitoring specified.</p>
                )}
              </div>
              
              {monitoring.frequency && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">Monitoring Frequency</h3>
                  <p className="whitespace-pre-line">{monitoring.frequency}</p>
                </div>
              )}
            </div>
          </TabsContent>          <TabsContent value="doseModifications">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Hematological Modifications</h3>
                {doseModifications.hematological.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {doseModifications.hematological.map((item: DoseModification, idx: number) => (
                      <li key={idx}>{item.modification}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No hematological modifications specified.</p>
                )}
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">Non-Hematological Modifications</h3>
                {doseModifications.nonHematological.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {doseModifications.nonHematological.map((item: DoseModification, idx: number) => (
                      <li key={idx}>{item.modification}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No non-hematological modifications specified.</p>
                )}
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">Renal Modifications</h3>
                {doseModifications.renal.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {doseModifications.renal.map((item: DoseModification, idx: number) => (
                      <li key={idx}>{item.modification}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No renal modifications specified.</p>
                )}
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">Hepatic Modifications</h3>
                {doseModifications.hepatic.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {doseModifications.hepatic.map((item: DoseModification, idx: number) => (
                      <li key={idx}>{item.modification}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No hepatic modifications specified.</p>
                )}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="safety" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="w-5 h-5" />
                  Safety Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">                {protocol.precautions && (
                  <div>
                    <h4 className="font-semibold text-amber-600 mb-2">Precautions</h4>
                    <div className="bg-amber-50 p-3 rounded border-l-4 border-amber-400">
                      {typeof protocol.precautions === 'string' 
                        ? protocol.precautions 
                        : Array.isArray(protocol.precautions)
                        ? protocol.precautions.map((item: any, idx: number) => (
                            <div key={idx} className="mb-2 last:mb-0">
                              {typeof item === 'object' ? item.note || JSON.stringify(item) : item}
                            </div>
                          ))
                        : typeof protocol.precautions === 'object' && !Array.isArray(protocol.precautions) ? (
                          Object.entries(protocol.precautions).map(([key, items]: [string, any], idx) => (
                            <div key={idx} className="mb-3">
                              <h5 className="font-semibold capitalize text-sm text-amber-700 mb-1">
                                {key.replace(/_/g, ' ')}
                              </h5>
                              <ul className="list-disc list-inside text-sm text-amber-900">
                                {Array.isArray(items) ? items.map((item: string, i: number) => (
                                  <li key={i}>{item}</li>
                                )) : (
                                  <li>{String(items)}</li>
                                )}
                              </ul>
                            </div>
                          ))
                        ) : (
                          <p>No precautions specified.</p>
                        )}
                    </div>
                  </div>
                )}
                  {protocol.contraindications && (
                  <div>
                    <h4 className="font-semibold text-red-600 mb-2">Contraindications</h4>
                    <div className="bg-red-50 p-3 rounded border-l-4 border-red-400">
                      {typeof protocol.contraindications === 'string' 
                        ? protocol.contraindications 
                        : typeof protocol.contraindications === 'object' && !Array.isArray(protocol.contraindications) ? (
                          <>
                            {(protocol.contraindications as any).absolute?.length > 0 && (
                              <div className="mb-3">
                                <h5 className="font-semibold text-red-600 text-sm mb-1">Absolute</h5>
                                <ul className="list-disc list-inside text-sm text-red-900">
                                  {(protocol.contraindications as any).absolute.map((item: string, i: number) => (
                                    <li key={i}>{item}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {(protocol.contraindications as any).relative?.length > 0 && (
                              <div className="mb-3">
                                <h5 className="font-semibold text-red-500 text-sm mb-1">Relative</h5>
                                <ul className="list-disc list-inside text-sm text-red-800">
                                  {(protocol.contraindications as any).relative.map((item: string, i: number) => (
                                    <li key={i}>{item}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            (!(protocol.contraindications as any).absolute || (protocol.contraindications as any).absolute.length === 0) &&
                             (!(protocol.contraindications as any).relative || (protocol.contraindications as any).relative.length === 0) && (
                              <p>No contraindications specified.</p>
                            )
                          </>
                        ) : Array.isArray(protocol.contraindications) ? (
                          <ul className="list-disc list-inside text-sm text-red-900">
                            {protocol.contraindications.map((item: string, i: number) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        ) : (
                          <p>No contraindications specified.</p>
                        )}
                    </div>
                  </div>
                )}
                
                {interactions && ((interactions.drugs_to_avoid && interactions.drugs_to_avoid.length > 0) || (interactions.contraindications && interactions.contraindications.length > 0) || (interactions.precautions_with_other_drugs && interactions.precautions_with_other_drugs.length > 0)) && (
                  <div>
                    <h4 className="font-semibold text-orange-600 mb-2">Drug Interactions & Warnings</h4>
                    <div className="bg-orange-50 p-3 rounded border-l-4 border-orange-400 space-y-2">                      {interactions.drugs_to_avoid && interactions.drugs_to_avoid.length > 0 && (
                        <div>
                          <span className="font-medium text-red-600">Drugs to Avoid:</span>
                          <ul className="list-disc list-inside ml-2">
                            {interactions.drugs_to_avoid.map((drug: string, idx: number) => (
                              <li key={idx}>{drug}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {interactions.contraindications && interactions.contraindications.length > 0 && (
                        <div>
                          <span className="font-medium text-red-600">Contraindications:</span>
                          <ul className="list-disc list-inside ml-2">
                            {interactions.contraindications.map((item: string, idx: number) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {interactions.precautions_with_other_drugs && interactions.precautions_with_other_drugs.length > 0 && (
                        <div>
                          <span className="font-medium text-amber-600">Precautions with Other Drugs:</span>
                          <ul className="list-disc list-inside ml-2">
                            {interactions.precautions_with_other_drugs.map((item: string, idx: number) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {!protocol.precautions && !protocol.contraindications && (!interactions || (!interactions.drugs_to_avoid || interactions.drugs_to_avoid.length === 0) && (!interactions.contraindications || interactions.contraindications.length === 0) && (!interactions.precautions_with_other_drugs || interactions.precautions_with_other_drugs.length === 0)) && (
                  <div className="text-center py-8 text-gray-500">
                    <AlertTriangle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No specific safety information available for this protocol.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="support" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="w-5 h-5" />
                  Support Medications & Care
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(() => {
                  const preMeds = protocol.pre_medications as PreMedication | Medication[];
                  if (preMeds && 'required' in preMeds && preMeds.required && preMeds.required.length > 0) {
                    return (
                      <div>
                        <h4 className="font-semibold mb-2 text-blue-600">Pre-medications</h4>
                        <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                          <ul>
                            {preMeds.required.map((med: Medication, idx: number) => (
                              <li key={idx} className="medication-name">{med.name} — {med.dose}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div>
                      <h4 className="font-semibold mb-2 text-blue-600">Pre-medications</h4>
                      <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                        <p>No pre-medications specified.</p>
                      </div>
                    </div>
                  );
                })()}
                
                {protocol.post_medications && (
                  <div>
                    <h4 className="font-semibold mb-2 text-green-600">Post-medications</h4>
                    <div className="bg-green-50 p-3 rounded border-l-4 border-green-400">
                      {typeof protocol.post_medications === 'string' 
                        ? protocol.post_medications 
                        : Array.isArray(protocol.post_medications)
                        ? protocol.post_medications.length > 0
                          ? protocol.post_medications.map((med: any, idx: number) => (
                              <div key={idx} className="mb-2 last:mb-0">
                                {typeof med === 'object' ? med.name || med.drug || JSON.stringify(med) : med}
                              </div>
                            ))
                          : "No post-medications specified"
                        : JSON.stringify(protocol.post_medications, null, 2)}
                    </div>
                  </div>
                )}
                
                {protocol.supportive_meds && (
                  <div>
                    <h4 className="font-semibold mb-2 text-purple-600">Additional Supportive Care</h4>
                    <div className="bg-purple-50 p-3 rounded border-l-4 border-purple-400">
                      {typeof protocol.supportive_meds === 'string' 
                        ? protocol.supportive_meds 
                        : Array.isArray(protocol.supportive_meds)
                        ? protocol.supportive_meds.length > 0
                          ? protocol.supportive_meds.map((med: any, idx: number) => (
                              <div key={idx} className="mb-2 last:mb-0">
                                {typeof med === 'object' ? med.name || med.drug || JSON.stringify(med) : med}
                              </div>
                            ))
                          : "No additional supportive medications specified"
                        : JSON.stringify(protocol.supportive_meds, null, 2)}
                    </div>
                  </div>
                )}

                {!protocol.pre_medications && !protocol.post_medications && !protocol.supportive_meds && (
                  <div className="text-center py-8 text-gray-500">
                    <Pill className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No support medication information available for this protocol.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="emergency" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <Shield className="w-5 h-5" />
                  Emergency Protocols & Rescue Agents
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {protocol.rescue_agents && (
                  <div>
                    <h4 className="font-semibold mb-2 text-red-600">Emergency/Rescue Agents</h4>
                    <div className="bg-red-50 p-3 rounded border-l-4 border-red-400">
                      {typeof protocol.rescue_agents === 'string' 
                        ? protocol.rescue_agents 
                        : Array.isArray(protocol.rescue_agents)
                        ? protocol.rescue_agents.length > 0
                          ? protocol.rescue_agents.map((agent: any, idx: number) => (
                              <div key={idx} className="mb-2 last:mb-0">
                                {typeof agent === 'object' ? agent.name || agent.drug || JSON.stringify(agent) : agent}
                              </div>
                            ))
                          : "No rescue agents specified"
                        : JSON.stringify(protocol.rescue_agents, null, 2)}
                    </div>
                  </div>
                )}                {toxicityMonitoring && toxicityMonitoring.thresholds_for_action && Object.keys(toxicityMonitoring.thresholds_for_action).length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 text-orange-600">Emergency Action Thresholds</h4>
                    <div className="bg-orange-50 p-3 rounded border-l-4 border-orange-400">
                      <div className="grid gap-2">
                        {Object.entries(toxicityMonitoring.thresholds_for_action).map(([condition, action]: [string, string], idx: number) => (
                          <div key={idx} className="bg-white p-2 rounded border border-orange-200">
                            <span className="font-medium text-orange-800">{condition}:</span>
                            <span className="ml-2 text-gray-700">{action}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {!protocol.rescue_agents && (!toxicityMonitoring || !toxicityMonitoring.thresholds_for_action || Object.keys(toxicityMonitoring.thresholds_for_action).length === 0) && (
                  <div className="text-center py-8 text-gray-500">
                    <Shield className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No emergency protocol information available.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="references" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  References & Clinical Evidence
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {protocol.reference_list && (
                  <div>
                    <h4 className="font-semibold mb-2 text-blue-600">Clinical References</h4>
                    <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                      {typeof protocol.reference_list === 'string' 
                        ? protocol.reference_list 
                        : Array.isArray(protocol.reference_list)
                        ? protocol.reference_list.length > 0
                          ? protocol.reference_list.map((ref: any, idx: number) => (
                              <div key={idx} className="mb-3 last:mb-0 p-2 bg-white rounded border border-blue-200">
                                <span className="text-sm text-blue-800 font-medium">[{idx + 1}]</span>
                                <span className="ml-2">
                                  {typeof ref === 'object' ? ref.citation || ref.title || JSON.stringify(ref) : ref}
                                </span>
                              </div>
                            ))
                          : "No references available"
                        : JSON.stringify(protocol.reference_list, null, 2)}
                    </div>
                  </div>
                )}

                {protocol.last_reviewed && (
                  <div>
                    <h4 className="font-semibold mb-2 text-green-600">Protocol Currency</h4>
                    <div className="bg-green-50 p-3 rounded border-l-4 border-green-400">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Last Reviewed:</span>
                        <span className="text-green-700">{new Date(protocol.last_reviewed).toLocaleDateString()}</span>
                      </div>
                      {(() => {
                        const reviewDate = new Date(protocol.last_reviewed);
                        const now = new Date();
                        const daysDiff = Math.floor((now.getTime() - reviewDate.getTime()) / (1000 * 60 * 60 * 24));
                        const yearsDiff = daysDiff / 365;
                        
                        let statusColor = 'text-green-600';
                        let statusText = 'Current';
                        
                        if (yearsDiff > 2) {
                          statusColor = 'text-red-600';
                          statusText = 'Requires Review';
                        } else if (yearsDiff > 1) {
                          statusColor = 'text-amber-600';
                          statusText = 'Review Soon';
                        }
                        
                        return (
                          <div className="mt-2 flex items-center justify-between">
                            <span className="font-medium">Status:</span>
                            <span className={`font-semibold ${statusColor}`}>{statusText}</span>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                )}

                {protocol.version && (
                  <div>
                    <h4 className="font-semibold mb-2 text-purple-600">Version Information</h4>
                    <div className="bg-purple-50 p-3 rounded border-l-4 border-purple-400">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Protocol Version:</span>
                        <span className="text-purple-700 font-mono">{protocol.version}</span>
                      </div>
                    </div>
                  </div>
                )}

                {!protocol.reference_list && !protocol.last_reviewed && !protocol.version && (
                  <div className="text-center py-8 text-gray-500">
                    <BookOpen className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No reference or version information available.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="toxicity">
            <div className="space-y-6">              <div>
                <h3 className="font-semibold text-lg mb-2">Expected Toxicities</h3>
                {toxicityMonitoring?.expected_toxicities && toxicityMonitoring.expected_toxicities.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {toxicityMonitoring.expected_toxicities.map((toxicity: string, idx: number) => (
                      <li key={idx}>{toxicity}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No expected toxicities specified.</p>
                )}
              </div>
                {toxicityMonitoring?.monitoring_parameters && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">Monitoring Parameters</h3>
                  <p className="whitespace-pre-line">{toxicityMonitoring.monitoring_parameters}</p>
                </div>
              )}

              {toxicityMonitoring?.frequency_details && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">Monitoring Frequency</h3>
                  <p className="whitespace-pre-line">{toxicityMonitoring.frequency_details}</p>
                </div>
              )}

              {toxicityMonitoring?.thresholds_for_action && Object.keys(toxicityMonitoring.thresholds_for_action).length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">Action Thresholds</h3>
                  <div className="grid gap-2">
                    {Object.entries(toxicityMonitoring.thresholds_for_action).map(([condition, action]: [string, string], idx: number) => (
                      <div key={idx} className="bg-muted p-2 rounded-md">
                        <span className="font-medium">{condition}:</span> {action}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>          <TabsContent value="interactions">
            <div className="space-y-6">
              {interactions?.drugs_to_avoid && interactions.drugs_to_avoid.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">Drugs to Avoid</h3>
                  <ul className="list-disc list-inside">
                    {interactions.drugs_to_avoid.map((drug: string, idx: number) => (
                      <li key={idx}>{drug}</li>
                    ))}
                  </ul>
                </div>
              )}

              {interactions?.contraindications && interactions.contraindications.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">Contraindications</h3>
                  <ul className="list-disc list-inside">
                    {interactions.contraindications.map((item: string, idx: number) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {interactions?.precautions_with_other_drugs && interactions.precautions_with_other_drugs.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">Precautions with Other Drugs</h3>
                  <ul className="list-disc list-inside">
                    {interactions.precautions_with_other_drugs.map((item: string, idx: number) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </TabsContent><TabsContent value="supportiveCare">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Required Supportive Care</h3>
                {supportiveCare && 'required' in supportiveCare && supportiveCare.required && supportiveCare.required.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {supportiveCare.required.map((item: SupportiveCareItem, idx: number) => (
                      <li key={idx}>{typeof item === 'object' ? item.name || JSON.stringify(item) : item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No required supportive care specified.</p>
                )}
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">Optional Supportive Care</h3>
                {supportiveCare && 'optional' in supportiveCare && supportiveCare.optional && supportiveCare.optional.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {supportiveCare.optional.map((item: SupportiveCareItem, idx: number) => (
                      <li key={idx}>{typeof item === 'object' ? item.name || JSON.stringify(item) : item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No optional supportive care specified.</p>
                )}
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">Monitoring Requirements</h3>
                {supportiveCare && 'monitoring' in supportiveCare && supportiveCare.monitoring && supportiveCare.monitoring.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {supportiveCare.monitoring.map((item: SupportiveCareItem, idx: number) => (
                      <li key={idx}>{item.name}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No monitoring requirements specified.</p>
                )}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="info">
            <InfoTab
              lastReviewed={protocol.last_reviewed}
              version={protocol.version}
              status={protocol.status}
              createdBy={protocol.created_by}
              updatedBy={protocol.updated_by}
              createdAt={protocol.created_at}
              updatedAt={protocol.updated_at}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ProtocolDetailsDialog;
