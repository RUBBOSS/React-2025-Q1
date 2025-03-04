import { useState, useEffect } from 'react';

/**
 * Hook to track if the component is mounted
 * Useful for preventing hydration mismatch with localStorage or theme settings
 */
export const useMounted = (): boolean => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
};
