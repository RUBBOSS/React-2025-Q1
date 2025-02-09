import { Component, ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  resetErrorState: () => void; // Add a prop to reset error state
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="error-fallback flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4" // added flex styling and background
        >
          <div className="flex-grow flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold text-center mb-4">
              This is a test error!
            </h1>
          </div>
          <div
            className="fixed bottom-0 left-0 right-0 bg-white p-6 text-center z-50" // modified container styling for try again button
          >
            <button
              onClick={() => {
                this.setState({ hasError: false });
                this.props.resetErrorState();
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" // added Tailwind classes
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
