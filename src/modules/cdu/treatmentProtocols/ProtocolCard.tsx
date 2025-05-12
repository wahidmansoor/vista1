import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ChevronRight } from 'lucide-react';
import type { Protocol } from '@/types/protocol';

interface Props {
  protocol: Protocol;
  onView: () => void;
}

const ProtocolCard: React.FC<Props> = ({ protocol, onView }) => {
  const renderCount = (items: any[] | undefined): string => {
    if (!Array.isArray(items)) return '0 items';
    return `${items.length} item${items.length !== 1 ? 's' : ''}`;
  };

  return (
    <Card className="p-4 bg-white/30 backdrop-blur-md border border-white/20 hover:shadow-lg opacity-80 hover:opacity-100 transition-all duration-300">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
              {protocol.code}
            </h3>
            {protocol.title && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {protocol.title}
              </p>
            )}
          </div>
          {protocol.cycle_info && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {protocol.cycle_info}
            </Badge>
          )}
        </div>

        <div className="space-y-2">
          {protocol.treatment_intent && (
            <Badge className="mr-2" variant="secondary">
              {protocol.treatment_intent}
            </Badge>
          )}
          
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          {protocol.treatment?.drugs && (
            <div>
              Drugs: {renderCount(protocol.treatment.drugs)}
            </div>
          )}
          {Array.isArray(protocol.supportive_care) && (
            <div>
              Supportive Care: {renderCount(protocol.supportive_care)}
            </div>
          )}
          {Array.isArray(protocol.monitoring) && (
            <div>
              Monitoring: {renderCount(protocol.monitoring)}
            </div>
          )}
        </div>

        <Button 
          variant="ghost" 
          className="w-full justify-between" 
          onClick={onView}
        >
          View Details
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};

export default ProtocolCard;
