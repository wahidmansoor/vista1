# Treatment Protocols Segment Analysis

## Executive Summary

The Treatment Protocols segment is a hierarchical navigation system that allows users to browse and view cancer treatment protocols. It implements a three-level selection process: first selecting a tumor supergroup, then a specific tumor group, and finally viewing protocols within that group. The component uses React with functional components and hooks for state management, Framer Motion for animations, and Tailwind CSS for styling. The interface displays protocol cards and a detailed protocol dialog that appears when a protocol is selected.

## Technical Architecture

### 1. File Structure Analysis

#### Main Entry Point
- `TreatmentProtocols.tsx` - The main component that orchestrates the protocol selection workflow

#### Component Files
- `UnifiedProtocolCard.tsx` - Displays individual protocol cards
- `ProtocolDetailsDialog.tsx` - Dialog showing detailed protocol information
- `ProtocolLoadingSkeleton.tsx` - Loading state component
- `ProtocolErrorState.tsx` - Error handling component

#### Tab Components
- `TreatmentTab.tsx` - Shows treatment drugs information
- `OverviewTab.tsx` - Shows protocol overview
- `EligibilityTab.tsx` - Shows eligibility criteria
- `DoseModificationsTab.tsx` - Shows dose modification info
- `InfoTab.tsx` - Shows general protocol information
- `TestsSectionTab.tsx` - Shows required tests

#### Utilities
- `pdfGenerator.ts` - Utility for generating PDF versions of protocols

#### Data Files
- `treatmentProtocolsData.ts` - Contains protocol data or constants

#### Dependency Hierarchy
```
TreatmentProtocols.tsx
├── UnifiedProtocolCard.tsx
├── ProtocolDetailsDialog.tsx
│   ├── Various Tab Components (TreatmentTab, OverviewTab, etc.)
│   └── MetadataFooter.tsx
├── ProtocolLoadingSkeleton.tsx
└── ProtocolErrorState.tsx
```

### 2. Styling Investigation

- **Styling Approach**: Tailwind CSS is the primary styling method used throughout the application
- **Color Scheme**: 
  - Indigo tones for primary elements (`text-indigo-900`, `from-indigo-50`, `to-indigo-100`)
  - Blue tones for secondary elements (`from-blue-50`, `to-blue-100`)
  - Gray tones for backgrounds (`from-gray-50`, `to-white`, `dark:from-gray-900`, `dark:to-gray-800`)
  - Red for safety-related items (`text-red-600`)
- **Layout Patterns**:
  - Grid-based layouts with responsive columns (`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3`)
  - Card-based design for protocol items
  - Dialog-based pattern for detailed views
- **Responsive Breakpoints**:
  - md: Medium devices (tablets, >= 768px)
  - lg: Large devices (desktops, >= 1024px)
- **Specific Style Classes**:
  - Card styles: `rounded-xl shadow-md bg-gradient-to-br`
  - Typography: `text-3xl font-bold`, `text-xl font-bold`
  - Container styles: `min-h-screen bg-gradient-to-br`
  - Animation: Framer Motion is used for transitions between views

### 3. Component Architecture

#### Main Components
- **TreatmentProtocols**: The main container component that manages navigation and state
  - Props: none (root component)
  - State:
    - `supergroups`: String array of available tumor supergroups
    - `selectedSupergroup`: Currently selected supergroup or null
    - `groups`: String array of tumor groups within selected supergroup
    - `selectedGroup`: Currently selected tumor group or null
    - `protocols`: Array of Protocol objects for selected group
    - `selectedProtocol`: Currently selected Protocol object or null
    - `loading`: Boolean indicating loading state
    - `error`: Error message string or null

- **UnifiedProtocolCard**: Displays protocol summary in card format
  - Props: 
    - `protocol`: Protocol object

- **ProtocolDetailsDialog**: Modal dialog showing protocol details
  - Props:
    - `protocol`: Protocol object
    - `open`: Boolean controlling dialog visibility
    - `onOpenChange`: Function to handle dialog open/close state

#### Parent-Child Relationships
- TreatmentProtocols renders:
  - UnifiedProtocolCard (multiple instances in a grid)
  - ProtocolDetailsDialog (conditionally when a protocol is selected)
  - ProtocolLoadingSkeleton (during loading states)
  - ProtocolErrorState (during error states)

