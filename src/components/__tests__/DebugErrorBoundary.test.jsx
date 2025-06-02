import React, { useState } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

// Simple ErrorBoundary for testing
class SimpleErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, resetKey: 0 };
  }

  static getDerivedStateFromError(error) {
    console.log('Error caught:', error.message);
    return { hasError: true };
  }

  handleReset = () => {
    console.log('Reset triggered');
    this.setState(prevState => ({
      hasError: false,
      resetKey: prevState.resetKey + 1
    }));
  };

  render() {
    console.log('ErrorBoundary render - hasError:', this.state.hasError, 'resetKey:', this.state.resetKey);
    
    if (this.state.hasError) {
      return (
        <div>
          <h2>Error occurred!</h2>
          <button onClick={this.handleReset} data-testid="tryAgainButton">Try Again</button>
        </div>
      );
    }

    return (
      <div key={this.state.resetKey} data-testid="recovered">
        {this.props.children}
      </div>
    );
  }
}

// Test component that throws once per instance but remembers across remounts
let globalThrowCount = 0;

const ThrowOnce = () => {
  const [instanceId] = useState(() => ++globalThrowCount);
  console.log('ThrowOnce render - instanceId:', instanceId);
  
  if (instanceId === 1) {
    console.log('ThrowOnce: first instance, throwing error');
    throw new Error('Test Error');
  }
  
  console.log('ThrowOnce: subsequent instance, rendering success content');
  return <div data-testid="success">Success Content</div>;
};

describe('Debug ErrorBoundary Reset', () => {
  it('should reset and recover', async () => {
    console.log('=== Test Start ===');
    
    render(
      <SimpleErrorBoundary>
        <ThrowOnce />
      </SimpleErrorBoundary>
    );

    console.log('=== After initial render ===');
    
    // Should show error UI
    expect(screen.getByText('Error occurred!')).toBeInTheDocument();
    
    console.log('=== Clicking Try Again ===');
    const tryAgainButton = screen.getByTestId('tryAgainButton');
    fireEvent.click(tryAgainButton);
    
    console.log('=== After clicking Try Again ===');
    
    // Should show recovered content
    const recoveredElement = await screen.findByTestId('recovered');
    expect(recoveredElement).toBeInTheDocument();
    
    // Should also show success content
    const successElement = await screen.findByTestId('success');
    expect(successElement).toBeInTheDocument();
  });
});
