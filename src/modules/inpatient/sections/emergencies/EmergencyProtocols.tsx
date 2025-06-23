import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { emergencyProtocols, EmergencyCategory, EmergencyProtocol } from './data/emergencyProtocols';
import EmergencyAccordion from './components/EmergencyAccordion';
import EmergencyDetailModal from './components/EmergencyDetailModal';
import { FaSearch, FaClock, FaFilter } from 'react-icons/fa';

// Available categories for the tab filter
const categories: Array<EmergencyCategory | 'All'> = [
  'All',
  'Hematologic',
  'Metabolic',
  'Treatment-Related',
  'Obstructive',
  'Infectious'
];

// Urgency levels for filtering
type UrgencyLevel = 'All' | 'Critical' | 'Non-urgent';
const urgencyLevels: UrgencyLevel[] = ['All', 'Critical', 'Non-urgent'];

const EmergencyProtocols: React.FC = () => {
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmergency, setSelectedEmergency] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<EmergencyCategory | 'All'>('All');
  const [urgencyFilter, setUrgencyFilter] = useState<UrgencyLevel>('All');

  // Helper function to check if a protocol belongs to a category
  const isInCategory = (protocol: EmergencyProtocol, category: EmergencyCategory | 'All') => {
    if (category === 'All') return true;
    return Array.isArray(protocol.category)
      ? protocol.category.includes(category as EmergencyCategory)
      : protocol.category === category;
  };

  // Helper function to check urgency level
  const checkUrgencyLevel = (protocol: EmergencyProtocol): UrgencyLevel => {
    if (!protocol.timeToAction) return 'Non-urgent';
    
    // Extract minutes from timeToAction
    const timeMatch = protocol.timeToAction.match(/(\d+)\s*(minutes?|hours?|days?)/i);
    if (!timeMatch) return 'Non-urgent';
    
    const value = parseInt(timeMatch[1], 10);
    const unit = timeMatch[2].toLowerCase();
    
    // Convert to minutes
    let minutes = value;
    if (unit.startsWith('hour')) minutes = value * 60;
    if (unit.startsWith('day')) minutes = value * 60 * 24;
    
    // Critical: 60 minutes or less
    if (minutes <= 60) return 'Critical';
    
    // Non-urgent: more than 12 hours (720 minutes)
    if (minutes > 720) return 'Non-urgent';
    
    return 'All';
  };

  // Filter protocols based on search, category, and urgency
  const filteredProtocols = useMemo(() => {
    return emergencyProtocols.filter(protocol => {
      // Search filter
      const matchesSearch = 
        searchQuery.trim() === '' ||
        protocol.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        protocol.symptoms.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Category filter
      const matchesCategory = isInCategory(protocol, activeCategory);
      
      // Urgency filter
      const matchesUrgency = 
        urgencyFilter === 'All' || 
        checkUrgencyLevel(protocol) === urgencyFilter ||
        (urgencyFilter === 'Critical' && checkUrgencyLevel(protocol) === 'Critical');
      
      return matchesSearch && matchesCategory && matchesUrgency;
    });
  }, [searchQuery, activeCategory, urgencyFilter]);

  // Get the selected protocol for the detail modal
  const selectedProtocol = useMemo(() => {
    return emergencyProtocols.find(p => p.id === selectedEmergency);
  }, [selectedEmergency]);

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Emergency Protocols</h2>
      
      {/* Search and filter controls */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search input */}
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name or symptom..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Urgency filter */}
        <div className="flex-shrink-0">
          <div className="relative">
            <select
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md appearance-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value as UrgencyLevel)}
            >
              {urgencyLevels.map(level => (
                <option key={level} value={level}>
                  {level === 'All' ? 'All Urgencies' : level}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaClock className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Category tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex flex-wrap space-x-4 overflow-x-auto" aria-label="Categories">
          {categories.map(category => (
            <button
              key={category}
              className={`whitespace-nowrap pb-2 font-medium text-sm border-b-2 ${
                activeCategory === category
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </nav>
      </div>
      
      {/* Emergency accordions */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredProtocols.map((protocol) => (
            <motion.div
              key={protocol.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <EmergencyAccordion
                protocol={protocol}
                onViewDetails={() => setSelectedEmergency(protocol.id)}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Empty state */}
        {filteredProtocols.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">No emergency protocols found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Emergency detail modal */}
      <AnimatePresence>
        {selectedProtocol && (
          <EmergencyDetailModal
            protocol={selectedProtocol}
            onClose={() => setSelectedEmergency(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmergencyProtocols;
