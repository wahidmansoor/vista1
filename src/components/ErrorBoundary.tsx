import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, ArrowLeft, RefreshCcw, ChevronDown, LifeBuoy } from 'lucide-react';
import { logError } from '@/utils/log';

interface Props {
  children?: ReactNode;
  moduleName?: string;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
  resetKey: number;
  isDetailsOpen: boolean;
  errorId: string;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      resetKey: 0,
      isDetailsOpen: false,
      errorId: '',
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Generate a unique error ID for tracking
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return { hasError: true, error, errorId };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Enhanced error information for debugging
    const enhancedErrorInfo = {
      ...errorInfo,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      stackTrace: error.stack,
      errorId: this.state.errorId,
    };

    this.setState({ error, errorInfo });
    
    // Log error with enhanced context
    logError(error, errorInfo, { 
      retryCount: this.state.retryCount,
      moduleName: this.props.moduleName,
      extra: enhancedErrorInfo
    });

    // Send error to external service if available
    if (window.reportError) {
      window.reportError(this.props.moduleName || 'Unknown', error, enhancedErrorInfo);
    }

    // Console log for immediate debugging
    console.group(`🚨 Error Boundary Caught Error [${this.state.errorId}]`);
    console.error('Module:', this.props.moduleName);
    console.error('Error:', error);
    console.error('Component Stack:', errorInfo.componentStack);
    console.error('Enhanced Info:', enhancedErrorInfo);
    console.groupEnd();
  }

  handleReset = (): void => {
    this.setState((prevState: State) => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1,
      resetKey: prevState.resetKey + 1,
      isDetailsOpen: false,
      errorId: '',
    }));
  };

  handleNavigateHome = (): void => {
    window.location.href = '/';
  };

  handleToggleDetails = (): void => {
    this.setState((prev: State) => ({
      isDetailsOpen: !prev.isDetailsOpen,
    }));
  };

  renderErrorUI = (): ReactNode => (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 1300,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      backgroundColor: 'rgba(255,255,255,0.9)',
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        maxWidth: '600px',
        width: '100%',
        padding: '3rem',
        borderRadius: '1rem',
        backgroundColor: 'white',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          backgroundColor: '#ffebee'
        }}>
          <AlertOctagon size={40} color="#d32f2f" />
        </div>
        
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 700,
          textAlign: 'center',
          margin: 0,
          color: '#1a1a1a'
        }}>
          {this.props.moduleName ? `Error in ${this.props.moduleName}` : 'Something went wrong'}
        </h1>
        
        <p style={{
          color: '#666',
          textAlign: 'center',
          margin: 0,
          fontSize: '1.1rem'
        }}>
          Please try refreshing the page or contact support if the problem persists.
        </p>

        {this.state.error && (
          <div style={{ width: '100%' }}>
            <details>
              <summary 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  border: '1px solid #ddd',
                  borderRadius: '0.5rem',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  textTransform: 'none'
                }}
              >
                Technical Details
                <ChevronDown size={16} />
              </summary>
              
              <div 
                data-testid="error-details-box"
                style={{ 
                  marginTop: '1rem',
                  padding: '1rem',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem'
                }}
              >
                <div style={{ marginBottom: '1rem' }}>
                  <strong>Error:</strong>
                  <pre style={{ 
                    whiteSpace: 'pre-wrap',
                    margin: '0.5rem 0 0 0',
                    color: '#d32f2f',
                    backgroundColor: 'white',
                    padding: '0.5rem',
                    borderRadius: '0.25rem',
                    border: '1px solid #ffcdd2'
                  }}>
                    {this.state.error.toString()}
                  </pre>
                </div>
                
                {this.state.errorInfo?.componentStack && (
                  <div>
                    <strong>Component Stack:</strong>
                    <pre style={{ 
                      whiteSpace: 'pre-wrap',
                      margin: '0.5rem 0 0 0',
                      fontSize: '0.75rem',
                      backgroundColor: 'white',
                      padding: '0.5rem',
                      borderRadius: '0.25rem',
                      border: '1px solid #e0e0e0',
                      maxHeight: '200px',
                      overflow: 'auto'
                    }}>
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </div>
                )}
              </div>
            </details>
          </div>
        )}

        <div style={{ 
          display: 'flex',
          gap: '1rem',
          marginTop: '1rem',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <button 
            onClick={this.handleNavigateHome}
            data-testid="goHomeButton"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              border: '1px solid #ddd',
              borderRadius: '0.5rem',
              backgroundColor: 'white',
              cursor: 'pointer',
              fontSize: '1rem',
              transition: 'all 0.2s'
            }}
          >
            <ArrowLeft size={18} />
            Go Home
          </button>

          <button 
            onClick={this.handleReset}
            data-testid="tryAgainButton"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '0.5rem',
              backgroundColor: '#1976d2',
              color: 'white',
              cursor: 'pointer',
              fontSize: '1rem',
              transition: 'all 0.2s'
            }}
          >
            <RefreshCcw size={18} />
            Try Again
          </button>
        </div>

        <a 
          href="mailto:support@example.com"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#1976d2',
            textDecoration: 'none',
            fontSize: '0.9rem',
            marginTop: '0.5rem'
          }}
        >
          <LifeBuoy size={18} />
          Contact support
        </a>
      </div>
    </div>
  );

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback || this.renderErrorUI();
    }

    return (
      <div key={this.state.resetKey} data-testid="recovered">
        {this.props.children}
      </div>
    );
  }
}

export default ErrorBoundary;
