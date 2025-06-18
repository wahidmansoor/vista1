# OncoVista UI Standardization & Implementation Guide

## Overview

This document outlines the complete UI standardization implementation for OncoVista, ensuring all modules have identical layout patterns, styling consistency, and unified design system.

## ✅ Completed Components

### 1. Design Token System
- **File**: `src/styles/design-tokens.css`
- **Status**: ✅ Complete
- **Features**:
  - Unified color palette (single blue primary color)
  - Standardized spacing scale
  - Consistent shadow depths
  - Typography scale
  - Component-specific tokens
  - Dark mode support

### 2. Universal Module Layout
- **File**: `src/components/Layout/UniversalModuleLayout.tsx`
- **Status**: ✅ Complete
- **Features**:
  - Standardized layout structure for ALL modules
  - Optional sidebar support
  - Responsive grid system
  - Proper semantic HTML
  - Accessibility features (ARIA labels, proper headings)

### 3. Standardized Components
- **StandardButton**: `src/components/ui/StandardButton.tsx` ✅
- **StandardInput**: `src/components/ui/StandardInput.tsx` ✅
- **Component Exports**: `src/components/standardized/index.ts` ✅

### 4. Updated Styles
- **Main CSS**: `src/index.css` ✅ Updated with design tokens
- **Token Import**: Design tokens imported and integrated

## 🔄 Implementation Requirements for ALL Modules

### Required Changes for Each Module

All modules (OPD, CDU, Palliative, Tools, Handbook, Inpatient) MUST implement:

#### 1. Layout Structure Standardization

**Replace existing layouts with:**
```tsx
import { UniversalModuleLayout } from '@/components/standardized';

export const YourModule = () => {
  return (
    <UniversalModuleLayout
      title="Module Name"
      subtitle="Module description"
      icon={YourIcon}
      headerActions={<StandardButton>Action</StandardButton>}
    >
      <ModuleGrid>
        <ModuleCard>Content</ModuleCard>
      </ModuleGrid>
    </UniversalModuleLayout>
  );
};
```

#### 2. Component Standardization

**Replace ALL existing components with standardized versions:**

```tsx
// OLD - Remove these
import { Button } from './components/Button';
import { Card } from './components/Card';

// NEW - Use these instead
import { 
  StandardButton, 
  ModuleCard, 
  ModuleGrid,
  StandardInput 
} from '@/components/standardized';
```

#### 3. Color System Migration

**Replace ALL color inconsistencies:**

```css
/* REMOVE - Inconsistent colors */
.blue-600 { } 
.blue-700 { }
.indigo-600 { }

/* USE - Unified primary colors */
.bg-primary-600 { }
.text-primary-600 { }
.border-primary-600 { }
```

#### 4. Spacing Standardization

**Replace ALL spacing inconsistencies:**

```css
/* REMOVE - Mixed spacing */
.space-y-4 { }
.space-y-6 { }
.gap-4 { }
.gap-6 { }

/* USE - Standardized spacing */
.space-y-6 { }  /* Only this for vertical spacing */
.gap-6 { }      /* Only this for grid gaps */
```

## 📋 Module-Specific Implementation Tasks

### OPD Module
- [ ] Replace `OPDLayout.tsx` with `UniversalModuleLayout`
- [ ] Update `EvaluationStepper.tsx` with standardized spacing
- [ ] Replace custom buttons with `StandardButton`
- [ ] Remove `opd.css` inconsistent styles
- [ ] Migrate all cards to `ModuleCard`

### CDU Module  
- [ ] Replace `CDULayout.tsx` with `UniversalModuleLayout`
- [ ] Remove heavy gradients from `TreatmentProtocols.tsx`
- [ ] Replace custom CSS variables with design tokens
- [ ] Standardize all form components
- [ ] Update grid systems to use `ModuleGrid`

### Palliative Care Module
- [ ] Update `SymptomControl.tsx` layout
- [ ] Replace `.palliative-card` with `ModuleCard`
- [ ] Unify typography with global scale
- [ ] Standardize spacing patterns

### Tools Module
- [ ] Update `ToolCard.tsx` to use `ModuleCard`
- [ ] Align grid system with unified responsive pattern
- [ ] Standardize all interactive elements

### Handbook Module
- [ ] Maintain two-column layout but standardize sidebar
- [ ] Align prose typography with global system
- [ ] Update content renderer with standard components

### Inpatient Module
- [ ] Implement `UniversalModuleLayout`
- [ ] Standardize admission templates
- [ ] Update all forms to use `StandardInput`

