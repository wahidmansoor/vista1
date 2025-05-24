import React, { Component, ReactNode } from 'react';
import { AlertOctagon, ArrowLeft, RefreshCcw, ChevronDown, LifeBuoy } from 'lucide-react';
import { getEnvVar } from '@/utils/environment';
import { logError } from '@/utils/log';
import PropTypes from 'prop-types';
import LogRocket from 'logrocket';
import { Button, Typography, Box, Paper, Link as MuiLink } from '@mui/material';

// ErrorBoundary: A React component to catch and handle errors in its child components.
// Props:
// - children: The child components wrapped by the ErrorBoundary.
// - moduleName: Optional name of the module for error tracking.
// - fallback: Optional fallback UI to display when an error occurs.
//
// State:
// - hasError: Indicates if an error has been caught.
// - error: The error object caught by the boundary.
// - errorInfo: Additional error information, such as the component stack.
// - isRetrying: Indicates if the user is attempting to retry after an error.
// - isDetailsOpen: Toggles the visibility of error details in the UI.

interface Props {
  children?: ReactNode;
  moduleName?: string;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  retryCount: number;
  resetKey: number;
  isDetailsOpen: boolean;
  isRetrying: boolean;
}

let errorCount = 0;
const ERROR_RATE_THRESHOLD = 5;

function digestError(error: Error, errorInfo: React.ErrorInfo) {
  return {
    message: error?.message,
    name: error?.name,
    stack: error?.stack,
    componentStack: errorInfo?.componentStack,
  };
}

