import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, Image } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { useScaledStyles } from '../hooks/useScaledStyles';
import { calcPregnancy } from '../utils/pregnancy';
import { loadJSON, saveJSON } from '../utils/storage';
import { FALLBACK_APPOINTMENTS } from '../data/supplements';

export default function AppointmentsScreen() {
  const { colors, fs } = useTheme();
  const styles = useScaledStyles(RAW_STYLES);
  const [userApts, setUserApts] = useState([]);
  const [showAddApt, setShowAddApt] = useState(false);
  const [newApt, setNewApt] = useState({ date: '', type: '', place: '', note: '' });
  const [examResults, setExamResults] = useState([]);
  const [showMilestones, setShowMilestones] = useState(false);
  const [weekNum, setWeekNum] = useState(24);
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [manualMode, setManualMode] = useState(false);
  const [manualText, setManualText] = useState('');

  useEffect(() => {
    const load = async () => {
      setUserApts(await loadJSON('ponny_user_apts', []));
      setExamResults(await loadJSON('ponny_exam_results', []));
      const cfg = await loadJSON('ponny_onboarding');
      setWeekNum(calcPregnancy(cfg).week);
    };
    load();
  }, []);

  const saveApts = async (updated) => { setUserApts(updated); await saveJSON('ponny_user_apts', updated); };
  const saveResults = async (updated) => { setExamResults(updated); await saveJSON('ponny_exam_results', updated); };

  const addApt = async () => {
    if (!newApt.date || !newApt.type) return;
    const updated = [...userApts, { id: Date.now(), ...newApt }].sort((a, b) => new Date(a.date) - new Date(b.date));
    await saveApts(updated);
    setNewApt({ date: '', type: '', place: '' });
    setShowAddApt(false);
  };

  const deleteApt = (id) => {
    Alert.alert('Xóa', 'Xóa lịch khám này?', [
      { text: 'Hủy' },
      { text: 'Xóa', style: 'destructive', onPress: async () => {
        await saveApts(userApts.filter(x => x.id !== id));
        await saveResults(examResults.filter(r => r.aptId !== id));
      }}
    ]);
  };

  const sortedApts = [...userApts].sort((a, b) => {
    const now = new Date();
    const aIsPast = new Date(a.date) < now;
    const bIsPast = new Date(b.date) < now;
    if (aIsPast !== bIsPast) return aIsPast ? 1 : -1;
    return new Date(a.date) - new Date(b.date);
  });

  // Milestones view
  if (showMilestones) {
    const nextApt = FALLBACK_APPOINTMENTS.find(a => a.week >= weekNum);
    return (
      <ScrollView style={[styles.container, { backgroundColor: colors.bg }]}>
        <View style={[styles.header, { backgroundColor: colors.gradientHeader[0] }]}>
          <TouchableOpacity onPress={() => setShowMilestones(false)} style={styles.backBtn}>
            <Text style={styles.backBtnText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mốc khám quan trọng</Text>
        </View>
        <View style={styles.section}>
          <Text style={[styles.source, { color: colors.textLight }]}>Theo chuẩn Bộ Y tế Việt Nam • Chỉ mang tính tham khảo</Text>
          {FALLBACK_APPOINTMENTS.map(a => (
            <View key={a.week} style={[styles.aptCard, {
              backgroundColor: colors.surface,
              opacity: a.week < weekNum ? 0.5 : 1,
              borderLeftColor: a.week === nextApt?.week ? colors.primary : 'transparent', borderLeftWidth: a.week === nextApt?.week ? 3 : 0,
            }]}>
              <View style={[styles.aptBadge, { backgroundColor: colors.primaryLighter }]}>
                <Text style={[styles.aptBadgeNum, { color: colors.primary }]}>{a.week}</Text>
                <Text style={[styles.aptBadgeUnit, { color: colors.primaryDark }]}>tuần</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.aptType, { color: colors.text }]}>{a.type}</Text>
                <Text style={[styles.aptTests, { color: colors.textSecondary }]}>{a.tests?.join(', ')}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={[styles.header, { backgroundColor: colors.gradientHeader[0] }]}>
        <Text style={styles.headerTitle}>Tái khám</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Image source={require('../../assets/icons/nav-calendar.png')} style={{ width: 22, height: 22 }} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Lịch khám của tôi</Text>
          </View>
          {userApts.length > 0 && (
            <TouchableOpacity onPress={() => setShowAddApt(!showAddApt)}>
              <Text style={[styles.sectionMore, { color: colors.primary }]}>{showAddApt ? '✕ Hủy' : '+ Thêm'}</Text>
            </TouchableOpacity>
          )}
        </View>

        {showAddApt && (
          <View style={[styles.addForm, { backgroundColor: colors.surface }]}>
            {/* Date input with calendar icon on right */}
            <View style={styles.dateInputRow}>
              <TextInput
                style={[styles.dateTextInput, { borderColor: colors.primaryLight, color: colors.text }]}
                placeholder="DD/MM/YYYY"
                placeholderTextColor={colors.textLight}
                value={manualText || (newApt.date ? (() => { const d = new Date(newApt.date); return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`; })() : '')}
                onChangeText={(t) => {
                  setManualText(t);
                  const parts = t.split('/');
                  if (parts.length === 3 && parts[2].length === 4) {
                    const [dd, mm, yyyy] = parts;
                    const dateStr = `${yyyy}-${mm.padStart(2,'0')}-${dd.padStart(2,'0')}`;
                    if (!isNaN(new Date(dateStr).getTime())) {
                      setNewApt({ ...newApt, date: dateStr });
                    }
                  }
                }}
                keyboardType="numbers-and-punctuation"
                maxLength={10}
              />
              <TouchableOpacity
                style={[styles.calIconBtn, { backgroundColor: colors.primaryLighter }]}
                onPress={() => {
                  setManualMode(!manualMode);
                  if (!manualMode && newApt.date) {
                    const d = new Date(newApt.date);
                    setCalYear(d.getFullYear());
                    setCalMonth(d.getMonth());
                  }
                }}
              >
                <Image source={require('../../assets/icons/nav-calendar.png')} style={{ width: 24, height: 24 }} />
              </TouchableOpacity>
            </View>

            {/* Calendar dropdown — only when icon is tapped */}
            {manualMode && (() => {
              const today = new Date();
              const selectedDate = newApt.date ? new Date(newApt.date) : null;
              const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
              const firstDayOfWeek = new Date(calYear, calMonth, 1).getDay();
              const dayNames = ['CN','T2','T3','T4','T5','T6','T7'];
              const monthNames = ['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6','Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12'];
              const cells = [];
              for (let i = 0; i < firstDayOfWeek; i++) cells.push(null);
              for (let d = 1; d <= daysInMonth; d++) cells.push(d);
              const isToday = (d) => d === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear();
              const isSelected = (d) => selectedDate && d === selectedDate.getDate() && calMonth === selectedDate.getMonth() && calYear === selectedDate.getFullYear();
              return (
                <View style={[styles.calDropdown, { borderColor: colors.primaryLight }]}>
                  <View style={styles.calHeader}>
                    <TouchableOpacity onPress={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(calYear-1); } else setCalMonth(calMonth-1); }} style={styles.calArrow}>
                      <Text style={[styles.calArrowText, { color: colors.primary }]}>◀</Text>
                    </TouchableOpacity>
                    <Text style={[styles.calTitle, { color: colors.text }]}>{monthNames[calMonth]} {calYear}</Text>
                    <TouchableOpacity onPress={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(calYear+1); } else setCalMonth(calMonth+1); }} style={styles.calArrow}>
                      <Text style={[styles.calArrowText, { color: colors.primary }]}>▶</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.calDayNames}>
                    {dayNames.map(dn => (<Text key={dn} style={[styles.calDayName, { color: colors.textLight }]}>{dn}</Text>))}
                  </View>
                  <View style={styles.calGrid}>
                    {cells.map((d, i) => (
                      <TouchableOpacity key={i} style={[styles.calDay, isSelected(d) && { backgroundColor: colors.primary }, isToday(d) && !isSelected(d) && { backgroundColor: colors.primaryLighter }]}
                        onPress={() => { if (!d) return; const m = String(calMonth+1).padStart(2,'0'); const dd = String(d).padStart(2,'0'); setNewApt({...newApt, date: `${calYear}-${m}-${dd}`}); setManualText(`${dd}/${m}/${calYear}`); setManualMode(false); }}
                        disabled={!d}
                      >
                        <Text style={[styles.calDayText, { color: d ? (isSelected(d) ? '#fff' : colors.text) : 'transparent' }, isToday(d) && !isSelected(d) && { color: colors.primary, fontWeight: '900' }]}>{d || ''}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              );
            })()}

            <TextInput
              style={[styles.input, { borderColor: colors.primaryLight, color: colors.text }]}
              placeholder="Loại khám (VD: SA hình thái)"
              placeholderTextColor={colors.textLight}
              value={newApt.type}
              onChangeText={t => setNewApt({ ...newApt, type: t })}
            />
            <TextInput
              style={[styles.input, { borderColor: colors.primaryLight, color: colors.text }]}
              placeholder="Nơi khám (VD: BV Phụ sản TW)"
              placeholderTextColor={colors.textLight}
              value={newApt.place}
              onChangeText={t => setNewApt({ ...newApt, place: t })}
            />
            <TextInput
              style={[styles.input, { borderColor: colors.primaryLight, color: colors.text, height: 72, textAlignVertical: 'top' }]}
              placeholder="Ghi chú (VD: Nhớ nhịn ăn trước 8h)"
              placeholderTextColor={colors.textLight}
              value={newApt.note}
              onChangeText={t => setNewApt({ ...newApt, note: t })}
              multiline
              numberOfLines={3}
            />
            <TouchableOpacity style={[styles.submitBtn, { backgroundColor: colors.primary }]} onPress={addApt}>
              <Text style={styles.submitBtnText}>Lưu lịch khám</Text>
            </TouchableOpacity>
          </View>
        )}

        {userApts.length === 0 && !showAddApt && (
          <View style={styles.emptyState}>
            <Image source={require('../../assets/icons/nav-calendar.png')} style={{ width: 120, height: 120 }} resizeMode="contain" />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>Chưa có lịch khám</Text>
            <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>Thêm lịch tái khám để được nhắc nhở</Text>
            <TouchableOpacity style={[styles.submitBtn, { backgroundColor: colors.primary }]} onPress={() => setShowAddApt(true)}>
              <Text style={styles.submitBtnText}>+ Thêm lịch khám đầu tiên</Text>
            </TouchableOpacity>
          </View>
        )}

        {sortedApts.map(a => {
          const aptDate = new Date(a.date);
          const diffDays = Math.ceil((aptDate - new Date()) / 86400000);
          const isPast = diffDays < 0;
          return (
            <View key={a.id} style={[styles.aptCard, { backgroundColor: colors.surface, opacity: isPast ? 0.6 : 1 }]}>
              <View style={[styles.aptBadge, { backgroundColor: colors.primaryLighter }]}>
                <Text style={[styles.aptBadgeNum, { color: colors.primary }]}>{aptDate.getDate()}</Text>
                <Text style={[styles.aptBadgeUnit, { color: colors.primaryDark }]}>Th{aptDate.getMonth() + 1}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.aptType, { color: colors.text }]}>{a.type}</Text>
                {a.place && <Text style={[styles.aptTests, { color: colors.textSecondary }]}>📍 {a.place}</Text>}
                <Text style={[styles.aptTests, { color: isPast ? colors.textLight : diffDays <= 3 ? colors.primary : colors.textSecondary }]}>
                  {isPast ? 'Đã qua' : diffDays === 0 ? '🔴 Hôm nay!' : `${diffDays} ngày nữa`}
                </Text>
              </View>
              <TouchableOpacity onPress={() => deleteApt(a.id)}>
                <Image source={require('../../assets/icons/icon-trash.png')} style={{ width: 28, height: 28 }} />
              </TouchableOpacity>
            </View>
          );
        })}
      </View>

      {/* CTA */}
      <TouchableOpacity
        style={[styles.ctaCard, { backgroundColor: colors.primaryLighter }]}
        onPress={() => setShowMilestones(true)}
      >
        <Text style={[styles.ctaText, { color: colors.text }]}>Bạn có muốn biết những mốc khám thai quan trọng?</Text>
        <Text style={[styles.ctaBtn, { color: colors.primary }]}>Xem ngay →</Text>
      </TouchableOpacity>

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
  section: { padding: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 15, fontWeight: '900' },
  sectionMore: { fontSize: 13, fontWeight: '700' },
  addForm: { padding: 16, borderRadius: 16, marginBottom: 12 },
  input: { borderWidth: 1.5, borderRadius: 12, padding: 12, fontSize: 14, fontWeight: '600', marginBottom: 8 },
  submitBtn: { padding: 14, borderRadius: 14, alignItems: 'center', marginTop: 4 },
  submitBtnText: { color: '#fff', fontSize: 14, fontWeight: '800' },
  emptyState: { alignItems: 'center', paddingVertical: 32 },
  emptyTitle: { fontSize: 18, fontWeight: '900', marginTop: 12 },
  emptyDesc: { fontSize: 13, fontWeight: '600', marginTop: 4, marginBottom: 16 },
  aptCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 16, marginBottom: 6 },
  aptBadge: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  aptBadgeNum: { fontSize: 18, fontWeight: '900' },
  aptBadgeUnit: { fontSize: 10, fontWeight: '700' },
  aptType: { fontSize: 14, fontWeight: '800' },
  aptTests: { fontSize: 12, fontWeight: '600', marginTop: 2, lineHeight: 18 },
  ctaCard: { marginHorizontal: 16, padding: 16, borderRadius: 16 },
  ctaText: { fontSize: 14, fontWeight: '700' },
  ctaBtn: { fontSize: 14, fontWeight: '800', marginTop: 8 },
  source: { fontSize: 11, fontWeight: '600', marginBottom: 8 },
  // Date input row
  dateInputRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  dateTextInput: { flex: 1, borderWidth: 1.5, borderRadius: 12, padding: 12, fontSize: 15, fontWeight: '700', letterSpacing: 1 },
  calIconBtn: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  // Calendar dropdown
  calDropdown: { borderWidth: 1.5, borderRadius: 14, padding: 12, marginBottom: 8 },
  // Calendar styles
  calHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  calArrow: { padding: 8 },
  calArrowText: { fontSize: 16, fontWeight: '900' },
  calTitle: { fontSize: 16, fontWeight: '900' },
  calDayNames: { flexDirection: 'row', marginBottom: 4 },
  calDayName: { flex: 1, textAlign: 'center', fontSize: 12, fontWeight: '700' },
  calGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  calDay: { width: '14.28%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 20 },
  calDayText: { fontSize: 14, fontWeight: '700' },
  calSelected: { textAlign: 'center', fontWeight: '800', fontSize: 13, marginTop: 12 },
  calManualToggle: { textAlign: 'center', fontWeight: '700', fontSize: 12, marginTop: 8, marginBottom: 8, textDecorationLine: 'underline' },
  calManualRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  calManualBtn: { padding: 12, borderRadius: 12 },
};
