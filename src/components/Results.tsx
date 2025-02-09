import { useState, useEffect, useCallback } from 'react';
import { useSearch } from '../context/SearchContext.tsx';
import Loader from './Loader';
import Card from './Card';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Pagination from './Pagination';

interface Result {
  name: string;
  url: string;
}

const ITEMS_PER_PAGE = 9;

const Results = () => {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { searchTerm } = useSearch();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  const navigate = useNavigate();

  const fetchResults = useCallback(
    async (query: string) => {
      setLoading(true);
      setError(null);

      try {
        const apiUrl = query
          ? `https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`
          : `https://pokeapi.co/api/v2/pokemon?limit=150`;

        const response = await fetch(apiUrl);

        if (response.status === 404 && query) {
          navigate('/404');
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch data. Please try again.');
        }

        const data = await response.json();
        const resultsData = query
          ? [{ name: data.name, url: apiUrl }]
          : data.results;

        setResults(resultsData);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unknown error occurred');
        }
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [navigate] // removed 'searchTerm'
  );

  useEffect(() => {
    fetchResults(searchTerm);
  }, [fetchResults, searchTerm]);

  const resetToMainList = () => {
    localStorage.removeItem('searchTerm');
    fetchResults('');
  };

  const handleSectionClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      searchParams.delete('details');
      setSearchParams(searchParams);
    }
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedItems = results.slice(startIndex, endIndex);

  if (loading) return <Loader />;
  if (error)
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="text-red-600 font-semibold">{error}</div>
        <button
          onClick={resetToMainList}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Back to Main List
        </button>
      </div>
    );

  return (
    <div onClick={handleSectionClick}>
      <div className="results grid gap-8 mt-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 px-6">
        {paginatedItems.length > 0 ? (
          paginatedItems.map((result) => (
            <Card
              key={result.name}
              name={result.name}
              url={
                result.url ||
                `https://pokeapi.co/api/v2/pokemon/${result.name}/`
              }
            />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center gap-4">
            <p className="text-gray-600">No Pokémon found</p>
            <button
              onClick={resetToMainList}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Back to Main List
            </button>
          </div>
        )}
      </div>
      <Pagination totalItems={results.length} itemsPerPage={ITEMS_PER_PAGE} />
    </div>
  );
};

export default Results;
