import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface DataItem {
  [key: string]: any;
}

export interface ColorMapping {
  field: string;
  values: {
    [key: string]: {
      background: string;
      text: string;
      border?: string;
    };
  };
  default?: {
    background: string;
    text: string;
    border?: string;
  };
}

interface DataCardProps {
  data: DataItem;
  title?: string | ((data: DataItem) => string) | React.ReactNode;
  description?: string | ((data: DataItem) => string);
  colorMapping?: ColorMapping;
  fields?: {
    key: string;
    label?: string;
    format?: (value: any, data: DataItem) => React.ReactNode;
    visible?: boolean | ((value: any, data: DataItem) => boolean);
    badge?: boolean;
    className?: string;
  }[];
  className?: string;
  onClick?: (data: DataItem) => void;
}

/**
 * A flexible card component for displaying data from Supabase or any other source
 * with support for color coding based on field values
 */
export const DataCard: React.FC<DataCardProps> = ({
  data,
  title,
  description,
  colorMapping,
  fields,
  className,
  onClick,
}) => {
  // Determine background color based on colorMapping
  const getColorStyles = () => {
    if (!colorMapping) return {};
    
    const fieldValue = data[colorMapping.field];
    const colors = colorMapping.values[fieldValue] || colorMapping.default || { 
      background: "bg-white dark:bg-gray-800",
      text: "text-gray-900 dark:text-gray-100" 
    };
    
    return {
      background: colors.background,
      text: colors.text,
      border: colors.border || "border-gray-200 dark:border-gray-700"
    };
  };

  const colorStyles = getColorStyles();
  
  const displayedFields = fields?.filter(field => {
    const value = data[field.key];
    if (typeof field.visible === 'function') {
      return field.visible(value, data);
    }
    return field.visible !== false;
  }) || [];
  // Render the title
  const renderTitle = () => {
    if (!title) return null;
    
    if (typeof title === 'function') {
      return (
        <CardTitle className={cn("text-lg", colorStyles.text)}>
          {title(data)}
        </CardTitle>
      );
    }
    
    if (typeof title === 'string') {
      return (
        <CardTitle className={cn("text-lg", colorStyles.text)}>
          {title}
        </CardTitle>
      );
    }
    
    // React component/element
    return (
      <CardTitle className={cn("text-lg", colorStyles.text)}>
        {title}
      </CardTitle>
    );
  };

  // Render the description
  const renderDescription = () => {
    if (!description) return null;
    
    const descContent = typeof description === 'function' 
      ? description(data)
      : description;
      
    return (
      <CardDescription className="mt-1">
        {descContent}
      </CardDescription>
    );
  };

  // Format and display a field value
  const formatFieldValue = (field: typeof displayedFields[0]) => {
    const value = data[field.key];
    if (field.format) {
      return field.format(value, data);
    }
    return value;
  };

  // Render a single field
  const renderField = (field: typeof displayedFields[0], index: number) => {
    const formattedValue = formatFieldValue(field);

    if (field.badge) {
      return (
        <Badge 
          key={index} 
          variant="outline" 
          className={cn("mr-2 mb-2", field.className)}
        >
          {field.label && <span className="font-medium mr-1">{field.label}:</span>}
          {formattedValue}
        </Badge>
      );
    }

    return (
      <div key={index} className={cn("mb-2", field.className)}>
        {field.label && <span className="font-medium text-sm mr-1">{field.label}:</span>}
        <span className="text-sm">{formattedValue}</span>
      </div>
    );
  };

  return (
    <Card 
      className={cn(
        "overflow-hidden border transition-all duration-200",
        colorStyles.background,
        colorStyles.border,
        onClick && "cursor-pointer hover:shadow-md",
        className
      )}
      onClick={onClick ? () => onClick(data) : undefined}
    >
      {(title || description) && (
        <CardHeader className="pb-2">
          {renderTitle()}
          {renderDescription()}
        </CardHeader>
      )}
      <CardContent>
        <div className="flex flex-wrap">
          {displayedFields.map((field, i) => renderField(field, i))}
        </div>
      </CardContent>
    </Card>
  );
};
