import { useState, ChangeEvent } from 'react';
import { useSearch } from '../context/SearchContext.tsx';
import Loader from './Loader';
import { useSearchParams } from 'react-router-dom';

const Search = () => {
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const { searchTerm, setSearchTerm } = useSearch();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSearch = async () => {
    const trimmedTerm = inputValue.trim();
    if (trimmedTerm !== searchTerm) {
      setLoading(true);

      const newParams = new URLSearchParams(searchParams);
      newParams.set('page', '1');
      if (trimmedTerm) {
        newParams.set('query', trimmedTerm);
      } else {
        newParams.delete('query');
      }
      setSearchParams(newParams);

      setSearchTerm(trimmedTerm);
      localStorage.setItem('searchTerm', trimmedTerm);

      await new Promise((resolve) => setTimeout(resolve, 1000));
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center gap-4 my-4">
      <input
        type="text"
        placeholder="Search Pokémon"
        value={inputValue}
        onChange={handleInputChange}
        className="px-4 py-2 border-4 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleSearch}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Search
      </button>
      {loading && <Loader />}
    </div>
  );
};

export default Search;
