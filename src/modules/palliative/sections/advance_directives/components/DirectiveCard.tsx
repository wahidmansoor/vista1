import React from "react";
import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/ui/card";

interface DirectiveCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

export const DirectiveCard: React.FC<DirectiveCardProps> = ({
  title,
  description,
  icon: Icon,
}) => {
  return (
    <Card className="border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200">
      <CardHeader className="flex flex-row items-center gap-4 space-y-0">
        <Icon className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
        <CardTitle className="text-base font-semibold text-gray-800 dark:text-gray-200">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-gray-600 dark:text-gray-400">
        {description}
      </CardContent>
    </Card>
  );
};