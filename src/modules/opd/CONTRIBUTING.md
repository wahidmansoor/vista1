# Contributing to the OPD Module

## Getting Started

The Oncology Outpatient Department (OPD) Module is built using React with TypeScript, Tailwind CSS for styling, and Headless UI for accessible components.

## Folder Structure

```
/opd
├── components/         # Reusable components
├── context/            # State management contexts
├── cards/              # Card container components for each section
├── layout/             # Layout components 
├── types/              # TypeScript interfaces and types
├── styles/             # CSS styles
├── data/               # Static data and templates
├── [feature-folders]/  # Feature-specific components and logic
│   ├── PatientEvaluation/
│   ├── DiagnosticPathways/
│   └── etc...
└── OPD.tsx            # Main module entry point
```

## Component Architecture

We follow a component-based architecture with the following principles:

1. **Reusable Components**: Create small, reusable components in the `components/` directory.
2. **Feature-based Organization**: Group feature-specific components in their own directories.
3. **Context-based State Management**: Use React Context for shared state across components.
4. **TypeScript**: Use TypeScript for all components and utilities.

## State Management

The module uses React Context for state management:

- `EvaluationContext`: Manages form data, selection state, and form submission state
- Local component state: For UI-specific state that doesn't need to be shared

## Development Guidelines

### Component Creation

When creating new components:

1. Use TypeScript interfaces for props
2. Implement proper accessibility attributes
3. Follow the naming convention: `ComponentName.tsx`
4. Include test files in a `__tests__` directory

Example:

```tsx
// ComponentName.tsx
import React from 'react';

interface ComponentNameProps {
  // Props definition
}

const ComponentName: React.FC<ComponentNameProps> = ({ /* props */ }) => {
  return (
    // JSX
  );
};

export default ComponentName;
```

### Testing

For each component, create a corresponding test file:

```tsx
// __tests__/ComponentName.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import ComponentName from '../ComponentName';

describe('ComponentName', () => {
  it('renders correctly', () => {
    // Test implementation
  });
});
```

To run tests, make sure you have the following dependencies installed:
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @types/jest
```

### Styling

We use Tailwind CSS for styling. Follow these guidelines:

1. Use utility classes for most styling needs
2. Create custom classes only when necessary
3. For complex components, use component composition instead of complex styling

### Accessibility

Ensure all components:

1. Have proper ARIA attributes
2. Are keyboard navigable
3. Have sufficient color contrast
4. Include proper focus states

### Adding New Features

When adding new features to the OPD module:

1. Create a new directory in the root of `/opd` for the feature
2. Implement the main component and any sub-components
3. Add the feature to the tab navigation in `OPDModule.tsx`
4. Add a route for the feature in `OPD.tsx`
5. Create appropriate tests

## Pull Request Process

1. Update documentation reflecting any changes
2. Add tests for new functionality
3. Ensure all linting and tests pass
4. Get at least one review before merging

## Common Issues

### HeadlessUI Installation

If you encounter issues with HeadlessUI:

```bash
npm install @headlessui/react
```

### Context Usage

To use the evaluation context:

```tsx
import { useEvaluation } from '../context/EvaluationContext';

const MyComponent = () => {
  const { formData, updateFormField } = useEvaluation();
  
  // Component implementation
};
```

## Resources

- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [HeadlessUI Documentation](https://headlessui.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Testing Library Documentation](https://testing-library.com/docs/) 