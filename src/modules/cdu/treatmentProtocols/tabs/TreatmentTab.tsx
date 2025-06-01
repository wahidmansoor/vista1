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
import { Pill, CalendarDays, Info, AlertCircle } from 'lucide-react';
import type { Treatment } from '@/types/treatment';
import type { ProtocolDrug } from '@/types/protocol';

interface TreatmentTabProps {
  treatment?: Treatment;
}

const TreatmentTab: React.FC<TreatmentTabProps> = ({ treatment }) => {
  const drugs = treatment?.drugs || [];
  const hasDrugs = Array.isArray(drugs) && drugs.length > 0;

  // Calculate cycle information
  const cycleLength = treatment?.cycle_length || 'Not specified';
  const cycleCount = treatment?.total_cycles || 'Not specified';
  const cycleInfo = `${cycleLength} days per cycle, ${cycleCount} ${parseInt(String(cycleCount)) === 1 ? 'cycle' : 'cycles'} total`;

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center space-x-3 mb-6">
        <Pill className="h-6 w-6 text-purple-500" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Treatment Information</h2>
      </div>
      <div className="flex flex-wrap gap-4 mb-6">
        {treatment?.intent && (
          <Badge variant="outline" className="bg-primary/10 text-primary px-3 py-1 text-sm">
            Intent: {treatment.intent}
          </Badge>
        )}
        {treatment?.route && (
          <Badge variant="outline" className="bg-indigo-500/10 text-indigo-500 px-3 py-1 text-sm">
            Route: {treatment.route}
          </Badge>
        )}
        {treatment?.schedule && (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-500 px-3 py-1 text-sm">
            Schedule: {treatment.schedule}
          </Badge>
        )}
        <Badge variant="outline" className="bg-green-500/10 text-green-500 px-3 py-1 text-sm flex items-center gap-1">
          <CalendarDays className="h-3.5 w-3.5" />
          {cycleInfo}
        </Badge>
      </div>
      {treatment?.notes && treatment.notes.length > 0 && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h3 className="font-medium">Treatment Notes</h3>
                <ul className="mt-2 space-y-1 list-disc pl-5">
                  {treatment.notes.map((note: string, i: number) => (
                    <li key={i} className="text-gray-700 dark:text-gray-300">{note}</li>
                  ))}
                </ul>
              </div>
            </div>
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
                    <TableCell>{(drug as any).route || '-'}</TableCell>
                    <TableCell>{(drug as any).timing || drug.administration || '-'}</TableCell>
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
      {treatment?.premedication && treatment.premedication.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-3">Premedications</h3>
          <Card>
            <CardContent className="p-4">
              <ul className="list-disc pl-5 space-y-1">
                {treatment.premedication.map((med: string | { name: string; dose?: string }, idx: number) => (
                  <li key={idx} className="text-gray-700 dark:text-gray-300">
                    {typeof med === 'string' ? med : med.name + (med.dose ? ` - ${med.dose}` : '')}
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

export default TreatmentTab;