- ProtocolDetailsDialog renders:
  - Various tab components (TreatmentTab, OverviewTab, etc.)
  - MetadataFooter for protocol metadata

### 4. Data Management & Supabase Integration

Based on the code examined, the application appears to use service functions for data fetching rather than direct Supabase calls in the components:

```typescript
import { getSupergroups, getTumorGroups, getProtocolsByTumorGroup } from '@/services/protocols';
```

The primary service file handling protocol data is located in `src/services/protocols.ts`. Here's the implementation details:

```typescript
// Key functions in protocols.ts
export const getSupergroups = async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from('protocols')
    .select('tumour_supergroup')
    .not('tumour_supergroup', 'is', null)
    .order('tumour_supergroup', { ascending: true });
  
  if (error) {
    console.error('Error fetching supergroups:', error);
    throw new Error('Failed to fetch tumour supergroups');
  }
  
  // Extract unique supergroups and filter out nulls
  const uniqueSupergroups = [...new Set(data.map(p => p.tumour_supergroup))]
    .filter(Boolean) as string[];
  
  return uniqueSupergroups;
};

export const getTumorGroups = async (supergroup: string): Promise<string[]> => {
  const { data, error } = await supabase
    .from('protocols')
    .select('tumour_group')
    .eq('tumour_supergroup', supergroup)
    .not('tumour_group', 'is', null)
    .order('tumour_group', { ascending: true });
  
  if (error) {
    console.error('Error fetching tumor groups:', error);
    throw new Error('Failed to fetch tumor groups');
  }
  
  // Extract unique groups and filter out nulls
  const uniqueGroups = [...new Set(data.map(p => p.tumour_group))]
    .filter(Boolean) as string[];
  
  return uniqueGroups;
};

export const getProtocolsByTumorGroup = async (tumorGroup: string): Promise<Protocol[]> => {
  const { data, error } = await supabase
    .from('protocols')
    .select('*')
    .eq('tumour_group', tumorGroup)
    .order('code', { ascending: true });
  
  if (error) {
    console.error('Error fetching protocols:', error);
    throw new Error('Failed to fetch protocols');
  }
  
  // Convert database records to Protocol objects
  return data.map(protocol => toProtocol(protocol)).filter(Boolean);
};

export const getProtocolById = async (id: string): Promise<Protocol | null> => {
  const { data, error } = await supabase
    .from('protocols')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching protocol by ID:', error);
    return null;
  }
  
  return toProtocol(data);
};
```

### Supabase Table Schema

The primary table used is `protocols` with the following schema:

```sql
CREATE TABLE protocols (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR NOT NULL,
  tumour_group VARCHAR NOT NULL,
  tumour_supergroup VARCHAR,
  treatment_intent VARCHAR,
  summary TEXT,
  
  -- JSONB fields
  eligibility JSONB,
  treatment JSONB,
  tests JSONB,
  dose_modifications JSONB,
  precautions JSONB,
  reference_list JSONB,
  cycle_info JSONB,
  pre_medications JSONB,
  post_medications JSONB,
  supportive_care JSONB,
  rescue_agents JSONB,
  monitoring JSONB,
  toxicity_monitoring JSONB,
  interactions JSONB,
  
  -- Metadata
  version VARCHAR,
  created_by VARCHAR,
  updated_by VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_reviewed TIMESTAMP WITH TIME ZONE,
  status VARCHAR DEFAULT 'draft',
  
  -- Search
  search_vector TSVECTOR
);

-- Indexes
CREATE INDEX idx_protocols_tumour_group ON protocols (tumour_group);
CREATE INDEX idx_protocols_tumour_supergroup ON protocols (tumour_supergroup);
CREATE INDEX idx_protocols_code ON protocols (code);
CREATE INDEX idx_protocols_search ON protocols USING GIN (search_vector);
```

### Error Handling Pattern

The service layer implements a consistent error handling pattern:

1. Errors from Supabase are logged to console with context
2. User-friendly error messages are thrown to be handled by UI components
3. The component layer catches these errors and displays them via `ProtocolErrorState`

### Data Flow Pattern
1. `getSupergroups()` fetches available tumor supergroups
2. `getTumorGroups(supergroup)` fetches tumor groups within a selected supergroup
3. `getProtocolsByTumorGroup(group)` fetches protocols for a selected tumor group

### 5. API & Data Fetching Patterns

