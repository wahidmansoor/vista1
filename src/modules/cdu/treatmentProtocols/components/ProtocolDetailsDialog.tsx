import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Protocol, Test } from "@/types/protocol";
import MonitoringTab from "../MonitoringTab";
import TreatmentTab from "../TreatmentTab";
import TestsSectionTab from "../TestsSectionTab";
import DoseModificationsTab from "../DoseModificationsTab";
import SupportiveCareTab from "../SupportiveCareTab";

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

const ProtocolDetailsDialog: React.FC<ProtocolDetailsDialogProps> = ({ protocol, open, onOpenChange }) => {
  // Set up data with fallbacks for each section
  const monitoring = React.useMemo(() => protocol.monitoring || { baseline: [], ongoing: [] }, [protocol.monitoring]);
  const treatment = React.useMemo(() => protocol.treatment || { drugs: [] }, [protocol.treatment]);
  const tests = React.useMemo(() => {
    if (Array.isArray(protocol.tests)) {
      return { baseline: [], monitoring: [] };
    }
    return protocol.tests || { baseline: [], monitoring: [] };
  }, [protocol.tests]);
  
  const doseModifications = React.useMemo(() => 
    protocol.dose_modifications || {
      hematological: [],
      nonHematological: [],
      renal: [],
      hepatic: []
    }, 
    [protocol.dose_modifications]
  );

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
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-4 flex flex-wrap">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="treatment">Treatment</TabsTrigger>
            <TabsTrigger value="tests">Tests</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            <TabsTrigger value="doseModifications">Dose Modifications</TabsTrigger>
            <TabsTrigger value="toxicity">Toxicity</TabsTrigger>
            <TabsTrigger value="interactions">Interactions</TabsTrigger>
            <TabsTrigger value="supportiveCare">Supportive Care</TabsTrigger>
            <TabsTrigger value="info">Info</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <div className="space-y-6">
              <OverviewSection overview={protocol.summary} />
              {protocol.eligibility && (
                <div className="mt-4">
                  <h3 className="font-semibold text-lg mb-2">Eligibility Criteria</h3>
                  {Array.isArray(protocol.eligibility) ? (
                    <ul className="list-disc list-inside">
                      {protocol.eligibility.map((item: string, idx: number) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <>
                      <h4 className="font-medium mb-1">Inclusion Criteria</h4>
                      <ul className="list-disc list-inside mb-2">
                        {protocol.eligibility.inclusion_criteria?.map((item: string, idx: number) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                      <h4 className="font-medium mb-1">Exclusion Criteria</h4>
                      <ul className="list-disc list-inside">
                        {protocol.eligibility.exclusion_criteria?.map((item: string, idx: number) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="treatment">
            <TreatmentTab treatment={treatment} />
          </TabsContent>
          <TabsContent value="tests">
            <TestsSectionTab tests={tests} />
          </TabsContent>
          <TabsContent value="monitoring">
            <MonitoringTab monitoring={monitoring} />
          </TabsContent>
          <TabsContent value="doseModifications">
            <DoseModificationsTab doseModifications={doseModifications} />
          </TabsContent>
          <TabsContent value="toxicity">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Expected Toxicities</h3>
                {toxicityMonitoring.expected_toxicities?.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {toxicityMonitoring.expected_toxicities.map((toxicity: string, idx: number) => (
                      <li key={idx}>{toxicity}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No expected toxicities specified.</p>
                )}
              </div>
              
              {toxicityMonitoring.monitoring_parameters && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">Monitoring Parameters</h3>
                  <p className="whitespace-pre-line">{toxicityMonitoring.monitoring_parameters}</p>
                </div>
              )}

              {toxicityMonitoring.frequency_details && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">Monitoring Frequency</h3>
                  <p className="whitespace-pre-line">{toxicityMonitoring.frequency_details}</p>
                </div>
              )}

              {Object.keys(toxicityMonitoring.thresholds_for_action || {}).length > 0 && (
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
          </TabsContent>
          <TabsContent value="interactions">
            <div className="space-y-6">
              {interactions.drugs_to_avoid?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">Drugs to Avoid</h3>
                  <ul className="list-disc list-inside">
                    {interactions.drugs_to_avoid.map((drug: string, idx: number) => (
                      <li key={idx}>{drug}</li>
                    ))}
                  </ul>
                </div>
              )}

              {interactions.contraindications?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">Contraindications</h3>
                  <ul className="list-disc list-inside">
                    {interactions.contraindications.map((item: string, idx: number) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {interactions.precautions_with_other_drugs?.length > 0 && (
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
          </TabsContent>
          <TabsContent value="supportiveCare">
            <SupportiveCareTab supportiveCare={supportiveCare} />
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
