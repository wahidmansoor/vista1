import React from 'react';
import { BeakerIcon, ShieldIcon, TargetIcon, AlertTriangleIcon, PillIcon, SyringeIcon } from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import { Card } from '../../../components/ui/card';
import type { Medication } from '../../../types/medications';
import { formatDistanceToNow } from 'date-fns';

export const Section = ({ title, children, icon: Icon }: { title: string; children: React.ReactNode; icon?: React.ElementType }) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2 font-semibold text-lg text-gray-900 dark:text-gray-100">
      {Icon && <Icon className="w-5 h-5" />}
      {title}
    </div>
    <div>{children}</div>
  </div>
);

export const TagList = ({ items }: { items: string[] }) => (
  <div className="flex flex-wrap gap-2">
    {items.map((item) => (
      <Badge key={item} variant="secondary" className="text-sm">
        {item}
      </Badge>
    ))}
  </div>
);

export const RichTextBlock = ({ content }: { content: string }) => (
  <div className="prose dark:prose-invert max-w-none">{content}</div>
);

export const DrugCard = ({ medication, onClick }: { medication: Medication; onClick?: () => void }) => (
  <Card className={`p-4 hover:shadow-lg transition-shadow ${onClick ? 'cursor-pointer' : ''}`} onClick={onClick}>
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">{medication.name}</h3>
          <p className="text-sm text-muted-foreground">{medication.classification}</p>
        </div>
        <div className="flex gap-1">
          {medication.is_chemotherapy && (
            <Badge variant="secondary" title="Chemotherapy">
              <BeakerIcon className="w-3 h-3" />
            </Badge>
          )}
          {medication.is_immunotherapy && (
            <Badge variant="secondary" title="Immunotherapy">
              <ShieldIcon className="w-3 h-3" />
            </Badge>
          )}
          {medication.is_targeted_therapy && (
            <Badge variant="secondary" title="Targeted Therapy">
              <TargetIcon className="w-3 h-3" />
            </Badge>
          )}
        </div>
      </div>

      {medication.brand_names?.length > 0 && (
        <div className="text-sm">
          <span className="font-medium text-gray-700 dark:text-gray-300">Brand Names</span>
          <TagList items={medication.brand_names} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Section title="Dosing" icon={PillIcon}>
          <div className="text-sm space-y-2">
            <p>{medication.dosing.standard}</p>
            {medication.dosing.adjustments && (
              <TagList items={medication.dosing.adjustments} />
            )}
          </div>
        </Section>

        <Section title="Administration" icon={SyringeIcon}>
          <p className="text-sm">{medication.administration}</p>
        </Section>
      </div>

      {medication.black_box_warning && (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-3 my-2">
          <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
            <AlertTriangleIcon className="w-4 h-4" />
            <span className="font-semibold">Black Box Warning</span>
          </div>
          <p className="mt-1 text-sm text-red-600 dark:text-red-300">
            {medication.black_box_warning}
          </p>
        </div>
      )}

      <div className="text-xs text-muted-foreground mt-4">
        Last updated {formatDistanceToNow(new Date(medication.updated_at))} ago
      </div>
    </div>
  </Card>
);
