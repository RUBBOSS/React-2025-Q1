import { useState, useEffect } from 'react';

const useRestoreSearchQuery = () => {
  const [query, setQuery] = useState<string>(() => {
    // Restore from local storage on component mount
    return localStorage.getItem('searchQuery') || '';
  });

  useEffect(() => {
    // Persist query changes to local storage
    localStorage.setItem('searchQuery', query);
  }, [query]);

  return [query, setQuery] as const;
};

export default useRestoreSearchQuery;
