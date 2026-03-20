import React from 'react';
import { Text as RNText } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

// AppText: drop-in replacement for Text that auto-scales fontSize
export default function AppText(props) {
  const { fontScale } = useTheme();

  if (!fontScale || fontScale === 1) {
    return <RNText {...props} />;
  }

  // Scale fontSize from style (handles arrays and objects)
  const scaledStyle = scaleStyle(props.style, fontScale);
  return <RNText {...props} style={scaledStyle} />;
}

function scaleStyle(style, scale) {
  if (!style) return style;
  if (Array.isArray(style)) {
    return style.map(s => scaleStyle(s, scale));
  }
  if (typeof style === 'number') {
    // StyleSheet.create reference — can't modify, return as is
    return style;
  }
  if (typeof style === 'object' && style.fontSize) {
    return { ...style, fontSize: Math.round(style.fontSize * scale) };
  }
  return style;
}
