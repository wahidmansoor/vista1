import React from "react";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion } from "@/components/ui/accordion";
import DrugCard from "./DrugCard";
import { X } from "lucide-react";

interface ProtocolDetailsDrawerProps {
  protocol: any;
  open: boolean;
  onClose: () => void;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="font-semibold text-lg text-indigo-800 dark:text-indigo-200 mb-2">{title}</h3>
    <div>{children}</div>
  </div>
);

const FieldList = ({ items, title }: { items: any[]; title?: string }) => {
  const renderListItem = (item: any): React.ReactNode => {
    if (typeof item === 'string') return item;
    
    if (typeof item === 'object' && item !== null) {
      // Dose reductions and modifications
      if (item.level || item.criteria || item.drug_a_reduction || item.drug_b_reduction) {
        return (
          <div className="space-y-2">
            {item.level && (
              <div className="font-medium text-indigo-700 dark:text-indigo-300">
                Level {item.level}
              </div>
            )}
            {item.criteria && (
              <div className="text-gray-700 dark:text-gray-300">
                {item.level ? <strong className="mr-2">Criteria:</strong> : ''}
                {item.criteria}
              </div>
            )}
            {(item.drug_a_reduction || item.drug_b_reduction) && (
              <div className="ml-4 space-y-1 mt-1 border-l-2 border-indigo-100 dark:border-indigo-800 pl-3">
                {item.drug_a_reduction && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Drug A:</span> {item.drug_a_reduction}
                  </div>
                )}
                {item.drug_b_reduction && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Drug B:</span> {item.drug_b_reduction}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      }

      // Pre/Post medications and rescue agents
      if (item.name && (item.dose || item.route || item.timing)) {
        return (
          <div className="space-y-1">
            <div className="font-medium text-gray-800 dark:text-gray-200">
              {item.name}
              {item.dose && <span className="ml-1">— {item.dose}</span>}
              {item.route && <span className="text-gray-600 dark:text-gray-400"> ({item.route})</span>}
            </div>
            {(item.timing || item.notes) && (
              <div className="ml-4 space-y-1 border-l-2 border-indigo-100 dark:border-indigo-800 pl-3">
                {item.timing && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Timing:</span> {item.timing}
                  </div>
                )}
                {item.notes && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Notes:</span> {item.notes}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      }

      // Monitoring parameters and supportive care
      if (item.test || item.parameter || item.frequency) {
        return (
          <div className="space-y-1">
            <div className="font-medium text-gray-800 dark:text-gray-200">
              {item.test || item.parameter}
              {item.frequency && (
                <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
                  ({item.frequency})
                </span>
              )}
            </div>
            {(item.threshold || item.details || item.target) && (
              <div className="ml-4 space-y-1 border-l-2 border-indigo-100 dark:border-indigo-800 pl-3">
                {item.threshold && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Threshold:</span> {item.threshold}
                  </div>
                )}
                {item.target && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Target:</span> {item.target}
                  </div>
                )}
                {item.details && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {item.details}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      }

      // Toxicity and conditions management
      if (item.condition || item.toxicity || item.guideline) {
        return (
          <div className="space-y-1">
            <div className="font-medium text-gray-800 dark:text-gray-200">
              {item.condition || item.toxicity || item.guideline}
              {item.severity && (
                <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
                  ({item.severity})
                </span>
              )}
              {item.grade && (
                <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
                  (Grade {item.grade})
                </span>
              )}
            </div>
            {(item.management || item.details) && (
              <div className="ml-4 space-y-1 border-l-2 border-indigo-100 dark:border-indigo-800 pl-3">
                {item.management && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Management:</span> {item.management}
                  </div>
                )}
                {item.details && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {item.details}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      }

      // Fallback for unknown object structures - format nicely
      const entries = Object.entries(item).filter(([_, v]) => v !== null && v !== undefined);
      if (entries.length > 0) {
        return (
          <div className="space-y-1 text-sm">
            {entries.map(([key, value], idx) => (
              <div key={idx} className="text-gray-700 dark:text-gray-300">
                <span className="font-medium capitalize">{key.replace(/_/g, ' ')}:</span>{' '}
                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
              </div>
            ))}
          </div>
        );
      }
    }

    return String(item);
  };

  return (
    <div className="space-y-3">
      {title && (
        <h4 className="font-medium text-indigo-700 dark:text-indigo-300 mb-2">
          {title}
        </h4>
      )}
      {Array.isArray(items) && items.length > 0 ? (
        <ul className="space-y-3">
          {items.map((item, i) => (
            <li 
              key={i} 
              className="relative pl-6 before:absolute before:left-0 before:top-[0.6em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-indigo-300 dark:before:bg-indigo-700"
            >
              {renderListItem(item)}
            </li>
          ))}
        </ul>
      ) : (
        <div className="italic text-gray-400">None listed</div>
      )}
    </div>
  );
};

const ProtocolDetailsDrawer: React.FC<ProtocolDetailsDrawerProps> = ({ protocol, open, onClose }) => {
  if (!open || !protocol) return null;

  const renderField = (value: any): React.ReactNode => {
    if (!value) return null;

    if (Array.isArray(value)) {
      return <FieldList items={value} />;
    }

    if (typeof value === 'object') {
      return (
        <div className="space-y-4">
          {Object.entries(value).map(([key, val]) => (
            <div key={key} className="space-y-2">
              <h4 className="font-medium text-indigo-700 dark:text-indigo-300 capitalize">
                {key.replace(/_/g, ' ')}
              </h4>
              <div>{renderField(val)}</div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
        {String(value)}
      </p>
    );
  };
  
  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed top-0 right-0 h-full w-full max-w-xl z-50 bg-white dark:bg-gray-900 shadow-2xl border-l border-gray-200 dark:border-gray-800 flex flex-col"
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
        <div>
          <span className="text-xl font-bold text-indigo-900 dark:text-indigo-100">{protocol.code}</span>
          {protocol.version && <span className="ml-2 text-xs text-gray-500">v{protocol.version}</span>}
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}><X className="w-5 h-5" /></Button>
      </div>
      
      <ScrollArea className="flex-1 p-6 overflow-y-auto">
        <Section title="Overview">
          <div className="flex flex-wrap gap-2 mb-2">
            <Badge variant="outline">{protocol.tumour_group}</Badge>
            {protocol.treatment_intent && <Badge variant="secondary">{protocol.treatment_intent}</Badge>}
            {protocol.tags && protocol.tags.map((tag: string) => <Badge key={tag}>{tag}</Badge>)}
          </div>
          {protocol.summary && <div className="mb-2 text-gray-800 dark:text-gray-200 whitespace-pre-line">{protocol.summary}</div>}
          {protocol.clinical_scenario && <div className="mb-2 text-gray-700 dark:text-gray-300"><b>Scenario:</b> {protocol.clinical_scenario}</div>}
          {protocol.ai_notes && (
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-purple-900 mb-4">AI Recommendations</h4>
              {protocol.ai_notes.recommendations && (
                <Accordion type="single" title="Recommendations" collapsible>
                  {protocol.ai_notes.recommendations}
                </Accordion>
              )}
              {protocol.ai_notes.warnings && (
                <Accordion type="single" title="Warnings" collapsible>
                  {protocol.ai_notes.warnings}
                </Accordion>
              )}
              {protocol.ai_notes.considerations && (
                <Accordion type="single" title="Special Considerations" collapsible>
                  {protocol.ai_notes.considerations}
                </Accordion>
              )}
            </div>
          )}
        </Section>

        <Section title="Eligibility">
          {Array.isArray(protocol.eligibility) ? (
            <FieldList items={protocol.eligibility} />
          ) : protocol.eligibility ? (
            <div className="space-y-4">
              {protocol.eligibility.inclusion_criteria && (
                <FieldList items={protocol.eligibility.inclusion_criteria} title="Inclusion Criteria" />
              )}
              {protocol.eligibility.exclusion_criteria && (
                <FieldList items={protocol.eligibility.exclusion_criteria} title="Exclusion Criteria" />
              )}
            </div>
          ) : (
            <div className="italic text-gray-400">No eligibility criteria listed</div>
          )}
        </Section>

        <Section title="Drugs">
          {protocol.treatment?.drugs?.length > 0 ? protocol.treatment.drugs.map((drug: any, i: number) => <DrugCard key={i} drug={drug} />) : <div className="italic text-gray-400">No drugs listed</div>}
        </Section>

        <Section title="Precautions">
          <FieldList items={protocol.precautions || []} />
        </Section>

        <Section title="Toxicity Monitoring">
          {Array.isArray(protocol.toxicity_monitoring) ? (
            <FieldList items={protocol.toxicity_monitoring} />
          ) : protocol.toxicity_monitoring ? (
            <div className="space-y-4">
              {protocol.toxicity_monitoring.expected_toxicities && (
                <FieldList items={protocol.toxicity_monitoring.expected_toxicities} title="Expected Toxicities" />
              )}
              {protocol.toxicity_monitoring.monitoring_parameters && (
                <div className="mb-4">
                  <h4 className="font-medium text-indigo-700 dark:text-indigo-300 mb-2">Monitoring Parameters</h4>
                  <p className="text-gray-700 dark:text-gray-300">{protocol.toxicity_monitoring.monitoring_parameters}</p>
                </div>
              )}
              {protocol.toxicity_monitoring.frequency_details && (
                <div className="mb-4">
                  <h4 className="font-medium text-indigo-700 dark:text-indigo-300 mb-2">Frequency Details</h4>
                  <p className="text-gray-700 dark:text-gray-300">{protocol.toxicity_monitoring.frequency_details}</p>
                </div>
              )}
              {protocol.toxicity_monitoring.thresholds_for_action && (
                <div className="mb-4">
                  <h4 className="font-medium text-indigo-700 dark:text-indigo-300 mb-2">Thresholds for Action</h4>
                  <dl className="grid grid-cols-3 gap-2">
                    {Object.entries(protocol.toxicity_monitoring.thresholds_for_action).map(([key, value], index) => (
                      <div key={index} className="contents">
                        <dt className="col-span-1 font-medium text-gray-600 dark:text-gray-400">{key}</dt>
                        <dd className="col-span-2 text-gray-700 dark:text-gray-300">{value as string}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </div>
          ) : (
            <div className="italic text-gray-400">No toxicity monitoring information listed</div>
          )}
        </Section>

        <Section title="Supportive Care">
          {Array.isArray(protocol.supportive_care) ? (
            <FieldList items={protocol.supportive_care} />
          ) : protocol.supportive_care ? (
            <div className="space-y-4">
              {protocol.supportive_care.required && (
                <FieldList items={protocol.supportive_care.required} title="Required" />
              )}
              {protocol.supportive_care.optional && (
                <FieldList items={protocol.supportive_care.optional} title="Optional" />
              )}
              {protocol.supportive_care.monitoring && (
                <FieldList items={protocol.supportive_care.monitoring} title="Monitoring" />
              )}
            </div>
          ) : (
            <div className="italic text-gray-400">No supportive care information listed</div>
          )}
        </Section>

        <Section title="Rescue Agents">
          <FieldList items={protocol.rescue_agents || []} />
        </Section>

        <Section title="Pre-Medications">
          <FieldList items={protocol.pre_medications || []} />
        </Section>

        <Section title="Post-Medications">
          <FieldList items={protocol.post_medications || []} />
        </Section>

        <Section title="Interactions">
          {Array.isArray(protocol.interactions) ? (
            <FieldList items={protocol.interactions} />
          ) : protocol.interactions ? (
            <div className="space-y-4">
              {protocol.interactions.drugs_to_avoid && (
                <FieldList items={protocol.interactions.drugs_to_avoid} title="Drugs to Avoid" />
              )}
              {protocol.interactions.contraindications && (
                <FieldList items={protocol.interactions.contraindications} title="Contraindications" />
              )}
              {protocol.interactions.precautions_with_other_drugs && (
                <FieldList items={protocol.interactions.precautions_with_other_drugs} title="Precautions with Other Drugs" />
              )}
            </div>
          ) : (
            <div className="italic text-gray-400">No interaction information listed</div>
          )}
        </Section>

        <Section title="Administration Notes">
          <FieldList items={protocol.administration_notes || []} />
        </Section>

        <Section title="Cycle Info">
          <FieldList items={protocol.cycle_info || []} />
        </Section>

        <Section title="Dose Reductions">
          <FieldList items={protocol.dose_reductions || []} />
        </Section>

        <Section title="Monitoring">
          <FieldList items={protocol.monitoring || []} />
        </Section>

        <Section title="Comments">
          {typeof protocol.comments === 'string' ? (
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{protocol.comments}</p>
          ) : Array.isArray(protocol.comments) ? (
            <FieldList items={protocol.comments} />
          ) : (
            <div className="italic text-gray-400">No comments available</div>
          )}
        </Section>

        <Section title="Metadata">
          <div className="text-xs text-gray-500 space-y-1">
            {protocol.version && <div>Version: {protocol.version}</div>}
            {protocol.created_by && <div>Created by: {protocol.created_by}</div>}
            {protocol.updated_by && <div>Updated by: {protocol.updated_by}</div>}
            {protocol.updated_at && <div>Updated: {protocol.updated_at}</div>}
            {protocol.last_reviewed && <div>Last reviewed: {protocol.last_reviewed}</div>}
          </div>
        </Section>
      </ScrollArea>
    </motion.div>
  );
};

export default ProtocolDetailsDrawer;