class ErrorBoundary extends Component<Props, ErrorBoundaryState> {
  private _recoveryTimeout?: ReturnType<typeof setTimeout>;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      resetKey: 0,
      isDetailsOpen: false,
      isRetrying: false,
    };
  }

  static propTypes = {
    children: PropTypes.node,
    moduleName: PropTypes.string,
    fallback: PropTypes.node,
  };

  // Methods:
  // - getDerivedStateFromError: Updates state when an error is caught.
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  // - componentDidCatch: Logs the error and updates state with error details.
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ error, errorInfo });

    logError(error, errorInfo, {
      moduleName: this.props.moduleName,
      retryCount: this.state.retryCount,
    });
    // Error digestion for LogRocket
    if (typeof LogRocket !== 'undefined' && LogRocket?.error) {
      LogRocket.error('ErrorBoundary', digestError(error, errorInfo));
    }
    // Error rate monitoring
    errorCount++;
    if (errorCount >= ERROR_RATE_THRESHOLD && typeof LogRocket !== 'undefined' && LogRocket?.track) {
      LogRocket.track('error-rate-threshold', { count: errorCount });
    }
  }

  // - handleReset: Resets the error state to allow retrying.
  handleReset = () => {
    this.setState((prevState) => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1,
      resetKey: prevState.resetKey + 1,
      isDetailsOpen: false,
      isRetrying: true,
    }));
  };

  // - handleNavigateHome: Redirects the user to the home page.
  handleNavigateHome = () => {
    window.location.href = '/';
  };

  // - handleToggleDetails: Toggles the visibility of error details in the UI.
  handleToggleDetails = () => {
    this.setState((prev) => ({
      isDetailsOpen: !prev.isDetailsOpen,
    }));
  };

  // - renderErrorUI: Renders the error UI with retry and home navigation options.
  renderErrorUI = () => {
    return (
      <Box position="fixed" top={0} left={0} width="100vw" height="100vh" zIndex={1300} display="flex" alignItems="center" justifyContent="center" p={4} bgcolor="rgba(255,255,255,0.8)" style={{backdropFilter: 'blur(4px)'}}>
        <Paper elevation={24} sx={{ maxWidth: 600, width: '100%', p: 6, borderRadius: 4, border: 1, borderColor: 'grey.100', bgcolor: 'background.paper' }}>
          <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
            <Box width={80} height={80} mb={2} display="flex" alignItems="center" justifyContent="center" borderRadius="50%" bgcolor="error.light">
              <AlertOctagon className="w-10 h-10" color="#d32f2f" />
            </Box>
            <Typography variant="h4" fontWeight={700} color="text.primary" mb={2} align="center">
              {this.props.moduleName ? `Error in ${this.props.moduleName}` : 'Something went wrong'}
            </Typography>
            <Typography color="text.secondary" mb={3} align="center">
              We apologize for the inconvenience. Our team has been notified and is working to resolve this issue.
            </Typography>
            {this.state.error && (
              <details open={this.state.isDetailsOpen} onToggle={this.handleToggleDetails} style={{ width: '100%', marginBottom: 24 }}>
                <summary style={{ cursor: 'pointer', fontWeight: 500, color: '#616161' }}>
                  <ChevronDown className={`w-4 h-4`} style={{ verticalAlign: 'middle', marginRight: 8, transition: 'transform 0.2s', transform: this.state.isDetailsOpen ? 'rotate(180deg)' : 'none' }} />
                  Technical Details
                </summary>
                <Box mt={2} color="text.secondary" data-testid="error-details-box">
                  <Typography variant="subtitle2">Error:</Typography>
                  <pre style={{ whiteSpace: 'pre-wrap', marginBottom: 16, paddingLeft: 16, borderLeft: '2px solid #f44336' }}>{this.state.error && this.state.error.toString()}</pre>
                  {this.state.errorInfo && (
                    <>
                      <Typography variant="subtitle2">Component Stack:</Typography>
                      <pre style={{ whiteSpace: 'pre-wrap', paddingLeft: 16, borderLeft: '2px solid #90caf9' }}>{this.state.errorInfo.componentStack}</pre>
                    </>
                  )}
                </Box>
              </details>
            )}
            <Box display="flex" gap={2} mt={2}>
              <button type="button" onClick={this.handleNavigateHome} className="MuiButtonBase-root MuiButton-root MuiButton-outlined MuiButton-outlinedPrimary MuiButton-sizeMedium MuiButton-outlinedSizeMedium MuiButton-colorPrimary">
                <span className="MuiButton-icon MuiButton-startIcon MuiButton-iconSizeMedium"><svg className="lucide lucide-arrow-left" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg></span>
                Go Home
              </button>
              <button type="button" onClick={this.handleReset} disabled={this.state.isRetrying} className={`MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedError MuiButton-sizeMedium MuiButton-containedSizeMedium MuiButton-colorError${this.state.isRetrying ? ' Mui-disabled' : ''}`}>
                <span className="MuiButton-icon MuiButton-startIcon MuiButton-iconSizeMedium">
                  <svg className={`lucide lucide-refresh-ccw${this.state.isRetrying ? ' animate-spin' : ''}`} fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>
                </span>
                {this.state.isRetrying ? 'Retrying...' : 'Try Again'}
              </button>
            </Box>
            <a className="MuiTypography-root MuiTypography-inherit MuiLink-root MuiLink-underlineHover" href="mailto:support@oncovista.com">
              <svg className="lucide lucide-life-buoy w-4 h-4" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 4.24 4.24"/><path d="m14.83 9.17 4.24-4.24"/><path d="m14.83 14.83 4.24 4.24"/><path d="m9.17 14.83-4.24 4.24"/><circle cx="12" cy="12" r="4"/></svg>
              Contact technical support
            </a>
          </Box>
        </Paper>
      </Box>
    );
  };

  componentDidUpdate(prevProps: Props, prevState: ErrorBoundaryState) {
    // Recovery mechanism: auto-reset error after 10s
    if (this.state.hasError && !prevState.hasError) {
      this._recoveryTimeout = setTimeout(() => {
        if (this.state.hasError) {
          this.handleReset();
        }
      }, 10000);
    }
    if (!this.state.hasError && prevState.hasError && this._recoveryTimeout) {
      clearTimeout(this._recoveryTimeout);
      this._recoveryTimeout = undefined;
    }
    // Reset isRetrying after error is cleared
    if (!this.state.hasError && prevState.hasError && this.state.isRetrying) {
      this.setState({ isRetrying: false });
    }
  }

  componentWillUnmount() {
    if (this._recoveryTimeout) {
      clearTimeout(this._recoveryTimeout);
    }
  }

  // Fix the render method
  render() {
    // If a custom fallback is provided and error, render it
    if (this.state.hasError && this.props.fallback) {
      return this.props.fallback;
    }
    if (this.state.hasError) {
      return this.renderErrorUI();
    }
    // Use resetKey to force remount children after reset
    return <React.Fragment key={this.state.resetKey}>{this.props.children}</React.Fragment>;
  }
}

export default ErrorBoundary;
