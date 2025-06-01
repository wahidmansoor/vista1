import { Protocol } from '../../../types/protocol';

type PrecautionsTabProps = {
  precautions?: Array<string | { criterion?: string; note?: string }>;
};

const PrecautionsTab = ({ precautions }: PrecautionsTabProps) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">Precautions & Warnings</h3>
    <ul className="list-disc pl-5 space-y-2">
      {precautions?.map((item, index) => (
        <li key={index} className="text-gray-700 dark:text-gray-300">
          {typeof item === 'string' ? item : (item.criterion || item.note || '')}
        </li>
      ))}
    </ul>
  </div>
);

// ... rest of the component code ...

export const DrawerOverlay = ({ protocol }: { protocol: Protocol }) => {
  return (
    <div className="drawer-side">
      {/* ... other content ... */}
      <PrecautionsTab precautions={protocol.precautions} />
      {/* ... other content ... */}
    </div>
  );
};

export default DrawerOverlay;
