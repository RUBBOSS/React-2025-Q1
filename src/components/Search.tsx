import { useState, ChangeEvent } from 'react';
import Loader from './Loader';

const Search = () => {
  const savedSearchTerm = localStorage.getItem('searchTerm') || '';
  const [searchTerm, setSearchTerm] = useState(savedSearchTerm);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = async () => {
    const trimmedTerm = searchTerm.trim();
    localStorage.setItem('searchTerm', trimmedTerm);
    setLoading(true);

    const event = new CustomEvent('search', { detail: trimmedTerm });
    window.dispatchEvent(event);

    await fetchSearchResults(trimmedTerm);

    setLoading(false);
  };

  const fetchSearchResults = (term: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Results for: ${term}`);
        resolve(true);
      }, 1000);
    });
  };

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search Pokémon"
        value={searchTerm}
        onChange={handleInputChange}
      />
      <button onClick={handleSearch}>Search</button>

      {loading && <Loader />}
    </div>
  );
};

export default Search;