#### API Functions
- `getSupergroups()`: Fetches tumor supergroups
- `getTumorGroups(supergroup)`: Fetches tumor groups for a specific supergroup
- `getProtocolsByTumorGroup(group)`: Fetches protocols for a specific tumor group

#### Loading State Management
- Loading state is managed via a `loading` state variable
- The component displays `<ProtocolLoadingSkeleton />` during loading state

#### Error Handling
- Error state is managed via an `error` state variable
- The component displays `<ProtocolErrorState error={error} type="error" />` during error state
- Errors are caught in try/catch blocks or `.catch()` methods on promises

### 6. State Management

#### State Management Approach
The component uses React's built-in useState and useEffect hooks for state management:

- **Navigation State**:
  - `selectedSupergroup`, `selectedGroup`, and `selectedProtocol` track the user's navigation path
  
- **Data State**:
  - `supergroups`, `groups`, and `protocols` store the fetched data at each navigation level
  
- **UI State**:
  - `loading` and `error` manage the UI state for async operations
  
#### State Update Patterns
- The component uses cascading effects where changing one state triggers data fetching that updates another state
- Each selection level (supergroup, group) triggers a reset of the levels below it
- When `selectedProtocol` is set, the ProtocolDetailsDialog is shown

## Complete Protocol Type Definition

The Protocol interface in `src/types/protocol.ts` is quite extensive:

```typescript
// Key parts of the Protocol interface
export interface Protocol {
  // Required fields
  id: string;
  code: string;
  tumour_group: string;

  // Optional fields
  treatment_intent?: string;
  notes?: any[];
  eligibility?: ProtocolEligibility;
  treatment?: {
    drugs: ProtocolDrug[];
  };
  tests?: {
    baseline?: Test[] | string[];
    monitoring?: Test[] | string[];
  } | Test[];
  status?: string;
  dose_modifications?: DoseModification;
  precautions: ProtocolNote[];
  contraindications?: string | any[];
  reference_list?: string[];
  created_at?: string;
  updated_at?: string;
  pharmacokinetics?: Record<string, unknown>;
  interactions?: Interactions;
  drug_class?: DrugClass;
  administration_notes?: string[];
  supportive_care?: SupportiveCare;
  toxicity_monitoring?: ToxicityMonitoring;
  rescue_agents?: RescueAgent[];
  pre_medications?: Medications;
  post_medications?: Medications;
  monitoring?: any;
  comments?: string;
  created_by?: string;
  updated_by?: string;
  version?: string;
  tags?: string[];
  clinical_scenario?: string;
  last_reviewed?: string;
  summary?: string;
  ai_notes?: AIInsights;
  natural_language_prompt?: string;
  supportive_meds?: Drug[];
  cycle_info?: string;
  dose_reductions?: DoseReductions;
}
```

Notable supporting types include:

```typescript
export interface ProtocolDrug {
  name: string;
  dose: string;
  administration: string;
  special_notes: string[];
  supportiveCare?: string[];
}

export interface DoseModification {
  hematological: string[];
  nonHematological: string[];
  renal: string[];
  hepatic: string[];
}

export interface ProtocolEligibility {
  inclusion_criteria?: Array<{ criterion: string }>;
  exclusion_criteria?: Array<{ criterion: string }>;
}
```

Validation is primarily handled through type guards:

```typescript
export const isValidProtocol = (protocol: any): protocol is Protocol => {
  return (
    protocol && 
    typeof protocol === 'object' &&
    typeof protocol.id === 'string' &&
    typeof protocol.code === 'string' &&
    typeof protocol.tumour_group === 'string' &&
    protocol.treatment &&
    Array.isArray(protocol.treatment.drugs)
  );
};
```

### 7. Template JSON Structure

