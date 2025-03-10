import React from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/globals.css';
import '../styles/base.css';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import { ThemeProvider } from '../context/ThemeContext';
import ErrorBoundary from '../components/ErrorBoundary';

// Check if we should use React Router
const useReactRouter = process.env.NEXT_PUBLIC_USE_REACT_ROUTER === 'true';

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  // For normal Next.js rendering
  if (!useReactRouter) {
    return (
      <React.StrictMode>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Pokemon Explorer</title>
        </Head>
        <ErrorBoundary>
          <Provider store={store}>
            <ThemeProvider>
              <Component {...pageProps} />
            </ThemeProvider>
          </Provider>
        </ErrorBoundary>
      </React.StrictMode>
    );
  }

  // For React Router SSR
  // Dynamic import to avoid issues when not using React Router
  const ReactRouterApp = React.lazy(() => import('../components/ReactRouterApp'));

  return (
    <React.StrictMode>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Pokemon Explorer</title>
      </Head>
      <ErrorBoundary>
        <Provider store={store}>
          <ThemeProvider>
            <React.Suspense fallback={<div>Loading...</div>}>
              <ReactRouterApp />
            </React.Suspense>
          </ThemeProvider>
        </Provider>
      </ErrorBoundary>
    </React.StrictMode>
  );
};

export default MyApp;
