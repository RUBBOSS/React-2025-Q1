/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from 'react';
import { SearchContextProps } from './searchTypes';

export interface SearchProps {
  onSearch?: (searchTerm: string) => void;
}

const SearchContext = createContext<SearchContextProps | undefined>(undefined);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [searchTerm, setSearchTermState] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('searchTerm') || '';
    }
    return '';
  });

  const setSearchTerm: React.Dispatch<React.SetStateAction<string>> = (
    term
  ) => {
    const newTerm = typeof term === 'function' ? term(searchTerm) : term;
    setSearchTermState(newTerm);
    if (typeof window !== 'undefined') {
      localStorage.setItem('searchTerm', newTerm);
    }
  };

  return (
    <SearchContext.Provider value={{ searchTerm, setSearchTerm }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = (): SearchContextProps => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};
