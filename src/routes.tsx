import { json } from '@remix-run/router';
import { createBrowserRouter, createStaticRouter } from 'react-router-dom';
import type { StaticHandlerContext } from '@remix-run/router';
import { fetchHomeData, fetchAboutData } from './api/data';
import Root from '../components/Root';
import Home from './pages/Home';
import HomePage from '../components/HomePage';
import RouterErrorBoundary from '../components/RouterErrorBoundary';

interface Pokemon {
  id: number;
  name: string;
}

interface HomeData {
  pokemonData: Pokemon[];
  totalCount: number;
}

interface AboutData {
  content: string;
}

export const routes = [
  {
    path: '/',
    element: <Root />,
    errorElement: <RouterErrorBoundary />,
    children: [
      {
        path: '',
        element: <Home />,
        loader: async (): Promise<HomeData> => {
          try {
            const data = await fetchHomeData();
            return data;
          } catch (error) {
            throw json({ 
              message: 'Failed to load home data' 
            }, { status: 500 });
          }
        },
      },
      {
        path: 'about',
        element: <HomePage />,
        loader: async (): Promise<AboutData> => {
          try {
            const data = await fetchAboutData();
            return data;
          } catch (error: unknown) {
            throw json({ 
              message: 'Failed to load about data' 
            }, { status: 500 });
          }
        },
      },
    ],
  },
];

export const createRouter = (isServer: boolean, context?: StaticHandlerContext) => {
  if (isServer) {
    if (!context) {
      throw new Error("StaticHandlerContext is required for server rendering");
    }
    return createStaticRouter(routes, context);
  } else {
    return createBrowserRouter(routes, { basename: '/' });
  }
};
