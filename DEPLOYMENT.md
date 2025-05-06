# OncoVista AI Agent Deployment Guide

## Prerequisites
- Node.js 18+
- Valid API keys for Gemini and/or OpenAI
- Supabase account and project (for database)

## Environment Setup

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Configure environment variables:
- Add your Gemini API key
- Configure API rate limits if needed
- Set mock mode to false for production

## Production Build

1. Install dependencies:
```bash
npm install
```

2. Build the application:
```bash
npm run build
```

## Deployment Options

### 1. Vercel (Recommended)
- Connect your GitHub repository
- Vercel will automatically detect Next.js
- Add environment variables in Vercel dashboard
- Enable automatic deployments

### 2. Docker
```bash
docker build -t oncovista .
docker run -p 3000:3000 oncovista
```

### 3. Traditional Hosting
- Upload build files to your hosting
- Configure reverse proxy (nginx/apache)
- Set up SSL certificates

## API Rate Limiting

The AI Agent system includes rate limiting:
- Default: 10 requests per minute per IP
- Configurable via environment variables
- Implements retry mechanism with exponential backoff

## Monitoring

1. Enable error tracking:
- Set up LogRocket (VITE_LOGROCKET_APP_ID)
- Monitor API response times
- Track error rates

2. Health checks:
- /api/health endpoint
- AI service connectivity
- Database connectivity

## Troubleshooting

Common issues:
1. "Process not defined":
   - Ensure environment variables are properly set
   - Check Vite configuration

2. Invalid JSON responses:
   - Verify API key permissions
   - Check rate limiting status
   - Monitor API service status

3. FollowUpPlan errors:
   - Validate input data structure
   - Check type definitions
   - Monitor error logs

## Security Considerations

1. API Keys:
   - Never expose API keys in client-side code
   - Rotate keys regularly
   - Use environment variables

2. Rate Limiting:
   - Implement IP-based limits
   - Add user authentication
   - Monitor for abuse

3. Data Protection:
   - Encrypt sensitive data
   - Implement access controls
   - Regular security audits