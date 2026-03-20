import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';
import { useScaledStyles } from '../hooks/useScaledStyles';
import { loadJSON, saveJSON } from '../utils/storage';
import { fmtTime } from '../utils/pregnancy';
import Svg, { Circle } from 'react-native-svg';

export default function KickScreen() {
  const { colors, fs } = useTheme();
  const styles = useScaledStyles(RAW_STYLES);
  const navigation = useNavigation();
  const [kickCount, setKickCount] = useState(0);
  const [kickTimer, setKickTimer] = useState(0);
  const [kickRunning, setKickRunning] = useState(false);
  const [kickHistory, setKickHistory] = useState([]);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    loadJSON('ponny_kicks', []).then(setKickHistory);
  }, []);

  useEffect(() => {
    if (!kickRunning) return;
    const t = setInterval(() => setKickTimer(v => v + 1), 1000);
    return () => clearInterval(t);
  }, [kickRunning]);

  const doKick = () => {
    if (!kickRunning) setKickRunning(true);
    setKickCount(v => v + 1);
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.2, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
  };

  const undoKick = () => {
    if (kickCount > 0) setKickCount(v => v - 1);
  };

  const endSession = async () => {
    if (kickCount > 0) {
      const entry = { time: new Date().toLocaleTimeString('vi', { hour: '2-digit', minute: '2-digit' }), count: kickCount, duration: kickTimer };
      const updated = [entry, ...kickHistory.slice(0, 9)];
      setKickHistory(updated);
      await saveJSON('ponny_kicks', updated);
    }
    setKickRunning(false);
    setKickTimer(0);
    setKickCount(0);
  };

  const circumference = 2 * Math.PI * 60;
  const progress = Math.min(kickCount, 10) / 10;

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.bg }]} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.gradientHeader[0] }]}>
        <Text style={styles.headerTitle}>Đếm cử động</Text>
      </View>

      <Animated.Text style={[styles.kickNum, { color: colors.primary, transform: [{ scale: scaleAnim }] }]}>
        {kickCount}
      </Animated.Text>
      <Text style={[styles.kickLabel, { color: colors.textSecondary }]}>lần bé đạp</Text>
      <Text style={[styles.kickTimer, { color: colors.text }]}>{fmtTime(kickTimer)}</Text>

      {/* Big Button */}
      <View style={styles.btnWrap}>
        <Svg width={146} height={146} style={styles.progressRing}>
          <Circle cx={73} cy={73} r={60} fill="none" stroke={colors.primaryLighter} strokeWidth={5} />
          <Circle
            cx={73} cy={73} r={60} fill="none" stroke={colors.primary} strokeWidth={5}
            strokeDasharray={circumference} strokeDashoffset={circumference * (1 - progress)}
            strokeLinecap="round" rotation={-90} origin="73,73"
          />
        </Svg>
        <TouchableOpacity
          style={[styles.kickBtn, { backgroundColor: colors.primary }]}
          onPress={doKick}
          activeOpacity={0.7}
        >
          <Image source={require('../../assets/illustrations/baby-kick.png')} style={{ width: 72, height: 72 }} resizeMode="contain" />
        </TouchableOpacity>
      </View>

      <Text style={[styles.target, { color: colors.textSecondary }]}>{kickCount}/10 cử động (mục tiêu 2 giờ)</Text>
      {kickCount > 0 && (
        <Text style={[styles.kickMsg, { color: kickCount >= 10 ? colors.success : colors.primary }]}>
          {kickCount >= 10 ? 'Tuyệt vời! Bé rất khỏe mạnh!' : `Thêm ${10 - kickCount} cú đạp nữa!`}
        </Text>
      )}

      <View style={styles.actions}>
        {kickCount > 0 && (
          <TouchableOpacity style={[styles.actionBtn, { borderColor: colors.primaryLight }]} onPress={undoKick}>
            <Text style={[styles.actionBtnText, { color: colors.textSecondary }]}>Bỏ lần cuối</Text>
          </TouchableOpacity>
        )}
        {kickRunning && (
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.primary }]} onPress={endSession}>
            <Text style={[styles.actionBtnText, { color: '#fff' }]}>Kết thúc phiên</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={[styles.hint, { backgroundColor: colors.surface }]}>
        <Text style={[styles.hintText, { color: colors.textSecondary }]}>
          Bấm vào em bé mỗi khi bé đạp.{'\n'}
          <Text style={{ fontWeight: '800' }}>Chuẩn:</Text> 10 cử động trong 2 giờ là bình thường.{'\n'}
          Nếu bé đạp ít hơn bình thường, hãy liên hệ bác sĩ.
        </Text>
      </View>

      {/* History */}
      {kickHistory.length > 0 && (
        <View style={styles.historySection}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Image source={require('../../assets/icons/nav-kick.png')} style={{ width: 18, height: 18 }} />
            <Text style={[styles.historyTitle, { color: colors.text }]}>Lịch sử đếm hôm nay</Text>
          </View>
          {kickHistory.map((h, i) => (
            <View key={i} style={[styles.historyItem, { backgroundColor: colors.surface }]}>
              <Text style={[styles.historyTime, { color: colors.primary }]}>{h.time}</Text>
              <Text style={[styles.historyCount, { color: colors.text }]}>{h.count} cử động • {fmtTime(h.duration)}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const RAW_STYLES = {
  container: { flex: 1 },
  content: { alignItems: 'center' },
  header: { width: '100%', padding: 16, paddingTop: 48, alignItems: 'center', borderBottomLeftRadius: 24, borderBottomRightRadius: 24, marginBottom: 24, flexDirection: 'row', justifyContent: 'center' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '900' },
  backBtn: { position: 'absolute', left: 16, top: 48, backgroundColor: 'rgba(255,255,255,0.2)', width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  backBtnText: { color: '#fff', fontSize: 18, fontWeight: '800' },
  kickNum: { fontSize: 72, fontWeight: '900' },
  kickLabel: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  kickTimer: { fontSize: 18, fontWeight: '800', marginBottom: 16 },
  btnWrap: { position: 'relative', width: 146, height: 146, justifyContent: 'center', alignItems: 'center', marginVertical: 16 },
  progressRing: { position: 'absolute' },
  kickBtn: { width: 110, height: 110, borderRadius: 55, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 16, elevation: 8 },
  target: { fontSize: 14, fontWeight: '700', marginTop: 8 },
  kickMsg: { fontSize: 14, fontWeight: '800', marginTop: 6 },
  actions: { flexDirection: 'row', gap: 8, marginTop: 16 },
  actionBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 14, borderWidth: 1.5, borderColor: 'transparent' },
  actionBtnText: { fontSize: 13, fontWeight: '700' },
  hint: { marginHorizontal: 24, padding: 16, borderRadius: 16, marginTop: 24 },
  hintText: { fontSize: 13, fontWeight: '600', lineHeight: 22, textAlign: 'center' },
  historySection: { width: '100%', paddingHorizontal: 24, marginTop: 24 },
  historyTitle: { fontSize: 15, fontWeight: '900', marginBottom: 8 },
  historyItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 14, borderRadius: 14, marginBottom: 4 },
  historyTime: { fontSize: 14, fontWeight: '800' },
  historyCount: { fontSize: 13, fontWeight: '600' },
};
