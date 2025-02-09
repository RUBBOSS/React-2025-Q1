import { useNavigate } from 'react-router-dom';
import { useSearch } from '../context/SearchContext.tsx';

const NotFound = () => {
  const { setSearchTerm } = useSearch();
  const navigate = useNavigate();

  const handleReturn = () => {
    setSearchTerm('');
    localStorage.removeItem('searchTerm');
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
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
            <button
              onClick={handleReturn}
              className="inline-flex items-center gap-2 px-6 py-3 text-lg bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all transform hover:scale-105 shadow-lg"
            >
              <span>Return to Home</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
