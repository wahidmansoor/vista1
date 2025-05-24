// Moved from src/modules/cdu/treatmentProtocols/MedicationDebugView.tsx
// Conditionally loaded in development environment

interface MedicationDebugViewProps {
  title?: string;
  data: any;
  showRaw?: boolean;
}

const MedicationDebugView: React.FC<MedicationDebugViewProps> = ({
  title = "Medication Debug",
  data,
  showRaw = false
}) => {
  const dataType = Array.isArray(data) 
    ? 'array' 
    : (data && typeof data === 'object' && ('required' in data || 'optional' in data)) 
      ? 'medications-object' 
      : typeof data;

  return (
    <div>Debug View Content</div>
  );
};

export default MedicationDebugView;
