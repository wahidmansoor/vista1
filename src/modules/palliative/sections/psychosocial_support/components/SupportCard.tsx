import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface SupportResource {
  id: string;
  type: string;
  description: string;
  services: string[];
  contacts: string[];
  icon: React.ReactNode;
}

interface SupportCardProps {
  resource: SupportResource;
}

export const SupportCard: React.FC<SupportCardProps> = ({ resource }) => {
  return (
    <Card className="h-full overflow-hidden border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg hover:scale-[1.01] transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-indigo-50/30 to-purple-50/30 dark:from-indigo-950/30 dark:to-purple-950/30 p-4">
        <div className="flex items-center gap-3">
          <span className="text-indigo-500 dark:text-indigo-400">{resource.icon}</span>
          <CardTitle className="text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-indigo-300 dark:to-purple-300">
            {resource.type}
          </CardTitle>
        </div>
        <CardDescription className="text-gray-600 dark:text-gray-400 mt-1">
          {resource.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-indigo-300 dark:to-purple-300 mb-2">
              Available Services
            </h4>
            <ul className="space-y-1">
              {resource.services.map((service: string, index: number) => (
                <li key={index} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2 p-2 rounded-lg hover:bg-indigo-50/30 dark:hover:bg-indigo-950/30 transition-all duration-200">
                  <span className="text-indigo-500 dark:text-indigo-400 mt-0.5">•</span>
                  {service}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-indigo-300 dark:to-purple-300 mb-2">
              Contact Information
            </h4>
            <ul className="space-y-1">
              {resource.contacts.map((contact, index) => (
                <li key={index} className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2 p-2 rounded-lg hover:bg-indigo-50/30 dark:hover:bg-indigo-950/30 transition-all duration-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400"></span>
                  {contact}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export type { SupportResource };