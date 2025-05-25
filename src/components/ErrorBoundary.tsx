import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, ArrowLeft, RefreshCcw, ChevronDown, LifeBuoy } from 'lucide-react';
import LogRocket from 'logrocket';
import { Typography, Box, Paper, Button, Link as MuiLink } from '@mui/material';

interface Props {
  children?: ReactNode;
  moduleName?: string;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
  resetKey: number;
  isDetailsOpen: boolean;
  isRetrying: boolean;
}

const ERROR_RATE_THRESHOLD = 5;
let errorCount = 0;

const digestError = (error: Error, errorInfo: ErrorInfo) => ({
  message: error?.message,
  name: error?.name,
  stack: error?.stack,
  componentStack: errorInfo?.componentStack,
});

class ErrorBoundary extends Component<Props, ErrorBoundaryState> {
  private recoveryTimeout?: NodeJS.Timeout;

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

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ error, errorInfo });
    
    // Log to your error tracking system
    if (typeof LogRocket !== 'undefined') {
      LogRocket.error('ErrorBoundary', digestError(error, errorInfo));
      if (++errorCount >= ERROR_RATE_THRESHOLD) {
        LogRocket.track('error-rate-threshold', { count: errorCount });
      }
    }
  }

  handleReset = (): void => {
    this.setState(prev => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prev.retryCount + 1,
      resetKey: prev.resetKey + 1,
      isDetailsOpen: false,
      isRetrying: true,
    }));
  };

  handleNavigateHome = (): void => {
    window.location.href = '/';
  };

  handleToggleDetails = (): void => {
    this.setState(prev => ({
      isDetailsOpen: !prev.isDetailsOpen,
    }));
  };

  renderErrorUI = (): ReactNode => (
    <Box 
      position="fixed" 
      top={0} 
      left={0} 
      width="100vw" 
      height="100vh" 
      zIndex={1300} 
      display="flex" 
      alignItems="center" 
      justifyContent="center" 
      p={4} 
      bgcolor="rgba(255,255,255,0.8)" 
      style={{ backdropFilter: 'blur(4px)' }}
    >
      <Paper elevation={24} sx={{ maxWidth: 600, width: '100%', p: 6, borderRadius: 4 }}>
        <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
          <Box 
            width={80} 
            height={80} 
            display="flex" 
            alignItems="center" 
            justifyContent="center" 
            borderRadius="50%" 
            bgcolor="error.light"
          >
            <AlertOctagon size={40} color="#d32f2f" />
          </Box>
          
          <Typography variant="h4" fontWeight={700} align="center">
            {this.props.moduleName ? `Error in ${this.props.moduleName}` : 'Something went wrong'}
          </Typography>
          
          <Typography color="text.secondary" align="center">
            We apologize for the inconvenience. Our team has been notified.
          </Typography>

          {this.state.error && (
            <Box width="100%">
              <Button 
                onClick={this.handleToggleDetails} 
                endIcon={this.state.isDetailsOpen ? <ChevronDown /> : <ChevronDown />}
                sx={{ textTransform: 'none' }}
              >
                Technical Details
              </Button>
              
              {this.state.isDetailsOpen && (
                <Box mt={2}>
                  <Typography variant="subtitle2">Error:</Typography>
                  <pre style={{ whiteSpace: 'pre-wrap' }}>{this.state.error.toString()}</pre>
                  {this.state.errorInfo && (
                    <>
                      <Typography variant="subtitle2">Component Stack:</Typography>
                      <pre style={{ whiteSpace: 'pre-wrap' }}>{this.state.errorInfo.componentStack}</pre>
                    </>
                  )}
                </Box>
              )}
            </Box>
          )}

          <Box display="flex" gap={2} mt={2}>
            <Button 
              variant="outlined" 
              startIcon={<ArrowLeft size={18} />} 
              onClick={this.handleNavigateHome}
            >
              Go Home
            </Button>
            <Button 
              variant="contained" 
              startIcon={<RefreshCcw size={18} />} 
              onClick={this.handleReset} 
              disabled={this.state.isRetrying}
            >
              {this.state.isRetrying ? 'Retrying...' : 'Try Again'}
            </Button>
          </Box>

          <MuiLink href="mailto:support@example.com" underline="hover">
            <Box display="flex" alignItems="center" gap={1}>
              <LifeBuoy size={18} /> Contact support
            </Box>
          </MuiLink>
        </Box>
      </Paper>
    </Box>
  );

  componentDidUpdate(prevProps: Props, prevState: ErrorBoundaryState): void {
    if (this.state.hasError && !prevState.hasError) {
      this.recoveryTimeout = setTimeout(() => {
        if (this.state.hasError) this.handleReset();
      }, 10000);
    }
    
    if (!this.state.hasError && this.recoveryTimeout) {
      clearTimeout(this.recoveryTimeout);
    }
    
    if (!this.state.hasError && this.state.isRetrying) {
      this.setState({ isRetrying: false });
    }
  }

  componentWillUnmount(): void {
    if (this.recoveryTimeout) clearTimeout(this.recoveryTimeout);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback || this.renderErrorUI();
    }
    return <React.Fragment key={this.state.resetKey}>{this.props.children}</React.Fragment>;
  }
}

export default ErrorBoundary;