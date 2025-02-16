export interface SearchContextProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export interface SearchComponentProps {
  onSearch?: (searchTerm: string) => void;
}
