import React, { useState } from 'react';
import { DataCard, ColorMapping } from '@/components/ui/data-card';
import { 
  AlertTriangle, 
  Thermometer, 
  ShieldAlert, 
  Activity, 
  HeartPulse, 
  ChevronDown, 
  ChevronUp,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Emergency item interface
interface EmergencyItem {
  id: string;
  title: string;
  description: string;
  details: string;
  icon: string | React.ElementType;
  color: string;
  category?: string;
  content?: string; // Add this for compatibility
  [key: string]: any;
}

// Import from your existing RedFlags data structure or create a new one
import { redFlags } from '@/modules/tools/RedFlags';

// Define color mapping based on importance or category
const severityColorMapping: ColorMapping = {
  field: 'color',
  values: {
    'bg-red-500': {
      background: 'bg-red-50 dark:bg-red-900/20',
      text: 'text-red-700 dark:text-red-400',
      border: 'border-red-200 dark:border-red-800'
    },
    'bg-orange-500': {
      background: 'bg-orange-50 dark:bg-orange-900/20',
      text: 'text-orange-700 dark:text-orange-400',
      border: 'border-orange-200 dark:border-orange-800'
    },
    'bg-yellow-500': {
      background: 'bg-yellow-50 dark:bg-yellow-900/20',
      text: 'text-yellow-700 dark:text-yellow-400',
      border: 'border-yellow-200 dark:border-yellow-800'
    },
    'bg-purple-500': {
      background: 'bg-purple-50 dark:bg-purple-900/20',
      text: 'text-purple-700 dark:text-purple-400',
      border: 'border-purple-200 dark:border-purple-800'
    },
    'bg-pink-500': {
      background: 'bg-pink-50 dark:bg-pink-900/20',
      text: 'text-pink-700 dark:text-pink-400',
      border: 'border-pink-200 dark:border-pink-800'
    },
  },
  default: {
    background: 'bg-gray-50 dark:bg-gray-900/20',
    text: 'text-gray-700 dark:text-gray-400',
    border: 'border-gray-200 dark:border-gray-800'
  }
};

const OncologyEmergencyCards: React.FC = () => {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };    const filterItems = (items: EmergencyItem[]) => {
    if (!searchTerm) return items;
    return items.filter((item: EmergencyItem) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.content && item.content.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };
  
  const filteredItems = filterItems(redFlags);
  
  // Get proper icon component
  const getIconComponent = (item: EmergencyItem) => {
    const iconMap: { [key: string]: any } = {
      Thermometer,
      ShieldAlert,
      Activity,
      HeartPulse,
      AlertTriangle,
    };

    if (typeof item.icon === 'string' && iconMap[item.icon]) {
      const IconComponent = iconMap[item.icon];
      return <IconComponent className="w-6 h-6 text-red-600" />;
    }
    
    // If item.icon is a React component
    if (typeof item.icon === 'function') {
      const IconComponent = item.icon;
      return <IconComponent className="w-6 h-6 text-red-600" />;
    }
    
    return <AlertTriangle className="w-6 h-6 text-red-600" />;
  };

  return (
    <div className="space-y-6 container mx-auto py-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          🚨 Oncologic Emergencies
        </h2>
        
        <div className="flex gap-3">
          <div className="relative max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search emergencies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-[250px]"
            />
          </div>
          
          <Tabs defaultValue="grid" onValueChange={(value) => setViewMode(value as 'grid' | 'list')}>
            <TabsList className="grid w-[100px] grid-cols-2">
              <TabsTrigger value="grid" className="p-2">
                <div className="grid grid-cols-2 gap-1 w-5 h-5">
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                </div>
              </TabsTrigger>
              <TabsTrigger value="list" className="p-2">
                <div className="flex flex-col gap-1 w-5 h-5 justify-center">
                  <div className="bg-current h-0.5 rounded-sm"></div>
                  <div className="bg-current h-0.5 rounded-sm"></div>
                  <div className="bg-current h-0.5 rounded-sm"></div>
                </div>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className={cn(
        "grid gap-4", 
        viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
      )}>        {filteredItems.map((item: EmergencyItem) => (
          <DataCard
            key={item.id}
            data={item}
            title={(
              <div className="flex items-center gap-2">
                <span className={cn(
                  "p-1.5 rounded-md flex-shrink-0",
                  item.color.replace('bg-', 'bg-opacity-20 bg-')
                )}>
                  {getIconComponent(item)}
                </span>
                <span>{item.title}</span>
              </div>
            )}
            description={item.description}
            colorMapping={severityColorMapping}
            fields={[
              {
                key: 'details',
                visible: !!expandedItems[item.id],
                format: (value) => (
                  <div className="mt-3">
                    <div 
                      className="prose prose-sm dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ 
                        __html: value
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          .replace(/\n/g, '<br />') 
                      }}
                    />
                  </div>
                )
              },
              {
                key: 'expandToggle',
                visible: true,
                format: () => (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpanded(item.id);
                    }}
                    className="p-1 h-auto mt-2 flex items-center gap-1 text-xs"
                  >
                    {expandedItems[item.id] ? (
                      <>Show less <ChevronUp className="h-3 w-3" /></>
                    ) : (
                      <>Show details <ChevronDown className="h-3 w-3" /></>
                    )}
                  </Button>
                )
              }
            ]}
            className={cn(
              "transition-all duration-300", 
              expandedItems[item.id] ? "shadow-md" : "",
              viewMode === 'list' ? "max-w-none" : ""
            )}
          />
        ))}
      </div>
      
      {filteredItems.length === 0 && (
        <div className="flex flex-col items-center py-12 text-gray-500">
          <AlertTriangle className="w-12 h-12 mb-3 text-gray-400" />
          <p className="text-lg">No matching emergencies found</p>
          <p className="text-sm">Try adjusting your search terms</p>
        </div>
      )}
    </div>
  );
};

export default OncologyEmergencyCards;
