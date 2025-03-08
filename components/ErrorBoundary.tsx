'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

function withRouter(ErrorBoundaryComponent: typeof ErrorBoundary) {
  return function WithRouter(props: Props) {
    const router = useRouter();
    return <ErrorBoundaryComponent {...props} router={router} />;
  };
}

class ErrorBoundary extends Component<Props & { router?: ReturnType<typeof useRouter> }, State> {
  constructor(props: Props & { router?: ReturnType<typeof useRouter> }) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleRefresh = () => {
    if (this.props.router) {
      this.props.router.refresh();
    }
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4 dark:bg-gray-900">
          <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
            <h2 className="mb-4 text-2xl font-bold text-red-600">
              Something went wrong
            </h2>
            <div className="mb-4 overflow-auto rounded-md bg-gray-100 p-4 dark:bg-gray-700">
              <p className="font-mono text-sm text-red-500">
                {this.state.error?.toString()}
              </p>
            </div>
            {this.state.errorInfo && (
              <details className="mt-4">
                <summary className="cursor-pointer text-blue-500 hover:text-blue-600">
                  View technical details
                </summary>
                <div className="mt-2 overflow-auto rounded-md bg-gray-100 p-4 dark:bg-gray-700">
                  <pre className="whitespace-pre-wrap font-mono text-xs text-gray-800 dark:text-gray-200">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </div>
              </details>
            )}
            <div className="mt-6 flex justify-center">
              <button
                onClick={this.handleRefresh}
                className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default withRouter(ErrorBoundary);
