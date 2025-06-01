import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "../../../../components/ui/card";
import { AlertTriangle, Package, Shield, BookOpen, Pill } from "lucide-react";
import { Protocol, Test } from "@/types/protocol";
import TreatmentTab from "../tabs/TreatmentTab";
import TestsSectionTab from "../tabs/TestsSectionTab";
import { DoseModificationsTab } from "../tabs/DoseModificationsTab";

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
  <div className="space-y-6">
    {/* Protocol Metadata Card */}
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-600">
          <Package className="w-5 h-5" />
          Protocol Metadata
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-1">Version</h4>
            <p className="text-gray-700">{version || "Not specified"}</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-800 mb-1">Status</h4>
            <p className="text-gray-700">{status || "Active"}</p>
          </div>
        </div>
        
        {lastReviewed && (
          <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
            <h4 className="font-semibold text-purple-800 mb-1">Last Reviewed</h4>
            <p className="text-gray-700">{new Date(lastReviewed).toLocaleDateString()}</p>
            {(() => {
              const reviewDate = new Date(lastReviewed);
              const now = new Date();
              const daysDiff = Math.floor((now.getTime() - reviewDate.getTime()) / (1000 * 60 * 60 * 24));
              const yearsDiff = daysDiff / 365;
              
              let statusColor = 'text-green-600';
              let statusText = 'Current';
              let bgColor = 'bg-green-50';
              
              if (yearsDiff > 2) {
                statusColor = 'text-red-600';
                statusText = 'Requires Review';
                bgColor = 'bg-red-50';
              } else if (yearsDiff > 1) {
                statusColor = 'text-amber-600';
                statusText = 'Review Soon';
                bgColor = 'bg-amber-50';
              }
              
              return (
                <div className={`mt-2 p-2 rounded ${bgColor}`}>
                  <span className={`text-sm font-medium ${statusColor}`}>
                    Review Status: {statusText} ({Math.round(yearsDiff * 10) / 10} years ago)
                  </span>
                </div>
              );
            })()}
          </div>
        )}
      </CardContent>
    </Card>

    {/* Authorship Information */}
    {(createdBy || createdAt || updatedBy || updatedAt) && (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-600">
            <BookOpen className="w-5 h-5" />
            Authorship & History
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(createdBy || createdAt) && (
            <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
              <h4 className="font-semibold text-indigo-800 mb-2">Created</h4>
              <div className="space-y-1">
                {createdBy && <p className="text-gray-700">By: {createdBy}</p>}
                {createdAt && <p className="text-gray-700">On: {new Date(createdAt).toLocaleDateString()}</p>}
              </div>
            </div>
          )}
          
          {(updatedBy || updatedAt) && (
            <div className="bg-teal-50 p-3 rounded-lg border border-teal-200">
              <h4 className="font-semibold text-teal-800 mb-2">Last Updated</h4>
              <div className="space-y-1">
                {updatedBy && <p className="text-gray-700">By: {updatedBy}</p>}
                {updatedAt && <p className="text-gray-700">On: {new Date(updatedAt).toLocaleDateString()}</p>}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    )}

    {/* Default Information Card */}
    {!version && !status && !lastReviewed && !createdBy && !createdAt && !updatedBy && !updatedAt && (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-600">
            <Package className="w-5 h-5" />
            Protocol Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-medium text-gray-700 mb-2">Protocol Metadata</h3>
            <p className="text-sm text-gray-500 mb-4">
              Additional protocol information and metadata will be displayed here when available.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-left">
              <h4 className="font-semibold text-blue-800 mb-2">This tab typically includes:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Protocol version information</li>
                <li>• Review and approval status</li>
                <li>• Creation and modification dates</li>
                <li>• Author and reviewer information</li>
                <li>• Implementation guidelines</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    )}
  </div>
);

