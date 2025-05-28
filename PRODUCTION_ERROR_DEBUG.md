# Production Error Debugging Guide

## Current Status
✅ **Source maps enabled** - Better stack traces in production  
✅ **Enhanced ErrorBoundary** - Captures more debugging information  
✅ **Global error tracking** - Captures unhandled errors  
✅ **Debug tools added** - `/debug/errors` and `/debug/analyzer` routes  

## Your Specific Error Analysis

### Stack Trace Pattern
```
at PZ (https://mwoncovista.com/assets/index-DHUQ6z_J.js:293:11789)
at FZ (https://mwoncovista.com/assets/index-DHUQ6z_J.js:293:36315)
at pt/ur (router functions)
```

### Likely Causes
1. **React component rendering error** - The `PZ` and `FZ` functions are likely minified React component functions
2. **Router-related issue** - Multiple references to router functions (`pt`, `ur`) suggest navigation problems
3. **State update after unmount** - Common cause of production errors in React apps
4. **Async operation completing after component destruction**

### Immediate Actions to Take

#### 1. Deploy with Source Maps
```bash
# Your vite.config.ts now has sourcemap: true
npm run build
# Deploy this build to get readable stack traces
```

#### 2. Access Debug Tools
Navigate to these URLs in your production app:
- `/debug/errors` - Real-time error capture dashboard
- `/debug/analyzer` - Pre-loaded with your specific error for analysis

#### 3. Check Browser Console
When the error occurs, check for:
- Previous warnings before the error
- Network request failures
- Memory leaks or performance issues

#### 4. Environment Variables
Verify all required environment variables are set in production:
```bash
VITE_AUTH0_DOMAIN=your-domain
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Enhanced Error Tracking

The app now automatically:
- ✅ Captures all unhandled JavaScript errors
- ✅ Tracks promise rejections
- ✅ Stores error history in localStorage
- ✅ Provides detailed debugging context
- ✅ Integrates with LogRocket for production monitoring

### Next Steps

1. **Deploy the updated build** with source maps enabled
2. **Reproduce the error** to capture it with enhanced tracking
3. **Check the debug dashboard** at `/debug/errors` for real-time information
4. **Use the analyzer** at `/debug/analyzer` to get specific recommendations

### Common Solutions Applied

#### Source Maps
- Enabled `sourcemap: true` in production builds
- Will show actual function/component names instead of `PZ`, `FZ`

#### Enhanced Error Boundaries
- Added unique error IDs for tracking
- Capture user agent, URL, timestamp
- Better integration with logging services

#### Global Error Handlers
- Catch unhandled errors and promise rejections
- Store error history for debugging
- Automatic reporting to external services

### Monitoring

The error tracker is now available globally:
```javascript
// In browser console
window.errorTracker.getErrors() // See all captured errors
window.errorTracker.clearErrors() // Clear error history
```

### Production Checklist

- [ ] Deploy build with source maps enabled
- [ ] Verify all environment variables are set
- [ ] Test error boundaries work correctly
- [ ] Check LogRocket is receiving error reports
- [ ] Monitor `/debug/errors` dashboard
- [ ] Review any console warnings

## Emergency Debugging

If the error persists after these changes:

1. **Check Network Tab** - Look for failed API requests
2. **Disable Browser Extensions** - They can interfere with React apps
3. **Test Different Browsers** - Cross-browser compatibility issues
4. **Check Mobile vs Desktop** - Device-specific problems
5. **Review Recent Deployments** - What changed before the error started?

## Contact Information

If you need further assistance:
- Check the error debug dashboard for real-time information
- Use the production error analyzer for specific recommendations
- Review the enhanced error logs for detailed context
