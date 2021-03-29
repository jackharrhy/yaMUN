import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
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
        <>
          <h1>Something went wrong!</h1>
          <div className="border mt-2 p-4 w-full overflow-scroll rounded-lg bg-black text-white">
            <pre>
              <code>{this.state.error?.stack}</code>
            </pre>
          </div>
        </>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
