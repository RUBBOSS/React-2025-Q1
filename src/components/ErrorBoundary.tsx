import { Component, ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  resetErrorState: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
          <div className="flex-grow flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold text-center mb-4">
              Something went wrong!
            </h1>
            <p className="text-gray-600">{this.state.error?.message}</p>
          </div>
          <div className="fixed bottom-0 left-0 right-0 bg-white p-6 text-center z-50">
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                this.props.resetErrorState();
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
