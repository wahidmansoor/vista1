import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import DrugDetailView from './DrugDetailView';

interface Protocol {
  id?: string;
  code: string;
  name?: string;
  tumour_group: string;
  treatment_intent?: string;
  regimen_details?: string;
  frequency?: string;
  duration?: string;
  drugs?: Array<{
    name: string;
    dosage?: string;
    route?: string;
    schedule?: string;
    premedication?: string[];
    special_instructions?: string[];
    pharmacology?: {
      mechanism?: string;
      classification?: string;
      pharmacokinetics?: string[];
    };
  }>;
  special_precautions?: string[];
  nursing_implications?: string[];
  references?: string[];
  patient_information?: string;
  notes?: string;
  monitoring?: string[];
  evaluation?: string[];
}

interface ProtocolDetailProps {
  protocol: Protocol;
}

const ProtocolDetail: React.FC<ProtocolDetailProps> = ({ protocol }) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{protocol.code}</h2>
        {protocol.name && (
          <p className="text-lg text-gray-600 dark:text-gray-400">{protocol.name}</p>
        )}
        <div className="flex flex-wrap gap-2 mt-2">
          <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-sm rounded-full">
            {protocol.tumour_group}
          </span>
          {protocol.treatment_intent && (
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full">
              {protocol.treatment_intent}
            </span>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full bg-white dark:bg-gray-800">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="drugs">Medications</TabsTrigger>
          <TabsTrigger value="nursing">Nursing</TabsTrigger>
          <TabsTrigger value="patient">Patient Info</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="pt-4">
          <Card className="p-4">
            <div className="space-y-4">
              {protocol.regimen_details && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Regimen Details</h3>
                  <p className="text-gray-600 dark:text-gray-400">{protocol.regimen_details}</p>
                </div>
              )}
              
              {protocol.frequency && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Frequency</h3>
                  <p className="text-gray-600 dark:text-gray-400">{protocol.frequency}</p>
                </div>
              )}
              
              {protocol.duration && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Duration</h3>
                  <p className="text-gray-600 dark:text-gray-400">{protocol.duration}</p>
                </div>
              )}

              {protocol.notes && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Notes</h3>
                  <p className="text-gray-600 dark:text-gray-400">{protocol.notes}</p>
                </div>
              )}
              
              {protocol.special_precautions && protocol.special_precautions.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Special Precautions</h3>
                  <ul className="list-disc ml-5">
                    {protocol.special_precautions.map((precaution, index) => (
                      <li key={index} className="text-gray-600 dark:text-gray-400">{precaution}</li>
                    ))}
                  </ul>
                </div>
              )}

              {protocol.references && protocol.references.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">References</h3>
                  <ul className="list-disc ml-5">
                    {protocol.references.map((reference, index) => (
                      <li key={index} className="text-gray-600 dark:text-gray-400">{reference}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        {/* Drugs Tab */}
        <TabsContent value="drugs" className="pt-4">
          <div className="space-y-4">
            {protocol.drugs && protocol.drugs.length > 0 ? (
              protocol.drugs.map((drug, index) => (
                <DrugDetailView key={index} drug={drug} />
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center p-4">No medication details available</p>
            )}
          </div>
        </TabsContent>

        {/* Nursing Tab */}
        <TabsContent value="nursing" className="pt-4">
          <Card className="p-4">
            {protocol.nursing_implications && protocol.nursing_implications.length > 0 ? (
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nursing Implications</h3>
                <ul className="list-disc ml-5">
                  {protocol.nursing_implications.map((item, index) => (
                    <li key={index} className="text-gray-600 dark:text-gray-400 mb-1">{item}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center">No nursing information available</p>
            )}
          </Card>
        </TabsContent>

        {/* Patient Info Tab */}
        <TabsContent value="patient" className="pt-4">
          <Card className="p-4">
            {protocol.patient_information ? (
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Patient Information</h3>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-gray-600 dark:text-gray-400">{protocol.patient_information}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center">No patient information available</p>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProtocolDetail;
