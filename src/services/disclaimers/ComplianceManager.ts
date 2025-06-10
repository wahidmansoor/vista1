import { ComplianceRecord, Jurisdiction } from "./types";
import { MedicalAuditLogger, LogCategory } from "../utils/MedicalAuditLogger";

export class ComplianceManager {
  private readonly auditLogger: MedicalAuditLogger;
  private complianceRecords: Map<string, ComplianceRecord>;

  constructor(auditLogger: MedicalAuditLogger) {
    this.auditLogger = auditLogger;
    this.complianceRecords = new Map();
  }

  async updateComplianceRecord(
    disclaimerId: string,
    record: Omit<ComplianceRecord, "lastReviewDate" | "nextReviewDate">
  ): Promise<void> {
    try {
      const now = new Date();
      const nextReview = new Date();
      nextReview.setMonth(nextReview.getMonth() + 3); // Review every 3 months

      const complianceRecord: ComplianceRecord = {
        ...record,
        disclaimerId,
        lastReviewDate: now,
        nextReviewDate: nextReview
      };

      this.complianceRecords.set(disclaimerId, complianceRecord);

      await this.auditLogger.logAiInteraction(
        "COMPLIANCE_SYSTEM",
        "Update Compliance Record",
        { prompt: 0, completion: 0, total: 0 },
        0,
        { disclaimerId, record: complianceRecord }
      );
    } catch (error) {
      await this.auditLogger.logError(
        error as Error,
        LogCategory.COMPLIANCE,
        { disclaimerId, record }
      );
      throw error;
    }
  }

  async getComplianceRecord(disclaimerId: string): Promise<ComplianceRecord | null> {
    const record = this.complianceRecords.get(disclaimerId);
    
    if (!record) {
      await this.auditLogger.logAiInteraction(
        "COMPLIANCE_SYSTEM",
        "Compliance Record Not Found",
        { prompt: 0, completion: 0, total: 0 },
        0,
        { disclaimerId }
      );
      return null;
    }

    return record;
  }

  async isCompliant(disclaimerId: string, jurisdictions: Jurisdiction[]): Promise<boolean> {
    const record = await this.getComplianceRecord(disclaimerId);
    
    if (!record) {
      return false;
    }

    const now = new Date();
    if (now > record.nextReviewDate) {
      await this.auditLogger.logAiInteraction(
        "COMPLIANCE_SYSTEM",
        "Compliance Review Overdue",
        { prompt: 0, completion: 0, total: 0 },
        0,
        { disclaimerId, lastReview: record.lastReviewDate }
      );
      return false;
    }

    const hasAllJurisdictions = jurisdictions.every(j => 
      record.jurisdiction.includes(j)
    );

    if (!hasAllJurisdictions) {
      await this.auditLogger.logAiInteraction(
        "COMPLIANCE_SYSTEM",
        "Missing Jurisdiction Coverage",
        { prompt: 0, completion: 0, total: 0 },
        0,
        { 
          disclaimerId,
          requested: jurisdictions,
          available: record.jurisdiction
        }
      );
      return false;
    }

    return true;
  }

  async generateComplianceReport(startDate: Date, endDate: Date): Promise<{
    totalRecords: number;
    compliantRecords: number;
    overdueReviews: number;
    jurisdictionCoverage: Record<Jurisdiction, number>;
  }> {
    const report = {
      totalRecords: 0,
      compliantRecords: 0,
      overdueReviews: 0,
      jurisdictionCoverage: {
        US: 0,
        EU: 0,
        UK: 0,
        Global: 0
      } as Record<Jurisdiction, number>
    };

    const now = new Date();
    
    for (const record of this.complianceRecords.values()) {
      if (record.lastReviewDate >= startDate && record.lastReviewDate <= endDate) {
        report.totalRecords++;
        
        if (now <= record.nextReviewDate) {
          report.compliantRecords++;
        } else {
          report.overdueReviews++;
        }

        record.jurisdiction.forEach(j => {
          report.jurisdictionCoverage[j]++;
        });
      }
    }

    await this.auditLogger.logAiInteraction(
      "COMPLIANCE_SYSTEM",
      "Generate Compliance Report",
      { prompt: 0, completion: 0, total: 0 },
      0,
      { 
        dateRange: { startDate, endDate },
        report
      }
    );

    return report;
  }
}
