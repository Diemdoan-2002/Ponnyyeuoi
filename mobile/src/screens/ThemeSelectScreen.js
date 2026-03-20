import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

export default function ThemeSelectScreen() {
  const { selectTheme, colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ponnyxinchao! 🌸</Text>
      <Text style={styles.subtitle}>Bé yêu của bạn thích màu gì? 💕{'\n'}Bạn luôn có thể đổi sau nha!</Text>
      <View style={styles.choices}>
        <TouchableOpacity 
          style={[styles.choice, { backgroundColor: '#FFE4EE', borderColor: '#FF6B9D' }]} 
          onPress={() => selectTheme('pink')}
          activeOpacity={0.8}
        >
          <Text style={styles.choiceEmoji}>❤️</Text>
          <Text style={[styles.choiceText, { color: '#FF6B9D' }]}>Pink Mode</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.choice, { backgroundColor: '#DBEAFE', borderColor: '#6B9FE8' }]} 
          onPress={() => selectTheme('blue')}
          activeOpacity={0.8}
        >
          <Text style={styles.choiceEmoji}>💙</Text>
          <Text style={[styles.choiceText, { color: '#6B9FE8' }]}>Blue Mode</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF5F8', padding: 32 },
  title: { fontSize: 32, fontWeight: '900', color: '#2D1B3D', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#6B5B7B', textAlign: 'center', marginBottom: 40, lineHeight: 24, fontWeight: '600' },
  choices: { flexDirection: 'row', gap: 16 },
  choice: { width: 140, height: 160, borderRadius: 24, borderWidth: 3, justifyContent: 'center', alignItems: 'center' },
  choiceEmoji: { fontSize: 48, marginBottom: 8 },
  choiceText: { fontSize: 16, fontWeight: '800' },
});
