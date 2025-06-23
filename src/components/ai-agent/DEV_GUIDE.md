# AI Agent Developer Guide

## Development Workflow

### Local Development
1. Clone the repository
2. Copy `.env.example` to `.env` and add your Gemini API key
3. Use `mockMode=true` during development to avoid API costs

### Testing Strategy

#### Unit Tests
- `/lib/gemini.ts`: Tests API integration and error handling
- `/lib/api/aiAgentAPI.ts`: Tests API client functionality
- `/api/ai-agent.ts`: Tests endpoint behavior
- Component tests for `<AIAgent />`

#### Integration Tests
Run the full integration test suite:
```bash
npm test src/__tests__/ai-agent.integration.test.ts
```

### Mock Mode
The system includes a comprehensive mock response system for development:

1. Located in `src/components/ai-agent/mockResponses.ts`
2. Responses are organized by module and intent
3. Simulates network delay for realism
4. Maintains consistent response structure

### Error Handling Guidelines

1. API Errors
   - Always use the `APIError` class
   - Include error codes for tracking
   - Log errors through `agentLogger`

2. UI Error States
   - Show toast notifications
   - Display retry button
   - Maintain last prompt for retry

3. Rate Limiting
   - 10 requests per minute per IP
   - Graceful degradation to mock mode
   - Clear user feedback

### Type Safety

1. Use TypeScript Strict Mode
2. Types defined in `src/types/ai-agent.d.ts`
3. Runtime type validation in API endpoints

### Performance Considerations

1. Response Caching
   - Session storage for history
   - No persistent storage
   - Clear on page reload

2. Bundle Size
   - Lazy load AI components
   - Tree-shake unused features
   - Minimize dependencies

### Security Best Practices

1. API Key Protection
   - Never expose in client code
   - Use environment variables
   - Validate on server side

2. Rate Limiting
   - Per-IP limits
   - Per-user session limits
   - Prevent abuse

3. Input Validation
   - Sanitize prompts
   - Validate module/intent types
   - Prevent injection

### Deployment Checklist

✅ Pre-deployment:
- [ ] Run all tests
- [ ] Check bundle size
- [ ] Validate environment variables
- [ ] Test rate limiting
- [ ] Verify error handling
- [ ] Check mock mode fallback
- [ ] Review security headers

✅ Post-deployment:
- [ ] Verify API connectivity
- [ ] Test error scenarios
- [ ] Monitor error rates
- [ ] Check response times
- [ ] Validate logging
- [ ] Test rate limiting

### Monitoring

1. Error Tracking
   - Use `agentLogger`
   - Monitor error rates
   - Track response times

2. Usage Metrics
   - Track requests per module
   - Monitor success rates
   - Log user feedback

3. Performance Metrics
   - Response times
   - Error rates
   - API quotas