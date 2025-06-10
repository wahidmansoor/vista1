import { z } from "zod";

export type Jurisdiction = "US" | "EU" | "UK" | "Global";
export type RiskLevel = "Low" | "Medium" | "High" | "Critical";
export type MedicalSpecialty = "Oncology" | "Radiation" | "Palliative" | "Emergency";
export type Language = "en" | "es" | "fr" | "ar";

export const DisclaimerConfigSchema = z.object({
  id: z.string(),
  version: z.string(),
  lastUpdated: z.date(),
  jurisdiction: z.array(z.enum(["US", "EU", "UK", "Global"])),
  applicableRegulations: z.array(z.string()),
  riskLevel: z.enum(["Low", "Medium", "High", "Critical"]),
  specialty: z.enum(["Oncology", "Radiation", "Palliative", "Emergency"]),
  languages: z.array(z.enum(["en", "es", "fr", "ar"])),
  requiresAcknowledgment: z.boolean(),
  auditRequired: z.boolean(),
});

export type DisclaimerConfig = z.infer<typeof DisclaimerConfigSchema>;

export interface DisclaimerContent {
  templateKey: string;
  content: Record<Language, string>;
  placeholders?: Record<string, string>;
}

export interface DisclaimerAcknowledgment {
  userId: string;
  disclaimerId: string;
  timestamp: Date;
  version: string;
  acknowledged: boolean;
}

export interface ComplianceRecord {
  disclaimerId: string;
  jurisdiction: Jurisdiction[];
  regulations: string[];
  lastReviewDate: Date;
  nextReviewDate: Date;
  reviewedBy: string;
}

export interface EmergencyDisclaimer extends DisclaimerContent {
  severity: "Urgent" | "Critical" | "LifeThreatening";
  responseTimeRequired: number; // in minutes
}
