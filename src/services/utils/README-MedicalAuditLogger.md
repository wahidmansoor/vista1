# Medical Audit Logger

A comprehensive HIPAA-compliant logging system for medical applications with support for structured logging, performance metrics, and compliance reporting.

## Features

- HIPAA-compliant logging with automatic data anonymization
- Structured logging with correlation IDs
- Performance metrics tracking
- AI interaction auditing
- Error categorization and alerting
- External logging service integration (ELK stack, Splunk)
- Compliance reporting
- Configurable log retention
- Real-time monitoring metrics

## Usage

```typescript
// Initialize the logger
const logger = MedicalAuditLogger.getInstance({
  retentionDays: 90,
  logLevel: LogLevel.INFO,
  enableAnonymization: true,
  externalServices: [
    {
      type: 'ELK',
      endpoint: 'https://elk.example.com',
      apiKey: process.env.ELK_API_KEY
    }
  ]
});

// Log AI interactions
logger.logAiInteraction(
  'GPT-4',
  'Generate treatment recommendations for...',
  {
    prompt: 150,
    completion: 100,
    total: 250
  },
  350, // response time in ms
  {
    department: 'oncology',
    purpose: 'treatment-recommendation'
  }
);

// Log performance metrics
logger.logPerformance(
  '/api/treatment-protocols',
  120, // response time in ms
  null,
  { action: 'retrieve', protocolId: '123' }
);

// Log errors
try {
  // ... some operation
} catch (error) {
  logger.logError(
    error,
    LogCategory.CLINICAL_DECISION,
    { context: 'treatment-plan-generation' }
  );
}

// Generate compliance report
const startDate = new Date('2025-01-01');
const endDate = new Date('2025-06-01');
const report = await logger.generateComplianceReport(
  startDate,
  endDate,
  LogCategory.AI_INTERACTION
);

// Get monitoring metrics
const metrics = await logger.getMonitoringMetrics(3600); // Last hour
console.log(metrics);
```

## Log Categories

- `SECURITY`: Security-related events and access control
- `PERFORMANCE`: System performance metrics
- `AI_INTERACTION`: AI model interactions and responses
- `CLINICAL_DECISION`: Clinical decision support events
- `SYSTEM`: General system events
- `COMPLIANCE`: Compliance-related events

## HIPAA Compliance

The logger automatically anonymizes sensitive data fields including:
- Patient IDs (hashed)
- Medical Record Numbers (hashed)
- Names (redacted)
- Date of Birth (redacted)
- Email addresses (redacted)
- Phone numbers (redacted)

## Integration with External Services

The logger supports sending logs to external services like ELK Stack and Splunk. Configure the external services in the logger initialization:

```typescript
const config: LogConfig = {
  // ... other config
  externalServices: [
    {
      type: 'ELK',
      endpoint: 'https://elk.example.com',
      apiKey: process.env.ELK_API_KEY
    },
    {
      type: 'Splunk',
      endpoint: 'https://splunk.example.com',
      apiKey: process.env.SPLUNK_API_KEY
    }
  ]
};
```

## Monitoring Dashboard Integration

The `getMonitoringMetrics()` method provides real-time metrics including:
- Total log count
- Error rate
- Average response time
- AI interaction count

These metrics can be used to build monitoring dashboards and set up alerts.

## Best Practices

1. Always use appropriate log categories for better organization
2. Include relevant metadata with each log
3. Set appropriate retention periods based on compliance requirements
4. Regularly review error logs and alerts
5. Monitor system performance through the logging metrics
6. Ensure external service endpoints are secure and properly authenticated

## Note

Remember to implement proper persistence and external service integration in production. The current implementation includes placeholder console.log statements that should be replaced with actual implementations.
