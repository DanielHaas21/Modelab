import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

/**
 * A hook that applies the current theme (light or dark) to the root element of the document.
 */
export const useTheme = () => {
  const mode = useSelector((state: RootState) => state.Mode.value);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(mode);
  }, [mode]);
};
