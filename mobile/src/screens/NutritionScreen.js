import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { useScaledStyles } from '../hooks/useScaledStyles';
import { calcPregnancy } from '../utils/pregnancy';
import { loadJSON, saveJSON } from '../utils/storage';
import { TRIMESTER_NUTRITION, RECOMMENDED_FOODS, FOODS_TO_AVOID, DAILY_CHECKLIST } from '../data/nutritionData';

export default function NutritionScreen({ navigation }) {
  const { colors, fs } = useTheme();
  const styles = useScaledStyles(RAW_STYLES);
  const [userConfig, setUserConfig] = useState(null);
  const [activeTab, setActiveTab] = useState('guide'); // guide | foods | avoid | check
  const [checkedItems, setCheckedItems] = useState({});

  useEffect(() => {
    const load = async () => {
      const cfg = await loadJSON('ponny_onboarding');
      setUserConfig(cfg);
      // Load today's checklist
      const today = new Date().toISOString().split('T')[0];
      const saved = await loadJSON('ponny_nutrition_check', {});
      setCheckedItems(saved[today] || {});
    };
    load();
  }, []);

  const pregnancy = calcPregnancy(userConfig);
  const weekNum = pregnancy.week;
  const trimester = weekNum <= 13 ? 1 : weekNum <= 27 ? 2 : 3;
  const triData = TRIMESTER_NUTRITION[trimester];
  const relevantFoods = RECOMMENDED_FOODS.filter(f => f.trimester.includes(trimester));

  const toggleCheck = async (id) => {
    const today = new Date().toISOString().split('T')[0];
    const updated = { ...checkedItems, [id]: !checkedItems[id] };
    setCheckedItems(updated);
    const allData = await loadJSON('ponny_nutrition_check', {});
    allData[today] = updated;
    await saveJSON('ponny_nutrition_check', allData);
  };

  const checkedCount = DAILY_CHECKLIST.filter(c => checkedItems[c.id]).length;

  const tabs = [
    { key: 'guide', label: '📋 Hướng dẫn' },
    { key: 'foods', label: '🥗 Nên ăn' },
    { key: 'avoid', label: '🚫 Kiêng' },
    { key: 'check', label: `✅ Hôm nay (${checkedCount}/${DAILY_CHECKLIST.length})` },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.gradientHeader[0] }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Image source={require('../../assets/icons/icon-nutrition.png')} style={{ width: 28, height: 28, marginRight: 8 }} />
        <Text style={styles.headerTitle}>Dinh dưỡng thai kỳ</Text>
      </View>

      {/* Trimester Badge */}
      <View style={[styles.triBadge, { backgroundColor: colors.primaryLighter }]}>
        <Text style={[styles.triTitle, { color: colors.primary }]}>{triData.title}</Text>
        <Text style={[styles.triSub, { color: colors.textSecondary }]}>{triData.subtitle} • Cần thêm {triData.calorieExtra}</Text>
      </View>

      {/* Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabRow}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && { backgroundColor: colors.primary }]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={[styles.tabText, activeTab === tab.key && { color: '#fff' }]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        {/* === TAB: Guide === */}
        {activeTab === 'guide' && (
          <View>
            {/* Key Nutrients */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>🧬 Dưỡng chất quan trọng</Text>
            {triData.keyNutrients.map((n, i) => (
              <View key={i} style={[styles.nutriCard, { backgroundColor: colors.surface }]}>
                <View style={styles.nutriHeader}>
                  <Text style={[styles.nutriName, { color: colors.primary }]}>{n.name}</Text>
                  <Text style={[styles.nutriAmount, { color: colors.text }]}>{n.amount}</Text>
                </View>
                <Text style={[styles.nutriWhy, { color: colors.textSecondary }]}>{n.why}</Text>
                <View style={[styles.nutriFoods, { backgroundColor: colors.primaryLighter + '60' }]}>
                  <Text style={[styles.nutriFoodsLabel, { color: colors.primary }]}>🍽️ Nguồn thực phẩm:</Text>
                  <Text style={[styles.nutriFoodsText, { color: colors.text }]}>{n.foods}</Text>
                </View>
              </View>
            ))}

            {/* Meal Tips */}
            <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 16 }]}>💡 Mẹo ăn uống</Text>
            {triData.mealTips.map((tip, i) => (
              <View key={i} style={[styles.tipRow, { backgroundColor: colors.surface }]}>
                <Text style={[styles.tipNum, { color: colors.primary }]}>{i + 1}</Text>
                <Text style={[styles.tipText, { color: colors.text }]}>{tip}</Text>
              </View>
            ))}
          </View>
        )}

        {/* === TAB: Recommended Foods === */}
        {activeTab === 'foods' && (
          <View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>🥗 Thực phẩm nên ăn (Tuần {weekNum})</Text>
            {relevantFoods.map((f, i) => (
              <View key={i} style={[styles.foodCard, { backgroundColor: colors.surface }]}>
                <Text style={styles.foodEmoji}>{f.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.foodName, { color: colors.text }]}>{f.name}</Text>
                  <Text style={[styles.foodBenefit, { color: colors.textSecondary }]}>{f.benefit}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* === TAB: Foods to Avoid === */}
        {activeTab === 'avoid' && (
          <View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>🚫 Thực phẩm cần kiêng</Text>
            {FOODS_TO_AVOID.map((f, i) => (
              <View key={i} style={[styles.foodCard, { backgroundColor: '#FEF2F2' }]}>
                <Text style={styles.foodEmoji}>{f.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.foodName, { color: '#DC2626' }]}>{f.name}</Text>
                  <Text style={[styles.foodBenefit, { color: '#991B1B' }]}>{f.reason}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* === TAB: Daily Checklist === */}
        {activeTab === 'check' && (
          <View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>✅ Checklist dinh dưỡng hôm nay</Text>
            <Text style={[styles.checkSub, { color: colors.textSecondary }]}>
              Đã hoàn thành {checkedCount}/{DAILY_CHECKLIST.length} mục
            </Text>

            {/* Progress bar */}
            <View style={[styles.progressBar, { backgroundColor: colors.primaryLighter }]}>
              <View style={[styles.progressFill, { backgroundColor: colors.primary, width: `${(checkedCount / DAILY_CHECKLIST.length) * 100}%` }]} />
            </View>

            {DAILY_CHECKLIST.map(item => (
              <TouchableOpacity
                key={item.id}
                style={[styles.checkItem, { backgroundColor: checkedItems[item.id] ? colors.primaryLighter : colors.surface }]}
                onPress={() => toggleCheck(item.id)}
              >
                <View style={[styles.checkBox, { borderColor: colors.primary, backgroundColor: checkedItems[item.id] ? colors.primary : 'transparent' }]}>
                  {checkedItems[item.id] && <Text style={styles.checkMark}>✓</Text>}
                </View>
                <Text style={[styles.checkLabel, { color: colors.text, textDecorationLine: checkedItems[item.id] ? 'line-through' : 'none' }]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}

            {checkedCount === DAILY_CHECKLIST.length && (
              <View style={[styles.congratsCard, { backgroundColor: '#ECFDF5' }]}>
                <Text style={styles.congratsEmoji}>🎉</Text>
                <Text style={[styles.congratsText, { color: '#065F46' }]}>Tuyệt vời! Mẹ đã hoàn thành checklist dinh dưỡng hôm nay!</Text>
              </View>
            )}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const RAW_STYLES = {
  header: { padding: 16, paddingTop: 48, flexDirection: 'row', alignItems: 'center', borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '900' },
  backBtn: { backgroundColor: 'rgba(255,255,255,0.2)', width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  backBtnText: { color: '#fff', fontSize: 18, fontWeight: '800' },
  triBadge: { margin: 16, marginBottom: 0, padding: 14, borderRadius: 16, alignItems: 'center' },
  triTitle: { fontSize: 14, fontWeight: '900' },
  triSub: { fontSize: 12, fontWeight: '600', marginTop: 2 },
  tabRow: { flexDirection: 'row', paddingHorizontal: 12, marginVertical: 12, maxHeight: 44 },
  tab: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.04)', marginRight: 8 },
  tabText: { fontSize: 12, fontWeight: '700', color: '#6B5B7B' },
  content: { flex: 1, paddingHorizontal: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '900', marginBottom: 10 },
  // Nutrient cards
  nutriCard: { padding: 14, borderRadius: 14, marginBottom: 8 },
  nutriHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  nutriName: { fontSize: 15, fontWeight: '900' },
  nutriAmount: { fontSize: 12, fontWeight: '700' },
  nutriWhy: { fontSize: 12, fontWeight: '600', marginBottom: 8 },
  nutriFoods: { padding: 10, borderRadius: 10 },
  nutriFoodsLabel: { fontSize: 11, fontWeight: '800', marginBottom: 2 },
  nutriFoodsText: { fontSize: 12, fontWeight: '600', lineHeight: 18 },
  // Tips
  tipRow: { flexDirection: 'row', alignItems: 'flex-start', padding: 12, borderRadius: 12, marginBottom: 6, gap: 10 },
  tipNum: { fontSize: 14, fontWeight: '900', width: 22, textAlign: 'center' },
  tipText: { fontSize: 13, fontWeight: '600', lineHeight: 20, flex: 1 },
  // Food cards
  foodCard: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 14, marginBottom: 6, gap: 12 },
  foodEmoji: { fontSize: 28 },
  foodName: { fontSize: 14, fontWeight: '800' },
  foodBenefit: { fontSize: 12, fontWeight: '600', marginTop: 2, lineHeight: 18 },
  // Checklist
  checkSub: { fontSize: 13, fontWeight: '600', marginBottom: 10 },
  progressBar: { height: 8, borderRadius: 4, marginBottom: 14 },
  progressFill: { height: 8, borderRadius: 4 },
  checkItem: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 14, marginBottom: 6, gap: 12 },
  checkBox: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, justifyContent: 'center', alignItems: 'center' },
  checkMark: { color: '#fff', fontSize: 14, fontWeight: '900' },
  checkLabel: { fontSize: 14, fontWeight: '700', flex: 1 },
  // Congrats
  congratsCard: { padding: 16, borderRadius: 16, alignItems: 'center', marginTop: 10 },
  congratsEmoji: { fontSize: 36, marginBottom: 6 },
  congratsText: { fontSize: 14, fontWeight: '800', textAlign: 'center' },
};
