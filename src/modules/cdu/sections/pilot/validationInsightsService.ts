import { ValidationEntry, validationLogService } from './validationLogService';

export interface CaseSummary {
  caseId: string;
  caseTitle: string;
  totalValidations: number;
  latestCorrectness: ValidationEntry['correctness'];
  hasSafetyConcern: boolean;
}

export interface ValidationInsights {
  totalEntries: number;
  correctnessCounts: {
    correct: number;
    partially_correct: number;
    incorrect: number;
  };
  issueCounts: {
    missingOptions: number;
    incorrectEligibility: number;
    unclearOutput: number;
    unsafeWording: number;
  };
  caseSummaries: CaseSummary[];
  safetySignals: ValidationEntry[];
}

export const validationInsightsService = {
  getInsights: (): ValidationInsights => {
    const logs = validationLogService.getLogs();
    
    const insights: ValidationInsights = {
      totalEntries: logs.length,
      correctnessCounts: { correct: 0, partially_correct: 0, incorrect: 0 },
      issueCounts: { missingOptions: 0, incorrectEligibility: 0, unclearOutput: 0, unsafeWording: 0 },
      caseSummaries: [],
      safetySignals: []
    };

    const caseMap = new Map<string, ValidationEntry[]>();

    logs.forEach(log => {
      // Aggregate correctness
      insights.correctnessCounts[log.correctness]++;

      // Aggregate issues
      if (log.issues.missingOptions) insights.issueCounts.missingOptions++;
      if (log.issues.incorrectEligibility) insights.issueCounts.incorrectEligibility++;
      if (log.issues.unclearOutput) insights.issueCounts.unclearOutput++;
      if (log.issues.unsafeWording) {
        insights.issueCounts.unsafeWording++;
        insights.safetySignals.push(log);
      } else if (log.correctness === 'incorrect') {
        insights.safetySignals.push(log);
      }

      // Group by case
      const caseLogs = caseMap.get(log.caseId) || [];
      caseLogs.push(log);
      caseMap.set(log.caseId, caseLogs);
    });

    // Create case summaries
    caseMap.forEach((caseLogs, caseId) => {
      const sortedLogs = [...caseLogs].sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      
      insights.caseSummaries.push({
        caseId,
        caseTitle: sortedLogs[0].caseTitle,
        totalValidations: caseLogs.length,
        latestCorrectness: sortedLogs[0].correctness,
        hasSafetyConcern: caseLogs.some(l => l.issues.unsafeWording || l.correctness === 'incorrect')
      });
    });

    return insights;
  }
};