## 🎨 Design Token Usage Guide

### Colors
```css
/* Primary Colors - USE ONLY THESE */
--color-primary-50: #eff6ff;
--color-primary-600: #2563eb;  /* Main primary */
--color-primary-700: #1d4ed8;  /* Primary dark */

/* Semantic Colors */
--color-success: #10b981;
--color-warning: #f59e0b;
--color-error: #ef4444;
```

### Spacing
```css
/* Spacing Scale - USE ONLY THESE */
--space-xs: 0.25rem;   /* 4px */
--space-sm: 0.5rem;    /* 8px */
--space-md: 1rem;      /* 16px */
--space-lg: 1.5rem;    /* 24px - PRIMARY */
--space-xl: 2rem;      /* 32px */
```

### Shadows
```css
/* Shadow Scale - USE ONLY THESE */
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);  /* PRIMARY */
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
```

## 📱 Responsive Patterns

### Required Breakpoint Behavior
All modules MUST use these exact responsive patterns:

```tsx
// Grid Columns
<ModuleGrid 
  colsMobile={1}     // grid-cols-1
  colsTablet={2}     // sm:grid-cols-2  
  colsDesktop={3}    // lg:grid-cols-3
>

// Container Padding
<div className="oncovista-container"> // Handles responsive padding
  // px-4 on mobile, px-6 on tablet, px-8 on desktop
</div>

// Typography Scaling
<h1 className="text-xl sm:text-2xl lg:text-3xl">
```

## 🔧 Implementation Checklist

### Phase 1: Foundation (✅ Complete)
- [x] Create design token system
- [x] Build universal layout component
- [x] Create standardized button and input components
- [x] Set up component export system

### Phase 2: Module Updates (🔄 In Progress)
- [ ] OPD Module standardization
- [x] CDU Module header visibility issues FIXED  
- [ ] Palliative Care Module standardization
- [ ] Tools Module standardization
- [ ] Handbook Module standardization
- [ ] Inpatient Module standardization

### Phase 3: Quality Assurance
- [ ] Visual consistency audit
- [ ] Accessibility compliance check (WCAG 2.1 AA)
- [ ] Performance optimization
- [ ] Cross-browser testing
- [ ] Mobile responsiveness validation

## 🚀 Next Steps

1. **Start with OPD Module** - Update the main component file first
2. **Test Layout Changes** - Ensure the universal layout works correctly
3. **Replace Components Systematically** - One component type at a time
4. **Remove Old Styles** - Clean up module-specific CSS files
5. **Validate Consistency** - Check all modules look identical

## 📐 Success Criteria

- [ ] All modules use identical layout structure
- [ ] No color inconsistencies (single blue palette only)
- [ ] No spacing variations (unified scale only)
- [ ] WCAG 2.1 AA compliance achieved
- [ ] Performance score >90 on all pages
- [ ] Mobile-responsive on all devices
- [ ] TypeScript strict mode compliance

## 🔗 Key Files

| Component | File Path | Status |
|-----------|-----------|---------|
| Design Tokens | `src/styles/design-tokens.css` | ✅ Complete |
| Universal Layout | `src/components/Layout/UniversalModuleLayout.tsx` | ✅ Complete |
| Standard Button | `src/components/ui/StandardButton.tsx` | ✅ Complete |
| Standard Input | `src/components/ui/StandardInput.tsx` | ✅ Complete |
| Component Exports | `src/components/standardized/index.ts` | ✅ Complete |
| Main Styles | `src/index.css` | ✅ Updated |

## 💡 Usage Examples

### Basic Module Structure
```tsx
import { 
  UniversalModuleLayout, 
  ModuleGrid, 
  ModuleCard, 
  StandardButton 
} from '@/components/standardized';
import { Stethoscope } from 'lucide-react';

export const ExampleModule = () => (
  <UniversalModuleLayout
    title="Module Name"
    subtitle="Brief description"
    icon={Stethoscope}
    headerActions={
      <StandardButton variant="primary">
        New Action
      </StandardButton>
    }
  >
    <ModuleGrid>
      <ModuleCard 
        title="Card Title"
        description="Card description"
        interactive
        onClick={() => {}}
      >
        Card content here
      </ModuleCard>
    </ModuleGrid>
  </UniversalModuleLayout>
);
```

This standardization ensures visual consistency, improved maintainability, and enhanced user experience across all OncoVista modules.
