import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Tab } from '@headlessui/react';
import {
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  CheckSquare,
  Clock,
  AlertTriangle,
  FileText,
  Activity,
  Sun,
  Moon,
  X,
} from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Toggle } from "@/components/ui/toggle";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTheme } from 'next-themes';
import { getProtocols } from '../../../services/protocols';
import type { Protocol } from '../../../types/protocol';

const COLORS = ['#4F46E5', '#7C3AED', '#EC4899', '#F59E0B', '#10B981'];
const TABS = [
  { id: 'groups', label: 'Group Distribution', icon: BarChartIcon },
  { id: 'intent', label: 'Intent Distribution', icon: PieChartIcon },
  { id: 'completeness', label: 'Completeness', icon: CheckSquare },
  { id: 'timeline', label: 'Timeline', icon: Clock },
];

interface Filter {
  type: string;
  value: string;
}

const calculateProtocolCompleteness = (protocol: Protocol): number => {
  const requiredFields = ['eligibility', 'treatment', 'tests', 'monitoring', 'precautions', 'supportive_care', 'toxicity_monitoring'];

  const filledFields = requiredFields.filter(field => {
    const value = protocol[field as keyof Protocol];
    return value && (
      Array.isArray(value) ? value.length > 0 :
      typeof value === 'object' ? Object.keys(value).length > 0 :
      Boolean(value)
    );
  });

  return (filledFields.length / requiredFields.length) * 100;
};

const getDaysFromNow = (dateStr: string): number =>
  Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));

