import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import { Button } from "./ui/button";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="max-w-md w-full bg-card border border-border p-6 shadow-lg text-center">
            <div className="flex justify-center mb-4 text-destructive">
              <AlertTriangle size={48} />
            </div>
            <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
            <p className="text-muted-foreground mb-6">
              An unexpected error occurred while rendering this page. This might be due to a data fetching failure or a component crash.
            </p>
            <div className="bg-muted p-3 rounded mb-6 text-left overflow-auto max-h-32">
              <code className="text-xs text-destructive">
                {this.state.error?.toString()}
              </code>
            </div>
            <div className="flex flex-col gap-2">
              <Button 
                onClick={() => window.location.reload()} 
                variant="default"
                className="w-full flex items-center justify-center gap-2"
              >
                <RefreshCcw size={16} />
                Reload Page
              </Button>
              <Button 
                onClick={() => window.location.href = '/'} 
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
              >
                <Home size={16} />
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
