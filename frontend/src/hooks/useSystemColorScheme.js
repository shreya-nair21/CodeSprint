import { useEffect, useMemo, useState } from 'react';

export const useSystemColorScheme = () => {
  const mediaQuery = useMemo(
    () => window.matchMedia('(prefers-color-scheme: dark)'),
    []
  );

  const [preferredColorScheme, setPreferredColorScheme] = useState(
    mediaQuery.matches ? 'Dark' : 'Light'
  );

  useEffect(() => {
    const handleChange = (event) => {
      setPreferredColorScheme(event.matches ? 'Dark' : 'Light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mediaQuery]);

  return preferredColorScheme;
};
