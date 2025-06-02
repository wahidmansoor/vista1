// Moved from src/modules/cdu/treatmentProtocols/MedicationDebugPanel.tsx
// Conditionally loaded in development environment

interface MedicationDebugPanelProps {
  protocol: Protocol;
}

const MedicationDebugPanel: React.FC<MedicationDebugPanelProps> = ({ protocol }) => {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  // Helper function to determine data type and structure
  const getDataTypeInfo = (data: any) => { /* ...existing code... */ };

  return (
    <div>Debug Panel Content</div>
  );
};

export default MedicationDebugPanel;
