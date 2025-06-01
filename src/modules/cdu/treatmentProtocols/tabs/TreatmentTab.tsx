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
import { Badge } from '@/components/ui/badge';
import { Pill, CalendarDays, Info, AlertCircle, Clock } from 'lucide-react';
import type { Protocol, Drug, ProtocolDrug } from '@/types/protocol';

interface TreatmentTabProps {
  protocol: Protocol;
}

const TreatmentTab: React.FC<TreatmentTabProps> = ({ protocol }) => {
  const drugs = protocol.treatment?.drugs ?? [];
  const hasDrugs = Array.isArray(drugs) && drugs.length > 0;
  const treatment = protocol.treatment;
  
  // Enhanced cycle information extraction - includes cycle_info from Supabase
  const getCycleInformation = () => {
    // First check for cycle_info column from Supabase database
    if (protocol.cycle_info) {
      // Handle both string and object types
      if (typeof protocol.cycle_info === 'string') {
        try {
          return JSON.parse(protocol.cycle_info);
        } catch {
          return { description: protocol.cycle_info };
        }
      }
      return protocol.cycle_info;
    }

    // Fallback to protocol-level cycle information
    const cycleData: any = {};
    
    if ((protocol as any).cycles) cycleData.cycles = (protocol as any).cycles;
    if ((protocol as any).cycle_length) cycleData.cycle_length = (protocol as any).cycle_length;
    if ((protocol as any).total_cycles) cycleData.total_cycles = (protocol as any).total_cycles;
    
    // Check treatment-level cycle information
    if ((treatment as any)?.cycles) cycleData.cycles = (treatment as any).cycles;
    if ((treatment as any)?.cycle_length) cycleData.cycle_length = (treatment as any).cycle_length;
    if ((treatment as any)?.total_cycles) cycleData.total_cycles = (treatment as any).total_cycles;
    
    return Object.keys(cycleData).length > 0 ? cycleData : null;
  };

  const cycleInformation = getCycleInformation();
  const hasCycleData = cycleInformation !== null || 
    treatment?.drugs?.some((drug: any) => 
      drug.day || drug.days || drug.schedule || 
      drug.cycle || drug.cycles || drug.cycle_length
    );

  // Legacy cycle info for badge
  const cycleLength = (protocol.treatment as any)?.cycle_length || 'Not specified';
  const cycleCount = (protocol.treatment as any)?.total_cycles || 'Not specified';
  const cycleInfo = `${cycleLength} days per cycle, ${cycleCount} ${parseInt(String(cycleCount)) === 1 ? 'cycle' : 'cycles'} total`;
  
  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center space-x-3 mb-6">
        <Pill className="h-6 w-6 text-purple-500" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Treatment Information</h2>
      </div>
      
      <div className="flex flex-wrap gap-4 mb-6">
        {protocol.treatment?.intent && (
          <Badge variant="outline" className="bg-primary/10 text-primary px-3 py-1 text-sm">
            Intent: {protocol.treatment.intent}
          </Badge>
        )}
        
        {protocol.treatment?.route && (
          <Badge variant="outline" className="bg-indigo-500/10 text-indigo-500 px-3 py-1 text-sm">
            Route: {protocol.treatment.route}
          </Badge>
        )}
        
        {protocol.treatment?.schedule && (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-500 px-3 py-1 text-sm">
            Schedule: {protocol.treatment.schedule}
          </Badge>
        )}
        
        <Badge variant="outline" className="bg-green-500/10 text-green-500 px-3 py-1 text-sm flex items-center gap-1">
          <CalendarDays className="h-3.5 w-3.5" />
          {cycleInfo}
        </Badge>
      </div>
      
      {protocol.treatment?.notes && protocol.treatment.notes.length > 0 && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h3 className="font-medium">Treatment Notes</h3>
                <ul className="mt-2 space-y-1 list-disc pl-5">
                  {protocol.treatment.notes.map((note: string, i: number) => (
                    <li key={i} className="text-gray-700 dark:text-gray-300">{note}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>      )}
      
      {/* Detailed Cycle Information Section */}
      {hasCycleData && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-start gap-2 mb-4">
              <Clock className="h-5 w-5 text-cyan-500 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-cyan-800 text-lg">Cycle Information</h3>
                <p className="text-sm text-gray-600">Treatment cycle details and scheduling</p>
              </div>
            </div>
            
            {/* Display cycle_info from Supabase if available */}
            {cycleInformation && typeof cycleInformation === 'object' && (
              <div className="space-y-4">
                {cycleInformation.description && (
                  <div className="bg-cyan-50 p-3 rounded-lg border border-cyan-200">
                    <h4 className="font-medium text-cyan-800 mb-2">Description</h4>
                    <p className="text-gray-700">{cycleInformation.description}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {cycleInformation.cycles && (
                    <div className="bg-white p-3 rounded-lg border border-cyan-200">
                      <h4 className="font-medium text-cyan-800 text-sm">Total Cycles</h4>
                      <p className="text-gray-700 font-semibold">{cycleInformation.cycles}</p>
                    </div>
                  )}
                  
                  {cycleInformation.cycle_length && (
                    <div className="bg-white p-3 rounded-lg border border-cyan-200">
                      <h4 className="font-medium text-cyan-800 text-sm">Cycle Length</h4>
                      <p className="text-gray-700 font-semibold">{cycleInformation.cycle_length} days</p>
                    </div>
                  )}
                  
                  {cycleInformation.total_cycles && (
                    <div className="bg-white p-3 rounded-lg border border-cyan-200">
                      <h4 className="font-medium text-cyan-800 text-sm">Total Cycles</h4>
                      <p className="text-gray-700 font-semibold">{cycleInformation.total_cycles}</p>
                    </div>
                  )}
                </div>
                
                {/* Additional cycle info fields */}
                {Object.keys(cycleInformation).filter(key => 
                  !['description', 'cycles', 'cycle_length', 'total_cycles'].includes(key)
                ).length > 0 && (
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <h4 className="font-medium text-gray-800 mb-2">Additional Information</h4>
                    <div className="space-y-1 text-sm">
                      {Object.entries(cycleInformation).filter(([key]) => 
                        !['description', 'cycles', 'cycle_length', 'total_cycles'].includes(key)
                      ).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-gray-600 capitalize">{key.replace(/_/g, ' ')}:</span>
                          <span className="text-gray-800 font-medium">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
              {/* Drug-specific cycle information */}
            {treatment?.drugs && treatment.drugs.filter((drug: any) => 
              drug.day || drug.days || drug.schedule || drug.cycle
            ).length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-cyan-800 mb-3">Drug Schedule Details</h4>
                <div className="space-y-2">
                  {treatment.drugs.filter((drug: any) => 
                    drug.day || drug.days || drug.schedule || drug.cycle
                  ).map((drug: any, idx: number) => (
                    <div key={idx} className="bg-white p-3 rounded-lg border border-cyan-100">
                      <div className="flex justify-between items-start">
                        <div className="font-medium text-cyan-800">
                          {drug.name || drug.drug || `Drug ${idx + 1}`}
                        </div>
                        <div className="text-xs text-gray-600 text-right">
                          {drug.day && <div>Day {drug.day}</div>}
                          {drug.days && <div>Days {drug.days}</div>}
                          {drug.schedule && <div>{drug.schedule}</div>}
                          {drug.cycle && <div>Cycle {drug.cycle}</div>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      <h3 className="text-xl font-semibold">Medication Schedule</h3>
      
      {!hasDrugs ? (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-2 text-amber-500">
              <AlertCircle className="h-5 w-5" />
              <p>No drug information available for this protocol.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[180px]">Drug</TableHead>
                  <TableHead>Dose</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {drugs.map((drug: ProtocolDrug, index: number) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {drug.name}
                    </TableCell>
                    <TableCell>{drug.dose || '-'}</TableCell>
                    <TableCell>{drug.route || '-'}</TableCell>
                    <TableCell>{drug.timing || drug.administration || '-'}</TableCell>
                    <TableCell>
                      {drug.special_notes && drug.special_notes.length > 0 ? (
                        <ul className="list-disc pl-5 text-sm">
                          {drug.special_notes.map((note: string, i: number) => (
                            <li key={i}>{note}</li>
                          ))}
                        </ul>
                      ) : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      
      {/* Additional treatment information */}
      {protocol.pre_medications?.required && protocol.pre_medications.required.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-3">Premedications</h3>
          <Card>
            <CardContent className="p-4">
              <ul className="list-disc pl-5 space-y-1">
                {protocol.pre_medications.required.map((med: Drug, idx: number) => (
                  <li key={idx} className="text-gray-700 dark:text-gray-300">
                    {med.name + (med.dose ? ` - ${med.dose}` : '')}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export { TreatmentTab };
export default TreatmentTab;
