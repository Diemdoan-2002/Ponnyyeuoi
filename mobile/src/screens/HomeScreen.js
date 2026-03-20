import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';
import { calcPregnancy, getTimeGreeting } from '../utils/pregnancy';
import { loadJSON } from '../utils/storage';
import FETAL_DATA from '../data/fetalData';
import { FALLBACK_ARTICLES } from '../data/supplements';
import { useScaledStyles } from '../hooks/useScaledStyles';
import Svg, { Circle } from 'react-native-svg';

export default function HomeScreen() {
  const { colors, themeName, toggleTheme, fs } = useTheme();
  const navigation = useNavigation();
  const styles = useScaledStyles(RAW_STYLES);
  const [userConfig, setUserConfig] = useState(null);
  const [meds, setMeds] = useState([]);
  const [kickHistory, setKickHistory] = useState([]);
  const [userApts, setUserApts] = useState([]);
  const [bookmarks, setBookmarks] = useState({});
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, { toValue: -10, duration: 600, useNativeDriver: true }),
        Animated.timing(bounceAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
        Animated.timing(bounceAnim, { toValue: -6, duration: 400, useNativeDriver: true }),
        Animated.timing(bounceAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
        Animated.delay(2000),
      ])
    ).start();
  }, []);

  useEffect(() => {
    const load = async () => {
      const cfg = await loadJSON('ponny_onboarding');
      setUserConfig(cfg);
      setMeds(await loadJSON('ponny_meds', []));
      setKickHistory(await loadJSON('ponny_kicks', []));
      setUserApts(await loadJSON('ponny_user_apts', []));
    };
    load();
    const unsub = navigation.addListener('focus', load);
    return unsub;
  }, [navigation]);

  const pregnancy = calcPregnancy(userConfig);
  const { week: weekNum, day: dayNum, daysLeft } = pregnancy;
  const progress = (weekNum / 40) * 100;
  const userName = userConfig?.name || 'bạn';
  const wd = FETAL_DATA[weekNum] || FETAL_DATA[24] || {};

  const circumference = 2 * Math.PI * 34;
  const strokeDashoffset = circumference - (circumference * progress / 100);

  const upcomingApt = userApts.filter(a => new Date(a.date) >= new Date()).sort((a, b) => new Date(a.date) - new Date(b.date))[0];

  const suggestedArticles = FALLBACK_ARTICLES.slice(0, 2);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.gradientHeader[0] }]}>
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.greeting, { fontSize: fs(14) }]}>{getTimeGreeting()}</Text>
            <Text style={[styles.headerName, { fontSize: fs(22) }]}>{userName}</Text>
          </View>
          <TouchableOpacity style={styles.themeBtn} onPress={toggleTheme}>
            <Text style={styles.themeBtnText}>{themeName === 'pink' ? '❤️ Pink' : '💙 Blue'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Hero Card */}
      <TouchableOpacity
        style={[styles.heroCard, { backgroundColor: colors.surface }]}
        onPress={() => navigation.navigate('Baby')}
        activeOpacity={0.9}
      >
        <Text style={[styles.heroWeek, { color: colors.text, fontSize: fs(22) }]}>
          Tuần {weekNum}<Text style={[styles.heroDay, { fontSize: fs(14) }]}>, Ngày {dayNum}</Text>
        </Text>

        <View style={styles.heroCenter}>
          {/* Baby illustration */}
          <Image
            source={require('../../assets/illustrations/baby-hero.png')}
            style={styles.babyHeroImg}
            resizeMode="contain"
          />
          <View style={styles.ringWrap}>
            <Svg width={80} height={80}>
              <Circle cx={40} cy={40} r={34} fill="none" stroke={colors.primaryLighter} strokeWidth={6} />
              <Circle
                cx={40} cy={40} r={34} fill="none" stroke={colors.primary} strokeWidth={6}
                strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
                strokeLinecap="round" rotation={-90} origin="40,40"
              />
            </Svg>
            <Text style={[styles.pctText, { color: colors.primary }]}>{Math.round(progress)}%</Text>
          </View>
        </View>

        <Text style={[styles.heroSize, { color: colors.textSecondary, fontSize: fs(14) }]}>
          {wd.sizeComparison ? `Bé to bằng ${wd.sizeComparison}` : 'Bé to bằng trái bắp'}
        </Text>
        <View style={styles.heroStats}>
          <Text style={[styles.heroStatItem, { color: colors.text, fontSize: fs(14) }]}>🍼 {wd.weight || '~600g'}</Text>
          <Text style={[styles.heroStatSep, { color: colors.textLight }]}>|</Text>
          <Text style={[styles.heroStatItem, { color: colors.text }]}>📏 {wd.length || '~21cm'}</Text>
        </View>
      </TouchableOpacity>

      {/* Reminders Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Nhắc nhở hôm nay</Text>

        {/* Meds — Fix #4: icon = nav-pill.png (same as original) */}
        <View style={styles.reminderGroup}>
          <View style={styles.reminderLabel}>
            <Image source={require('../../assets/icons/nav-pill.png')} style={styles.labelIcon} />
            <Text style={[styles.groupLabel, { color: colors.primary }]}>Uống thuốc</Text>
          </View>
          {meds.length > 0 ? meds.map(m => (
            <View key={m.id} style={[styles.reminderRow, { backgroundColor: colors.surface }]}>
              <Text style={[styles.reminderName, { color: colors.text }]}>{m.name} {m.dose}</Text>
              <Text style={[styles.reminderActionText, { color: m.taken ? colors.success : colors.primary }]}>
                {m.taken ? '✅' : 'Uống'}
              </Text>
            </View>
          )) : (
            <TouchableOpacity
              style={[styles.reminderRow, { backgroundColor: colors.surface }]}
              onPress={() => navigation.navigate('Meds')}
            >
              <Text style={[styles.reminderName, { color: colors.textLight }]}>Chưa thiết lập thuốc</Text>
              <Text style={[styles.reminderActionText, { color: colors.primary }]}>Thêm →</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Appointments — Fix #4: icon = nav-calendar.png */}
        <View style={styles.reminderGroup}>
          <View style={styles.reminderLabel}>
            <Image source={require('../../assets/icons/nav-calendar.png')} style={styles.labelIcon} />
            <Text style={[styles.groupLabel, { color: colors.primary }]}>Lịch tái khám</Text>
          </View>
          <TouchableOpacity
            style={[styles.reminderRow, { backgroundColor: colors.surface }]}
            onPress={() => navigation.navigate('Appointments')}
          >
            <Text style={[styles.reminderName, { color: upcomingApt ? colors.text : colors.textLight }]}>
              {upcomingApt ? upcomingApt.type : 'Chưa có lịch tái khám'}
            </Text>
            <Text style={[styles.reminderActionText, { color: colors.primary }]}>
              {upcomingApt ? `${Math.ceil((new Date(upcomingApt.date) - new Date()) / 86400000)} ngày nữa` : 'Thêm →'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Kick — Fix #4: label icon = nav-kick.png, row icon = nav-baby.png (as original) */}
        <View style={styles.reminderGroup}>
          <View style={styles.reminderLabel}>
            <Image source={require('../../assets/icons/nav-kick.png')} style={styles.labelIcon} />
            <Text style={[styles.groupLabel, { color: colors.primary }]}>Đếm cử động thai</Text>
          </View>
          <TouchableOpacity
            style={[styles.reminderRow, { backgroundColor: colors.surface }]}
            onPress={() => navigation.navigate('Kick')}
          >
            <Text style={[styles.reminderName, { color: colors.text }]}>Đếm cử động hôm nay</Text>
            <Text style={[styles.reminderActionText, { color: colors.primary }]}>
              {kickHistory.length > 0 ? `${kickHistory[0].count} lần • ${kickHistory[0].time}` : 'Chưa đếm'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Nutrition Shortcut */}
      <View style={styles.section}>
        <View style={styles.reminderGroup}>
          <View style={styles.reminderLabel}>
            <Image source={require('../../assets/icons/icon-nutrition.png')} style={styles.labelIcon} />
            <Text style={[styles.groupLabel, { color: colors.primary }]}>Dinh dưỡng thai kỳ</Text>
          </View>
          <TouchableOpacity
            style={[styles.reminderRow, { backgroundColor: colors.surface }]}
            onPress={() => navigation.navigate('Nutrition')}
          >
            <Text style={[styles.reminderName, { color: colors.text }]}>Hướng dẫn ăn uống & checklist</Text>
            <Text style={[styles.reminderActionText, { color: colors.primary }]}>Xem →</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Fix #2: Articles — "Đọc gì tuần này" with category tag + bookmark + summary */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Đọc gì tuần này</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Knowledge')}>
            <Text style={[styles.sectionMore, { color: colors.primary }]}>Xem tất cả →</Text>
          </TouchableOpacity>
        </View>
        {suggestedArticles.map(a => (
          <TouchableOpacity
            key={a.id}
            style={[styles.articleCard, { backgroundColor: colors.surface }]}
            onPress={() => navigation.navigate('Knowledge')}
          >
            <View style={styles.articleCardTop}>
              <View style={[styles.articleTag, { backgroundColor: colors.primaryLighter }]}>
                <Text style={[styles.articleTagText, { color: colors.primary }]}>{a.category}</Text>
              </View>
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation && e.stopPropagation();
                  setBookmarks(p => ({ ...p, [a.id]: !p[a.id] }));
                }}
              >
                <Text style={styles.bookmarkBtn}>{bookmarks[a.id] ? '❤️' : '🤍'}</Text>
              </TouchableOpacity>
            </View>
            <Text style={[styles.articleTitle, { color: colors.text }]}>{a.title}</Text>
            <Text style={[styles.articleDesc, { color: colors.textSecondary }]}>{a.summary}</Text>
            <Text style={[styles.articleMeta, { color: colors.textLight }]}>📖 {a.readTimeMinutes || 5} phút đọc</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>

    {/* Floating Chat FAB — bouncing animation */}
    <Animated.View style={[styles.chatFab, { transform: [{ translateY: bounceAnim }] }]}>
      <TouchableOpacity
        onPress={() => navigation.navigate('Chat')}
        activeOpacity={0.85}
        style={styles.chatFabBtn}
      >
        <Image source={require('../../assets/icons/nav-chat.png')} style={styles.chatFabIcon} />
      </TouchableOpacity>
    </Animated.View>
    </View>
  );
}

const RAW_STYLES = {
  container: { flex: 1 },
  header: { padding: 16, paddingTop: 48, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, paddingBottom: 40 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting: { color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: '600' },
  headerName: { color: '#fff', fontSize: 22, fontWeight: '900', marginTop: 2 },
  themeBtn: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 24, paddingHorizontal: 16, paddingVertical: 8 },
  themeBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  heroCard: { margin: 16, marginTop: -24, borderRadius: 22, padding: 20, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 24, shadowOffset: { width: 0, height: 4 }, elevation: 8, alignItems: 'center' },
  heroWeek: { fontSize: 22, fontWeight: '900', alignSelf: 'flex-start' },
  heroDay: { fontSize: 14, fontWeight: '700' },
  heroCenter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 16, marginVertical: 16 },
  babyHeroImg: { width: 100, height: 100 },
  ringWrap: { alignItems: 'center', justifyContent: 'center' },
  pctText: { position: 'absolute', fontSize: 18, fontWeight: '900' },
  heroSize: { fontSize: 14, fontWeight: '700', marginBottom: 8 },
  heroStats: { flexDirection: 'row', justifyContent: 'center', gap: 8, alignItems: 'center', marginBottom: 4 },
  heroStatItem: { fontSize: 14, fontWeight: '700' },
  heroStatSep: { fontSize: 14 },
  section: { padding: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '900', marginBottom: 8 },
  sectionMore: { fontSize: 13, fontWeight: '700' },
  reminderGroup: { marginBottom: 12 },
  reminderLabel: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  labelIcon: { width: 56, height: 56 },
  groupLabel: { fontSize: 13, fontWeight: '800' },
  reminderRow: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: 14, marginBottom: 4 },
  reminderName: { flex: 1, fontSize: 14, fontWeight: '700' },
  reminderActionText: { fontSize: 12, fontWeight: '700' },
  smallIcon: { width: 48, height: 48 },
  articleCard: { padding: 16, borderRadius: 16, marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  articleCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  articleTag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  articleTagText: { fontSize: 11, fontWeight: '800' },
  bookmarkBtn: { fontSize: 18 },
  articleTitle: { fontSize: 15, fontWeight: '800', lineHeight: 22, marginBottom: 4 },
  articleDesc: { fontSize: 13, fontWeight: '600', lineHeight: 20, marginBottom: 6 },
  articleMeta: { fontSize: 11, fontWeight: '600' },
  chatFab: { position: 'absolute', bottom: 24, right: 16 },
  chatFabBtn: { width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(255,255,255,0.9)', justifyContent: 'center', alignItems: 'center', shadowColor: '#E91E8C', shadowOpacity: 0.35, shadowRadius: 16, shadowOffset: { width: 0, height: 6 }, elevation: 12 },
  chatFabIcon: { width: 56, height: 56 },
};
