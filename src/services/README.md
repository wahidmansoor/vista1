# AI Service Architecture

This directory contains the base architecture for integrating multiple AI providers into the oncology assistant application. The implementation provides a robust, type-safe way to interact with different AI models while handling rate limiting, retries, and error cases.

## Installation

Install the required dependencies:

```bash
npm install openai @anthropic-ai/sdk
```

## Architecture Overview

### Base Class

`AIService` (in `AIService.ts`) is the abstract base class that provides:

- Rate limiting
- Retry mechanisms
- Performance monitoring
- Error handling with medical context
- Streaming support
- Generic request/response types
- Configuration management

### Utility Classes

- `RateLimiter`: Manages API rate limits per provider
- `PerformanceMetrics`: Tracks performance and usage metrics

### Implementations

#### OpenAI Service

`OpenAIService` implements the base class for OpenAI's GPT models:

```typescript
const openAIService = new OpenAIService({
  provider: 'openai',
  modelName: 'gpt-4',
  apiKey: process.env.OPENAI_API_KEY,
  temperature: 0.7,
  maxTokens: 1000
});
```

#### Claude Service

`ClaudeService` implements the base class for Anthropic's Claude models:

```typescript
const claudeService = new ClaudeService({
  provider: 'anthropic',
  modelName: 'claude-3-opus-20240229',
  apiKey: process.env.ANTHROPIC_API_KEY,
  temperature: 0.7,
  maxTokens: 1000
});
```

## Usage Examples

### Basic Request

```typescript
async function getMedicalAnalysis() {
  const service = new OpenAIService({
    provider: 'openai',
    modelName: 'gpt-4',
    apiKey: process.env.OPENAI_API_KEY
  });

  const response = await service.processRequest({
    prompt: "Analyze the following medical case...",
    context: {
      patientAge: 45,
      symptoms: ["fatigue", "weight loss"],
      labResults: { ... }
    }
  });

  return response.content;
}
```

### Streaming Response

```typescript
async function streamMedicalAnalysis() {
  const service = new ClaudeService({
    provider: 'anthropic',
    modelName: 'claude-3-opus-20240229',
    apiKey: process.env.ANTHROPIC_API_KEY
  });

  for await (const chunk of service.streamResponse({
    prompt: "Provide a detailed analysis...",
    context: { ... }
  })) {
    console.log(chunk.content);
  }
}
```

### Error Handling

The service provides medical-context aware error handling:

```typescript
try {
  const response = await service.processRequest({
    prompt: "Invalid request..."
  });
} catch (error) {
  if (error instanceof MedicalAIError) {
    console.error(`Medical AI Error: ${error.message}`);
    console.error(`Severity: ${error.severity}`);
    console.error(`Context: ${JSON.stringify(error.context)}`);
  }
}
```

## Performance Monitoring

Access metrics for monitoring and optimization:

```typescript
const metrics = service.getMetrics();
console.log(`Success Rate: ${metrics.successfulRequests / metrics.totalRequests * 100}%`);
console.log(`Average Latency: ${metrics.averageLatency}ms`);
console.log(`95th Percentile Latency: ${metrics.p95Latency}ms`);
```

## Best Practices

1. **Error Handling**: Always wrap AI service calls in try-catch blocks and handle `MedicalAIError` appropriately
2. **Context**: Provide relevant medical context in requests for better responses
3. **Rate Limits**: Monitor rate limit usage through the metrics interface
4. **Model Selection**: Choose appropriate models based on task complexity:
   - GPT-4: Complex medical reasoning, detailed analysis
   - Claude: Long-form medical content, complex instructions
   - GPT-3.5-turbo: Simple queries, quick responses

## Security Considerations

1. Never expose API keys in client-side code
2. Validate and sanitize all input before sending to AI services
3. Implement proper access controls around AI service usage
4. Monitor and log usage patterns for security analysis
5. Handle PHI (Protected Health Information) appropriately

## Extending the Architecture

To add support for a new AI provider:

1. Create a new class extending `AIService`
2. Implement the required abstract methods:
   - `validateInput()`
   - `formatResponse()`
   - `makeRequest()`
   - `makeStreamingRequest()`
3. Add appropriate rate limits in `RateLimiter`
4. Add provider-specific error handling
