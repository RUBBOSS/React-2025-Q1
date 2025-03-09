'use client';

import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import { ThemeProvider } from '../context/ThemeContext';
import ErrorBoundary from '../components/ErrorBoundary';

export function Providers({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <React.StrictMode>
      <ErrorBoundary>
        <Provider store={store}>
          <ThemeProvider>
            {isClient ? children : null}
          </ThemeProvider>
        </Provider>
      </ErrorBoundary>
    </React.StrictMode>
  );
}
