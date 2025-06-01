import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Shield, AlertCircle } from 'lucide-react';
import type { Protocol, RescueAgent } from '@/types/protocol';

type EmergencyProcedures = string | string[];

interface ExtendedProtocol extends Protocol {
  emergency_procedures?: EmergencyProcedures;
}

interface RescueAgentsTabProps {
  protocol: ExtendedProtocol;
}

const RescueAgentsTab: React.FC<RescueAgentsTabProps> = ({ protocol }) => {
  const rescueAgents: RescueAgent[] = protocol.rescue_agents || [];
  const hasRescueAgents = rescueAgents.length > 0;

  const getEmergencyProcedures = (procedures: EmergencyProcedures | undefined): string[] => {
    if (!procedures) return [];
    return Array.isArray(procedures) ? procedures : [procedures];
  };
  
  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center space-x-3 mb-6">
        <Shield className="h-6 w-6 text-orange-500" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Rescue Agents</h2>
      </div>
      
      {!hasRescueAgents ? (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-2 text-amber-500">
              <AlertCircle className="h-5 w-5" />
              <p>No rescue agent information available for this protocol.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[180px]">Agent</TableHead>
                  <TableHead>Indication</TableHead>
                  <TableHead>Dosing</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rescueAgents.map((agent, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {agent.name}
                    </TableCell>
                    <TableCell>{agent.indication || '-'}</TableCell>
                    <TableCell>{agent.dosing || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      
      {/* Emergency Procedures if available */}
      {protocol.emergency_procedures && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Emergency Procedures</h3>
          <Card>
            <CardContent className="p-6">
              <ul className="space-y-3 list-disc pl-5">
                {getEmergencyProcedures(protocol.emergency_procedures).map((procedure, idx) => (
                  <li key={idx} className="text-gray-700 dark:text-gray-300">{procedure}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export { RescueAgentsTab };
