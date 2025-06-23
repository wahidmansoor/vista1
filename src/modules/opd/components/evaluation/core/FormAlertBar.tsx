import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  CheckCircle, 
  X, 
  ChevronDown, 
  ChevronUp,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export type AlertType = 'error' | 'warning' | 'info' | 'success';
export type AlertPriority = 'low' | 'medium' | 'high' | 'critical';

export interface FormAlert {
  id: string;
  type: AlertType;
  priority: AlertPriority;
  title: string;
  message: string;
  fieldId?: string;
  sectionId?: string;
  actionable?: boolean;
  actionLabel?: string;
  onAction?: () => void;
  dismissible?: boolean;
  autoHide?: boolean;
  links?: Array<{
    label: string;
    url: string;
    external?: boolean;
  }>;
  timestamp?: Date;
}

interface FormAlertBarProps {
  alerts: FormAlert[];
  onDismissAlert: (alertId: string) => void;
  onNavigateToField?: (fieldId: string, sectionId?: string) => void;
  maxVisible?: number;
  className?: string;
  showTimestamp?: boolean;
  groupByType?: boolean;
}

const getAlertConfig = (type: AlertType, priority: AlertPriority) => {
  const baseConfig = {
    error: {
      icon: AlertCircle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      iconColor: 'text-red-500'
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-800',
      iconColor: 'text-yellow-500'
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-500'
    },
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      iconColor: 'text-green-500'
    }
  }[type];

  // Modify styles based on priority
  if (priority === 'critical') {
    baseConfig.bgColor = baseConfig.bgColor.replace('50', '100');
    baseConfig.borderColor = baseConfig.borderColor.replace('200', '300');
  }

  return baseConfig;
};

const getPriorityBadge = (priority: AlertPriority) => {
  const config = {
    low: { label: 'Low', className: 'bg-gray-100 text-gray-700' },
    medium: { label: 'Medium', className: 'bg-blue-100 text-blue-700' },
    high: { label: 'High', className: 'bg-orange-100 text-orange-700' },
    critical: { label: 'Critical', className: 'bg-red-100 text-red-700' }
  }[priority];

  return (
    <Badge variant="outline" className={cn('text-xs', config.className)}>
      {config.label}
    </Badge>
  );
};

