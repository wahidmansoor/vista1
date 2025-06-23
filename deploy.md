# OncoVista AI Agent Deployment Guide

## Vercel Deployment

### Prerequisites
1. Vercel account
2. Google Cloud project with Gemini API enabled
3. Environment variables ready

### Steps

1. **Connect Repository**
   ```bash
   vercel link
   ```

2. **Configure Environment**
   - Add environment variables in Vercel dashboard:
     - `VITE_GEMINI_API_KEY`
   - Set production environment
   - Enable automatic preview deployments

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Post-Deployment Verification
1. Verify API connectivity
2. Test rate limiting
3. Monitor error rates
4. Check response times

## Railway Deployment (API Server)

### Prerequisites
1. Railway account
2. Docker installed
3. Environment variables ready

### Steps

1. **Initialize Railway Project**
   ```bash
   railway init
   ```

2. **Configure Environment**
   - Add environment variables:
     ```bash
     railway vars set GEMINI_API_KEY=your_key
     railway vars set NODE_ENV=production
     ```

3. **Deploy**
   ```bash
   railway up
   ```

### Post-Deployment
1. Configure custom domain
2. Set up monitoring
3. Configure auto-scaling

## Environment Variables

Create `.env.production`:
```env
VITE_GEMINI_API_KEY=your_key_here
NODE_ENV=production
```

## Docker Deployment

### Build
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "start"]
```

### Run
```bash
docker build -t oncovista .
docker run -p 3000:3000 oncovista
```

## Health Checks

Monitor these endpoints:
- `/api/health` - API health
- `/api/ai-agent/status` - AI service status

## Monitoring Setup

1. **Error Tracking**
   - Configure LogRocket
   - Set up error alerts

2. **Performance Monitoring**
   - Response times
   - Error rates
   - API quotas

3. **Usage Metrics**
   - Requests per module
   - Success rates
   - User feedback

## Scaling Considerations

1. **Rate Limiting**
   - Per-IP: 10 req/min
   - Per-user: 100 req/hour
   - Global: 1000 req/min

2. **Caching**
   - Session-based only
   - No persistent storage
   - Clear on deployment

3. **Load Balancing**
   - Multiple regions
   - Auto-scaling rules
   - Failover configuration

## Security Checklist

✅ Pre-deployment:
- [ ] Secrets properly configured
- [ ] API keys rotated
- [ ] Rate limiting tested
- [ ] Input validation verified
- [ ] Error handling tested
- [ ] Security headers configured

✅ Post-deployment:
- [ ] Monitor error rates
- [ ] Check response times
- [ ] Verify rate limiting
- [ ] Test failover
- [ ] Validate logging
- [ ] Security scan