import { logErrorToService } from './logErrorToService';

interface ApiErrorContext {
  module: string;
  operation: string;
  data?: unknown;
}

export async function handleApiError<T>(
  promise: Promise<T>,
  context: ApiErrorContext
): Promise<T> {
  try {
    return await promise;
  } catch (error) {
    logErrorToService(error, {
      module: context.module,
      context: `API Operation: ${context.operation}`,
      extra: {
        data: context.data,
        timestamp: new Date().toISOString()
      }
    });
    
    // Re-throw for component error boundaries to catch
    throw error;
  }
}

// Usage example:
// const data = await handleApiError(
//   fetchPatientData(id),
//   { module: 'OPD', operation: 'fetchPatientData', data: { id } }
// );