import { hydrateRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { createRouter } from './routes';

const router = createRouter(false);

hydrateRoot(
  document,
  <RouterProvider router={router} />
);
