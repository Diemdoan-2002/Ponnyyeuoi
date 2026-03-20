import AsyncStorage from '@react-native-async-storage/async-storage';

export async function loadJSON(key, fallback = null) {
  try {
    const s = await AsyncStorage.getItem(key);
    return s ? JSON.parse(s) : fallback;
  } catch {
    return fallback;
  }
}

export async function saveJSON(key, value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('Storage save error:', e);
  }
}

export async function clearAll() {
  try {
    await AsyncStorage.clear();
  } catch (e) {
    console.warn('Storage clear error:', e);
  }
}
