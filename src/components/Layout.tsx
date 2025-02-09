import { useSearchParams } from 'react-router-dom';
import Search from './Search';
import Results from './Results';
import Details from './Details';
import TestErrorButton from './TestErrorButton';
import ErrorBoundary from './ErrorBoundary';

const Layout = () => {
  const [searchParams] = useSearchParams();
  const showDetails = searchParams.has('details');

  return (
    <ErrorBoundary resetErrorState={() => {}}>
      {' '}
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Pokémon Search</h1>
        <div className="flex gap-6">
          <div
            className={`${showDetails ? 'w-1/2' : 'w-full'} transition-all duration-300`}
          >
            <Search />
            <Results />
            <TestErrorButton />
          </div>
          {showDetails && (
            <div className="w-1/2 sticky top-8 h-[calc(100vh-4rem)] transition-all duration-300">
              <Details />
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Layout;
