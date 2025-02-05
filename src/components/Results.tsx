import { useState, useEffect } from 'react';
import Loader from './Loader';
import Card from './Card';

interface Result {
  name: string;
  url: string;
}

const Results = () => {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedSearchTerm = localStorage.getItem('searchTerm') || '';
    fetchResults(savedSearchTerm);

    const handleSearchEvent = (event: Event) => {
      const customEvent = event as CustomEvent;
      const searchTerm = customEvent.detail;
      fetchResults(searchTerm);
    };

    window.addEventListener('search', handleSearchEvent);

    return () => {
      window.removeEventListener('search', handleSearchEvent);
    };
  }, []);

  const fetchResults = async (searchTerm: string) => {
    setLoading(true);
    setError(null);

    try {
      const apiUrl = searchTerm
        ? `https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`
        : `https://pokeapi.co/api/v2/pokemon?limit=10`;

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

  if (loading) return <Loader />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="results-container">
      {results.map((result) => (
        <Card
          key={result.name}
          name={result.name}
          url={
            result.url || `https://pokeapi.co/api/v2/pokemon/${result.name}/`
          }
        />
      ))}
    </div>
  );
};

export default Results;
