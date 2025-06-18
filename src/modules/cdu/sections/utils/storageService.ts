/**
 * Enhanced localStorage service with data migration and error handling
 * Provides robust data persistence for Disease Progress Tracker
 */

import {
  StorageData,
  DataMigration,
  ValidationError
} from '../types/diseaseProgress.types';

const STORAGE_KEY = "disease-progress-tracker-data";
const BACKUP_KEY = "disease-progress-tracker-backup";
const CURRENT_VERSION = "2.0.0";

// Data migration definitions
const migrations: DataMigration[] = [
  {
    fromVersion: "1.0.0",
    toVersion: "2.0.0",
    migrate: (oldData: any): StorageData => {
      // Migration from v1 to v2 - handle structure changes
      return {
        diseaseStatus: {
          primaryDiagnosis: oldData.primaryDiagnosis || '',
          otherPrimaryDiagnosis: oldData.otherPrimaryDiagnosis || '',
          stageAtDiagnosis: oldData.stageAtDiagnosis || '',
          histologyMutation: oldData.histologyMutation || '',
          otherHistologyMutation: oldData.otherHistologyMutation || '',
          dateOfDiagnosis: oldData.dateOfDiagnosis || '',
          diseaseNotes: oldData.diseaseNotes || '',
        },
        performanceStatus: {
          assessmentDate: oldData.assessmentDate || '',
          performanceScale: oldData.performanceScale || '',
          performanceScore: oldData.performanceScore || '',
          performanceNotes: oldData.performanceNotes || '',
        },
        progression: {
          reassessmentDate: oldData.reassessmentDate || '',
          imagingType: oldData.imagingType || '',
          findingsSummary: oldData.findingsSummary || '',
          markerType: oldData.markerType || '',
          markerValue: oldData.markerValue || '',
          progressionNotes: oldData.progressionNotes || '',
        },
        linesOfTreatment: {
          treatmentLine: oldData.treatmentLine || '',
          treatmentRegimen: oldData.treatmentRegimen || '',
          startDate: oldData.startDate || '',
          endDate: oldData.endDate || '',
          treatmentResponse: oldData.treatmentResponse || '',
          treatmentNotes: oldData.treatmentNotes || '',
        },
        metadata: {
          version: "2.0.0",
          lastSaved: new Date().toISOString(),
        },
      };
    }
  }
];

// Validation schema for data integrity
const validateStorageData = (data: any): { isValid: boolean; errors: ValidationError[] } => {
  const errors: ValidationError[] = [];
  
  // Check required structure
  if (!data || typeof data !== 'object') {
    errors.push({
      field: 'root',
      message: 'Invalid data structure',
      severity: 'error'
    });
    return { isValid: false, errors };
  }
  
  // Validate sections exist
  const requiredSections = ['diseaseStatus', 'performanceStatus', 'progression', 'linesOfTreatment'];
  requiredSections.forEach(section => {
    if (!data[section] || typeof data[section] !== 'object') {
      errors.push({
        field: section,
        message: `Missing or invalid ${section} section`,
        severity: 'error'
      });
    }
  });
  
  // Validate date formats
  const dateFields = [
    'diseaseStatus.dateOfDiagnosis',
    'performanceStatus.assessmentDate',
    'progression.reassessmentDate',
    'linesOfTreatment.startDate',
    'linesOfTreatment.endDate'
  ];
  
  dateFields.forEach(fieldPath => {
    const [section, field] = fieldPath.split('.');
    const value = data[section]?.[field];
    
    if (value && typeof value === 'string' && value.trim() !== '') {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        errors.push({
          field: fieldPath,
          message: `Invalid date format in ${fieldPath}`,
          severity: 'warning'
        });
      }
    }
  });
  
  return {
    isValid: errors.filter(e => e.severity === 'error').length === 0,
    errors
  };
};

