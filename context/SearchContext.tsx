import React, { createContext, useContext, useState, ReactNode } from 'react';
interface Pokemon {
  id: string;
  name: string;
  url: string;
  types?: string[];
  sprites?: {
    front_default: string;
    other?: {
      'official-artwork'?: {
        front_default: string;
      };
    };
  };
}
interface SearchContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  searchResults: Pokemon[];
  setSearchResults: (results: Pokemon[]) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}
const SearchContext = createContext<SearchContextType | undefined>(undefined);
export const useSearch = (): SearchContextType => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};
interface SearchProviderProps {
  children: ReactNode;
}
export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const value = {
    searchTerm,
    setSearchTerm,
    searchResults,
    setSearchResults,
    isLoading,
    setIsLoading,
    error,
    setError,
  };
  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
};
