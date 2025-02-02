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
        <div className="error-fallback">
          <h1>Something went wrong!</h1>
          <button
            onClick={() => {
              this.setState({ hasError: false });
              this.props.resetErrorState(); // Reset the parent error state as well
            }}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