// Apply data migrations
const migrateData = (data: any, fromVersion?: string): StorageData => {
  const startVersion = fromVersion || data.metadata?.version || "1.0.0";
  let migratedData = data;
  
  // Apply migrations in sequence
  migrations.forEach(migration => {
    if (migration.fromVersion === startVersion || 
        (startVersion < migration.toVersion && migration.fromVersion <= startVersion)) {
      try {
        migratedData = migration.migrate(migratedData);
        console.log(`Data migrated from ${migration.fromVersion} to ${migration.toVersion}`);
      } catch (error) {
        console.error(`Migration failed from ${migration.fromVersion} to ${migration.toVersion}:`, error);
        throw new Error(`Data migration failed: ${error}`);
      }
    }
  });
  
  return migratedData;
};

// Create backup before saving
const createBackup = (data: StorageData): void => {
  try {
    const backupData = {
      ...data,
      backupTimestamp: new Date().toISOString(),
      originalVersion: data.metadata?.version || CURRENT_VERSION
    };
    localStorage.setItem(BACKUP_KEY, JSON.stringify(backupData));
  } catch (error) {
    console.warn('Failed to create backup:', error);
    // Don't throw - backup failure shouldn't prevent save
  }
};

// Storage service implementation
export const storageService = {
  /**
   * Save data to localStorage with validation and backup
   */
  async save(data: StorageData): Promise<void> {
    try {
      // Validate data before saving
      const validation = validateStorageData(data);
      if (!validation.isValid) {
        const criticalErrors = validation.errors.filter(e => e.severity === 'error');
        if (criticalErrors.length > 0) {
          throw new Error(`Data validation failed: ${criticalErrors.map(e => e.message).join(', ')}`);
        }
      }
      
      // Create backup of existing data
      const existingData = this.loadRaw();
      if (existingData) {
        createBackup(existingData);
      }
      
      // Add metadata
      const dataWithMetadata: StorageData = {
        ...data,
        metadata: {
          version: CURRENT_VERSION,
          lastSaved: new Date().toISOString(),
        },
      };
      
      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataWithMetadata));
      
      // Log validation warnings
      const warnings = validation.errors.filter(e => e.severity === 'warning');
      if (warnings.length > 0) {
        console.warn('Data saved with warnings:', warnings);
      }
      
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
      throw new Error(`Storage save failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  /**
   * Load data from localStorage with migration and validation
   */
  async load(): Promise<StorageData | null> {
    try {
      const rawData = localStorage.getItem(STORAGE_KEY);
      if (!rawData) {
        return null;
      }
      
      let parsedData;
      try {
        parsedData = JSON.parse(rawData);
      } catch (parseError) {
        console.error('Failed to parse stored data:', parseError);
        
        // Try to restore from backup
        const backupData = this.loadBackup();
        if (backupData) {
          console.log('Restored data from backup');
          return backupData;
        }
        
        throw new Error('Stored data is corrupted and no backup available');
      }
      
      // Check if migration is needed
      const storedVersion = parsedData.metadata?.version || "1.0.0";
      if (storedVersion !== CURRENT_VERSION) {
        console.log(`Migrating data from version ${storedVersion} to ${CURRENT_VERSION}`);
        parsedData = migrateData(parsedData, storedVersion);
        
        // Save migrated data
        await this.save(parsedData);
      }
      
      // Validate loaded data
      const validation = validateStorageData(parsedData);
      if (!validation.isValid) {
        const criticalErrors = validation.errors.filter(e => e.severity === 'error');
        if (criticalErrors.length > 0) {
          console.error('Loaded data failed validation:', criticalErrors);
          
          // Try backup
          const backupData = this.loadBackup();
          if (backupData) {
            console.log('Using backup data due to validation failure');
            return backupData;
          }
          
          throw new Error('Loaded data is invalid and no valid backup available');
        }
      }
      
      return parsedData;
      
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      throw new Error(`Storage load failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  /**
   * Load raw data without migration (for internal use)
   */
  loadRaw(): StorageData | null {
    try {
      const rawData = localStorage.getItem(STORAGE_KEY);
      return rawData ? JSON.parse(rawData) : null;
    } catch (error) {
      console.error('Failed to load raw data:', error);
      return null;
    }
  },

  /**
   * Load backup data
   */
  loadBackup(): StorageData | null {
    try {
      const backupData = localStorage.getItem(BACKUP_KEY);
      if (!backupData) {
        return null;
      }
      
      const parsed = JSON.parse(backupData);
      // Remove backup-specific metadata
      delete parsed.backupTimestamp;
      delete parsed.originalVersion;
      
      return parsed;
    } catch (error) {
      console.error('Failed to load backup data:', error);
      return null;
    }
  },

  /**
   * Clear all stored data
   */
  clear(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(BACKUP_KEY);
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
      throw new Error('Failed to clear stored data');
    }
  },

  /**
   * Export data for download
   */
  exportData(): string {
    try {
      const data = this.loadRaw();
      if (!data) {
        throw new Error('No data to export');
      }
      
      const exportData = {
        ...data,
        exportTimestamp: new Date().toISOString(),
        exportVersion: CURRENT_VERSION
      };
      
      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('Failed to export data:', error);
      throw new Error(`Data export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  /**
   * Import data from file
   */
  async importData(jsonString: string): Promise<void> {
    try {
      const importedData = JSON.parse(jsonString);
      
      // Remove export-specific metadata
      delete importedData.exportTimestamp;
      delete importedData.exportVersion;
      
      // Validate imported data
      const validation = validateStorageData(importedData);
      if (!validation.isValid) {
        const criticalErrors = validation.errors.filter(e => e.severity === 'error');
        if (criticalErrors.length > 0) {
          throw new Error(`Imported data is invalid: ${criticalErrors.map(e => e.message).join(', ')}`);
        }
      }
      
      // Apply migrations if needed
      const importVersion = importedData.metadata?.version || "1.0.0";
      const migratedData = migrateData(importedData, importVersion);
      
      // Save imported data
      await this.save(migratedData);
      
    } catch (error) {
      console.error('Failed to import data:', error);
      throw new Error(`Data import failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  /**
   * Get storage info and health status
   */
  getStorageInfo(): {
    hasData: boolean;
    version: string;
    lastSaved?: string;
    hasBackup: boolean;
    dataSize: number;
    healthStatus: 'healthy' | 'warning' | 'error';
    issues: string[];
  } {
    const issues: string[] = [];
    let healthStatus: 'healthy' | 'warning' | 'error' = 'healthy';
    
    try {
      const data = this.loadRaw();
      const backup = this.loadBackup();
      
      if (!data) {
        return {
          hasData: false,
          version: 'N/A',
          hasBackup: backup !== null,
          dataSize: 0,
          healthStatus: 'healthy',
          issues: []
        };
      }
      
      // Check data integrity
      const validation = validateStorageData(data);
      if (!validation.isValid) {
        const criticalErrors = validation.errors.filter(e => e.severity === 'error');
        if (criticalErrors.length > 0) {
          healthStatus = 'error';
          issues.push(...criticalErrors.map(e => e.message));
        } else {
          healthStatus = 'warning';
          issues.push(...validation.errors.map(e => e.message));
        }
      }
      
      // Check version compatibility
      const version = data.metadata?.version || "1.0.0";
      if (version !== CURRENT_VERSION) {
        if (healthStatus === 'healthy') healthStatus = 'warning';
        issues.push(`Data version ${version} needs migration to ${CURRENT_VERSION}`);
      }
      
      return {
        hasData: true,
        version,
        lastSaved: data.metadata?.lastSaved,
        hasBackup: backup !== null,
        dataSize: JSON.stringify(data).length,
        healthStatus,
        issues
      };
      
    } catch (error) {
      return {
        hasData: false,
        version: 'N/A',
        hasBackup: false,
        dataSize: 0,
        healthStatus: 'error',
        issues: [`Storage access failed: ${error instanceof Error ? error.message : 'Unknown error'}`]
      };
    }
  }
};
