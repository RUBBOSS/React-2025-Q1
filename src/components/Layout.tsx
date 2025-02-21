import { useSearchParams } from 'react-router-dom';
import Search from './Search';
import Results from './Results';
import Details from './Details';
import TestErrorButton from './TestErrorButton';
import ErrorBoundary from './ErrorBoundary';
import LoadingIndicator from './LoadingIndicator';
import ThemeSwitcher from './ThemeSwitcher';
import Flyout from './Flyout';

const Layout = () => {
  const [searchParams] = useSearchParams();
  const showDetails = searchParams.has('details');

  return (
    <ErrorBoundary resetErrorState={() => {}}>
      <LoadingIndicator />
      <div className="container mx-auto py-4 px-4 relative">
        <h1 className="text-4xl font-bold text-center absolute left-1/2 transform -translate-x-1/2">
          Pokémon Search
        </h1>
        <div className="absolute right-0 top-0">
          <ThemeSwitcher />
        </div>
      </div>

      <div className="container mx-auto py-8 px-4">
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
      <Flyout />
    </ErrorBoundary>
  );
};

export default Layout;
