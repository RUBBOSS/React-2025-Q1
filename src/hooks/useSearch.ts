import { useState, useEffect } from 'react';

export function useSearch() {
  const [searchTerm, setSearchTerm] = useState(() => {
    return localStorage.getItem('searchTerm') || '';
  });

  useEffect(() => {
    localStorage.setItem('searchTerm', searchTerm);
  }, [searchTerm]);

  return { searchTerm, setSearchTerm };
}
