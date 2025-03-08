'use client';

import React, { useState, useEffect, useRef } from 'react';

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
  initialValue?: string;
}

const SearchBar = ({ onSearch, initialValue = '' }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [isSearching, setIsSearching] = useState(false);
  const activeSearchRef = useRef<string | null>(null);

  // Update searchTerm when initialValue changes
  useEffect(() => {
    if (initialValue !== searchTerm) {
      setSearchTerm(initialValue);
    }
  }, [initialValue]);

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
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search Pokemon by name or ID..."
          className="w-full rounded-lg border border-gray-300 p-3 pl-4 pr-10 shadow-md focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
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
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
        <button
          type="submit"
          className="absolute right-3 top-3 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          disabled={isSearching}
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