Based on the actual Protocol type definition, here's a real-world protocol JSON:

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "code": "ABVD",
  "tumour_group": "Lymphoma",
  "tumour_supergroup": "Hematologic",
  "treatment_intent": "Curative",
  "summary": "ABVD regimen for Hodgkin lymphoma (2-4 cycles for early-stage disease, 6 cycles for advanced disease)",
  "eligibility": {
    "inclusion_criteria": [
      { "criterion": "Confirmed diagnosis of classical Hodgkin lymphoma" },
      { "criterion": "Age ≥ 18 years" },
      { "criterion": "ECOG performance status 0-2" }
    ],
    "exclusion_criteria": [
      { "criterion": "LVEF < 45%" },
      { "criterion": "Significant pulmonary disease" },
      { "criterion": "Active uncontrolled infection" }
    ]
  },
  "treatment": {
    "drugs": [
      {
        "name": "Doxorubicin",
        "dose": "25 mg/m²",
        "administration": "IV push",
        "special_notes": [
          "Administer through free-flowing IV line",
          "Risk of extravasation"
        ]
      },
      {
        "name": "Bleomycin",
        "dose": "10 units/m²",
        "administration": "IV infusion",
        "special_notes": [
          "Monitor for pulmonary toxicity",
          "Consider omission in patients > 60 years"
        ]
      },
      {
        "name": "Vinblastine",
        "dose": "6 mg/m²",
        "administration": "IV push",
        "special_notes": [
          "Risk of extravasation"
        ]
      },
      {
        "name": "Dacarbazine",
        "dose": "375 mg/m²",
        "administration": "IV infusion",
        "special_notes": [
          "Administer over 30-60 minutes",
          "Risk of severe nausea"
        ]
      }
    ]
  },
  "tests": {
    "baseline": [
      { "name": "CBC with differential", "timing": "Within 3 days" },
      { "name": "Comprehensive metabolic panel", "timing": "Within 3 days" },
      { "name": "ECG", "timing": "Within 30 days" },
      { "name": "LVEF assessment", "timing": "Within 30 days" },
      { "name": "Pulmonary function tests", "timing": "Within 30 days" }
    ],
    "monitoring": [
      { "name": "CBC with differential", "timing": "Prior to each cycle" },
      { "name": "Comprehensive metabolic panel", "timing": "Prior to each cycle" },
      { "name": "LVEF assessment", "timing": "After 4 cycles" },
      { "name": "Pulmonary function tests", "timing": "If symptoms develop" }
    ]
  },
  "dose_modifications": {
    "hematological": [
      "ANC < 1.0 x 10⁹/L: Delay treatment until recovery",
      "Platelets < 75 x 10⁹/L: Delay treatment until recovery"
    ],
    "nonHematological": [
      "Grade 3-4 mucositis: Reduce dose of doxorubicin and vinblastine by 25%",
      "Grade 2 pulmonary toxicity: Discontinue bleomycin"
    ],
    "renal": [
      "CrCl < 30 mL/min: Reduce dacarbazine dose by 25%"
    ],
    "hepatic": [
      "Bilirubin 1.5-3 x ULN: Reduce doxorubicin dose by 25%",
      "Bilirubin > 3 x ULN: Reduce doxorubicin dose by 50%"
    ]
  },
  "precautions": [
    { "note": "Cardiac monitoring advised due to doxorubicin" },
    { "note": "Pulmonary monitoring during treatment due to bleomycin toxicity" },
    { "note": "Antiemetic prophylaxis required (high emetogenic potential)" }
  ],
  "pre_medications": {
    "required": [
      {
        "name": "Ondansetron",
        "dose": "16 mg",
        "administration": "IV",
        "timing": "30 minutes before chemotherapy"
      },
      {
        "name": "Dexamethasone",
        "dose": "12 mg",
        "administration": "IV",
        "timing": "30 minutes before chemotherapy"
      }
    ],
    "optional": [
      {
        "name": "Lorazepam",
        "dose": "0.5-1 mg",
        "administration": "IV",
        "timing": "As needed for breakthrough nausea"
      }
    ]
  },
  "monitoring": {
    "baseline": [
      "ECG",
      "LVEF assessment",
      "PFTs including DLCO"
    ],
    "ongoing": [
      "Respiratory symptoms before each bleomycin dose",
      "Cardiac assessment after 4 cycles"
    ],
    "frequency": "Each cycle"
  },
  "version": "3.1",
  "created_by": "Dr. A. Smith",
  "updated_by": "Dr. J. Johnson",
  "created_at": "2023-05-15T10:30:00Z",
  "updated_at": "2024-02-20T14:45:00Z",
  "last_reviewed": "2024-02-20T14:45:00Z",
  "status": "Active"
}
```

### 8. Business Logic Analysis

#### Navigation Logic
- The component implements a hierarchical navigation pattern (supergroup → group → protocol)
- Each selection resets the levels below it

#### Conditional Rendering
- Different views are conditionally rendered based on the navigation state:
  1. Supergroup selection (when no supergroup is selected)
  2. Group selection (when supergroup is selected but no group)
  3. Protocol list (when both supergroup and group are selected)
  4. Protocol details (when a protocol is selected, shown in a dialog)

#### Error Handling
- API errors are caught and displayed via the ProtocolErrorState component
- Empty states are handled (e.g., "No protocols found" message when the protocol list is empty)

## Special Component Analysis

### MetadataFooter.tsx

```tsx
// MetadataFooter.tsx
import React from 'react';
import { Clock, Calendar, Tag, User } from 'lucide-react';
import type { Protocol } from '@/types/protocol';
import { formatDate } from '@/utils/dateFormatters';

