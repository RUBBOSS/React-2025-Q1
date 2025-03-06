import { ReactNode } from 'react';
export interface Pokemon {
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
export interface SearchContextProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  results: Pokemon[];
  setResults: (results: Pokemon[]) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}
export interface SearchProviderProps {
  children: ReactNode;
}
export interface SearchComponentProps {
  onSearch?: (searchTerm: string) => void;
}
