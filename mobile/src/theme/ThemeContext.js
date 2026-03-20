import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { pinkTheme, blueTheme } from './colors';

const ThemeContext = createContext();

const FONT_SCALES = { small: 0.88, medium: 1, large: 1.15 };

export function ThemeProvider({ children }) {
  const [themeName, setThemeName] = useState(null);
  const [fontSizeName, setFontSizeName] = useState('medium');

  useEffect(() => {
    AsyncStorage.getItem('ponny_theme').then(v => { if (v) setThemeName(v); });
    AsyncStorage.getItem('ponny_font_size').then(v => { if (v) setFontSizeName(v); });
  }, []);

  const colors = themeName === 'blue' ? blueTheme : pinkTheme;
  const fontScale = FONT_SCALES[fontSizeName] || 1;

  // fs(size) — scale any fontSize value
  const fs = useMemo(() => {
    return (size) => Math.round(size * fontScale);
  }, [fontScale]);

  const selectTheme = async (name) => {
    setThemeName(name);
    await AsyncStorage.setItem('ponny_theme', name);
  };

  const toggleTheme = async () => {
    const next = themeName === 'pink' ? 'blue' : 'pink';
    await selectTheme(next);
  };

  const setFontSize = async (size) => {
    setFontSizeName(size);
    await AsyncStorage.setItem('ponny_font_size', size);
  };

  return (
    <ThemeContext.Provider value={{ themeName, colors, selectTheme, toggleTheme, fontSizeName, fontScale, setFontSize, fs }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
