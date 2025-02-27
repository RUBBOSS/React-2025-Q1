import React from 'react';
import { FallbackProps } from 'react-error-boundary';

const ErrorFallback: React.FC<FallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  return (
    <div className="error-fallback flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="flex-grow flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-center mb-4">
          Something went wrong!
        </h1>
        <p className="text-gray-600" data-testid="error-message">
          {error.message}
        </p>
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-white p-6 text-center z-50">
        <button
          onClick={resetErrorBoundary}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ErrorFallback;
