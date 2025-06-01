import { z } from 'zod';

// Basic schemas for reusable structures
export const supportiveCareItemSchema = z.object({
  name: z.string().optional(),
  dose: z.string().optional(),
  timing: z.string().optional(),
  route: z.string().optional(),
  purpose: z.string().optional()
});

export const drugSchema = z.object({
  name: z.string(),
  dose: z.string().optional(),
  timing: z.string().optional(),
  administration: z.string().optional(),
  route: z.string().optional(),
  alternative_switches: z.array(z.string()).optional(),
  supportiveCare: z.array(z.union([z.string(), supportiveCareItemSchema])).optional(),
  contraindications: z.array(z.string()).optional(),
  special_notes: z.array(z.string()).optional(),
  drug_class: z.string().optional()
});

export const protocolNoteSchema = z.object({
  note: z.string()
});

export const doseModificationSchema = z.object({
  hematological: z.array(z.string()),
  nonHematological: z.array(z.string()),
  renal: z.array(z.string()),
  hepatic: z.array(z.string())
});

export const toxicityMonitoringSchema = z.object({
  parameters: z.array(z.string()).optional(),
  frequency: z.string().optional(),
  expected_toxicities: z.array(z.string()).optional(),
  thresholds: z.record(z.string()).optional(),
  monitoring_parameters: z.string().optional(),
  frequency_details: z.string().optional(),
  thresholds_for_action: z.record(z.string()).optional()
});

export const medicationsSchema = z.object({
  required: z.array(drugSchema),
  optional: z.array(drugSchema)
});

export const rescueAgentSchema = z.object({
  name: z.string(),
  indication: z.string(),
  dosing: z.string()
});

// Main protocol schema
export const protocolSchema = z.object({
  id: z.string(),
  code: z.string(),
  tumour_group: z.string(),
  treatment_intent: z.string().optional(),
  eligibility: z.object({
    inclusion_criteria: z.array(z.object({ criterion: z.string() })).optional(),
    exclusion_criteria: z.array(z.object({ criterion: z.string() })).optional()
  }).optional(),
  treatment: z.object({
    drugs: z.array(drugSchema),
    protocol: z.string().optional()
  }),
  tests: z.object({
    baseline: z.array(z.object({
      name: z.string(),
      timing: z.string().optional(),
      parameters: z.array(z.string()).optional(),
      frequency: z.string().optional()
    })).optional(),
    monitoring: z.array(z.object({
      name: z.string(),
      timing: z.string().optional(),
      parameters: z.array(z.string()).optional(),
      frequency: z.string().optional()
    })).optional()
  }).optional(),
  dose_modifications: doseModificationSchema.optional(),
  precautions: z.array(protocolNoteSchema),
  contraindications: z.array(z.string()).optional(),
  rescue_agents: z.array(rescueAgentSchema).optional(),
  pre_medications: medicationsSchema.optional(),
  post_medications: medicationsSchema.optional(),
  toxicity_monitoring: toxicityMonitoringSchema.optional()
});

// Validation helper functions
export const validateProtocol = (data: unknown) => {
  return protocolSchema.safeParse(data);
};

export const validateDrug = (data: unknown) => {
  return drugSchema.safeParse(data);
};

export const validateMedications = (data: unknown) => {
  return medicationsSchema.safeParse(data);
};

export const validateRescueAgents = (data: unknown) => {
  return z.array(rescueAgentSchema).safeParse(data);
};

export const validatePrecautions = (data: unknown) => {
  return z.array(protocolNoteSchema).safeParse(data);
};
