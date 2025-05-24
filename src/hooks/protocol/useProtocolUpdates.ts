import { useMemo, useCallback } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import type { Protocol } from '../../../../types/protocol';

interface UseProtocolUpdatesOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

interface ProtocolUpdate {
  id: string;
  changes: Partial<Protocol>;
  reason?: string;
  reviewer?: string;
}

const useProtocolUpdates = (options: UseProtocolUpdatesOptions = {}) => {
  const queryClient = useQueryClient();

  // Helper to generate version number
  const generateNewVersion = useCallback((currentVersion: string = '1.0.0') => {
    const [major, minor, patch] = currentVersion.split('.').map(Number);
    return `${major}.${minor}.${patch + 1}`;
  }, []);

  // Helper to determine if changes are major
  const isMajorChange = useCallback((changes: Partial<Protocol>) => {
    const criticalFields = [
      'treatment',
      'precautions',
      'contraindications',
      'toxicity_monitoring'
    ];
    return criticalFields.some(field => field in changes);
  }, []);

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (update: ProtocolUpdate) => {
      // Simulate API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get current protocol
      const currentProtocol = queryClient.getQueryData<Protocol>(['protocol', update.id]);
      if (!currentProtocol) throw new Error('Protocol not found');

      // Generate new version number
      const newVersion = generateNewVersion(currentProtocol.version);

      // Create updated protocol
      const updatedProtocol = {
        ...currentProtocol,
        ...update.changes,
        version: newVersion,
        updated_at: new Date().toISOString(),
        updated_by: update.reviewer || 'Unknown',
      };

      return updatedProtocol;
    },
    onSuccess: (updatedProtocol) => {
      // Update cache
      queryClient.setQueryData(['protocol', updatedProtocol.id], updatedProtocol);
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['protocols'] });
      queryClient.invalidateQueries({ queryKey: ['protocol-history', updatedProtocol.id] });
      
      options.onSuccess?.();
    },
    onError: (error: Error) => {
      options.onError?.(error);
    }
  });

  // Get protocol history
  const getProtocolHistory = useCallback(async (protocolId: string) => {
    // Simulate API call - replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [];
  }, []);

  // Optimistic update helpers
  const getOptimisticUpdate = useCallback((update: ProtocolUpdate): Protocol => {
    const currentProtocol = queryClient.getQueryData<Protocol>(['protocol', update.id]);
    if (!currentProtocol) throw new Error('Protocol not found');

    const newVersion = generateNewVersion(currentProtocol.version);
    
    return {
      ...currentProtocol,
      ...update.changes,
      version: newVersion,
      updated_at: new Date().toISOString(),
      updated_by: update.reviewer || 'Unknown',
    };
  }, [generateNewVersion]);

  // Revert update
  const revertUpdate = useCallback(async (protocolId: string, version: string) => {
    // Simulate API call - replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Invalidate queries after revert
    queryClient.invalidateQueries({ queryKey: ['protocol', protocolId] });
    queryClient.invalidateQueries({ queryKey: ['protocols'] });
    queryClient.invalidateQueries({ queryKey: ['protocol-history', protocolId] });
  }, [queryClient]);

  return {
    updateProtocol: updateMutation.mutate,
    updateProtocolAsync: updateMutation.mutateAsync,
    isUpdating: updateMutation.status === 'pending',
    getProtocolHistory,
    revertUpdate,
    getOptimisticUpdate,
    isMajorChange
  };
};

export default useProtocolUpdates;