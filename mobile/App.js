import React, { useState, useEffect } from 'react';
import { StatusBar, View, Text } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';
import AppNavigator from './src/navigation/AppNavigator';
import ThemeSelectScreen from './src/screens/ThemeSelectScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import { loadJSON } from './src/utils/storage';

function AppContent() {
  const { themeName, colors, fontSizeName, fontScale } = useTheme();
  const [onboardingData, setOnboardingData] = useState(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJSON('ponny_onboarding').then(data => {
      setOnboardingData(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <View style={{ flex: 1, backgroundColor: '#FFF5F8' }} />;

  if (!themeName) {
    return <ThemeSelectScreen />;
  }

  if (!onboardingData) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />
        <OnboardingScreen onComplete={(data) => setOnboardingData(data)} />
      </SafeAreaView>
    );
  }

  // key={fontSizeName} forces full re-render when font size changes
  return (
    <View key={fontSizeName} style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.gradientHeader[0]} />
      <AppNavigator />
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
