import { useContext } from 'react';
import { AppContext } from '@/context/AppContext';
import theme from '@/constants/theme';

export function useTheme() {
  const { darkMode } = useContext(AppContext);
  
  // Currently we only have a dark theme, but this hook is set up to support a light theme in the future
  return theme;
}