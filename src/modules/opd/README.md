# Oncology Outpatient Department (OPD) Module

## Overview
The OPD module provides a comprehensive interface for managing oncology outpatient services through multiple specialized sections. Built using React and headlessUI, it offers a tab-based navigation system for different aspects of oncology care.

## Structure
```
/opd
├── OPD.tsx                      # Main component
├── patient-evaluation/          # Patient evaluation components
├── diagnostic-pathways/         # Diagnostic pathway components
├── cancer-screening/           # Cancer screening components
└── referral-guidelines/        # Referral guidelines components
```

## Features

### 1. Patient Evaluation
- Initial patient assessment
- Medical history recording
- Physical examination documentation
- Symptom evaluation

### 2. Follow-Up Oncology
- Patient progress tracking
- Treatment response monitoring
- Side effects management
- Follow-up scheduling

### 3. Diagnostic Pathways
- Standardized diagnostic protocols
- Test ordering and tracking
- Results interpretation
- Diagnostic workflow management

### 4. Cancer Screening
- Screening protocols implementation
- Risk assessment tools
- Early detection programs
- Screening schedule management

### 5. Referral Guidelines
- Specialist referral protocols
- Referral criteria
- Inter-department coordination
- Referral tracking system

## Technical Implementation

### Navigation
The module uses `@headlessui/react` Tab components for navigation with the following features:
- Responsive tab interface
- State management using React hooks
- Dynamic content rendering
- Smooth transitions between sections

### Styling
- Utilizes Tailwind CSS for styling
- Gradient backgrounds
- Responsive design
- Interactive elements with hover states
- Consistent color scheme (indigo and teal)

### Component Structure
```tsx
OPD
├── Tab.Group
│   ├── Tab.List
│   │   └── Tab (for each section)
│   └── Tab.Panels
│       └── Tab.Panel (for each section)
```

## Usage
To navigate between different sections:
1. Click on the desired tab in the navigation bar
2. The corresponding content will be displayed in the main panel
3. Each section maintains its own state and functionality

## Future Enhancements
- Integration with patient management system
- Advanced reporting features
- Data analytics dashboard
- Mobile responsiveness improvements
