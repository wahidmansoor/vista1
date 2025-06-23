/**
 * Icon utilities for safely accessing Lucide React icons
 * This file handles dynamic icon loading and provides fallbacks
 */

import React from 'react';
import * as LucideIcons from 'lucide-react';

// Type for Lucide icon components
export type LucideIconComponent = React.ComponentType<{
  size?: number;
  color?: string;
  className?: string;
  strokeWidth?: number;
  absoluteStrokeWidth?: boolean;
}>;

// Interface for icon lookup with proper typing
interface IconLookup {
  [key: string]: LucideIconComponent;
}

// Common icon name variations and their mappings
const ICON_NAME_MAPPINGS: Record<string, string> = {
  'home': 'Home',
  'user': 'User',
  'settings': 'Settings',
  'search': 'Search',
  'menu': 'Menu',
  'close': 'X',
  'cancel': 'X',
  'add': 'Plus',
  'remove': 'Minus',
  'delete': 'Trash',
  'edit': 'Edit',
  'save': 'Save',
  'check': 'Check',
  'error': 'AlertCircle',
  'warning': 'AlertTriangle',
  'info': 'Info',
  'help': 'HelpCircle',
  'visible': 'Eye',
  'hidden': 'EyeOff',
  'upload': 'Upload',
  'download': 'Download',
  'calendar': 'Calendar',
  'time': 'Clock',
  'email': 'Mail',
  'phone': 'Phone',
  'location': 'MapPin',
  'favorite': 'Heart',
  'star': 'Star',
  'notification': 'Bell',
  'lock': 'Lock',
  'unlock': 'Unlock',
  'security': 'Shield',
  'database': 'Database',
  'cloud': 'Cloud',
  'server': 'Server',
  'desktop': 'Monitor',
  'mobile': 'Smartphone',
  'tablet': 'Tablet',
  'laptop': 'Laptop',
  'web': 'Globe',
  'link': 'Link',
  'external': 'ExternalLink',
  'copy': 'Copy',
  'share': 'Share',
  'print': 'Printer',
  'file': 'FileText',
  'image': 'Image',
  'video': 'Video',
  'audio': 'Music',
  'headphones': 'Headphones',
  'camera': 'Camera',
  'microphone': 'Mic',
  'volume': 'Volume2',
  'mute': 'VolumeX',
  'play': 'Play',
  'pause': 'Pause',
  'stop': 'Square',
  'previous': 'SkipBack',
  'next': 'SkipForward',
  'repeat': 'Repeat',
  'shuffle': 'Shuffle',
  'fullscreen': 'Maximize',
  'minimize': 'Minimize',
  'rotate-left': 'RotateCcw',
  'rotate-right': 'RotateCw',
  'zoom-in': 'ZoomIn',
  'zoom-out': 'ZoomOut',
  'filter': 'Filter',
  'sort': 'ArrowUpDown',
  'grid': 'Grid3X3',
  'list': 'List',
  'layout': 'Layout',
  'sidebar': 'Sidebar',
  'more-horizontal': 'MoreHorizontal',
  'more-vertical': 'MoreVertical',
  'loading': 'Loader2',
  'refresh': 'RefreshCw',
  'arrow-up': 'ArrowUp',
  'arrow-down': 'ArrowDown',
  'arrow-left': 'ArrowLeft',
  'arrow-right': 'ArrowRight',
  'chevron-up': 'ChevronUp',
  'chevron-down': 'ChevronDown',
  'chevron-left': 'ChevronLeft',
  'chevron-right': 'ChevronRight'
};

/**
 * Convert various icon name formats to PascalCase
 * @param iconName - Icon name in any format
 * @returns PascalCase icon name
 */
