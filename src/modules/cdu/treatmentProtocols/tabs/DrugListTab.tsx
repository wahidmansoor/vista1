import { type FC } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pill, AlertCircle } from 'lucide-react';
import type { Protocol, ProtocolDrug } from '@/types/protocol';

interface DrugListTabProps {
  protocol: Protocol;
}

export const DrugListTab: FC<DrugListTabProps> = ({ protocol }) => {
  const drugs = protocol.treatment?.drugs ?? [];
  const hasDrugs = Array.isArray(drugs) && drugs.length > 0;
  
  if (!hasDrugs) {
    return (
      <div className="space-y-6 p-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Treatment Drugs
        </h2>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-2 text-amber-500">
              <AlertCircle className="h-5 w-5" />
              <p>No drug information available for this protocol.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Treatment Drugs
      </h2>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[180px]">Drug</TableHead>
                <TableHead>Dose</TableHead>
                <TableHead>Administration</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {drugs.map((drug: ProtocolDrug, index: number) => (
                <TableRow key={`drug-${index}`}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <Pill className="h-4 w-4 text-indigo-500" />
                    {drug.name}
                  </TableCell>
                  <TableCell>{drug.dose || '-'}</TableCell>
                  <TableCell>{drug.administration || '-'}</TableCell>
                  <TableCell>
                    {drug.special_notes?.length > 0 ? (
                      <ul className="list-disc pl-5">
                        {drug.special_notes.map((note: string, i: number) => (
                          <li key={`note-${i}`} className="text-sm">
                            {note}
                          </li>
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
      
      {protocol.drug_class && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Drug Classifications</h3>
          <Card>
            <CardContent className="p-4">
              {protocol.drug_class.name && (
                <h4 className="font-medium text-lg mb-2">
                  {protocol.drug_class.name}
                </h4>
              )}
              {protocol.drug_class.classification && (
                <p className="mb-2">
                  <span className="font-semibold">Classification: </span>
                  {protocol.drug_class.classification}
                </p>
              )}
              {protocol.drug_class.mechanism && (
                <p>
                  <span className="font-semibold">Mechanism: </span>
                  {protocol.drug_class.mechanism}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
