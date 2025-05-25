import * as React from 'react';
import { AlertOctagon, ArrowLeft, RefreshCcw, ChevronDown, LifeBuoy } from 'lucide-react';
import { Typography, Box, Paper, Button, Link as MuiLink } from '@mui/material';

interface Props {
  children?: React.ReactNode;
  moduleName?: string;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  retryCount: number;
  resetKey: number;
  isDetailsOpen: boolean;
  isRetrying: boolean;
}

class ErrorBoundary extends React.Component<Props, State> {
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

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.setState({ error, errorInfo });
    console.error('ErrorBoundary caught an error:', error, errorInfo);
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

  renderErrorUI = (): React.ReactNode => (
    <Box position="fixed" top={0} left={0} width="100vw" height="100vh" zIndex={1300} 
         display="flex" alignItems="center" justifyContent="center" p={4} 
         bgcolor="rgba(255,255,255,0.8)" style={{ backdropFilter: 'blur(4px)' }}>
      <Paper elevation={24} sx={{ maxWidth: 600, width: '100%', p: 6, borderRadius: 4 }}>
        <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
          <Box width={80} height={80} display="flex" alignItems="center" 
               justifyContent="center" borderRadius="50%" bgcolor="error.light">
            <AlertOctagon size={40} color="#d32f2f" />
          </Box>
          
          <Typography variant="h4" fontWeight={700} align="center">
            {this.props.moduleName ? `Error in ${this.props.moduleName}` : 'Something went wrong'}
          </Typography>
          
          <Typography color="text.secondary" align="center">
            Please try refreshing the page or contact support.
          </Typography>

          {this.state.error && (
            <Box width="100%">
              <Button onClick={this.handleToggleDetails} 
                      endIcon={<ChevronDown />}
                      sx={{ textTransform: 'none' }}>
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
            <Button variant="outlined" startIcon={<ArrowLeft />} onClick={this.handleNavigateHome}>
              Go Home
            </Button>
            <Button variant="contained" startIcon={<RefreshCcw />} 
                    onClick={this.handleReset} disabled={this.state.isRetrying}>
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

  componentDidUpdate(prevProps: Props, prevState: State): void {
    if (this.state.hasError && !prevState.hasError) {
      this.recoveryTimeout = setTimeout(() => this.handleReset(), 10000);
    }
    if (!this.state.hasError && this.recoveryTimeout) {
      clearTimeout(this.recoveryTimeout);
    }
  }

  componentWillUnmount(): void {
    if (this.recoveryTimeout) clearTimeout(this.recoveryTimeout);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return this.props.fallback || this.renderErrorUI();
    }
    return <React.Fragment key={this.state.resetKey}>{this.props.children}</React.Fragment>;
  }
}

export default ErrorBoundary;