const ProtocolDetailsDialog: React.FC<ProtocolDetailsDialogProps> = ({ protocol, open, onOpenChange }) => {
  // Set up data with fallbacks for each section
  const monitoring = React.useMemo(() => protocol.monitoring || { baseline: [], ongoing: [] }, [protocol.monitoring]);
  const treatment = React.useMemo(() => protocol.treatment || { drugs: [] }, [protocol.treatment]);  const tests = React.useMemo(() => {
  // Use monitoring field instead of tests field
  let testsData = protocol.tests || protocol.monitoring;
  
  // If tests is a string, try to parse it as JSON
  if (typeof testsData === 'string') {
    try {
      testsData = JSON.parse(testsData);
    } catch (e) {
      return { baseline: [], monitoring: [] };
    }
  }
  
  // If no tests data
  if (!testsData) {
    return { baseline: [], monitoring: [] };
  }
  
  // If tests is an object with baseline and monitoring/ongoing properties
  if (typeof testsData === 'object' && !Array.isArray(testsData)) {
    return {
      baseline: Array.isArray(testsData.baseline) ? testsData.baseline : [],
      // Handle both 'monitoring' and 'ongoing' field names
      monitoring: Array.isArray(testsData.monitoring) ? testsData.monitoring : 
                 Array.isArray(testsData.ongoing) ? testsData.ongoing : []
    };
  }
  
  // If tests is an array (legacy format), treat as baseline tests
  if (Array.isArray(testsData)) {
    return {
      baseline: testsData,
      monitoring: []
    };
  }
  
  // Fallback
  return { baseline: [], monitoring: [] };
}, [protocol.tests, protocol.monitoring]);
  const doseModifications = React.useMemo(() => {
    const modifications = protocol.dose_modifications || {} as any;
    return {
      hematological: Array.isArray(modifications.hematological) ? modifications.hematological : [],
      nonHematological: Array.isArray(modifications.nonHematological) ? modifications.nonHematological : [],
      renal: Array.isArray(modifications.renal) ? modifications.renal : [],
      hepatic: Array.isArray(modifications.hepatic) ? modifications.hepatic : []
    };
  }, [protocol.dose_modifications]);const toxicityMonitoring = React.useMemo(() => {
    const toxicityData = protocol.toxicity_monitoring || {} as any;
    return {
      expected_toxicities: Array.isArray(toxicityData.expected_toxicities) ? toxicityData.expected_toxicities : [],
      monitoring_parameters: toxicityData.monitoring_parameters || '',
      frequency_details: toxicityData.frequency_details || '',
      thresholds_for_action: toxicityData.thresholds_for_action || {}
    };
  }, [protocol.toxicity_monitoring]);const supportiveCare = React.useMemo(() => {
    const supportiveData = protocol.supportive_care || {} as any;
    return {
      required: Array.isArray(supportiveData.required) ? supportiveData.required : [],
      optional: Array.isArray(supportiveData.optional) ? supportiveData.optional : [],
      monitoring: Array.isArray(supportiveData.monitoring) ? supportiveData.monitoring : []
    };
  }, [protocol.supportive_care]);  const interactions = React.useMemo(() => {
    const interactionData = protocol.interactions || {} as any;
    return {
      drugs_to_avoid: Array.isArray(interactionData.drugs_to_avoid) ? interactionData.drugs_to_avoid : [],
      contraindications: Array.isArray(interactionData.contraindications) ? interactionData.contraindications : [],
      precautions_with_other_drugs: Array.isArray(interactionData.precautions_with_other_drugs) ? interactionData.precautions_with_other_drugs : []
    };
  }, [protocol.interactions]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] min-w-[80vw] md:min-w-[85vw] lg:min-w-[90vw] xl:min-w-[80vw] 2xl:min-w-[70vw] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{protocol.code || "Protocol Details"}</DialogTitle>
          <DialogDescription>
            {protocol.summary || "Treatment protocol details"}
          </DialogDescription>        </DialogHeader>        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-4 flex flex-wrap">
            <TabsTrigger value="overview" className="text-blue-600 hover:bg-blue-50 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800">Overview</TabsTrigger>
            <TabsTrigger value="treatment" className="text-purple-600 hover:bg-purple-50 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800">Treatment</TabsTrigger>
            <TabsTrigger value="tests" className="text-green-600 hover:bg-green-50 data-[state=active]:bg-green-100 data-[state=active]:text-green-800">Tests</TabsTrigger>
            <TabsTrigger value="doseModifications" className="text-amber-600 hover:bg-amber-50 data-[state=active]:bg-amber-100 data-[state=active]:text-amber-800">Dose Modifications</TabsTrigger>
            <TabsTrigger value="safety" className="text-red-600 hover:bg-red-50 data-[state=active]:bg-red-100 data-[state=active]:text-red-800 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Safety
            </TabsTrigger>
            <TabsTrigger value="support" className="text-teal-600 hover:bg-teal-50 data-[state=active]:bg-teal-100 data-[state=active]:text-teal-800 flex items-center">
              <Pill className="w-4 h-4 mr-2" />
              Support Care
            </TabsTrigger>
            <TabsTrigger value="emergency" className="text-orange-600 hover:bg-orange-50 data-[state=active]:bg-orange-100 data-[state=active]:text-orange-800 flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              Emergency
            </TabsTrigger>
            <TabsTrigger value="toxicity" className="text-pink-600 hover:bg-pink-50 data-[state=active]:bg-pink-100 data-[state=active]:text-pink-800">Toxicity</TabsTrigger>
            <TabsTrigger value="interactions" className="text-cyan-600 hover:bg-cyan-50 data-[state=active]:bg-cyan-100 data-[state=active]:text-cyan-800">Interactions</TabsTrigger>
            <TabsTrigger value="references" className="text-indigo-600 hover:bg-indigo-50 data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-800 flex items-center">
              <BookOpen className="w-4 h-4 mr-2" />
              References
            </TabsTrigger>
            <TabsTrigger value="info" className="text-gray-600 hover:bg-gray-50 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-800">Info</TabsTrigger>
          </TabsList><TabsContent value="overview">
            <div className="space-y-6">
              <OverviewSection overview={protocol.summary} />
              {protocol.eligibility && (
                <div className="mt-4">
                  <h3 className="font-semibold text-lg mb-4">Eligibility Criteria</h3>
                    {/* Check for new structure first - use safe property access */}
                  {((protocol.eligibility as any)?.age || (protocol.eligibility as any)?.performance_status || (protocol.eligibility as any)?.tumor_criteria) ? (
                    <div className="space-y-4">
                      {/* Age criteria */}
                      {(protocol.eligibility as any)?.age && (
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <h4 className="font-medium mb-1 text-blue-800">Age Requirements</h4>
                          <p className="text-gray-700">{(protocol.eligibility as any).age}</p>
                        </div>
                      )}
                      
                      {/* Performance status */}
                      {(protocol.eligibility as any)?.performance_status && (
                        <div className="bg-green-50 p-3 rounded-lg">
                          <h4 className="font-medium mb-1 text-green-800">Performance Status</h4>
                          <p className="text-gray-700">{(protocol.eligibility as any).performance_status}</p>
                        </div>
                      )}
                      
                      {/* Tumor criteria */}
                      {(protocol.eligibility as any)?.tumor_criteria && Array.isArray((protocol.eligibility as any).tumor_criteria) && (
                        <div className="bg-purple-50 p-3 rounded-lg">
                          <h4 className="font-medium mb-2 text-purple-800">Tumor Criteria</h4>
                          <ul className="list-disc list-inside text-gray-700">
                            {(protocol.eligibility as any).tumor_criteria.map((criterion: string, idx: number) => (
                              <li key={idx}>{criterion}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {/* Laboratory criteria */}
                      {(protocol.eligibility as any)?.laboratory_criteria && (
                        <div className="bg-yellow-50 p-3 rounded-lg">
                          <h4 className="font-medium mb-2 text-yellow-800">Laboratory Requirements</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
                            {Object.entries((protocol.eligibility as any).laboratory_criteria).map(([test, value], idx: number) => (
                              <div key={idx} className="flex justify-between">
                                <span className="font-medium">{test}:</span>
                                <span>{String(value)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Cardiac function */}
                      {(protocol.eligibility as any)?.cardiac_function && (
                        <div className="bg-red-50 p-3 rounded-lg">
                          <h4 className="font-medium mb-1 text-red-800">Cardiac Function</h4>
                          <p className="text-gray-700">{(protocol.eligibility as any).cardiac_function}</p>
                        </div>
                      )}
                      
                      {/* Pregnancy status */}
                      {(protocol.eligibility as any)?.pregnancy_status && (
                        <div className="bg-pink-50 p-3 rounded-lg">
                          <h4 className="font-medium mb-1 text-pink-800">Pregnancy Status</h4>
                          <p className="text-gray-700">{(protocol.eligibility as any).pregnancy_status}</p>
                        </div>
                      )}
                      
                      {/* Other criteria */}
                      {(protocol.eligibility as any)?.other_criteria && Array.isArray((protocol.eligibility as any).other_criteria) && (
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <h4 className="font-medium mb-2 text-gray-800">Other Requirements</h4>
                          <ul className="list-disc list-inside text-gray-700">
                            {(protocol.eligibility as any).other_criteria.map((criterion: string, idx: number) => (
                              <li key={idx}>{criterion}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Fallback to old structure */
                    Array.isArray(protocol.eligibility) ? (
                      <ul className="list-disc list-inside">
                        {protocol.eligibility.map((item: string, idx: number) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <>
                        <h4 className="font-medium mb-1">Inclusion Criteria</h4>
                        <ul className="list-disc list-inside mb-2">
                          {protocol.eligibility.inclusion_criteria?.map((item: string | { criterion: string }, idx: number) => (
                            <li key={idx}>{typeof item === 'string' ? item : item.criterion}</li>
                          ))}
                        </ul>
                        <h4 className="font-medium mb-1">Exclusion Criteria</h4>
                        <ul className="list-disc list-inside">
                          {protocol.eligibility.exclusion_criteria?.map((item: string | { criterion: string }, idx: number) => (
                            <li key={idx}>{typeof item === 'string' ? item : item.criterion}</li>
                          ))}
                        </ul>
                      </>
                    )
                  )}
                </div>
              )}
            </div>
          </TabsContent><TabsContent value="treatment" className="h-[70vh] overflow-y-auto px-1">
            <TreatmentTab protocol={protocol} />
          </TabsContent>          <TabsContent value="tests">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  Baseline Tests
                </h3>
                {tests?.baseline && tests.baseline.length > 0 ? (
                  <div className="space-y-3">
                    {tests.baseline.map((test: any, idx: number) => (
                      <div key={idx} className="bg-blue-50 p-4 rounded-lg border border-blue-200 shadow-sm">
                        <h4 className="font-medium text-blue-800 mb-2 text-lg">
                          {typeof test === 'object' ? (test.name || test.test || test.type || `Test ${idx + 1}`) : test}
                        </h4>
                        {typeof test === 'object' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            {test.timing && (
                              <div className="bg-white p-2 rounded border border-blue-100">
                                <span className="font-medium text-blue-700">Timing:</span> 
                                <span className="ml-1 text-gray-700">{test.timing}</span>
                              </div>
                            )}
                            {test.frequency && (
                              <div className="bg-white p-2 rounded border border-blue-100">
                                <span className="font-medium text-blue-700">Frequency:</span> 
                                <span className="ml-1 text-gray-700">{test.frequency}</span>
                              </div>
                            )}
                            {test.parameters && test.parameters.length > 0 && (
                              <div className="bg-white p-2 rounded border border-blue-100 md:col-span-2">
                                <span className="font-medium text-blue-700">Parameters:</span>
                                <div className="mt-1 flex flex-wrap gap-1">
                                  {test.parameters.map((param: string, pIdx: number) => (
                                    <span key={pIdx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                      {param}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {test.notes && (
                              <div className="bg-white p-2 rounded border border-blue-100 md:col-span-2">
                                <span className="font-medium text-blue-700">Notes:</span> 
                                <span className="ml-1 text-gray-700">{test.notes}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-2 flex items-center justify-center">
                      <span className="text-gray-400 text-xl">📋</span>
                    </div>
                    <p>No baseline tests specified.</p>
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  Monitoring Tests
                </h3>
                {tests?.monitoring && tests.monitoring.length > 0 ? (
                  <div className="space-y-3">
                    {tests.monitoring.map((test: any, idx: number) => (
                      <div key={idx} className="bg-green-50 p-4 rounded-lg border border-green-200 shadow-sm">
                        <h4 className="font-medium text-green-800 mb-2 text-lg">
                          {typeof test === 'object' ? (test.name || test.test || test.type || `Monitoring Test ${idx + 1}`) : test}
                        </h4>
                        {typeof test === 'object' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            {test.timing && (
                              <div className="bg-white p-2 rounded border border-green-100">
                                <span className="font-medium text-green-700">Timing:</span> 
                                <span className="ml-1 text-gray-700">{test.timing}</span>
                              </div>
                            )}
                            {test.frequency && (
                              <div className="bg-white p-2 rounded border border-green-100">
                                <span className="font-medium text-green-700">Frequency:</span> 
                                <span className="ml-1 text-gray-700">{test.frequency}</span>
                              </div>
                            )}
                            {test.cycle && (
                              <div className="bg-white p-2 rounded border border-green-100">
                                <span className="font-medium text-green-700">Cycle:</span> 
                                <span className="ml-1 text-gray-700">{test.cycle}</span>
                              </div>
                            )}
                            {test.day && (
                              <div className="bg-white p-2 rounded border border-green-100">
                                <span className="font-medium text-green-700">Day:</span> 
                                <span className="ml-1 text-gray-700">{test.day}</span>
                              </div>
                            )}
                            {test.parameters && test.parameters.length > 0 && (
                              <div className="bg-white p-2 rounded border border-green-100 md:col-span-2">
                                <span className="font-medium text-green-700">Parameters:</span>
                                <div className="mt-1 flex flex-wrap gap-1">
                                  {test.parameters.map((param: string, pIdx: number) => (
                                    <span key={pIdx} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                      {param}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {test.notes && (
                              <div className="bg-white p-2 rounded border border-green-100 md:col-span-2">
                                <span className="font-medium text-green-700">Notes:</span> 
                                <span className="ml-1 text-gray-700">{test.notes}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-2 flex items-center justify-center">
                      <span className="text-gray-400 text-xl">🔬</span>
                    </div>
                    <p>No monitoring tests specified.</p>
                  </div>
                )}
              </div>

              {/* Additional monitoring from protocol.monitoring field */}
              {protocol.monitoring && protocol.monitoring !== protocol.tests && (
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <div className="w-4 h-4 bg-purple-500 rounded"></div>
                    Additional Monitoring
                  </h3>
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    {typeof protocol.monitoring === 'string' ? (
                      <p className="text-gray-700 whitespace-pre-line">{protocol.monitoring}</p>
                    ) : (
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                        {JSON.stringify(protocol.monitoring, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              )}
            </div>
          </TabsContent><TabsContent value="doseModifications">
            <div className="space-y-6">              <div>
                <h3 className="font-semibold text-lg mb-2">Hematological Modifications</h3>
                {Array.isArray(doseModifications.hematological) && doseModifications.hematological.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {doseModifications.hematological?.map((item: string, idx: number) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No hematological modifications specified.</p>
                )}
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">Non-Hematological Modifications</h3>
                {Array.isArray(doseModifications.nonHematological) && doseModifications.nonHematological.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {doseModifications.nonHematological?.map((item: string, idx: number) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>                ) : (
                  <p className="text-muted-foreground">No non-hematological modifications specified.</p>
                )}
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">Renal Modifications</h3>
                {Array.isArray(doseModifications.renal) && doseModifications.renal.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {doseModifications.renal?.map((item: string, idx: number) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No renal modifications specified.</p>
                )}
              </div>
                <div>
                <h3 className="font-semibold text-lg mb-2">Hepatic Modifications</h3>
                {Array.isArray(doseModifications.hepatic) && doseModifications.hepatic.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {doseModifications.hepatic?.map((item: string, idx: number) => (
                      <li key={idx}>{item}</li>
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
              <CardContent className="space-y-4">
                {protocol.precautions && (
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
                        : JSON.stringify(protocol.precautions, null, 2)}
                    </div>
                  </div>
                )}
                
                {protocol.contraindications && (
                  <div>
                    <h4 className="font-semibold text-red-600 mb-2">Contraindications</h4>
                    <div className="bg-red-50 p-3 rounded border-l-4 border-red-400">
                      {typeof protocol.contraindications === 'string' 
                        ? protocol.contraindications 
                        : JSON.stringify(protocol.contraindications, null, 2)}
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
          </TabsContent>          <TabsContent value="support" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="w-5 h-5" />
                  Support Medications & Care
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Required Supportive Care */}
                {supportiveCare?.required && supportiveCare.required.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 text-blue-600">Required Supportive Care</h4>
                    <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                      <div className="space-y-2">
                        {supportiveCare.required.map((item: any, idx: number) => (
                          <div key={idx} className="bg-white p-2 rounded border border-blue-200">
                            {typeof item === 'object' ? (
                              <div>
                                <div className="font-medium">{item.name || item.drug || 'Medication'}</div>
                                {item.dose && <div className="text-sm text-gray-600">Dose: {item.dose}</div>}
                                {item.route && <div className="text-sm text-gray-600">Route: {item.route}</div>}
                                {item.frequency && <div className="text-sm text-gray-600">Frequency: {item.frequency}</div>}
                                {item.indication && <div className="text-sm text-gray-600">Indication: {item.indication}</div>}
                              </div>
                            ) : (
                              <div>{item}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Optional Supportive Care */}
                {supportiveCare?.optional && supportiveCare.optional.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 text-green-600">Optional Supportive Care</h4>
                    <div className="bg-green-50 p-3 rounded border-l-4 border-green-400">
                      <div className="space-y-2">
                        {supportiveCare.optional.map((item: any, idx: number) => (
                          <div key={idx} className="bg-white p-2 rounded border border-green-200">
                            {typeof item === 'object' ? (
                              <div>
                                <div className="font-medium">{item.name || item.drug || 'Medication'}</div>
                                {item.dose && <div className="text-sm text-gray-600">Dose: {item.dose}</div>}
                                {item.route && <div className="text-sm text-gray-600">Route: {item.route}</div>}
                                {item.frequency && <div className="text-sm text-gray-600">Frequency: {item.frequency}</div>}
                                {item.indication && <div className="text-sm text-gray-600">Indication: {item.indication}</div>}
                              </div>
                            ) : (
                              <div>{item}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Pre-medications (legacy support) */}
                {protocol.pre_medications && (
                  <div>
                    <h4 className="font-semibold mb-2 text-purple-600">Pre-medications</h4>
                    <div className="bg-purple-50 p-3 rounded border-l-4 border-purple-400">
                      {typeof protocol.pre_medications === 'string' 
                        ? protocol.pre_medications 
                        : Array.isArray(protocol.pre_medications)
                        ? protocol.pre_medications.length > 0 
                          ? protocol.pre_medications.map((med: any, idx: number) => (
                              <div key={idx} className="mb-2 last:mb-0 bg-white p-2 rounded border border-purple-200">
                                {typeof med === 'object' ? (
                                  <div>
                                    <div className="font-medium">{med.name || med.drug || 'Medication'}</div>
                                    {med.dose && <div className="text-sm text-gray-600">Dose: {med.dose}</div>}
                                    {med.route && <div className="text-sm text-gray-600">Route: {med.route}</div>}
                                    {med.timing && <div className="text-sm text-gray-600">Timing: {med.timing}</div>}
                                  </div>
                                ) : (
                                  <div>{med}</div>
                                )}
                              </div>
                            ))
                          : "No pre-medications specified"
                        : JSON.stringify(protocol.pre_medications, null, 2)}
                    </div>
                  </div>
                )}
                
                {/* Post-medications (legacy support) */}
                {protocol.post_medications && (
                  <div>
                    <h4 className="font-semibold mb-2 text-orange-600">Post-medications</h4>
                    <div className="bg-orange-50 p-3 rounded border-l-4 border-orange-400">
                      {typeof protocol.post_medications === 'string' 
                        ? protocol.post_medications 
                        : Array.isArray(protocol.post_medications)
                        ? protocol.post_medications.length > 0
                          ? protocol.post_medications.map((med: any, idx: number) => (
                              <div key={idx} className="mb-2 last:mb-0 bg-white p-2 rounded border border-orange-200">
                                {typeof med === 'object' ? (
                                  <div>
                                    <div className="font-medium">{med.name || med.drug || 'Medication'}</div>
                                    {med.dose && <div className="text-sm text-gray-600">Dose: {med.dose}</div>}
                                    {med.route && <div className="text-sm text-gray-600">Route: {med.route}</div>}
                                    {med.timing && <div className="text-sm text-gray-600">Timing: {med.timing}</div>}
                                  </div>
                                ) : (
                                  <div>{med}</div>
                                )}
                              </div>
                            ))
                          : "No post-medications specified"
                        : JSON.stringify(protocol.post_medications, null, 2)}
                    </div>
                  </div>
                )}

                {/* Monitoring Requirements */}
                {supportiveCare?.monitoring && supportiveCare.monitoring.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 text-amber-600">Monitoring Requirements</h4>
                    <div className="bg-amber-50 p-3 rounded border-l-4 border-amber-400">
                      <div className="space-y-1">
                        {supportiveCare.monitoring.map((item: string, idx: number) => (
                          <div key={idx} className="bg-white p-2 rounded border border-amber-200">
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {!supportiveCare?.required?.length && !supportiveCare?.optional?.length && !protocol.pre_medications && !protocol.post_medications && !supportiveCare?.monitoring?.length && (
                  <div className="text-center py-8 text-gray-500">
                    <Pill className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No support medication information available for this protocol.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>          <TabsContent value="emergency" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <Shield className="w-5 h-5" />
                  Emergency Protocols & Rescue Agents
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Emergency/Rescue Agents */}
                {protocol.rescue_agents && (
                  <div>
                    <h4 className="font-semibold mb-2 text-red-600">Emergency/Rescue Agents</h4>
                    <div className="bg-red-50 p-3 rounded border-l-4 border-red-400">
                      {typeof protocol.rescue_agents === 'string' 
                        ? protocol.rescue_agents 
                        : Array.isArray(protocol.rescue_agents)
                        ? protocol.rescue_agents.length > 0
                          ? (
                              <div className="space-y-3">
                                {protocol.rescue_agents.map((agent: any, idx: number) => (
                                  <div key={idx} className="bg-white p-3 rounded border border-red-200">
                                    {typeof agent === 'object' ? (
                                      <div>
                                        <div className="font-semibold text-red-800 mb-1">
                                          {agent.name || agent.drug || agent.agent || 'Emergency Agent'}
                                        </div>
                                        {agent.dose && (
                                          <div className="text-sm text-gray-600 mb-1">
                                            <span className="font-medium">Dose:</span> {agent.dose}
                                          </div>
                                        )}
                                        {agent.route && (
                                          <div className="text-sm text-gray-600 mb-1">
                                            <span className="font-medium">Route:</span> {agent.route}
                                          </div>
                                        )}
                                        {agent.indication && (
                                          <div className="text-sm text-gray-600 mb-1">
                                            <span className="font-medium">Indication:</span> {agent.indication}
                                          </div>
                                        )}
                                        {agent.timing && (
                                          <div className="text-sm text-gray-600 mb-1">
                                            <span className="font-medium">Timing:</span> {agent.timing}
                                          </div>
                                        )}
                                        {agent.notes && (
                                          <div className="text-sm text-gray-600">
                                            <span className="font-medium">Notes:</span> {agent.notes}
                                          </div>
                                        )}
                                      </div>
                                    ) : (
                                      <div className="text-gray-700">{agent}</div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )
                          : "No rescue agents specified"
                        : JSON.stringify(protocol.rescue_agents, null, 2)}
                    </div>
                  </div>
                )}

                {/* Emergency Action Thresholds */}
                {toxicityMonitoring && toxicityMonitoring.thresholds_for_action && Object.keys(toxicityMonitoring.thresholds_for_action).length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 text-orange-600">Emergency Action Thresholds</h4>
                    <div className="bg-orange-50 p-3 rounded border-l-4 border-orange-400">
                      <div className="space-y-2">
                        {Object.entries(toxicityMonitoring.thresholds_for_action).map(([condition, action], idx: number) => (
                          <div key={idx} className="bg-white p-3 rounded border border-orange-200">
                            <div className="font-medium text-orange-800 mb-1">{condition}</div>
                            <div className="text-gray-700 text-sm">{String(action)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}                {/* Emergency Contact Information */}
                {(protocol as any)?.emergency_contact && (
                  <div>
                    <h4 className="font-semibold mb-2 text-purple-600">Emergency Contact Information</h4>
                    <div className="bg-purple-50 p-3 rounded border-l-4 border-purple-400">
                      <div className="bg-white p-3 rounded border border-purple-200">
                        {typeof (protocol as any).emergency_contact === 'string' 
                          ? (protocol as any).emergency_contact
                          : typeof (protocol as any).emergency_contact === 'object'
                          ? (
                              <div className="space-y-1">
                                {(protocol as any).emergency_contact.name && (
                                  <div><span className="font-medium">Contact:</span> {(protocol as any).emergency_contact.name}</div>
                                )}
                                {(protocol as any).emergency_contact.phone && (
                                  <div><span className="font-medium">Phone:</span> {(protocol as any).emergency_contact.phone}</div>
                                )}
                                {(protocol as any).emergency_contact.hours && (
                                  <div><span className="font-medium">Hours:</span> {(protocol as any).emergency_contact.hours}</div>
                                )}
                              </div>
                            )
                          : JSON.stringify((protocol as any).emergency_contact, null, 2)}
                      </div>
                    </div>
                  </div>
                )}

                {!protocol.rescue_agents && (!toxicityMonitoring || !toxicityMonitoring.thresholds_for_action || Object.keys(toxicityMonitoring.thresholds_for_action).length === 0) && !(protocol as any)?.emergency_contact && (
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
          </TabsContent>          <TabsContent value="toxicity">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  Expected Toxicities
                </h3>
                {toxicityMonitoring?.expected_toxicities && toxicityMonitoring.expected_toxicities.length > 0 ? (
                  <div className="grid gap-2">
                    {toxicityMonitoring.expected_toxicities.map((toxicity: string, idx: number) => (
                      <div key={idx} className="bg-red-50 p-3 rounded-lg border border-red-200">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span className="text-gray-800">{toxicity}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-2 flex items-center justify-center">
                      <span className="text-gray-400 text-xl">⚠️</span>
                    </div>
                    <p>No expected toxicities specified.</p>
                  </div>
                )}
              </div>

              {toxicityMonitoring?.monitoring_parameters && (
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    Monitoring Parameters
                  </h3>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="whitespace-pre-line text-gray-700">{toxicityMonitoring.monitoring_parameters}</p>
                  </div>
                </div>
              )}

              {toxicityMonitoring?.frequency_details && (
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    Monitoring Frequency
                  </h3>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="whitespace-pre-line text-gray-700">{toxicityMonitoring.frequency_details}</p>
                  </div>
                </div>
              )}

              {toxicityMonitoring?.thresholds_for_action && Object.keys(toxicityMonitoring.thresholds_for_action).length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <div className="w-4 h-4 bg-orange-500 rounded"></div>
                    Action Thresholds
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(toxicityMonitoring.thresholds_for_action).map(([condition, action], idx: number) => (
                      <div key={idx} className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                        <div className="font-medium text-orange-800 mb-2">{condition}</div>
                        <div className="text-gray-700 bg-white p-2 rounded border border-orange-100">
                          {String(action)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}              {/* Additional toxicity information */}
              {(protocol as any)?.toxicity && (
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <div className="w-4 h-4 bg-purple-500 rounded"></div>
                    Additional Toxicity Information
                  </h3>
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    {typeof (protocol as any).toxicity === 'string' ? (
                      <p className="whitespace-pre-line text-gray-700">{(protocol as any).toxicity}</p>
                    ) : (
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                        {JSON.stringify((protocol as any).toxicity, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              )}

              {!toxicityMonitoring?.expected_toxicities?.length && 
               !toxicityMonitoring?.monitoring_parameters && 
               !toxicityMonitoring?.frequency_details && 
               (!toxicityMonitoring?.thresholds_for_action || Object.keys(toxicityMonitoring.thresholds_for_action).length === 0) &&
               !(protocol as any)?.toxicity && (
                <div className="text-center py-8 text-gray-500">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-gray-400 text-2xl">📊</span>
                  </div>
                  <p className="text-lg">No toxicity monitoring information available.</p>
                  <p className="text-sm text-gray-400 mt-1">Toxicity data will be displayed here when available.</p>
                </div>
              )}
            </div>
          </TabsContent>          <TabsContent value="interactions">
            <div className="space-y-6">
              {interactions?.drugs_to_avoid && interactions.drugs_to_avoid.length > 0 && (
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-red-800">
                    <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-content">
                      <span className="text-white text-xs font-bold mx-auto">⚠</span>
                    </div>
                    Drugs to Avoid
                  </h3>
                  <div className="space-y-2">
                    {interactions.drugs_to_avoid.map((drug: string, idx: number) => (
                      <div key={idx} className="bg-white p-3 rounded border border-red-100 shadow-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-red-500 text-sm">🚫</span>
                          <span className="font-medium text-red-700">{drug}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {interactions?.contraindications && interactions.contraindications.length > 0 && (
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-orange-800">
                    <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">!</span>
                    </div>
                    Contraindications
                  </h3>
                  <div className="space-y-2">
                    {interactions.contraindications.map((item: string, idx: number) => (
                      <div key={idx} className="bg-white p-3 rounded border border-orange-100 shadow-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-orange-500 text-sm">⛔</span>
                          <span className="font-medium text-orange-700">{item}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {interactions?.precautions_with_other_drugs && interactions.precautions_with_other_drugs.length > 0 && (
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-yellow-800">
                    <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">⚠</span>
                    </div>
                    Precautions with Other Drugs
                  </h3>
                  <div className="space-y-2">
                    {interactions.precautions_with_other_drugs.map((item: string, idx: number) => (
                      <div key={idx} className="bg-white p-3 rounded border border-yellow-100 shadow-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-yellow-500 text-sm">⚠️</span>
                          <span className="font-medium text-yellow-700">{item}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional drug interaction sections if available */}
              {(interactions as any)?.monitoring_requirements && (interactions as any).monitoring_requirements.length > 0 && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-blue-800">
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">👁</span>
                    </div>
                    Monitoring Requirements
                  </h3>
                  <div className="space-y-2">
                    {(interactions as any).monitoring_requirements.map((item: string, idx: number) => (
                      <div key={idx} className="bg-white p-3 rounded border border-blue-100 shadow-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-blue-500 text-sm">📊</span>
                          <span className="font-medium text-blue-700">{item}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty state when no interactions are specified */}
              {(!interactions?.drugs_to_avoid || interactions.drugs_to_avoid.length === 0) &&
               (!interactions?.contraindications || interactions.contraindications.length === 0) &&
               (!interactions?.precautions_with_other_drugs || interactions.precautions_with_other_drugs.length === 0) &&
               (!(interactions as any)?.monitoring_requirements || (interactions as any).monitoring_requirements.length === 0) && (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-gray-400 text-2xl">🔄</span>
                  </div>
                  <h3 className="font-medium text-gray-700 mb-2">No Drug Interactions Specified</h3>
                  <p className="text-sm">No known drug interactions, contraindications, or precautions have been documented for this protocol.</p>
                </div>
              )}
            </div></TabsContent>          <TabsContent value="info">
            <InfoTab
              lastReviewed={protocol.last_reviewed}
              version={protocol.version}
              status={protocol.status}
              createdBy={protocol.created_by}
              updatedBy={protocol.updated_by}
              createdAt={protocol.created_at}
              updatedAt={protocol.updated_at}
            />
            
            {/* Additional Protocol Statistics */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-600">
                  <div className="w-5 h-5 bg-emerald-500 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">📊</span>
                  </div>
                  Protocol Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Drug Count */}
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {treatment?.drugs?.length || 0}
                    </div>
                    <div className="text-sm text-blue-800 font-medium">Drugs</div>
                    <div className="text-xs text-gray-600 mt-1">in treatment plan</div>
                  </div>
                  
                  {/* Tests Count */}
                  <div className="bg-green-50 p-3 rounded-lg border border-green-200 text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {(tests?.baseline?.length || 0) + (tests?.monitoring?.length || 0)}
                    </div>
                    <div className="text-sm text-green-800 font-medium">Tests</div>
                    <div className="text-xs text-gray-600 mt-1">baseline + monitoring</div>
                  </div>
                  
                  {/* Toxicities Count */}
                  <div className="bg-red-50 p-3 rounded-lg border border-red-200 text-center">
                    <div className="text-2xl font-bold text-red-600 mb-1">
                      {toxicityMonitoring?.expected_toxicities?.length || 0}
                    </div>
                    <div className="text-sm text-red-800 font-medium">Toxicities</div>
                    <div className="text-xs text-gray-600 mt-1">expected side effects</div>
                  </div>
                </div>
                
                {/* Protocol Completeness Indicator */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-3">Protocol Completeness</h4>
                  <div className="space-y-2">
                    {[
                      { label: 'Treatment Plan', hasData: treatment?.drugs?.length > 0, color: 'blue' },
                      { label: 'Eligibility Criteria', hasData: !!protocol.eligibility, color: 'green' },
                      { label: 'Baseline Tests', hasData: tests?.baseline?.length > 0, color: 'purple' },
                      { label: 'Monitoring Tests', hasData: tests?.monitoring?.length > 0, color: 'indigo' },
                      { label: 'Dose Modifications', hasData: Object.values(doseModifications).some(arr => arr.length > 0), color: 'amber' },
                      { label: 'Safety Information', hasData: !!(protocol.precautions || protocol.contraindications), color: 'red' },
                      { label: 'Supportive Care', hasData: supportiveCare?.required?.length > 0 || supportiveCare?.optional?.length > 0, color: 'teal' },
                      { label: 'Emergency Protocols', hasData: !!protocol.rescue_agents, color: 'orange' }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{item.label}</span>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${item.hasData ? `bg-${item.color}-500` : 'bg-gray-300'}`}></div>
                          <span className={`text-xs font-medium ${item.hasData ? `text-${item.color}-600` : 'text-gray-500'}`}>
                            {item.hasData ? 'Complete' : 'Incomplete'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                  {/* Quick Protocol Facts */}
                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                  <h4 className="font-semibold text-indigo-800 mb-3">Quick Facts</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Protocol Code:</span>
                      <span className="font-medium text-indigo-700">{protocol.code || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Pre-medications:</span>
                      <span className="font-medium text-indigo-700">
                        {(protocol.pre_medications && (Array.isArray(protocol.pre_medications) ? protocol.pre_medications.length > 0 : true)) ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Rescue Agents:</span>
                      <span className="font-medium text-indigo-700">
                        {protocol.rescue_agents ? 'Available' : 'None specified'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Drug Interactions:</span>
                      <span className="font-medium text-indigo-700">
                        {interactions?.drugs_to_avoid?.length > 0 ? `${interactions.drugs_to_avoid.length} drugs to avoid` : 'None specified'}
                      </span>
                    </div>                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ProtocolDetailsDialog;
