import { createStaticHandler, StaticHandlerContext } from '@remix-run/router';
import { StaticRouterProvider } from 'react-router-dom';
import { routes } from './routes';
import { createRouter } from './routes';

export async function render(request: Request) {
  const handler = createStaticHandler(routes);
  const context = await handler.query(request) as StaticHandlerContext;
  
  return <StaticRouterProvider router={createRouter(true, context)} context={context} />;
}
