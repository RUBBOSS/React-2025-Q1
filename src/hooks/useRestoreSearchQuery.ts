import { useState, useEffect } from 'react';

const useRestoreSearchQuery = () => {
  const [query, setQuery] = useState<string>(() => {
    return localStorage.getItem('searchQuery') || '';
  });

  useEffect(() => {
    localStorage.setItem('searchQuery', query);
  }, [query]);

  return [query, setQuery] as const;
};

export default useRestoreSearchQuery;
