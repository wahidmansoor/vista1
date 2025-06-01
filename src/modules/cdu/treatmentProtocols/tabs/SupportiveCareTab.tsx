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
import { HeartPulse, AlertCircle } from 'lucide-react';
import type { Protocol, SupportiveCareItem, Drug } from '@/types/protocol';
import { getSupportiveCareItems } from '@/types/protocolHelpers';

interface SupportiveCareTabProps {
  protocol: Protocol;
}

const SupportiveCareTab: React.FC<SupportiveCareTabProps> = ({ protocol }) => {
  // Get supportive care items from various places in the protocol
  const supportiveItems = getSupportiveCareItems(protocol);
  const hasSupportiveItems = supportiveItems && supportiveItems.length > 0;
  
  // Extract required and optional supportive meds
  const requiredMeds = protocol.supportive_care?.required || [];
  const optionalMeds = protocol.supportive_care?.optional || [];
  
  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center space-x-3 mb-6">
        <HeartPulse className="h-6 w-6 text-red-500" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Supportive Care</h2>
      </div>
      
      {!hasSupportiveItems ? (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-2 text-amber-500">
              <AlertCircle className="h-5 w-5" />
              <p>No supportive care information available for this protocol.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Required Medications */}
          {requiredMeds.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Required Medications</h3>
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Medication</TableHead>
                        <TableHead>Dose</TableHead>
                        <TableHead>Route</TableHead>
                        <TableHead>Timing</TableHead>
                        <TableHead>Purpose</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>                      {requiredMeds.map((med, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{med.name}</TableCell>
                          <TableCell>{med.dose || '-'}</TableCell>
                          <TableCell>{med.route || '-'}</TableCell>
                          <TableCell>{med.timing || '-'}</TableCell>
                          <TableCell>{(med as any).purpose || '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* Optional Medications */}
          {optionalMeds.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Optional Medications</h3>
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Medication</TableHead>
                        <TableHead>Dose</TableHead>
                        <TableHead>Route</TableHead>
                        <TableHead>Timing</TableHead>
                        <TableHead>Purpose</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>                      {optionalMeds.map((med, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{med.name}</TableCell>
                          <TableCell>{med.dose || '-'}</TableCell>
                          <TableCell>{med.route || '-'}</TableCell>
                          <TableCell>{med.timing || '-'}</TableCell>
                          <TableCell>{(med as any).purpose || '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* All Supportive Care Items (consolidating everything) */}
          {supportiveItems.length > 0 && !(requiredMeds.length > 0 || optionalMeds.length > 0) && (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Medication</TableHead>
                      <TableHead>Dose</TableHead>
                      <TableHead>Route</TableHead>
                      <TableHead>Timing</TableHead>
                      <TableHead>Purpose</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {supportiveItems.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.dose || '-'}</TableCell>
                        <TableCell>{item.route || '-'}</TableCell>
                        <TableCell>{item.timing || '-'}</TableCell>
                        <TableCell>{item.purpose || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </>
      )}
      
      {/* Supportive Care Guidelines */}
      {protocol.supportive_guidelines && protocol.supportive_guidelines.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Supportive Care Guidelines</h3>
          <Card>
            <CardContent className="p-6">
              <ul className="space-y-3 list-disc pl-5">
                {protocol.supportive_guidelines.map((guideline, idx) => (
                  <li key={idx} className="text-gray-700 dark:text-gray-300">{guideline}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export { SupportiveCareTab };
