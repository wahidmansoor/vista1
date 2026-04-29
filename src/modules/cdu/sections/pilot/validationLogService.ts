export type ValidationEntry = {
  caseId: string;
  caseTitle: string;
  timestamp: string;
  snapshotVersion: number;
  correctness: "correct" | "partially_correct" | "incorrect";
  issues: {
    missingOptions?: string[];
    incorrectEligibility?: string[];
    unclearOutput?: boolean;
    unsafeWording?: boolean;
  };
  notes: string;
};

const STORAGE_KEY = 'vista_validation_log_v1';

export const validationLogService = {
  saveValidation: (entry: ValidationEntry): void => {
    try {
      const logs = validationLogService.getLogs();
      logs.push(entry);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
    } catch (error) {
      console.error('Failed to save validation log:', error);
    }
  },

  getLogs: (): ValidationEntry[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load validation logs:', error);
      return [];
    }
  },

  getLogsByCase: (caseId: string): ValidationEntry[] => {
    return validationLogService.getLogs().filter(log => log.caseId === caseId);
  },

  clearLogs: (): void => {
    localStorage.removeItem(STORAGE_KEY);
  }
};