function normalizeName(iconName: string): string {
  // Handle common mappings first
  if (ICON_NAME_MAPPINGS[iconName.toLowerCase()]) {
    return ICON_NAME_MAPPINGS[iconName.toLowerCase()];
  }

  // Convert kebab-case, snake_case, or space-separated to PascalCase
  return iconName
    .split(/[-_\s]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

/**
 * Get an icon component by name with fallback handling
 * @param iconName - Name of the icon to retrieve
 * @returns LucideIconComponent or null if not found
 */
export function getIconComponent(iconName: string): LucideIconComponent | null {
  if (!iconName || typeof iconName !== 'string') {
    console.warn('Invalid icon name provided:', iconName);
    return null;
  }

  // Normalize the icon name
  const normalizedName = normalizeName(iconName.trim());
  
  // Cast LucideIcons to our interface for safe access
  const iconLookup = LucideIcons as unknown as IconLookup;
  
  // Try the normalized name first
  if (normalizedName in iconLookup) {
    return iconLookup[normalizedName];
  }
  
  // Try some common variations
  const variations = [
    normalizedName,
    normalizedName + 'Icon',
    iconName.charAt(0).toUpperCase() + iconName.slice(1),
    iconName.toLowerCase(),
    iconName.toUpperCase()
  ];
  
  for (const variation of variations) {
    if (variation in iconLookup) {
      return iconLookup[variation];
    }
  }
  
  // Log warning for debugging in development
  if (process.env.NODE_ENV === 'development') {
    console.warn(`Icon "${iconName}" (normalized: "${normalizedName}") not found in Lucide React.`);
    console.log('Available icons sample:', Object.keys(LucideIcons).slice(0, 20));
  }
  
  return null;
}

/**
 * Render an icon component safely with fallback
 * @param iconName - Name of the icon
 * @param props - Props to pass to the icon component
 * @returns React element or fallback icon
 */
export function renderIcon(
  iconName: string, 
  props: {
    size?: number;
    color?: string;
    className?: string;
    strokeWidth?: number;
    absoluteStrokeWidth?: boolean;
  } = {}
): React.ReactElement {
  const IconComponent = getIconComponent(iconName);
    if (!IconComponent) {
    // Return a default help circle icon as fallback
    return React.createElement(LucideIcons.HelpCircle, props);
  }

  return React.createElement(IconComponent, props);
}

/**
 * Get dynamic icon with fallback (backward compatibility function)
 * @param iconName - Name of the icon
 * @param props - Props to pass to the icon component
 * @returns React element
 */
export const getDynamicIcon = (iconName: string, props: any = {}) => {
  try {
    const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.AlertTriangle;
    return React.createElement(IconComponent, {
      size: 16,
      ...props
    });
  } catch (error) {
    return React.createElement(LucideIcons.AlertTriangle, {
      size: 16,
      ...props
    });
  }
};

// Icon map for backward compatibility
export const iconMap = {
  Home: LucideIcons.Home,
  User: LucideIcons.User,
  Settings: LucideIcons.Settings,
  // Add more as needed, or use AlertTriangle as fallback
  AlertTriangle: LucideIcons.AlertTriangle,
};

/**
 * Check if an icon exists in the Lucide library
 * @param iconName - Name of the icon to check
 * @returns boolean indicating if icon exists
 */
export function iconExists(iconName: string): boolean {
  return getIconComponent(iconName) !== null;
}

/**
 * Get a list of all available icon names
 * @returns Array of icon names
 */
export function getAvailableIcons(): string[] {
  return Object.keys(LucideIcons).filter(key => 
    typeof (LucideIcons as any)[key] === 'function'
  );
}

/**
 * Create an icon component with default props
 * @param iconName - Name of the icon
 * @param defaultProps - Default props to apply to the icon
 * @returns Function that creates the icon with props
 */
export function createIcon(
  iconName: string, 
  defaultProps: Partial<React.ComponentProps<LucideIconComponent>> = {}
) {
  return (props: Partial<React.ComponentProps<LucideIconComponent>> = {}) => 
    renderIcon(iconName, { ...defaultProps, ...props });
}

// Commonly used icons - exported for better tree-shaking and direct access
export const CommonIcons = {
  Home: LucideIcons.Home,
  User: LucideIcons.User,
  Settings: LucideIcons.Settings,
  Search: LucideIcons.Search,
  Menu: LucideIcons.Menu,
  Close: LucideIcons.X,
  Add: LucideIcons.Plus,
  Remove: LucideIcons.Minus,
  Edit: LucideIcons.Edit,
  Delete: LucideIcons.Trash,
  Save: LucideIcons.Save,
  Cancel: LucideIcons.X,
  Check: LucideIcons.Check,
  Error: LucideIcons.AlertCircle,
  Warning: LucideIcons.AlertTriangle,
  Info: LucideIcons.Info,
  Help: LucideIcons.HelpCircle,
  Visible: LucideIcons.Eye,
  Hidden: LucideIcons.EyeOff,
  Upload: LucideIcons.Upload,
  Download: LucideIcons.Download,
  Calendar: LucideIcons.Calendar,
  Clock: LucideIcons.Clock,
  Mail: LucideIcons.Mail,
  Phone: LucideIcons.Phone,
  Location: LucideIcons.MapPin,
  Heart: LucideIcons.Heart,
  Star: LucideIcons.Star,
  Bell: LucideIcons.Bell,
  Lock: LucideIcons.Lock,
  Unlock: LucideIcons.Unlock,
  Shield: LucideIcons.Shield,
  Loading: LucideIcons.Loader2,
  Refresh: LucideIcons.RefreshCw,
  ArrowUp: LucideIcons.ArrowUp,
  ArrowDown: LucideIcons.ArrowDown,
  ArrowLeft: LucideIcons.ArrowLeft,
  ArrowRight: LucideIcons.ArrowRight,
  ChevronUp: LucideIcons.ChevronUp,
  ChevronDown: LucideIcons.ChevronDown,
  ChevronLeft: LucideIcons.ChevronLeft,
  ChevronRight: LucideIcons.ChevronRight,
  MoreHorizontal: LucideIcons.MoreHorizontal,
  MoreVertical: LucideIcons.MoreVertical
};

// Default export
export default {
  getIconComponent,
  renderIcon,
  iconExists,
  getAvailableIcons,
  createIcon,
  CommonIcons
};