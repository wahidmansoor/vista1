/**
 * Local storage service for Patient Data
 * Provides persistence for CDU tracker session
 */

const STORAGE_KEY = 'vista1_cdu_patient_data';

export const storageService = {
  save: async (data: any): Promise<void> => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
      throw e;
    }
  },
  
  load: async (): Promise<any | null> => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Failed to load from localStorage', e);
      return null;
    }
  },
  
  clear: (): void => {
    localStorage.removeItem(STORAGE_KEY);
  }
};
