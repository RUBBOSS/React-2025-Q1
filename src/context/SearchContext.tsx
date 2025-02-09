import React, { createContext, useState, ReactNode, useContext } from 'react';

type SearchContextType = {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
};

export const SearchContext = createContext<SearchContextType | undefined>(
  undefined
);

type Props = {
  children: ReactNode;
};

export const SearchProvider: React.FC<Props> = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  return (
    <SearchContext.Provider value={{ searchTerm, setSearchTerm }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};
