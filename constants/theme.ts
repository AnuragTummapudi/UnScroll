import { Platform } from 'react-native';

const colors = {
  primary: '#6366F1', // Electric indigo
  primaryLight: '#818CF8',
  primaryDark: '#4F46E5',
  
  secondary: '#8B5CF6', // Purple
  secondaryLight: '#A78BFA',
  secondaryDark: '#7C3AED',
  
  accent: '#F97316', // Orange
  accentLight: '#FB923C',
  accentDark: '#EA580C',
  
  success: '#10B981', // Green
  successLight: '#34D399',
  successDark: '#059669',
  
  warning: '#FBBF24', // Yellow
  warningLight: '#FCD34D',
  warningDark: '#D97706',
  
  error: '#EF4444', // Red
  errorLight: '#F87171',
  errorDark: '#DC2626',
  
  background: {
    primary: '#0F172A', // Very dark blue
    secondary: '#1E293B', // Dark blue-gray
    elevation: '#334155', // Medium blue-gray for cards
  },
  
  text: {
    primary: '#F1F5F9', // Almost white
    secondary: '#94A3B8', // Light gray
    tertiary: '#64748B', // Medium gray
  },
  
  border: '#334155',
  divider: '#1E293B',
  
  glass: {
    background: 'rgba(30, 41, 59, 0.7)', // Semi-transparent dark blue
    border: 'rgba(99, 102, 241, 0.3)', // Semi-transparent primary
  },
};

const fonts = Platform.select({
  ios: {
    regular: 'System',
    medium: 'System',
    semiBold: 'System',
    bold: 'System',
  },
  android: {
    regular: 'sans-serif',
    medium: 'sans-serif-medium',
    semiBold: 'sans-serif-medium',
    bold: 'sans-serif-bold',
  },
  default: {
    regular: 'System',
    medium: 'System',
    semiBold: 'System',
    bold: 'System',
  },
});

const fontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
};

const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
};

const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },
  glow: (color: string, opacity = 0.5) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: opacity,
    shadowRadius: 10,
    elevation: 10,
  }),
};

const animations = {
  default: {
    duration: 300,
  },
  fast: {
    duration: 150,
  },
  slow: {
    duration: 500,
  },
};

// Web-specific styles
const webStyles = Platform.OS === 'web' ? {
  root: {
    backgroundColor: colors.background.primary,
    color: colors.text.primary,
    fontFamily: fonts.regular,
  },
  scrollbar: {
    '::-webkit-scrollbar': {
      width: '8px',
      height: '8px',
    },
    '::-webkit-scrollbar-track': {
      background: colors.background.secondary,
    },
    '::-webkit-scrollbar-thumb': {
      background: colors.background.elevation,
      borderRadius: '4px',
    },
    '::-webkit-scrollbar-thumb:hover': {
      background: colors.primary,
    },
  },
} : {};

export const theme = {
  colors,
  fonts,
  fontSizes,
  spacing,
  borderRadius,
  shadows,
  animations,
  webStyles,
};

export default theme;