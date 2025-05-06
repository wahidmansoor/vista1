import React from "react";
import { motion, AnimatePresence } from "framer-motion";

type EmergencyDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  protocol: Protocol | null;
};

const EmergencyDetailModal: React.FC<EmergencyDetailModalProps> = ({
  isOpen,
  onClose,
  protocol,
}) => {
  if (!isOpen || !protocol) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-lg">
        <div className="px-4 py-2 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">{protocol.title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✖
          </button>
        </div>
        <div className="px-4 py-2 space-y-2">
          <div className="text-sm">
            <strong>System:</strong> {protocol.system}
          </div>
          <div className="text-sm">
            <strong>Category:</strong> {protocol.category}
          </div>
          <div className="text-sm">
            <strong>Time to Action:</strong> {protocol.timeToAction < 1 ? "<1h" : `${protocol.timeToAction}h`}
          </div>
          <div className="text-sm">
            <strong>Description:</strong> {protocol.description}
          </div>
          <div className="text-sm">
            <strong>Key Signs:</strong>
            <ul className="list-disc list-inside">
              {protocol.keySigns.map((sign, idx) => (
                <li key={idx}>{sign}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="px-4 py-2 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm"
          >
            Close
          </button>
        </div>
        <div className="modal-content print:static print:shadow-none print:border print:bg-white">
          <div className="mt-2 print:hidden">
            <button
              className="px-2 py-1 rounded bg-violet-50 hover:bg-violet-100 text-violet-700 text-xs"
              // onClick={...}
            >
              🧠 AI Summary
            </button>
            {/* ...AI summary display... */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyDetailModal;