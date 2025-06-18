import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import UnifiedProtocolCard from './UnifiedProtocolCard';
import ProtocolDetailsDialog from './components/ProtocolDetailsDialog';
import ProtocolLoadingSkeleton from './ProtocolLoadingSkeleton';
import ProtocolErrorState from './ProtocolErrorState';

import { Protocol } from '@/types/protocol';
import {
  getAllGroupOptions,
  getProtocolsByTumorGroup,
} from '@/services/protocols';

export default function TreatmentProtocols() {
  const [groupOptions, setGroupOptions] = useState<
    { label: string; group: string; supergroup: string }[]
  >([]);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [selectedSupergroup, setSelectedSupergroup] = useState<string | null>(null);
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load combo box options
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoading(true);
        const options = await getAllGroupOptions();
        setGroupOptions(options);
      } catch (err) {
        setError('Failed to load tumour group options.');
      } finally {
        setLoading(false);
      }
    };
    fetchOptions();
  }, []);

  // Load protocols when group is selected
  useEffect(() => {
    if (selectedGroup) {
      setLoading(true);
      getProtocolsByTumorGroup(selectedGroup)
        .then((data) => {
          setProtocols(data);
        })
        .catch(() => {
          setError('Failed to load protocols for this group.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [selectedGroup]);

  if (loading) return <ProtocolLoadingSkeleton />;
  if (error) return <ProtocolErrorState error={error} type="error" />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-4"
    >
      <h1 className="text-3xl font-bold text-indigo-900 mb-6">
        Select a Cancer Type
      </h1>      {/* Combo Box */}
      <div className="max-w-xl mb-8">
        <select
          className="treatment-protocols-dropdown w-full p-4 rounded-lg border-2 border-indigo-300 bg-white text-gray-900 shadow-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 appearance-none cursor-pointer"
          defaultValue=""
          onChange={(e) => {
            const selected = groupOptions.find((opt) => opt.label === e.target.value);
            if (selected) {
              setSelectedGroup(selected.group);
              setSelectedSupergroup(selected.supergroup);
            }
          }}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23374151' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: 'right 0.5rem center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '1.5em 1.5em',
            paddingRight: '2.5rem'
          }}
        >
          <option value="" disabled>
            -- Select Tumour Group --
          </option>
          {groupOptions.map((opt) => (
            <option key={opt.label} value={opt.label}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Protocol Cards */}
      {selectedGroup && (
        <>
          <h2 className="text-2xl font-semibold text-indigo-800 mb-4">
            Protocols for {selectedGroup}
          </h2>
          {protocols.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
              No protocols found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {protocols.map((protocol) => (
                <div
                  key={protocol.code}
                  onClick={() => setSelectedProtocol(protocol)}
                >
                  <UnifiedProtocolCard protocol={protocol} />
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Protocol Dialog */}
      {selectedProtocol && (
        <ProtocolDetailsDialog
          protocol={selectedProtocol}
          open={!!selectedProtocol}
          onOpenChange={(open) => {
            if (!open) setSelectedProtocol(null);
          }}
        />
      )}
    </motion.div>
  );
}
