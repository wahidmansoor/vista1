// ✅ Save this as ErrorBoundary.tsx
import React, { Component, ReactNode } from 'react';
import { AlertOctagon, ArrowLeft, RefreshCcw, ChevronDown, LifeBuoy } from 'lucide-react';
import { getEnvVar } from '@/utils/environment';
import { logError } from '@/utils/log';
import PropTypes from 'prop-types';
import LogRocket from 'logrocket';
import { Button, Typography, Box, Paper, Link as MuiLink } from '@mui/material';

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

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ error, errorInfo });

    logError(error, errorInfo, {
      moduleName: this.props.moduleName,
      retryCount: this.state.retryCount,
    });

    if (typeof LogRocket !== 'undefined' && LogRocket?.error) {
      LogRocket.error('ErrorBoundary', digestError(error, errorInfo));
    }

    errorCount++;
    if (errorCount >= ERROR_RATE_THRESHOLD && typeof LogRocket !== 'undefined' && LogRocket?.track) {
      LogRocket.track('error-rate-threshold', { count: errorCount });
    }
  }

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

  handleNavigateHome = () => {
    window.location.href = '/';
  };

  handleToggleDetails = () => {
    this.setState((prev) => ({
      isDetailsOpen: !prev.isDetailsOpen,
    }));
  };

  renderErrorUI = () => {
    return (
      <Box position="fixed" top={0} left={0} width="100vw" height="100vh" zIndex={1300} display="flex" alignItems="center" justifyContent="center" p={4} bgcolor="rgba(255,255,255,0.8)" style={{ backdropFilter: 'blur(4px)' }}>
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
                <ArrowLeft className="w-4 h-4" /> Go Home
              </button>
              <button type="button" onClick={this.handleReset} disabled={this.state.isRetrying} className={`MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedError MuiButton-sizeMedium MuiButton-containedSizeMedium MuiButton-colorError${this.state.isRetrying ? ' Mui-disabled' : ''}`}>
                <RefreshCcw className={`w-4 h-4${this.state.isRetrying ? ' animate-spin' : ''}`} /> {this.state.isRetrying ? 'Retrying...' : 'Try Again'}
              </button>
            </Box>
            <MuiLink href="mailto:support@oncovista.com" underline="hover">
              <LifeBuoy className="w-4 h-4" /> Contact technical support
            </MuiLink>
          </Box>
        </Paper>
      </Box>
    );
  };

  componentDidUpdate(prevProps: Props, prevState: ErrorBoundaryState) {
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
    if (!this.state.hasError && prevState.hasError && this.state.isRetrying) {
      this.setState({ isRetrying: false });
    }
  }

  componentWillUnmount() {
    if (this._recoveryTimeout) {
      clearTimeout(this._recoveryTimeout);
    }
  }

  render() {
    if (this.state.hasError && this.props.fallback) {
      return this.props.fallback;
    }
    if (this.state.hasError) {
      return this.renderErrorUI();
    }
    return <React.Fragment key={this.state.resetKey}>{this.props.children}</React.Fragment>;
  }
}

export default ErrorBoundary;
 