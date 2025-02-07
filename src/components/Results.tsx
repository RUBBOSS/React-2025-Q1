import { useState, useEffect } from 'react';
import { useSearch } from '../context/SearchContext';
import Loader from './Loader';
import Card from './Card';
import { useSearchParams } from 'react-router-dom';
import Pagination from './Pagination';

interface Result {
  name: string;
  url: string;
}

// Change items per page to 9
const ITEMS_PER_PAGE = 9;

const Results = () => {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { searchTerm } = useSearch();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  useEffect(() => {
    fetchResults(searchTerm);
  }, [searchTerm]);

  const fetchResults = async (searchTerm: string) => {
    setLoading(true);
    setError(null);

    try {
      const apiUrl = searchTerm
        ? `https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`
        : `https://pokeapi.co/api/v2/pokemon?limit=150`; // Increased limit to show more pages

      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error('Failed to fetch data. Please try again.');
      }

      const data = await response.json();
      const resultsData = searchTerm
        ? [{ name: data.name, url: data.url }]
        : data.results;

      setResults(resultsData);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const resetToMainList = () => {
    localStorage.removeItem('searchTerm');
    fetchResults('');
  };

  const handleSectionClick = (e: React.MouseEvent) => {
    // Only close if clicking the container, not a card
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
      <div className="grid gap-8 mt-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 px-6">
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
