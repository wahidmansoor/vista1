import { 
  Icon as LucideIcon,
  AlertCircle,
  CircleEllipsis,
  type LucideProps
} from 'lucide-react';

type IconName = 'Vial' | 'Flask' | 'Beaker' | 'CircleEllipsis';

const ICON_FALLBACKS: Record<IconName, IconName> = {
  Vial: 'Flask',
  Flask: 'Beaker',
  Beaker: 'CircleEllipsis',
  CircleEllipsis: 'CircleEllipsis'
} as const;

const ICON_ALIASES: Record<string, IconName> = {
  'vial': 'Flask',
  'test-tube': 'Flask',
  'laboratory': 'Beaker'
} as const;

export const getIconWithFallback = (
  iconName: string | undefined,
  props?: LucideProps
): typeof LucideIcon => {
  if (!iconName) return CircleEllipsis;

  // Try to get canonical name if an alias was provided
  const canonicalName = ICON_ALIASES[iconName.toLowerCase()] || iconName as IconName;

  // Try to get the icon from lucide-react
  try {
    const IconComponent = require('lucide-react')[canonicalName];
    if (IconComponent) return IconComponent;
  } catch (e) {
    console.warn(`Icon ${iconName} not found in lucide-react, trying fallback...`);
  }

  // If primary icon not found, try fallbacks
  let currentFallback = canonicalName;
  while (currentFallback && ICON_FALLBACKS[currentFallback]) {
    try {
      const FallbackIcon = require('lucide-react')[currentFallback];
      if (FallbackIcon) return FallbackIcon;
      if (currentFallback === ICON_FALLBACKS[currentFallback]) break;
      currentFallback = ICON_FALLBACKS[currentFallback];
    } catch (e) {
      currentFallback = ICON_FALLBACKS[currentFallback];
    }
  }

  // Return generic icon as final fallback
  return AlertCircle;
};