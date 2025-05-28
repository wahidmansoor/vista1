# Auto-Logout System Documentation

## Overview
The OncoVista application includes a comprehensive auto-logout system that automatically logs users out after periods of inactivity to enhance security in medical environments.

## Features

### 🔐 Security Features
- **Automatic logout** after configurable inactivity period (default: 10 minutes)
- **Warning system** with countdown timer (default: 2 minutes before logout)
- **Activity tracking** monitors mouse movement, keyboard input, and clicks
- **Session management** integrates seamlessly with Auth0 authentication

### 🎯 User Experience
- **Header status indicator** shows remaining session time for authenticated users
- **Warning modal** appears before logout with options to extend session or logout immediately
- **Graceful handling** preserves user experience while maintaining security
- **Configurable timeouts** can be adjusted per deployment requirements

## Components

### Core Hook: `useAutoLogout`
Located: `src/hooks/useAutoLogout.ts`

```typescript
const { 
  timeRemaining, 
  showWarning, 
  extendSession, 
  logout 
} = useAutoLogout({
  timeoutMinutes: 10,      // Total session timeout
  warningMinutes: 2        // Warning period before logout
});
```

### Provider: `AutoLogoutProvider`
Located: `src/providers/AutoLogoutProvider.tsx`
- Wraps the entire application in App.tsx
- Provides global auto-logout state management
- Handles the warning modal display

### Status Component: `AutoLogoutStatus`
Located: `src/components/AutoLogoutStatus.tsx`
- Displays in the application header when user is authenticated
- Shows remaining session time with visual indicators
- Color-coded: green (safe), yellow (warning), red (critical)

### Warning Modal: `AutoLogoutWarning`
Located: `src/components/AutoLogoutWarning.tsx`
- Modal dialog with countdown timer
- "Extend Session" and "Logout Now" buttons
- Auto-closes when time expires

## Configuration

### Default Settings
```typescript
const DEFAULT_CONFIG = {
  timeoutMinutes: 10,    // 10 minutes total session
  warningMinutes: 2,     // 2 minutes warning period
  checkInterval: 1000    // 1 second activity check
};
```

### Customization
To modify timeout periods, update the configuration in `AutoLogoutProvider.tsx`:

```typescript
<AutoLogoutProvider 
  timeoutMinutes={15}    // Extended to 15 minutes
  warningMinutes={3}     // 3 minute warning
>
```

## Integration

### App.tsx Integration
```typescript
import { AutoLogoutProvider } from './providers/AutoLogoutProvider';

const App: React.FC = () => {
  return (
    <LayoutProvider>
      <BrowserRouter>
        <AutoLogoutProvider>
          <ToastProvider>
            <Layout>
              <AppRoutes />
            </Layout>
          </ToastProvider>
        </AutoLogoutProvider>
      </BrowserRouter>
    </LayoutProvider>
  );
};
```

### Header Integration
The Header component automatically includes the AutoLogoutStatus for authenticated users:

```typescript
{isAuthenticated && (
  <div className="flex items-center gap-3">
    <AutoLogoutStatus />
    {/* Other header elements */}
  </div>
)}
```

## Activity Detection

The system tracks the following user activities:
- **Mouse movement** - Any cursor movement resets the timer
- **Mouse clicks** - Click events reset the timer  
- **Keyboard input** - Any key press resets the timer
- **Touch events** - Touch interactions on mobile devices

## Testing

### Test Page
Access the test page at `/auto-logout-test` to:
- Monitor real-time session status
- Manually trigger logout scenarios
- Test warning modal functionality
- Verify activity detection

### Manual Testing
1. **Login** to the application with Auth0
2. **Observe** the session timer in the header (⏰ icon)
3. **Wait** for the warning modal to appear (after 8 minutes by default)
4. **Test** the "Extend Session" and "Logout Now" buttons
5. **Verify** activity detection by moving mouse or typing

## Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## Security Considerations

1. **Client-side only** - Timer resets are handled in the browser
2. **Auth0 integration** - Leverages secure logout mechanisms
3. **No sensitive data** - Timer state doesn't contain user information
4. **Graceful degradation** - Functions without JavaScript (falls back to Auth0 session management)

## Troubleshooting

### Common Issues

**Issue**: Auto-logout not working
- Check that AutoLogoutProvider wraps the app correctly
- Verify Auth0 integration is functioning
- Ensure useAutoLogout hook is being called

**Issue**: Status not showing in header
- Confirm user is authenticated
- Check that AutoLogoutStatus component is imported
- Verify the component is rendered conditionally

**Issue**: Warning modal not appearing
- Check console for JavaScript errors
- Verify Headless UI Dialog dependencies
- Ensure proper z-index stacking

### Debug Mode
The test page (`/auto-logout-test`) provides detailed debugging information including:
- Current timeout settings
- Activity detection status
- Session state monitoring
- Manual controls for testing

## Future Enhancements

Potential improvements for future versions:
- **Server-side validation** - Validate session timeouts on the backend
- **Notification API** - Browser notifications when application is in background
- **Idle detection API** - Use browser Idle Detection API when available
- **Progressive warnings** - Multiple warning stages (5min, 2min, 30sec)
- **Activity analytics** - Track usage patterns for optimal timeout configuration

## Support

For questions or issues related to the auto-logout system:
1. Check this documentation
2. Review the test page for debugging
3. Examine console logs for errors
4. Contact the development team

---

**Last Updated**: December 2024
**Version**: 1.0.0
**Author**: OncoVista Development Team
