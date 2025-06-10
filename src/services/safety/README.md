# Medical Safety System

A comprehensive safety monitoring and validation system for oncology clinical decision support.

## Overview

The Medical Safety System provides multi-layered safety checks and validations for oncology workflows, including:

- Clinical rules engine with severity scoring
- Drug interaction monitoring
- Allergy and contraindication checking
- Age-appropriate dosing validation
- Cancer-specific safety protocols
- Clinical guideline compliance
- Real-time alerts and notifications
- Escalation paths for high-risk scenarios

## Architecture

The system is built with three main components:

1. **SafetySystem**: Core safety checking engine that processes clinical data through multiple validation layers
2. **SafetySystemFactory**: Factory class for initializing the system with default rules and configurations
3. **Types**: TypeScript interfaces and enums defining the safety system's data structures

## Usage

### Basic Setup

```typescript
import { SafetySystemFactory } from './SafetySystemFactory';

// Create a new safety system instance with default configurations
const safetySystem = await SafetySystemFactory.createSafetySystem();
```

### Performing Safety Checks

```typescript
// Clinical data to validate
const clinicalData = {
  age: 65,
  diagnosis: 'breast_cancer',
  medications: ['cisplatin', 'furosemide'],
  allergies: ['penicillin'],
  treatmentType: 'chemotherapy',
  labs: {
    creatinine: 1.2,
    platelets: 150
  }
};

// Perform comprehensive safety check
const result = await safetySystem.performSafetyCheck(clinicalData);

if (!result.passed) {
  console.log('Safety checks failed:');
  result.alerts.forEach(alert => {
    console.log(`[${alert.severity}] ${alert.message}`);
  });

  if (result.requiresEscalation) {
    console.log('Escalation required. Recommendations:', result.recommendations);
  }
}
```

### Adding Custom Rules

```typescript
safetySystem.addRule({
  id: crypto.randomUUID(),
  name: 'Custom Lab Value Check',
  description: 'Validates specific lab values',
  category: 'labs',
  severity: SafetySeverityLevel.HIGH,
  conditions: [
    {
      type: 'lab',
      operator: 'lessThan',
      value: 50,
      parameters: { labName: 'platelets' }
    }
  ],
  actions: [
    {
      type: 'block',
      severity: SafetySeverityLevel.HIGH,
      message: 'Platelet count too low for treatment',
      additionalData: { threshold: 50 }
    }
  ],
  enabled: true,
  lastUpdated: new Date()
});
```

### Managing Drug Interactions

```typescript
safetySystem.addDrugInteraction({
  id: crypto.randomUUID(),
  drug1: 'drug_a',
  drug2: 'drug_b',
  severity: SafetySeverityLevel.HIGH,
  mechanism: 'Interaction mechanism',
  effect: 'Clinical effect',
  recommendations: ['Recommendation 1', 'Recommendation 2'],
  evidenceLevel: 'Level 1',
  lastUpdated: new Date()
});
```

## Safety Levels

The system uses four severity levels for alerts:

- **LOW**: Informational alerts that don't require immediate action
- **MEDIUM**: Warnings that should be reviewed but don't block workflow
- **HIGH**: Serious safety concerns requiring acknowledgment
- **CRITICAL**: Blocking issues that must be resolved before proceeding

## Audit Logging

All safety checks are automatically logged using the MedicalAuditLogger, providing:

- Comprehensive audit trails
- Compliance tracking
- Performance monitoring
- Error alerting

## Emergency Contacts

The system maintains an emergency contact directory for escalations:

```typescript
const contacts = safetySystem.emergencyContacts;
// Access based on availability or specialty
const oncologyContact = contacts.find(c => 
  c.specialties.includes('Medical Oncology')
);
```

## Clinical Guidelines

The system supports multiple guideline sources:

- NCCN Guidelines
- ASCO Guidelines
- Local institutional protocols

Guidelines are automatically validated against clinical data during safety checks.

## Best Practices

1. Always initialize the system using SafetySystemFactory for consistent configuration
2. Perform safety checks early in clinical workflows
3. Handle all severity levels appropriately in your UI
4. Log and monitor escalation patterns
5. Keep drug interaction database updated
6. Regularly review and update clinical rules

## Error Handling

The system uses TypeScript for type safety and includes comprehensive error handling:

```typescript
try {
  const result = await safetySystem.performSafetyCheck(clinicalData);
  // Handle results
} catch (error) {
  // System-level errors (not safety alerts)
  console.error('Safety system error:', error);
}
```

## Future Enhancements

Planned features include:

- ML-based risk prediction
- Real-time guideline updates
- Integration with external drug databases
- Enhanced audit reporting
- Customizable alert thresholds
