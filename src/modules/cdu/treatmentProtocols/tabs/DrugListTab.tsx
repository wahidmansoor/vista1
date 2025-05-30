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
import { Pill, AlertCircle } from 'lucide-react';
import type { Protocol, Drug } from '@/types/protocol';

interface DrugListTabProps {
  protocol: Protocol;
}

const DrugListTab: React.FC<DrugListTabProps> = ({ protocol }) => {
  // Check if we have treatment drugs data
  const drugs = protocol.treatment?.drugs || [];
  const hasDrugs = Array.isArray(drugs) && drugs.length > 0;
  
  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Treatment Drugs</h2>
      
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
                  <TableHead>Timing</TableHead>
                  <TableHead>Special Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {drugs.map((drug, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium flex items-center gap-2">
                      <Pill className="h-4 w-4 text-indigo-500" />
                      {drug.name}
                    </TableCell>
                    <TableCell>{drug.dose || '-'}</TableCell>
                    <TableCell>{drug.route || '-'}</TableCell>
                    <TableCell>{drug.timing || '-'}</TableCell>
                    <TableCell>
                      {(drug.special_notes && drug.special_notes.length > 0) ? (
                        <ul className="list-disc pl-5">
                          {drug.special_notes.map((note, i) => (
                            <li key={i} className="text-sm">{note}</li>
                          ))}
                        </ul>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      
      {/* Display drug class information if available */}
      {protocol.drug_classes && protocol.drug_classes.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Drug Classifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {protocol.drug_classes.map((drugClass, idx) => (
              <Card key={idx}>
                <CardContent className="p-4">
                  <h4 className="font-medium text-lg mb-2">{drugClass.name}</h4>
                  {drugClass.classification && (
                    <p className="mb-2">
                      <span className="font-semibold">Classification: </span>
                      {drugClass.classification}
                    </p>
                  )}
                  {drugClass.mechanism && (
                    <p>
                      <span className="font-semibold">Mechanism: </span>
                      {drugClass.mechanism}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export { DrugListTab };
