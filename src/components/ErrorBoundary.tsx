import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorInfo: string;
}

export default class ErrorBoundary extends Component<Props, State> {
  state = { hasError: false, errorInfo: "" };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, errorInfo: error.message };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 text-red-600">
          <h1 className="text-xl font-bold">⚠️ Something went wrong.</h1>
          <p className="text-sm">{this.state.errorInfo}</p>
        </div>
      );
    }
    return this.props.children;
  }
}
