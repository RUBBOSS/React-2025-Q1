import { useState, ChangeEvent } from 'react';
import { useSearch } from '../context/SearchContext';
import Loader from './Loader';

const Search = () => {
  const [loading, setLoading] = useState(false);
  const { searchTerm, setSearchTerm } = useSearch();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = async () => {
    const trimmedTerm = searchTerm.trim();
    localStorage.setItem('searchTerm', trimmedTerm);
    setLoading(true);

    setSearchTerm(trimmedTerm); // This will trigger Results to fetch

    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center gap-4 my-4">
      <input
        type="text"
        placeholder="Search Pokémon"
        value={searchTerm}
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