const AlertItem: React.FC<{
  alert: FormAlert;
  onDismiss: (id: string) => void;
  onNavigateToField?: (fieldId: string, sectionId?: string) => void;
  showTimestamp?: boolean;
}> = ({ alert, onDismiss, onNavigateToField, showTimestamp }) => {
  const config = getAlertConfig(alert.type, alert.priority);
  const IconComponent = config.icon;
  
  useEffect(() => {
    if (alert.autoHide && alert.type === 'success') {
      const timer = setTimeout(() => onDismiss(alert.id), 5000);
      return () => clearTimeout(timer);
    }
  }, [alert.autoHide, alert.type, alert.id, onDismiss]);

  return (
    <div className={cn(
      'border rounded-lg p-3 transition-all duration-200',
      config.bgColor,
      config.borderColor
    )}>
      <div className="flex items-start space-x-3">
        <IconComponent className={cn('h-5 w-5 mt-0.5 flex-shrink-0', config.iconColor)} />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h4 className={cn('text-sm font-medium', config.textColor)}>
                {alert.title}
              </h4>
              {alert.priority !== 'low' && getPriorityBadge(alert.priority)}
            </div>
            
            <div className="flex items-center space-x-1">
              {showTimestamp && alert.timestamp && (
                <span className="text-xs opacity-60">
                  {alert.timestamp.toLocaleTimeString()}
                </span>
              )}
              
              {alert.dismissible && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDismiss(alert.id)}
                  className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          
          <p className={cn('text-sm mt-1', config.textColor, 'opacity-90')}>
            {alert.message}
          </p>
          
          {/* Links */}
          {alert.links && alert.links.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {alert.links.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target={link.external ? '_blank' : '_self'}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                  className={cn(
                    'inline-flex items-center text-xs underline hover:no-underline',
                    config.textColor
                  )}
                >
                  {link.label}
                  {link.external && <ExternalLink className="h-3 w-3 ml-1" />}
                </a>
              ))}
            </div>
          )}
          
          {/* Actions */}
          <div className="flex items-center space-x-2 mt-3">
            {alert.fieldId && onNavigateToField && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigateToField(alert.fieldId!, alert.sectionId)}
                className="text-xs h-7"
              >
                Go to field
              </Button>
            )}
            
            {alert.actionable && alert.onAction && (
              <Button
                variant="outline"
                size="sm"
                onClick={alert.onAction}
                className="text-xs h-7"
              >
                {alert.actionLabel || 'Fix'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const AlertGroup: React.FC<{
  type: AlertType;
  alerts: FormAlert[];
  onDismiss: (id: string) => void;
  onNavigateToField?: (fieldId: string, sectionId?: string) => void;
  showTimestamp?: boolean;
}> = ({ type, alerts, onDismiss, onNavigateToField, showTimestamp }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const config = getAlertConfig(type, 'medium');
  
  return (
    <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-between p-2 h-auto',
            config.bgColor,
            config.textColor
          )}
        >
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium capitalize">{type}s</span>
            <Badge variant="outline" className="text-xs">
              {alerts.length}
            </Badge>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="space-y-2 pt-2">
        {alerts.map(alert => (
          <AlertItem
            key={alert.id}
            alert={alert}
            onDismiss={onDismiss}
            onNavigateToField={onNavigateToField}
            showTimestamp={showTimestamp}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};

export const FormAlertBar: React.FC<FormAlertBarProps> = ({
  alerts,
  onDismissAlert,
  onNavigateToField,
  maxVisible = 5,
  className,
  showTimestamp = false,
  groupByType = true
}) => {
  const [showAll, setShowAll] = useState(false);
  
  // Sort alerts by priority and timestamp
  const sortedAlerts = [...alerts].sort((a, b) => {
    const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    
    if (priorityDiff !== 0) return priorityDiff;
    
    // Sort by timestamp if priorities are equal
    const aTime = a.timestamp?.getTime() || 0;
    const bTime = b.timestamp?.getTime() || 0;
    return bTime - aTime;
  });
  
  const visibleAlerts = showAll ? sortedAlerts : sortedAlerts.slice(0, maxVisible);
  const hasMore = sortedAlerts.length > maxVisible;
  
  if (alerts.length === 0) return null;
  
  return (
    <div className={cn(
      'bg-white border border-gray-200 rounded-lg p-4 space-y-3',
      className
    )}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900">
          Form Validation {alerts.length > 0 && `(${alerts.length})`}
        </h3>
        
        <div className="flex items-center space-x-2">
          {hasMore && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAll(!showAll)}
              className="text-xs"
            >
              {showAll ? 'Show less' : `Show all (${sortedAlerts.length})`}
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => alerts.forEach(alert => onDismissAlert(alert.id))}
            className="text-xs"
          >
            Clear all
          </Button>
        </div>
      </div>
      
      <div className="space-y-3">
        {groupByType ? (
          // Group alerts by type
          Object.entries(
            visibleAlerts.reduce((groups, alert) => {
              groups[alert.type] = groups[alert.type] || [];
              groups[alert.type].push(alert);
              return groups;
            }, {} as Record<AlertType, FormAlert[]>)
          ).map(([type, typeAlerts]) => (
            <AlertGroup
              key={type}
              type={type as AlertType}
              alerts={typeAlerts}
              onDismiss={onDismissAlert}
              onNavigateToField={onNavigateToField}
              showTimestamp={showTimestamp}
            />
          ))
        ) : (
          // Show alerts individually
          visibleAlerts.map(alert => (
            <AlertItem
              key={alert.id}
              alert={alert}
              onDismiss={onDismissAlert}
              onNavigateToField={onNavigateToField}
              showTimestamp={showTimestamp}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default FormAlertBar;
