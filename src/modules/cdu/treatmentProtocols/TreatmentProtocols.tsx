import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import UnifiedProtocolCard from './UnifiedProtocolCard';
import DrawerOverlay from './DrawerOverlay';
import { Protocol } from '@/types/protocol';
import { getSupergroups, getTumorGroups, getProtocolsByTumorGroup } from '@/services/protocols';
import ProtocolErrorState from './ProtocolErrorState';
import ProtocolLoadingSkeleton from './ProtocolLoadingSkeleton';

export default function TreatmentProtocols() {
  const [supergroups, setSupergroups] = useState<string[]>([]);
  const [selectedSupergroup, setSelectedSupergroup] = useState<string | null>(null);
  const [groups, setGroups] = useState<string[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch supergroups on mount
  useEffect(() => {
    const fetchSupergroups = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getSupergroups();
        setSupergroups(data);
      } catch (err) {
        setError('Failed to load tumour supergroups.');
      } finally {
        setLoading(false);
      }
    };
    fetchSupergroups();
  }, []);

  // Fetch groups for selected supergroup
  useEffect(() => {
    if (selectedSupergroup) {
      setLoading(true);
      setSelectedGroup(null);
      setProtocols([]);
      getTumorGroups(selectedSupergroup)
        .then((data) => {
          setGroups(data);
          setLoading(false);
        })
        .catch(() => {
          setError('Failed to load tumour groups.');
          setLoading(false);
        });
    }
  }, [selectedSupergroup]);

  // Fetch protocols for selected group
  useEffect(() => {
    if (selectedGroup) {
      setLoading(true);
      getProtocolsByTumorGroup(selectedGroup)
        .then((data) => {
          setProtocols(data);
          setLoading(false);
        })
        .catch(() => {
          setError('Failed to load protocols for this group.');
          setLoading(false);
        });
    }
  }, [selectedGroup]);

  if (loading) return <ProtocolLoadingSkeleton />;
  if (error) return <ProtocolErrorState error={error} type="error" />;

  // Step 1: Show supergroups
  if (!selectedSupergroup) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-4"
      >
        <h1 className="text-3xl font-bold text-indigo-900 mb-8">Select Tumour Supergroup</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {supergroups.map((sg) => (
            <div
              key={sg}
              className="cursor-pointer p-6 rounded-xl shadow-md bg-gradient-to-br from-indigo-50 to-indigo-100 hover:bg-indigo-200 transition"
              onClick={() => setSelectedSupergroup(sg)}
            >
              <h2 className="text-xl font-bold text-indigo-900">{sg}</h2>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  // Step 2: Show tumour groups for selected supergroup
  if (selectedSupergroup && !selectedGroup) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-4"
      >
        <button
          onClick={() => setSelectedSupergroup(null)}
          className="mb-4 px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          ← Back to Supergroups
        </button>
        <h1 className="text-3xl font-bold text-indigo-900 mb-8">Select Tumour Group</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((g) => (
            <div
              key={g}
              className="cursor-pointer p-6 rounded-xl shadow-md bg-gradient-to-br from-blue-50 to-blue-100 hover:bg-blue-200 transition"
              onClick={() => setSelectedGroup(g)}
            >
              <h2 className="text-xl font-bold text-blue-900">{g}</h2>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  // Step 3: Show protocols for selected group
  if (selectedGroup) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-4"
      >
        <button
          onClick={() => setSelectedGroup(null)}
          className="mb-4 px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          ← Back to Groups
        </button>
        <h1 className="text-3xl font-bold text-indigo-900 mb-8">Protocols in {selectedGroup}</h1>
        {protocols.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
            No protocols found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {protocols.map((protocol) => (
              <div key={protocol.code} onClick={() => setSelectedProtocol(protocol)}>
                <UnifiedProtocolCard protocol={protocol} />
              </div>
            ))}
          </div>
        )}
        {/* Protocol detail overlay */}
        {selectedProtocol && (
          <DrawerOverlay
            isOpen={!!selectedProtocol}
            protocol={selectedProtocol}
            onClose={() => setSelectedProtocol(null)}
            onDrugSelect={() => {}}
          />
        )}
      </motion.div>
    );
  }

  return null;
}
