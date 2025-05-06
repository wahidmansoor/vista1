# OncoVista AI Agent System

## Overview
The OncoVista AI Agent is a context-aware AI assistant powered by Google's Gemini Pro model, designed specifically for oncology workflows.

## Features
- 🤖 Real-time AI responses using Gemini Pro
- 🔄 Fallback mock mode for development
- 📝 Module-specific prompts and suggestions
- 🔍 Context-aware responses based on module/intent
- 📜 Session-based response history
- ⚡ Rate limiting protection
- 🛡️ Error handling with retry capability

## Setup

### Environment Variables
Create a `.env` file with:
```env
VITE_GEMINI_API_KEY=your_api_key_here
```

### Installation
```bash
npm install @google/generative-ai
```

## Usage

```tsx
import { AIAgent } from '@/components/ai-agent/AIAgent';

function MyComponent() {
  return (
    <AIAgent
      module="OPD"
      intent="screening"
      initialContext="Patient demographics and history..."
      mockMode={false}
    />
  );
}
```

## API Response Structure
```typescript
interface AIResponse {
  id: string;
  content: string;
  timestamp: Date;
  metadata: {
    module: ModuleType;
    intent: PromptIntent;
    model: string;
  };
}
```

## Module Types
- `OPD`: Outpatient Department
- `CDU`: Chemotherapy Day Unit
- `Inpatient`: Inpatient Ward
- `Palliative`: Palliative Care
- `RadOnc`: Radiation Oncology

## Intent Types
- `screening`: Cancer screening recommendations
- `triage`: Patient triage decisions
- `toxicity`: Toxicity management
- `follow-up`: Follow-up planning
- `evaluation`: Patient evaluation

## Error Handling
The system includes comprehensive error handling:
- Connection errors
- Rate limiting
- Invalid responses
- Timeout handling
- Retry mechanism

## Development Mode
Set `mockMode={true}` to use offline responses for development:
```tsx
<AIAgent
  module="OPD"
  intent="screening"
  mockMode={true}
/>
```

## Testing
Run the test suite:
```bash
npm test src/__tests__/ai-agent.*.test.ts
```