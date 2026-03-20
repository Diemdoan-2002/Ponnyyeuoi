import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { useScaledStyles } from '../hooks/useScaledStyles';
import { calcPregnancy } from '../utils/pregnancy';
import { loadJSON, saveJSON } from '../utils/storage';
import FETAL_DATA from '../data/fetalData';
import { calcBMI, evaluateWeight, getRecommendedWeightAtWeek } from '../data/weightGuidelines';
import Svg, { Line, Circle as SvgCircle, Rect, Text as SvgText } from 'react-native-svg';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

export default function BabyScreen() {
  const { colors, fs } = useTheme();
  const styles = useScaledStyles(RAW_STYLES);
  const [userConfig, setUserConfig] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(24);
  const [babyDiary, setBabyDiary] = useState({});
  const [milestones, setMilestones] = useState({});
  const [showDiaryForm, setShowDiaryForm] = useState(false);
  const [diaryInput, setDiaryInput] = useState({ weight: '', note: '' });
  const [subPage, setSubPage] = useState(null);
  // Weight tracking state
  const [weightLog, setWeightLog] = useState([]);
  const [showWeightForm, setShowWeightForm] = useState(false);
  const [weightInput, setWeightInput] = useState('');

  const loadData = async () => {
    const cfg = await loadJSON('ponny_onboarding');
    setUserConfig(cfg);
    const p = calcPregnancy(cfg);
    setSelectedWeek(p.week);
    setBabyDiary(await loadJSON('ponny_baby_diary', {}));
    setMilestones(await loadJSON('ponny_milestones', {}));
    setWeightLog(await loadJSON('ponny_weight_log', []));
  };

  useEffect(() => { loadData(); }, []);

  // Reload data when screen is focused (e.g. coming back from Settings)
  useFocusEffect(useCallback(() => { loadData(); }, []));

  const pregnancy = calcPregnancy(userConfig);
  const weekNum = pregnancy.week;
  const wd = FETAL_DATA[selectedWeek] || FETAL_DATA[24] || {};
  const trimester = selectedWeek <= 13 ? 1 : selectedWeek <= 27 ? 2 : 3;

  const saveDiary = async () => {
    if (!diaryInput.weight && !diaryInput.note) return;
    const updated = { ...babyDiary, [selectedWeek]: { ...diaryInput, date: new Date().toLocaleDateString('vi') } };
    setBabyDiary(updated);
    await saveJSON('ponny_baby_diary', updated);
    setDiaryInput({ weight: '', note: '' });
    setShowDiaryForm(false);
  };

  const toggleMilestone = async (key) => {
    const updated = { ...milestones, [key]: !milestones[key] };
    setMilestones(updated);
    await saveJSON('ponny_milestones', updated);
  };

  const weekPills = Array.from({ length: 9 }, (_, i) => selectedWeek - 4 + i).filter(w => w >= 1 && w <= 40);

  // --- Fetal Table SubPage ---
  if (subPage === 'fetal-table') {
    const allWeeks = Object.keys(FETAL_DATA).map(Number).sort((a, b) => a - b).filter(w => FETAL_DATA[w].bpd && FETAL_DATA[w].bpd !== '-');
    return (
      <ScrollView style={[styles.container, { backgroundColor: colors.bg }]}>
        <View style={[styles.header, { backgroundColor: colors.gradientHeader[0] }]}>
          <TouchableOpacity onPress={() => setSubPage(null)} style={styles.backBtn}>
            <Text style={styles.backBtnText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Bảng chỉ số thai nhi</Text>
        </View>
        <View style={styles.section}>
          <Text style={[styles.source, { color: colors.textLight }]}>Nguồn: WHO / INTERGROWTH-21st • Chỉ là tham khảo</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View>
              <View style={[styles.tableRow, styles.tableHeader, { backgroundColor: colors.primaryLighter }]}>
                <Text style={[styles.tableCell, styles.tableCellHeader, { color: colors.primary }]}>Tuần</Text>
                <Text style={[styles.tableCell, styles.tableCellHeader, { color: colors.primary }]}>CN (g)</Text>
                <Text style={[styles.tableCell, styles.tableCellHeader, { color: colors.primary }]}>CD (cm)</Text>
                <Text style={[styles.tableCell, styles.tableCellHeader, { color: colors.primary }]}>BPD</Text>
                <Text style={[styles.tableCell, styles.tableCellHeader, { color: colors.primary }]}>FL</Text>
                <Text style={[styles.tableCell, styles.tableCellHeader, { color: colors.primary }]}>AC</Text>
                <Text style={[styles.tableCell, styles.tableCellHeader, { color: colors.primary }]}>HC</Text>
              </View>
              {allWeeks.map(w => {
                const d = FETAL_DATA[w];
                return (
                  <TouchableOpacity
                    key={w}
                    style={[styles.tableRow, { backgroundColor: w === weekNum ? colors.primaryLighter : colors.surface }]}
                    onPress={() => { setSelectedWeek(w); setSubPage(null); }}
                  >
                    <Text style={[styles.tableCell, { fontWeight: '900', color: colors.primary }]}>{w}</Text>
                    <Text style={[styles.tableCell, { color: colors.text }]}>{d.weight}</Text>
                    <Text style={[styles.tableCell, { color: colors.text }]}>{d.length}</Text>
                    <Text style={[styles.tableCell, { color: colors.text }]}>{d.bpd}</Text>
                    <Text style={[styles.tableCell, { color: colors.text }]}>{d.fl}</Text>
                    <Text style={[styles.tableCell, { color: colors.text }]}>{d.ac}</Text>
                    <Text style={[styles.tableCell, { color: colors.text }]}>{d.hc}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    );
  }

  // --- Growth Chart SubPage ---
  if (subPage === 'growth-chart') {
    const loggedWeeks = Object.keys(babyDiary).map(Number).filter(w => babyDiary[w].weight).sort((a, b) => a - b);
    const allWeeks = [...new Set([...loggedWeeks, ...Object.keys(FETAL_DATA).map(Number)])].filter(w => w >= 8 && w <= 40).sort((a, b) => a - b);
    const maxW = Math.max(...allWeeks.map(w => Math.max(parseFloat(babyDiary[w]?.weight) || 0, parseFloat(FETAL_DATA[w]?.weight) || 0)), 1);
    return (
      <ScrollView style={[styles.container, { backgroundColor: colors.bg }]}>
        <View style={[styles.header, { backgroundColor: colors.gradientHeader[0] }]}>
          <TouchableOpacity onPress={() => setSubPage(null)} style={styles.backBtn}>
            <Text style={styles.backBtnText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Biểu đồ tăng trưởng</Text>
        </View>
        <View style={styles.section}>
          <View style={styles.chartLegend}>
            <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: colors.primaryLight }]} /><Text style={{ color: colors.textSecondary, fontSize: 12 }}>Tiêu chuẩn WHO</Text></View>
            <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: colors.primary }]} /><Text style={{ color: colors.textSecondary, fontSize: 12 }}>Bé nhà bạn</Text></View>
          </View>
          {allWeeks.filter(w => FETAL_DATA[w]?.weight && FETAL_DATA[w]?.weight !== '-').map(w => {
            const std = parseFloat(FETAL_DATA[w]?.weight) || 0;
            const actual = parseFloat(babyDiary[w]?.weight) || 0;
            const stdPct = (std / maxW * 100);
            const actPct = actual ? (actual / maxW * 100) : 0;
            return (
              <View key={w} style={[styles.chartRow, w === weekNum && { backgroundColor: colors.primaryLighter }]}>
                <Text style={[styles.chartWeek, { color: colors.primary }]}>T{w}</Text>
                <View style={styles.chartBars}>
                  <View style={[styles.chartBar, { width: `${stdPct}%`, backgroundColor: colors.primaryLight }]}>
                    <Text style={styles.chartVal}>{FETAL_DATA[w]?.weight}</Text>
                  </View>
                  {actual > 0 && (
                    <View style={[styles.chartBar, { width: `${actPct}%`, backgroundColor: colors.primary, marginTop: 2 }]}>
                      <Text style={[styles.chartVal, { color: '#fff' }]}>{actual}g</Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
          <Text style={[styles.source, { color: colors.textLight, textAlign: 'center', marginTop: 8 }]}>Nguồn tiêu chuẩn: WHO / INTERGROWTH-21st</Text>
        </View>
      </ScrollView>
    );
  }

  // --- Main Baby Screen ---
  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.gradientHeader[0] }]}>
        <Text style={styles.headerTitle}>Bé yêu</Text>
      </View>

      {/* Baby Hero — with illustration like original */}
      <View style={[styles.heroCard, { backgroundColor: colors.surface }]}>
        <Text style={[styles.heroWeek, { color: colors.primary }]}>Tuần {selectedWeek}</Text>
        <View style={styles.heroCenter}>
          <Image
            source={require('../../assets/illustrations/baby-hero.png')}
            style={styles.babyHeroImg}
            resizeMode="contain"
          />
          <View style={styles.heroStats}>
            <View style={styles.heroStat}>
              <Image source={require('../../assets/icons/nav-pill.png')} style={styles.statIcon} />
              <Text style={[styles.heroVal, { color: colors.text }]}>{wd.weight || '~600g'}</Text>
            </View>
            <View style={styles.heroStat}>
              <Image source={require('../../assets/icons/nav-book.png')} style={styles.statIcon} />
              <Text style={[styles.heroVal, { color: colors.text }]}>{wd.length || '~30cm'}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Week Selector */}
      <View style={styles.weekSelector}>
        <Text style={[styles.weekLabel, { color: colors.textSecondary }]}>Tuần</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.weekRow}>
          {weekPills.map(w => (
            <TouchableOpacity
              key={w}
              style={[
                styles.weekPill,
                w === selectedWeek && { backgroundColor: colors.primary },
                w === weekNum && w !== selectedWeek && { borderWidth: 2, borderColor: colors.primary },
              ]}
              onPress={() => setSelectedWeek(w)}
            >
              <Text style={[styles.weekPillText, w === selectedWeek && { color: '#fff' }]}>T{w}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Dev Cards — with custom icons like original */}
      <View style={styles.section}>
        {[
          { icon: require('../../assets/icons/baby-dev.png'), title: 'Bé đang phát triển', text: wd.babyDevelopment, bg: colors.primaryLighter },
          { icon: require('../../assets/icons/mom-changes.png'), title: 'Thay đổi ở mẹ', text: wd.maternalChanges, bg: '#EDE9FE' },
          { icon: require('../../assets/icons/tips-bulb.png'), title: 'Lời khuyên', text: wd.tips, bg: '#FEF3C7' },
        ].map((card, i) => (
          <View key={i} style={[styles.devCard, { backgroundColor: card.bg }]}>
            <Image source={card.icon} style={styles.devCardIcon} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.devCardTitle, { color: colors.text }]}>{card.title}</Text>
              <Text style={[styles.devCardText, { color: colors.textSecondary }]}>{card.text || 'Chưa có thông tin.'}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* ===== WEIGHT TRACKING SECTION ===== */}
      {(() => {
        const preWeight = userConfig?.preWeight ? parseFloat(userConfig.preWeight) : null;
        const height = userConfig?.height ? parseFloat(userConfig.height) : null;
        const bmi = preWeight && height ? calcBMI(preWeight, height) : null;
        const latestEntry = weightLog.length > 0 ? weightLog[weightLog.length - 1] : null;
        const currentWeight = latestEntry ? latestEntry.weight : preWeight;
        const evaluation = preWeight && currentWeight && height ? evaluateWeight(preWeight, currentWeight, weekNum, height) : null;

        const saveWeight = async () => {
          const w = parseFloat(weightInput);
          if (!w || w < 30 || w > 200) { Alert.alert('Lỗi', 'Vui lòng nhập cân nặng hợp lệ (30-200 kg)'); return; }
          const entry = { id: Date.now().toString(), week: weekNum, weight: w, date: new Date().toISOString().split('T')[0] };
          const updated = [...weightLog.filter(e => e.week !== weekNum), entry].sort((a, b) => a.week - b.week);
          setWeightLog(updated);
          await saveJSON('ponny_weight_log', updated);
          setWeightInput('');
          setShowWeightForm(false);
        };

        const deleteWeight = async (id) => {
          const updated = weightLog.filter(e => e.id !== id);
          setWeightLog(updated);
          await saveJSON('ponny_weight_log', updated);
        };

        // Mini chart data
        const chartW = 300;
        const chartH = 140;
        const padL = 35;
        const padR = 10;
        const padT = 15;
        const padB = 25;
        const plotW = chartW - padL - padR;
        const plotH = chartH - padT - padB;

        const allWeights = weightLog.map(e => e.weight);
        if (preWeight) allWeights.push(preWeight);
        const minW = allWeights.length > 0 ? Math.min(...allWeights) - 3 : 45;
        const maxW = allWeights.length > 0 ? Math.max(...allWeights) + 3 : 75;
        const minWeek = 0;
        const maxWeek = 40;

        const toX = (wk) => padL + (wk - minWeek) / (maxWeek - minWeek) * plotW;
        const toY = (kg) => padT + plotH - (kg - minW) / (maxW - minW) * plotH;

        // Recommended range points
        const recPoints = bmi ? [0, 8, 16, 24, 32, 40].map(wk => {
          const rec = getRecommendedWeightAtWeek(preWeight, bmi, wk);
          return { wk, min: rec.min, max: rec.max };
        }) : [];

        return (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Image source={require('../../assets/icons/icon-weight.png')} style={styles.sectionIcon} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Cân nặng mẹ</Text>
            </View>
            <TouchableOpacity onPress={() => setShowWeightForm(!showWeightForm)}>
              <Text style={[styles.sectionMore, { color: colors.primary }]}>{showWeightForm ? '✕ Hủy' : '+ Cập nhật'}</Text>
            </TouchableOpacity>
          </View>

          {/* Overview Card */}
          {!preWeight || !height ? (
            <View style={[styles.formCard, { backgroundColor: colors.surface }]}>
              <Text style={[{ fontSize: 13, fontWeight: '700', color: colors.textSecondary, textAlign: 'center', lineHeight: 20 }]}>
                Vào Cài đặt → nhập chiều cao và cân nặng trước thai để bắt đầu theo dõi ⚖️
              </Text>
            </View>
          ) : (
            <View style={[styles.weightOverview, { backgroundColor: colors.surface }]}>
              <View style={styles.weightRow}>
                <View style={styles.weightCol}>
                  <Text style={[styles.weightBigNum, { color: colors.primary }]}>{currentWeight || '--'}</Text>
                  <Text style={[styles.weightUnit, { color: colors.textLight }]}>kg hiện tại</Text>
                </View>
                <View style={[styles.weightDivider, { backgroundColor: colors.primaryLighter }]} />
                <View style={styles.weightCol}>
                  <Text style={[styles.weightBigNum, { color: colors.text }]}>{evaluation ? (evaluation.totalGain > 0 ? '+' : '') + evaluation.totalGain : '--'}</Text>
                  <Text style={[styles.weightUnit, { color: colors.textLight }]}>kg tăng</Text>
                </View>
              </View>
              {evaluation && (
                <View style={[styles.weightBadge, { backgroundColor: evaluation.color + '18' }]}>
                  <Text style={[styles.weightBadgeText, { color: evaluation.color }]}>{evaluation.label}</Text>
                  <Text style={[styles.weightRecText, { color: colors.textLight }]}>Khuyến nghị tăng cả thai kỳ: {evaluation.recMin}–{evaluation.recMax} kg</Text>
                </View>
              )}
              {/* Per-week detail */}
              {bmi && (
                <View style={[{ marginTop: 10, padding: 12, backgroundColor: colors.primaryLighter + '60', borderRadius: 12 }]}>
                  <Text style={[{ fontSize: 13, fontWeight: '800', color: colors.text, marginBottom: 6 }]}>📊 Tuần {weekNum} — Chi tiết</Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text style={[{ fontSize: 12, fontWeight: '600', color: colors.textSecondary }]}>Cân nặng nên đạt:</Text>
                    <Text style={[{ fontSize: 12, fontWeight: '800', color: colors.primary }]}>{evaluation.recAtWeek.min}–{evaluation.recAtWeek.max} kg</Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text style={[{ fontSize: 12, fontWeight: '600', color: colors.textSecondary }]}>Nên tăng so với trước thai:</Text>
                    <Text style={[{ fontSize: 12, fontWeight: '800', color: colors.text }]}>{Math.round((evaluation.recAtWeek.min - preWeight) * 10) / 10}–{Math.round((evaluation.recAtWeek.max - preWeight) * 10) / 10} kg</Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={[{ fontSize: 12, fontWeight: '600', color: colors.textSecondary }]}>BMI trước thai:</Text>
                    <Text style={[{ fontSize: 12, fontWeight: '800', color: colors.text }]}>{evaluation.bmi} ({evaluation.bmiCategory})</Text>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* Weight Input Form */}
          {showWeightForm && (
            <View style={[styles.formCard, { backgroundColor: colors.surface }]}>
              <Text style={[{ fontWeight: '800', fontSize: 13, color: colors.primary, marginBottom: 8 }]}>Cập nhật cân nặng tuần {weekNum}</Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TextInput
                  style={[styles.formInput, { borderColor: colors.primaryLight, color: colors.text, flex: 1, marginBottom: 0 }]}
                  placeholder="VD: 62.5"
                  placeholderTextColor={colors.textLight}
                  keyboardType="decimal-pad"
                  value={weightInput}
                  onChangeText={setWeightInput}
                />
                <Text style={[{ fontSize: 16, fontWeight: '800', color: colors.text, alignSelf: 'center' }]}>kg</Text>
                <TouchableOpacity style={[styles.submitBtn, { backgroundColor: colors.primary, paddingHorizontal: 20 }]} onPress={saveWeight}>
                  <Text style={styles.submitBtnText}>Lưu</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Mini Line Chart */}
          {weightLog.length >= 1 && preWeight && height && (
            <View style={[styles.formCard, { backgroundColor: colors.surface, paddingHorizontal: 8 }]}>
              <Svg width={chartW} height={chartH}>
                {/* Recommended range (shaded area) */}
                {recPoints.length > 1 && recPoints.map((p, i) => {
                  if (i === recPoints.length - 1) return null;
                  const next = recPoints[i + 1];
                  return (
                    <Rect key={`rec-${i}`}
                      x={toX(p.wk)} y={toY(Math.max(p.max, next.max))}
                      width={toX(next.wk) - toX(p.wk)}
                      height={Math.abs(toY(Math.min(p.min, next.min)) - toY(Math.max(p.max, next.max)))}
                      fill={colors.primaryLighter} opacity={0.5}
                    />
                  );
                })}
                {/* Axis labels */}
                {[0, 10, 20, 30, 40].map(wk => (
                  <SvgText key={`lbl-${wk}`} x={toX(wk)} y={chartH - 4} fontSize={9} fill={colors.textLight} textAnchor="middle">T{wk}</SvgText>
                ))}
                {/* Y axis labels */}
                {[minW, Math.round((minW + maxW) / 2), maxW].map(kg => (
                  <SvgText key={`y-${kg}`} x={4} y={toY(kg) + 3} fontSize={9} fill={colors.textLight}>{kg}</SvgText>
                ))}
                {/* Data line */}
                {weightLog.map((entry, i) => {
                  if (i === 0) return null;
                  const prev = weightLog[i - 1];
                  return (
                    <Line key={`line-${i}`}
                      x1={toX(prev.week)} y1={toY(prev.weight)}
                      x2={toX(entry.week)} y2={toY(entry.weight)}
                      stroke={colors.primary} strokeWidth={2.5}
                    />
                  );
                })}
                {/* Data dots */}
                {weightLog.map((entry, i) => (
                  <SvgCircle key={`dot-${i}`}
                    cx={toX(entry.week)} cy={toY(entry.weight)}
                    r={5} fill={colors.primary} stroke="#fff" strokeWidth={2}
                  />
                ))}
              </Svg>
              <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 12, marginTop: 4 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary }} />
                  <Text style={{ fontSize: 10, color: colors.textLight, fontWeight: '600' }}>Thực tế</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <View style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: colors.primaryLighter }} />
                  <Text style={{ fontSize: 10, color: colors.textLight, fontWeight: '600' }}>Khuyến nghị</Text>
                </View>
              </View>
            </View>
          )}

          {/* Weight History */}
          {weightLog.length > 0 && (
            <View style={{ marginTop: 4 }}>
              {weightLog.slice().reverse().slice(0, 5).map(entry => (
                <View key={entry.id} style={[styles.milestoneItem, { backgroundColor: colors.surface }]}>
                  <View style={{ flex: 1 }}>
                    <Text style={[{ fontSize: 14, fontWeight: '800', color: colors.text }]}>Tuần {entry.week}: {entry.weight} kg</Text>
                    <Text style={[{ fontSize: 11, fontWeight: '600', color: colors.textLight }]}>{entry.date}</Text>
                  </View>
                  <TouchableOpacity onPress={() => deleteWeight(entry.id)}>
                    <Image source={require('../../assets/icons/icon-trash.png')} style={{ width: 22, height: 22 }} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>
        );
      })()}

      {/* Baby Diary — with icon like original */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Image source={require('../../assets/icons/diary.png')} style={styles.sectionIcon} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Nhật ký bé yêu</Text>
          </View>
          {selectedWeek === weekNum && !babyDiary[selectedWeek] && (
            <TouchableOpacity onPress={() => setShowDiaryForm(!showDiaryForm)}>
              <Text style={[styles.sectionMore, { color: colors.primary }]}>{showDiaryForm ? '✕ Hủy' : '+ Ghi chép'}</Text>
            </TouchableOpacity>
          )}
        </View>

        {showDiaryForm && selectedWeek === weekNum && (
          <View style={[styles.formCard, { backgroundColor: colors.surface }]}>
            <Text style={[{ fontWeight: '800', fontSize: 13, color: colors.primary, marginBottom: 8 }]}>Ghi chép tuần {selectedWeek}</Text>
            <TextInput
              style={[styles.formInput, { borderColor: colors.primaryLight, color: colors.text }]}
              placeholder="Cân nặng bé từ siêu âm (g) — VD: 760"
              placeholderTextColor={colors.textLight}
              keyboardType="number-pad"
              value={diaryInput.weight}
              onChangeText={t => setDiaryInput({ ...diaryInput, weight: t })}
            />
            <TextInput
              style={[styles.formInput, { borderColor: colors.primaryLight, color: colors.text, height: 80, textAlignVertical: 'top' }]}
              placeholder="Ghi chú của mẹ... VD: Hôm nay bé đạp nhiều lắm 💓"
              placeholderTextColor={colors.textLight}
              multiline
              value={diaryInput.note}
              onChangeText={t => setDiaryInput({ ...diaryInput, note: t })}
            />
            <TouchableOpacity style={[styles.submitBtn, { backgroundColor: colors.primary }]} onPress={saveDiary}>
              <Text style={styles.submitBtnText}>Lưu nhật ký</Text>
            </TouchableOpacity>
          </View>
        )}

        {babyDiary[selectedWeek] ? (
          <View style={[styles.diaryEntry, { backgroundColor: colors.surface }]}>
            <Text style={[styles.diaryDate, { color: colors.textLight }]}>{babyDiary[selectedWeek].date}</Text>
            {babyDiary[selectedWeek].weight && (
              <View style={styles.diaryWeightRow}>
                <Text style={[styles.diaryWeight, { color: colors.text }]}>Cân nặng bé: <Text style={{ fontWeight: '900' }}>{babyDiary[selectedWeek].weight}g</Text></Text>
                <Text style={[styles.diaryRef, { color: colors.textLight }]}>Tiêu chuẩn: {wd.weight}</Text>
              </View>
            )}
            {babyDiary[selectedWeek].note && (
              <Text style={[styles.diaryNote, { color: colors.textSecondary }]}>{babyDiary[selectedWeek].note}</Text>
            )}
            <TouchableOpacity onPress={() => {
              setDiaryInput(babyDiary[selectedWeek]);
              setBabyDiary(prev => { const n = { ...prev }; delete n[selectedWeek]; return n; });
              setShowDiaryForm(true);
            }}>
              <Text style={[styles.diaryEditBtn, { color: colors.primary }]}>✏️ Sửa</Text>
            </TouchableOpacity>
          </View>
        ) : !showDiaryForm && (
          <Text style={[styles.emptyText, { color: colors.textLight }]}>
            {selectedWeek === weekNum ? 'Chưa có ghi chép tuần này. Nhấn "+ Ghi chép" để lưu lại nhé!' : selectedWeek < weekNum ? `Tuần ${selectedWeek} không có ghi chép` : `Tuần ${selectedWeek} chưa đến`}
          </Text>
        )}
      </View>

      {/* Milestones — with icons like original */}
      <View style={styles.section}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          <Image source={require('../../assets/icons/milestone.png')} style={styles.sectionIcon} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Cột mốc đáng nhớ</Text>
        </View>
        {[
          { key: 'first_heartbeat', icon: require('../../assets/icons/heartbeat.png'), label: 'Nghe tim thai lần đầu' },
          { key: 'first_ultrasound', icon: require('../../assets/icons/nav-calendar.png'), label: 'Siêu âm lần đầu' },
          { key: 'gender_reveal', icon: require('../../assets/icons/nav-baby.png'), label: 'Biết giới tính bé' },
          { key: 'first_kick', icon: require('../../assets/icons/nav-kick.png'), label: 'Lần đầu cảm nhận thai máy' },
          { key: 'baby_name', icon: require('../../assets/icons/milestone.png'), label: 'Đặt tên cho bé' },
          { key: 'nursery_ready', icon: require('../../assets/icons/nav-home.png'), label: 'Chuẩn bị phòng cho bé' },
          { key: 'hospital_bag', icon: require('../../assets/icons/action-meds.png'), label: 'Chuẩn bị giỏ đồ đi sinh' },
          { key: 'maternity_photo', icon: require('../../assets/icons/milestone.png'), label: 'Chụp ảnh bầu' },
        ].map(m => (
          <TouchableOpacity
            key={m.key}
            style={[styles.milestoneItem, { backgroundColor: colors.surface, opacity: milestones[m.key] ? 0.7 : 1 }]}
            onPress={() => toggleMilestone(m.key)}
          >
            <Text style={{ fontSize: 18 }}>{milestones[m.key] ? '✅' : '⬜'}</Text>
            <Image source={m.icon} style={styles.milestoneIcon} />
            <Text style={[styles.milestoneLabel, { color: colors.text, textDecorationLine: milestones[m.key] ? 'line-through' : 'none' }]}>
              {m.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Buttons: Fetal Table + Growth Chart */}
      <View style={styles.section}>
        <TouchableOpacity style={[styles.viewTableBtn, { backgroundColor: colors.primaryLighter }]} onPress={() => setSubPage('fetal-table')}>
          <Text style={[styles.viewTableText, { color: colors.primary }]}>📊 Xem bảng chỉ số 40 tuần</Text>
        </TouchableOpacity>
        {Object.keys(babyDiary).some(w => babyDiary[w].weight) && (
          <TouchableOpacity style={[styles.viewTableBtn, { backgroundColor: colors.primaryLighter, marginTop: 6 }]} onPress={() => setSubPage('growth-chart')}>
            <Text style={[styles.viewTableText, { color: colors.primary }]}>📈 Xem biểu đồ tăng trưởng của bé</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const RAW_STYLES = {
  container: { flex: 1 },
  header: { padding: 16, paddingTop: 48, alignItems: 'center', borderBottomLeftRadius: 24, borderBottomRightRadius: 24, flexDirection: 'row', justifyContent: 'center' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '900' },
  backBtn: { position: 'absolute', left: 16, top: 48, backgroundColor: 'rgba(255,255,255,0.2)', width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  backBtnText: { color: '#fff', fontSize: 18, fontWeight: '800' },
  heroCard: { margin: 16, marginTop: -12, borderRadius: 22, padding: 20, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 16, elevation: 6, alignItems: 'center' },
  heroWeek: { fontSize: 22, fontWeight: '900' },
  heroCenter: { flexDirection: 'row', alignItems: 'center', gap: 16, marginVertical: 12 },
  babyHeroImg: { width: 100, height: 100 },
  heroStats: { gap: 12 },
  heroStat: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statIcon: { width: 22, height: 22 },
  heroVal: { fontSize: 16, fontWeight: '800' },
  weekSelector: { paddingHorizontal: 16, marginBottom: 8 },
  weekLabel: { fontSize: 12, fontWeight: '800', marginBottom: 6 },
  weekRow: { flexDirection: 'row' },
  weekPill: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 14, backgroundColor: 'rgba(0,0,0,0.04)', marginRight: 6 },
  weekPillText: { fontSize: 13, fontWeight: '700', color: '#6B5B7B' },
  section: { padding: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '900' },
  sectionMore: { fontSize: 13, fontWeight: '700' },
  sectionIcon: { width: 22, height: 22 },
  devCard: { flexDirection: 'row', gap: 12, padding: 16, borderRadius: 16, marginBottom: 8 },
  devCardIcon: { width: 54, height: 54, marginTop: 2 },
  devCardTitle: { fontSize: 14, fontWeight: '900', marginBottom: 4 },
  devCardText: { fontSize: 13, fontWeight: '600', lineHeight: 20 },
  formCard: { padding: 16, borderRadius: 16, marginBottom: 8 },
  formInput: { borderWidth: 1.5, borderRadius: 12, padding: 12, fontSize: 14, fontWeight: '600', marginBottom: 8 },
  submitBtn: { padding: 14, borderRadius: 14, alignItems: 'center' },
  submitBtnText: { color: '#fff', fontSize: 14, fontWeight: '800' },
  diaryEntry: { padding: 16, borderRadius: 16 },
  diaryDate: { fontSize: 12, fontWeight: '600', marginBottom: 4 },
  diaryWeightRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  diaryWeight: { fontSize: 14, fontWeight: '700' },
  diaryRef: { fontSize: 12, fontWeight: '600' },
  diaryNote: { fontSize: 13, fontWeight: '600', lineHeight: 20, marginTop: 4 },
  diaryEditBtn: { fontSize: 13, fontWeight: '700', marginTop: 8 },
  emptyText: { fontSize: 13, fontWeight: '600', textAlign: 'center', padding: 16 },
  milestoneItem: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 14, marginBottom: 4 },
  milestoneIcon: { width: 24, height: 24 },
  milestoneLabel: { fontSize: 14, fontWeight: '700', flex: 1 },
  viewTableBtn: { padding: 14, borderRadius: 14, alignItems: 'center' },
  viewTableText: { fontSize: 14, fontWeight: '800' },
  source: { fontSize: 11, fontWeight: '600', marginBottom: 8 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
  tableHeader: { borderBottomWidth: 2 },
  tableCell: { width: 60, paddingVertical: 10, paddingHorizontal: 6, fontSize: 12, fontWeight: '600', textAlign: 'center' },
  tableCellHeader: { fontWeight: '900', fontSize: 12 },
  chartLegend: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginBottom: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  chartRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 8, borderRadius: 8, marginBottom: 2 },
  chartWeek: { width: 30, fontSize: 12, fontWeight: '800' },
  chartBars: { flex: 1 },
  chartBar: { height: 18, borderRadius: 6, justifyContent: 'center', paddingHorizontal: 6 },
  chartVal: { fontSize: 10, fontWeight: '700' },
  // Weight tracking styles
  weightOverview: { padding: 16, borderRadius: 16, marginBottom: 8 },
  weightRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20 },
  weightCol: { alignItems: 'center' },
  weightBigNum: { fontSize: 28, fontWeight: '900' },
  weightUnit: { fontSize: 12, fontWeight: '700', marginTop: 2 },
  weightDivider: { width: 1.5, height: 40, borderRadius: 1 },
  weightBadge: { marginTop: 12, padding: 10, borderRadius: 12, alignItems: 'center' },
  weightBadgeText: { fontSize: 13, fontWeight: '800' },
  weightRecText: { fontSize: 11, fontWeight: '600', marginTop: 2 },
};
