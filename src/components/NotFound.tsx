import { Link } from 'react-router-dom';
import { useSearch } from '../context/SearchContext.tsx';

const NotFound = () => {
  const { setSearchTerm } = useSearch();

  const handleReturn = () => {
    setSearchTerm('');
    localStorage.removeItem('searchTerm');
  };

  return (
    <div
      className="min-h-[80vh] flex flex-col items-center justify-center p-4"
      data-testid="404-page"
    >
      <div className="text-center space-y-6">
        <h1 className="text-9xl font-bold text-blue-500 animate-bounce">404</h1>
        <div className="space-y-4">
          <h2 className="text-3xl font-semibold text-gray-800">
            Oops! Looks like this area is unexplored!
          </h2>
          <p className="text-xl text-gray-600">
            The Pokémon you&apos;re looking for might be in another route...
          </p>
          <div className="mt-8">
            <Link
              to="/"
              onClick={handleReturn}
              className="inline-flex items-center gap-2 px-6 py-3 text-lg bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all transform hover:scale-105 shadow-lg"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
