import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

// Hook: auto-scale all fontSize values in a styles object
// Usage: const styles = useScaledStyles(rawStyles);
export function useScaledStyles(stylesFn) {
  const { fs } = useTheme();
  return useMemo(() => {
    const raw = typeof stylesFn === 'function' ? stylesFn(fs) : stylesFn;
    const scaled = {};
    for (const key in raw) {
      const style = raw[key];
      if (style && typeof style === 'object' && style.fontSize) {
        scaled[key] = { ...style, fontSize: fs(style.fontSize) };
      } else {
        scaled[key] = style;
      }
    }
    return StyleSheet.create(scaled);
  }, [fs, stylesFn]);
}
