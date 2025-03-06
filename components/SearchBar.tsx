import React, { useState, useEffect, useRef } from 'react';
interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
  initialValue?: string;
}
const SearchBar: React.FC<SearchBarProps> = ({ onSearch, initialValue = '' }) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [isSearching, setIsSearching] = useState(false);
  const activeSearchRef = useRef<string | null>(null);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSearching(true);
    const currentSearchTerm = searchTerm.trim().toLowerCase();
    activeSearchRef.current = currentSearchTerm;
    setTimeout(() => {
      if (activeSearchRef.current === currentSearchTerm) {
        onSearch(currentSearchTerm);
        setIsSearching(false);
      }
    }, 300);
  };
  const handleReset = () => {
    setSearchTerm('');
    setIsSearching(true);
    activeSearchRef.current = '';
    setTimeout(() => {
      if (activeSearchRef.current === '') {
        onSearch('');
        setIsSearching(false);
      }
    }, 300);
  };
  useEffect(() => {
    return () => {
      activeSearchRef.current = null;
    };
  }, []);
  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search Pokemon by name or ID..."
          className="w-full p-3 pl-4 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white shadow-md"
          disabled={isSearching}
        />
        {searchTerm && (
          <button
            type="button"
            onClick={handleReset}
            className="absolute right-12 top-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            aria-label="Clear search"
            disabled={isSearching}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        <button
          type="submit"
          className="absolute right-3 top-3 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          disabled={isSearching}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </form>
  );
};
export default SearchBar;
