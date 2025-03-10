import React from 'react';
import { useNavigate, isRouteErrorResponse, useRouteError } from 'react-router-dom';

// Router Error UI component
const RouterErrorUI = () => {
  const navigate = useNavigate();
  const error = useRouteError();
  
  let errorMessage = "Something went wrong";
  let errorDetails = "";
  
  if (isRouteErrorResponse(error)) {
    // If this is a route error response (like 404, 500)
    errorMessage = `${error.status} ${error.statusText}`;
    errorDetails = error.data?.message || JSON.stringify(error.data);
  } else if (error instanceof Error) {
    errorMessage = error.message;
    errorDetails = error.stack || "";
  } else if (typeof error === 'object' && error !== null) {
    errorDetails = JSON.stringify(error, null, 2);
  }
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4 dark:bg-gray-900">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
        <h2 className="mb-4 text-2xl font-bold text-red-600">
          {errorMessage}
        </h2>
        <div className="mb-4 overflow-auto rounded-md bg-gray-100 p-4 dark:bg-gray-700">
          <p className="font-mono text-sm text-red-500">
            {errorDetails}
          </p>
        </div>
        <div className="mt-6 flex justify-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="rounded-md bg-gray-500 px-4 py-2 text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Go Back
          </button>
          <button
            onClick={() => navigate('/')}
            className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

// The RouterErrorBoundary component is a function component
// because React Router's errorElement expects a component that
// can use hooks like useRouteError
const RouterErrorBoundary = () => {
  return <RouterErrorUI />;
};

export default RouterErrorBoundary;
