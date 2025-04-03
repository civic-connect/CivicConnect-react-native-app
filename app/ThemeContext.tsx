// ThemeContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';

type ColorPalette = {
  primary: string;
  secondary: string;
  background: string;
  card: string;
  text: string;
  subtext: string;
  border: string;
  accent: string;
  error: string;
  success: string;
  gradient: string[];
};

type ThemeContextType = {
  darkMode: boolean;
  toggleTheme: () => void;
  colors: ColorPalette;
};

export const ThemeContext = createContext<ThemeContextType>({
  darkMode: false,
  toggleTheme: () => {},
  colors: {} as ColorPalette,
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const colorScheme = useColorScheme();
  const [darkMode, setDarkMode] = useState(false);
  const isDark = darkMode || colorScheme === 'dark';

  const colors = {
    light: {
      primary: '#4361ee',
      secondary: '#3a0ca3',
      background: '#f8f9fa',
      card: '#ffffff',
      text: '#212529',
      subtext: '#6c757d',
      border: '#dee2e6',
      accent: '#f72585',
      error: '#ef233c',
      success: '#4cc9f0',
      gradient: ['#4361ee', '#3a0ca3']
    },
    dark: {
      primary: '#4895ef',
      secondary: '#560bad',
      background: '#121212',
      card: '#1e1e1e',
      text: '#f8f9fa',
      subtext: '#adb5bd',
      border: '#343a40',
      accent: '#b5179e',
      error: '#f72585',
      success: '#4cc9f0',
      gradient: ['#4895ef', '#3f37c9']
    }
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeContext.Provider value={{
      darkMode,
      toggleTheme,
      colors: isDark ? colors.dark : colors.light,
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);