interface MetadataFooterProps {
  protocol: Protocol;
}

const MetadataFooter: React.FC<MetadataFooterProps> = ({ protocol }) => {
  const lastUpdated = protocol.updated_at ? formatDate(protocol.updated_at) : 'Unknown';
  const version = protocol.version || 'N/A';
  const author = protocol.created_by || 'Unknown';
  const lastReviewed = protocol.last_reviewed ? formatDate(protocol.last_reviewed) : 'Not reviewed';
  
  return (
    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-6">
      <div className="flex flex-wrap text-xs text-gray-500 dark:text-gray-400 gap-4">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>Updated: {lastUpdated}</span>
        </div>
        <div className="flex items-center gap-1">
          <Tag className="w-3 h-3" />
          <span>Version: {version}</span>
        </div>
        <div className="flex items-center gap-1">
          <User className="w-3 h-3" />
          <span>Author: {author}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          <span>Last reviewed: {lastReviewed}</span>
        </div>
      </div>
    </div>
  );
};

export default MetadataFooter;
```

### ProtocolDetailPageContainer.tsx

```tsx
// ProtocolDetailPageContainer.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProtocolById } from '@/services/protocols';
import TreatmentTab from '../TreatmentTab';
import OverviewTab from '../OverviewTab';
import EligibilityTab from '../EligibilityTab';
import DoseModificationsTab from '../DoseModificationsTab';
import TestsSectionTab from '../TestsSectionTab';
import InfoTab from '../InfoTab';
import ProtocolLoadingSkeleton from '../ProtocolLoadingSkeleton';
import ProtocolErrorState from '../ProtocolErrorState';
import type { Protocol } from '@/types/protocol';
import { ChevronLeft, Printer } from 'lucide-react';
import { generateProtocolPDF } from '../utils/pdfGenerator';

