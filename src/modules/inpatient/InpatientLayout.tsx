import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const tabs = [
  { value: 'overview', label: 'Overview' },
  { value: 'discharge', label: 'Discharge' },
  { value: 'orders', label: 'Orders' },
];

const InpatientLayout = () => {
  const location = useLocation();
  const currentTab = location.pathname.split('/').pop() || 'overview';

  return (
    <div className="space-y-4 p-4">
      <Tabs value={currentTab} className="w-full">
        <TabsList>
          {tabs.map(tab => (
            <TabsTrigger key={tab.value} value={tab.value} asChild>
              <Link to={`/inpatient/${tab.value}`}>{tab.label}</Link>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <Outlet />
    </div>
  );
};

export default InpatientLayout;