const ProtocolDashboard: React.FC = () => {
  const [activeFilters, setActiveFilters] = useState<Filter[]>([]);
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data: protocols = [], isLoading } = useQuery<Protocol[], Error>({
    queryKey: ['protocols'],
    queryFn: () => getProtocols({ tumorGroup: null, drugName: null, treatmentIntent: null }),
    staleTime: 1000 * 60 * 5,
  });

  const filteredProtocols = useMemo(() => {
    return protocols.filter(protocol =>
      activeFilters.every(filter => {
        switch (filter.type) {
          case 'group': return protocol.tumour_group === filter.value;
          case 'intent': return protocol.treatment_intent === filter.value;
          case 'recent': return protocol.updated_at ? getDaysFromNow(protocol.updated_at) <= 30 : false;
          default: return true;
        }
      })
    );
  }, [protocols, activeFilters]);

  const stats = useMemo(() => {
    const completenessScores = filteredProtocols.map(calculateProtocolCompleteness);
    const total = filteredProtocols.length;
    const avgCompleteness = total > 0
      ? completenessScores.reduce((a, b) => a + b, 0) / total
      : 0;

    return {
      totalProtocols: total,
      avgCompleteness: Math.round(avgCompleteness),
      missingDataCount: filteredProtocols.filter(p => calculateProtocolCompleteness(p) < 70).length,
      recentlyUpdated: filteredProtocols.filter(p => p.updated_at ? getDaysFromNow(p.updated_at) <= 30 : false).length,
    };
  }, [filteredProtocols]);

  const handleFilterRemove = (filterToRemove: Filter) => {
    setActiveFilters(filters =>
      filters.filter(f => f.type !== filterToRemove.type || f.value !== filterToRemove.value)
    );
  };

  const renderFilterChips = () => (
    <div className="flex flex-wrap gap-2 mb-4">
      {activeFilters.map((filter, index) => (
        <Badge key={index} variant="secondary" className="flex items-center gap-1">
          {filter.type}: {filter.value}
          <button onClick={() => handleFilterRemove(filter)} className="ml-1 hover:text-red-500">
            <X className="w-3 h-3" />
          </button>
        </Badge>
      ))}
    </div>
  );

  const StatCard = ({ title, value, icon, color }: {
    title: string; value: number | string; icon: React.ReactNode; color: string;
  }) => (
    <Card className={`p-6 ${color} text-white rounded-lg shadow-lg`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-80">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
        </div>
        <div className="text-white/80">{icon}</div>
      </div>
    </Card>
  );

  // Chart components implementation
  const GroupChart = () => {
    const groupData = useMemo(() => {
      const groups: Record<string, number> = {};
      filteredProtocols.forEach(protocol => {
        if (protocol.tumour_group) {
          groups[protocol.tumour_group] = (groups[protocol.tumour_group] || 0) + 1;
        }
      });
      return Object.keys(groups).map(group => ({ name: group, count: groups[group] }));
    }, [filteredProtocols]);

    return (
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={groupData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#4F46E5" name="Protocols" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const IntentChart = () => {
    const intentData = useMemo(() => {
      const intents: Record<string, number> = {};
      filteredProtocols.forEach(protocol => {
        if (protocol.treatment_intent) {
          intents[protocol.treatment_intent] = (intents[protocol.treatment_intent] || 0) + 1;
        }
      });
      return Object.keys(intents).map(intent => ({ name: intent, value: intents[intent] }));
    }, [filteredProtocols]);

    return (
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={intentData}
              cx="50%"
              cy="50%"
              labelLine={true}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={150}
              fill="#8884d8"
              dataKey="value"
            >
              {intentData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const CompletenessMatrix = () => {
    const completenessData = useMemo(() => {
      return filteredProtocols.map(protocol => ({
        name: protocol.id || `${protocol.tumour_group || ''} Protocol` || 'Unnamed Protocol',
        completeness: calculateProtocolCompleteness(protocol)
      })).sort((a, b) => b.completeness - a.completeness).slice(0, 10);
    }, [filteredProtocols]);

    return (
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={completenessData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 100]} />
            <YAxis dataKey="name" type="category" width={150} />
            <Tooltip formatter={(value) => [`${value}%`, 'Completeness']} />
            <Bar dataKey="completeness" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const TimelineChart = () => {
    const timelineData = useMemo(() => {
      const dates: Record<string, number> = {};
      filteredProtocols.forEach(protocol => {
        if (protocol.updated_at) {
          const date = new Date(protocol.updated_at).toISOString().split('T')[0];
          dates[date] = (dates[date] || 0) + 1;
        }
      });
      return Object.keys(dates)
        .sort()
        .map(date => ({ date, count: dates[date] }))
        .slice(-30); // Last 30 days with updates
    }, [filteredProtocols]);

    return (
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={timelineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#7C3AED" name="Updates" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">OncoProtocol Explorer</h1>
          <p className="text-gray-600 dark:text-gray-400">Explore and manage oncology treatment protocols</p>
        </div>
        <Toggle
          pressed={isDark}
          onPressedChange={() => setTheme(isDark ? 'light' : 'dark')}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Toggle>
      </div>

      {activeFilters.length > 0 && renderFilterChips()}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Protocols" value={stats.totalProtocols} icon={<FileText className="w-6 h-6" />} color="bg-indigo-500" />
        <StatCard title="Avg. Completeness" value={`${stats.avgCompleteness}%`} icon={<Activity className="w-6 h-6" />} color="bg-green-500" />
        <StatCard title="Missing Data" value={stats.missingDataCount} icon={<AlertTriangle className="w-6 h-6" />} color="bg-amber-500" />
        <StatCard title="Recently Updated" value={stats.recentlyUpdated} icon={<Clock className="w-6 h-6" />} color="bg-purple-500" />
      </div>

      <ScrollArea className="h-[500px]">
        <Card className="p-6">
          <Tab.Group>
            <Tab.List className="flex space-x-2 border-b mb-4 overflow-x-auto whitespace-nowrap scrollbar-hide pr-8 relative">
              {TABS.map((tab) => (
                <Tab
                  key={tab.id}
                  className={({ selected }) => `
                    px-4 py-2 rounded-t-lg font-medium flex items-center space-x-2
                    ${selected
                      ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}
                  `}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </Tab>
              ))}
              <div className="pointer-events-none absolute top-0 right-0 h-full w-8 bg-gradient-to-l from-white to-transparent dark:from-gray-900" />
            </Tab.List>
            <Tab.Panels>
              <Tab.Panel><GroupChart /></Tab.Panel>
              <Tab.Panel><IntentChart /></Tab.Panel>
              <Tab.Panel><CompletenessMatrix /></Tab.Panel>
              <Tab.Panel><TimelineChart /></Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </Card>
      </ScrollArea>
    </div>
  );
};

export default ProtocolDashboard;