const ProtocolDetailPageContainer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [protocol, setProtocol] = useState<Protocol | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');
  
  useEffect(() => {
    if (!id) {
      setError('Protocol ID is missing');
      setLoading(false);
      return;
    }
    
    const loadProtocol = async () => {
      try {
        setLoading(true);
        const data = await getProtocolById(id);
        if (!data) {
          setError('Protocol not found');
        } else {
          setProtocol(data);
        }
      } catch (err) {
        setError('Failed to load protocol details');
      } finally {
        setLoading(false);
      }
    };
    
    loadProtocol();
  }, [id]);
  
  const handlePrintPDF = async () => {
    if (protocol) {
      await generateProtocolPDF(protocol);
    }
  };
  
  if (loading) return <ProtocolLoadingSkeleton />;
  if (error || !protocol) return <ProtocolErrorState error={error || 'Protocol not found'} type="error" />;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-indigo-600 hover:text-indigo-800"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back
          </button>
          <button 
            onClick={handlePrintPDF}
            className="flex items-center bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
          >
            <Printer className="w-4 h-4 mr-1" />
            Print
          </button>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-indigo-900 dark:text-indigo-300 mb-2">{protocol.code}</h1>
          <h2 className="text-xl text-gray-600 dark:text-gray-400 mb-6">{protocol.tumour_group}</h2>
          
          {/* Tab navigation */}
          <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6 overflow-x-auto">
            {['overview', 'eligibility', 'treatment', 'tests', 'modifications', 'info'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 mr-2 transition-all ${
                  activeTab === tab 
                    ? 'border-b-2 border-indigo-500 text-indigo-600 font-medium'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          
          {/* Tab content */}
          <div className="py-2">
            {activeTab === 'overview' && <OverviewTab protocol={protocol} />}
            {activeTab === 'eligibility' && <EligibilityTab protocol={protocol} />}
            {activeTab === 'treatment' && <TreatmentTab treatment={protocol.treatment} />}
            {activeTab === 'tests' && <TestsSectionTab protocol={protocol} />}
            {activeTab === 'modifications' && <DoseModificationsTab protocol={protocol} />}
            {activeTab === 'info' && <InfoTab protocol={protocol} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProtocolDetailPageContainer;
```

### DrawerOverlay.tsx

```tsx
// DrawerOverlay.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn'; // utility for combining classnames

interface DrawerOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  position?: 'left' | 'right';
  width?: string;
  children: React.ReactNode;
}

const DrawerOverlay: React.FC<DrawerOverlayProps> = ({
  isOpen,
  onClose,
  position = 'right',
  width = '24rem',
  children
}) => {
  // Determine animation properties based on position
  const drawerVariants = {
    hidden: {
      x: position === 'right' ? '100%' : '-100%',
      opacity: 0
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    exit: {
      x: position === 'right' ? '100%' : '-100%',
      opacity: 0,
      transition: {
        ease: 'easeInOut',
        duration: 0.3
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />
          
          {/* Drawer */}
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={drawerVariants}
            className={cn(
              "fixed top-0 bottom-0 bg-white dark:bg-gray-800 shadow-xl z-50 overflow-y-auto",
              position === 'right' ? 'right-0' : 'left-0'
            )}
            style={{ width }}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DrawerOverlay;
```

## Card Component Styling Deep Dive

The `UnifiedProtocolCard.tsx` component uses these classes:

```tsx
// Card container
"p-4 bg-white dark:bg-gray-900 shadow rounded-lg cursor-pointer hover:shadow-lg transition-all"
// This creates a card with padding, white background (dark gray in dark mode),
// a subtle shadow, rounded corners, and cursor pointer on hover with a transition effect

// Inner content container
"flex flex-col gap-2"
// This sets up a column layout with 8px (0.5rem) gap between elements

// Protocol code display
"text-xl font-bold text-indigo-800"
// This creates a large, bold, indigo-colored heading

// Tumor group display
"text-sm text-gray-600"
// This creates a smaller gray text

// Treatment intent display (conditional)
"text-xs text-gray-500"
// This creates an even smaller, lighter gray text
```

## Dialog Implementation Details

The `ProtocolDetailsDialog.tsx` component likely uses the Radix UI Dialog component:

```tsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { Protocol } from '@/types/protocol';
import MetadataFooter from './MetadataFooter';
import TreatmentTab from '../TreatmentTab';
import OverviewTab from '../OverviewTab';
import EligibilityTab from '../EligibilityTab';
import DoseModificationsTab from '../DoseModificationsTab';
import TestsSectionTab from '../TestsSectionTab';
import InfoTab from '../InfoTab';

interface ProtocolDetailsDialogProps {
  protocol: Protocol;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProtocolDetailsDialog: React.FC<ProtocolDetailsDialogProps> = ({
  protocol,
  open,
  onOpenChange
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Animation variants for tab content
  const tabContentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="px-6 pt-6 pb-2 sticky top-0 bg-white dark:bg-gray-900 z-10 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-indigo-900 dark:text-indigo-300">
              {protocol.code}
            </DialogTitle>
            <button
              onClick={() => onOpenChange(false)}
              className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="text-gray-600 dark:text-gray-400 mt-1">
            {protocol.tumour_group}
            {protocol.treatment_intent && (
              <span className="ml-2 text-sm text-gray-500">
                ({protocol.treatment_intent})
              </span>
            )}
          </div>
        </DialogHeader>
        
        <Tabs
          defaultValue="overview"
          value={activeTab}
          onValueChange={setActiveTab}
          className="px-6 py-4"
        >
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
            <TabsTrigger value="treatment">Treatment</TabsTrigger>
            <TabsTrigger value="tests">Tests</TabsTrigger>
            <TabsTrigger value="modifications">Dose Modifications</TabsTrigger>
            <TabsTrigger value="info">Info</TabsTrigger>
          </TabsList>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial="hidden"
              animate="visible"
              variants={tabContentVariants}
            >
              <TabsContent value="overview" className="mt-0">
                <OverviewTab protocol={protocol} />
              </TabsContent>
              <TabsContent value="eligibility" className="mt-0">
                <EligibilityTab protocol={protocol} />
              </TabsContent>
              <TabsContent value="treatment" className="mt-0">
                <TreatmentTab treatment={protocol.treatment} />
              </TabsContent>
              <TabsContent value="tests" className="mt-0">
                <TestsSectionTab protocol={protocol} />
              </TabsContent>
              <TabsContent value="modifications" className="mt-0">
                <DoseModificationsTab protocol={protocol} />
              </TabsContent>
              <TabsContent value="info" className="mt-0">
                <InfoTab protocol={protocol} />
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
        
        <div className="px-6 pb-6">
          <MetadataFooter protocol={protocol} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProtocolDetailsDialog;
```

## Tab System Architecture

The tab system uses a combination of state management and conditional rendering:

1. **Tab Registration**: Tabs are statically defined in the `ProtocolDetailsDialog` component.

2. **Tab State Management**:
```tsx
const [activeTab, setActiveTab] = useState('overview');
```

3. **Data Passing**: Each tab component receives the entire protocol or relevant sections:
```tsx
<OverviewTab protocol={protocol} />
<TreatmentTab treatment={protocol.treatment} />
```

4. **Tab Animation**: Framer Motion is used for smooth transitions between tabs:
```tsx
<AnimatePresence mode="wait">
  <motion.div
    key={activeTab}
    initial="hidden"
    animate="visible"
    variants={tabContentVariants}
  >
    {/* Tab content here */}
  </motion.div>
</AnimatePresence>
```

## Data Flow Visualization

```
User selects supergroup → 
   State update: setSelectedSupergroup(sg) → 
      Effect triggers → 
         API call: getTumorGroups(selectedSupergroup) →
            State update: setGroups(data) →
               UI update: Show tumor groups

User selects tumor group → 
   State update: setSelectedGroup(g) → 
      Effect triggers → 
         API call: getProtocolsByTumorGroup(selectedGroup) →
            State update: setProtocols(data) →
               UI update: Show protocol cards

User clicks protocol card → 
   State update: setSelectedProtocol(protocol) →
      UI update: ProtocolDetailsDialog rendered with protocol={selectedProtocol}

User closes dialog → 
   Dialog onOpenChange(false) → 
      State update: setSelectedProtocol(null) →
         UI update: Dialog unmounts

User clicks back button → 
   State update: setSelectedGroup(null) or setSelectedSupergroup(null) →
      Previous view is shown
```

Error flow:
```
API call fails →
   catch block executed → 
      State update: setError('Error message') →
         UI update: <ProtocolErrorState error={error} /> is rendered
```

## Performance Implementation Details

### Loading State Management

```tsx
// In TreatmentProtocols.tsx
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchSupergroups = async () => {
    try {
      setLoading(true); // Start loading
      setError(null);
      const data = await getSupergroups();
      setSupergroups(data);
    } catch (err) {
      setError('Failed to load tumour supergroups.');
    } finally {
      setLoading(false); // End loading regardless of success/failure
    }
  };
  fetchSupergroups();
}, []);

// Loading state conditionally renders a skeleton UI
if (loading) return <ProtocolLoadingSkeleton />;
```

### Lazy Loading Implementation

The `ProtocolDetailsDialog` component likely implements lazy loading for tabs:

```tsx
// Pseudo-code for lazy loading tab content in ProtocolDetailsDialog
import React, { lazy, Suspense } from 'react';

// Lazy load tab components
const TreatmentTab = lazy(() => import('../TreatmentTab'));
const OverviewTab = lazy(() => import('../OverviewTab'));
// ...other tab imports

// In the render function
{activeTab === 'treatment' && (
  <Suspense fallback={<div className="animate-pulse h-32 bg-gray-200 rounded"></div>}>
    <TreatmentTab treatment={protocol.treatment} />
  </Suspense>
)}
```

## Integration Points

### CDU Module Routing

The Treatment Protocols module integrates with routing via:

```tsx
// In cduRoutes.tsx
import TreatmentProtocols from '@/modules/cdu/treatmentProtocols/TreatmentProtocols';
import ProtocolDetailPageContainer from '@/modules/cdu/treatmentProtocols/ProtocolDetailPageContainer';

const cduRoutes = [
  {
    path: 'treatment-protocols',
    element: <TreatmentProtocols />
  },
  {
    path: 'protocol/:id',
    element: <ProtocolDetailPageContainer />
  }
];
```

### Authentication/Authorization Integration

Authorization checks are likely implemented at the service layer or with a higher-order component:

```tsx
// Pseudo-code for authorization integration
import { useAuth } from '@/hooks/useAuth';

const withProtocolAccess = (Component) => {
  return (props) => {
    const { user, hasPermission } = useAuth();
    
    if (!user) {
      return <Navigate to="/login" />;
    }
    
    if (!hasPermission('view:protocols')) {
      return <AccessDeniedPage />;
    }
    
    return <Component {...props} />;
  };
};

export default withProtocolAccess(TreatmentProtocols);
```

## Error Handling Deep Dive

The error handling strategy follows a pattern throughout the module:

1. State management for errors:
```tsx
const [error, setError] = useState<string | null>(null);
```

2. Try-catch blocks with specific error messages:
```tsx
try {
  setLoading(true);
  setError(null);
  const data = await getSupergroups();
  setSupergroups(data);
} catch (err) {
  // Specific error message based on the operation
  setError('Failed to load tumour supergroups.');
} finally {
  setLoading(false);
}
```

3. Conditional rendering of error component:
```tsx
if (error) return <ProtocolErrorState error={error} type="error" />;
```

4. The ProtocolErrorState component:
```tsx
// ProtocolErrorState.tsx
import React from 'react';
import { AlertCircle, Info, AlertTriangle } from 'lucide-react';

interface ProtocolErrorStateProps {
  error: string;
  type?: 'error' | 'warning' | 'info';
}

const ProtocolErrorState: React.FC<ProtocolErrorStateProps> = ({ 
  error, 
  type = 'error' 
}) => {
  const iconMap = {
    error: <AlertCircle className="w-8 h-8 text-red-500" />,
    warning: <AlertTriangle className="w-8 h-8 text-amber-500" />,
    info: <Info className="w-8 h-8 text-blue-500" />
  };
  
  const colorMap = {
    error: 'bg-red-50 text-red-800 border-red-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200'
  };
  
  return (
    <div className={`p-6 rounded-lg border ${colorMap[type]} flex items-center justify-center min-h-[200px]`}>
      <div className="flex flex-col items-center text-center">
        {iconMap[type]}
        <p className="mt-4 text-lg font-medium">{error}</p>
        {type === 'error' && (
          <p className="mt-2 text-sm">Please try again or contact support if the problem persists.</p>
        )}
      </div>
    </div>
  );
};

export default ProtocolErrorState;
```

## File Map

### Core Files
- `TreatmentProtocols.tsx`: Main component orchestrating the protocol selection workflow
- `UnifiedProtocolCard.tsx`: Card component displaying protocol summary
- `ProtocolDetailsDialog.tsx`: Dialog showing detailed protocol information

### Tab Components
- `TreatmentTab.tsx`: Treatment details tab
- `OverviewTab.tsx`: Protocol overview tab
- `EligibilityTab.tsx`: Eligibility criteria tab
- `DoseModificationsTab.tsx`: Dose modifications tab
- `InfoTab.tsx`: General info tab
- `TestsSectionTab.tsx`: Tests section tab

### UI Components
- `ProtocolLoadingSkeleton.tsx`: Loading state component
- `ProtocolErrorState.tsx`: Error handling component
- `DrawerOverlay.tsx`: Overlay component for drawers

### Utilities
- `pdfGenerator.ts`: PDF generation utility

### Data
- `treatmentProtocolsData.ts`: Protocol data constants

## Recommendations

1. **State Management Improvements**
   - Consider implementing caching for API responses to improve performance during navigation
   - The current state management is adequate but could be refactored to use React Context or a custom hook for cleaner code organization

2. **Progressive Enhancement**
   - Add search and filtering capabilities for protocols as the database grows
   - Implement bookmarking or favoriting of frequently used protocols

3. **UX Enhancements**
   - Add breadcrumbs to improve navigation clarity
   - Implement a "Recently viewed" section for quick access to frequently used protocols

4. **Technical Debt**
   - Some TypeScript errors are present in the codebase (see ts-errors.log)
   - Consider creating a dedicated Protocol service or custom hook to encapsulate protocol-related data fetching

5. **Accessibility**
   - Ensure all interactive elements have proper ARIA attributes
   - Verify keyboard navigation works correctly through the hierarchy

6. **Code Organization**
   - Consider consolidating the tab components into a single directory for better organization
   - Extract repeated styling patterns into shared components or utility classes

7. **Documentation**
   - Add JSDoc comments to functions and components
   - Document the Protocol type structure more explicitly
