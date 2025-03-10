import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { createRouter } from '../src/routes';

// Create the router for client-side rendering
const router = typeof window !== 'undefined' ? createRouter(false) : null;

const ReactRouterApp = () => {
  if (!router) {
    return <div>Loading router...</div>;
  }
  
  return <RouterProvider router={router} />;
};

export default ReactRouterApp;
