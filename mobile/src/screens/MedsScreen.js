import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';
import { useScaledStyles } from '../hooks/useScaledStyles';
import { calcPregnancy } from '../utils/pregnancy';
import { loadJSON, saveJSON } from '../utils/storage';
import { SUPPLEMENT_RECS, SUPPLEMENT_DETAILS } from '../data/supplements';

export default function MedsScreen() {
  const { colors, fs } = useTheme();
  const styles = useScaledStyles(RAW_STYLES);
  const navigation = useNavigation();
  const [meds, setMeds] = useState([]);
  const [showAddMed, setShowAddMed] = useState(false);
  const [newMed, setNewMed] = useState({ name: '', dose: '', times: ['08:00'] });
  const [medHistory, setMedHistory] = useState({});
  const [selectedSupp, setSelectedSupp] = useState(null);
  const [weekNum, setWeekNum] = useState(24);

  useEffect(() => {
    const load = async () => {
      setMeds(await loadJSON('ponny_meds', []));
      setMedHistory(await loadJSON('ponny_med_history', {}));
      const cfg = await loadJSON('ponny_onboarding');
      const p = calcPregnancy(cfg);
      setWeekNum(p.week);
    };
    load();
  }, []);

  const trimester = weekNum <= 13 ? 1 : weekNum <= 27 ? 2 : 3;
  const suppKey = trimester === 1 ? 'trimester1' : trimester === 2 ? 'trimester2' : 'trimester3';
  const suppRecs = SUPPLEMENT_RECS[suppKey];
  const medTaken = meds.filter(m => m.taken).length;

  const toggleMed = async (id) => {
    const updated = meds.map(m => m.id === id ? { ...m, taken: !m.taken } : m);
    setMeds(updated);
    await saveJSON('ponny_meds', updated);
  };

  const deleteMed = (id) => {
    Alert.alert('Xóa thuốc', 'Bạn có chắc muốn xóa thuốc này?', [
      { text: 'Hủy' },
      { text: 'Xóa', style: 'destructive', onPress: async () => {
        const updated = meds.filter(m => m.id !== id);
        setMeds(updated);
        await saveJSON('ponny_meds', updated);
      }}
    ]);
  };

  const addMed = async () => {
    if (!newMed.name.trim()) return;
    const timeStr = newMed.times.filter(t => t).join(' & ') || '08:00';
    const freqStr = newMed.times.length > 1 ? `${newMed.times.length} lần/ngày` : 'Mỗi ngày';
    const updated = [...meds, { id: Date.now(), name: newMed.name, dose: newMed.dose, freq: freqStr, time: timeStr, taken: false }];
    setMeds(updated);
    await saveJSON('ponny_meds', updated);
    setNewMed({ name: '', dose: '', times: ['08:00'] });
    setShowAddMed(false);
  };

  // Supplement detail view
  if (selectedSupp && SUPPLEMENT_DETAILS[selectedSupp]) {
    const detail = SUPPLEMENT_DETAILS[selectedSupp];
    return (
      <ScrollView style={[styles.container, { backgroundColor: colors.bg }]}>
        <View style={[styles.header, { backgroundColor: colors.gradientHeader[0] }]}>
          <TouchableOpacity onPress={() => setSelectedSupp(null)} style={styles.backBtn}>
            <Text style={styles.backBtnText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{detail.title}</Text>
        </View>
        <View style={styles.section}>
          {detail.sections.map((sec, i) => (
            <View key={i} style={[styles.detailCard, { backgroundColor: colors.surface, borderLeftColor: colors.primary }]}>
              <Text style={[styles.detailH, { color: colors.text }]}>{sec.h}</Text>
              <Text style={[styles.detailT, { color: colors.textSecondary }]}>{sec.t}</Text>
            </View>
          ))}
          <Text style={[styles.source, { color: colors.textLight }]}>Nguồn: WHO / BYT Việt Nam • Tham khảo ý kiến bác sĩ</Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={[styles.header, { backgroundColor: colors.gradientHeader[0] }]}>
        <Text style={styles.headerTitle}>Thuốc & Vitamin</Text>
      </View>

      {/* Progress */}
      {meds.length > 0 && (
        <View style={[styles.progressCard, { backgroundColor: colors.surface }]}>
          <View style={[styles.progressRing, { borderColor: medTaken === meds.length ? colors.success : colors.primaryLight }]}>
            <Text style={[styles.progressText, { color: colors.success }]}>{medTaken}/{meds.length}</Text>
          </View>
          <View>
            <Text style={[styles.progressTitle, { color: colors.text }]}>Hôm nay: {medTaken}/{meds.length} thuốc</Text>
            <Text style={[styles.progressSub, { color: colors.warning }]}>Uống đều mỗi ngày nhé!</Text>
          </View>
        </View>
      )}

      {/* Med Cards */}
      <View style={styles.section}>
        {meds.map(m => (
          <View key={m.id} style={[styles.medCard, { backgroundColor: colors.surface, opacity: m.taken ? 0.7 : 1 }]}>
            <Image source={require('../../assets/icons/nav-pill.png')} style={{ width: 32, height: 32 }} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.medName, { color: colors.text }]}>{m.name}</Text>
              <Text style={[styles.medDose, { color: colors.textSecondary }]}>{m.dose} • {m.freq}</Text>
              <Text style={[styles.medTime, { color: colors.textLight }]}>{m.time}</Text>
            </View>
            <TouchableOpacity
              style={[styles.medAction, { backgroundColor: m.taken ? colors.successLight : colors.primaryLighter }]}
              onPress={() => toggleMed(m.id)}
            >
              <Text style={{ color: m.taken ? colors.success : colors.primary, fontWeight: '800', fontSize: 12 }}>
                {m.taken ? '✅ Xong' : 'Uống'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteMed(m.id)}>
              <Image source={require('../../assets/icons/icon-trash.png')} style={{ width: 28, height: 28 }} />
            </TouchableOpacity>
          </View>
        ))}

        {meds.length === 0 && !showAddMed && (
          <View style={styles.emptyState}>
            <Image source={require('../../assets/icons/nav-pill.png')} style={{ width: 120, height: 120 }} resizeMode="contain" />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>Chưa có thuốc nào</Text>
            <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>Thêm thuốc bạn đang uống để theo dõi mỗi ngày</Text>
            <TouchableOpacity style={[styles.submitBtn, { backgroundColor: colors.primary }]} onPress={() => setShowAddMed(true)}>
              <Text style={styles.submitBtnText}>+ Thêm thuốc đầu tiên</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Add Med Form */}
        {showAddMed && (
          <View style={[styles.addForm, { backgroundColor: colors.surface }]}>
            <TextInput
              style={[styles.input, { borderColor: colors.primaryLight, color: colors.text }]}
              placeholder="Tên thuốc (VD: DHA, Omega-3...)"
              placeholderTextColor={colors.textLight}
              value={newMed.name}
              onChangeText={t => setNewMed({ ...newMed, name: t })}
            />
            <TextInput
              style={[styles.input, { borderColor: colors.primaryLight, color: colors.text }]}
              placeholder="Liều (VD: 500mg)"
              placeholderTextColor={colors.textLight}
              value={newMed.dose}
              onChangeText={t => setNewMed({ ...newMed, dose: t })}
            />
            <TouchableOpacity
              style={[styles.submitBtn, { backgroundColor: newMed.name.trim() ? colors.primary : colors.primaryLight }]}
              onPress={addMed}
              disabled={!newMed.name.trim()}
            >
              <Text style={styles.submitBtnText}>Thêm thuốc</Text>
            </TouchableOpacity>
          </View>
        )}

        {meds.length > 0 && (
          <TouchableOpacity
            style={[styles.fab, { backgroundColor: colors.primary }]}
            onPress={() => setShowAddMed(!showAddMed)}
          >
            <Text style={styles.fabText}>{showAddMed ? '✕' : '+'}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Supplement Recommendations */}
      <View style={styles.section}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <Image source={require('../../assets/icons/tips-bulb.png')} style={{ width: 22, height: 22 }} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Bạn có thể cần bổ sung — TCN {trimester}</Text>
        </View>
        <Text style={[styles.source, { color: colors.textLight, marginBottom: 8 }]}>Nguồn: WHO / BYT VN • Tham khảo ý kiến bác sĩ</Text>
        {suppRecs.map((s, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.suppCard, { backgroundColor: colors.surface }]}
            onPress={() => SUPPLEMENT_DETAILS[s.name] && setSelectedSupp(s.name)}
          >
            <Image source={require('../../assets/icons/nav-pill.png')} style={{ width: 28, height: 28 }} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.suppName, { color: colors.text }]}>{s.name} <Text style={{ color: colors.textLight, fontSize: 12 }}>{s.dose}</Text></Text>
              <Text style={[styles.suppReason, { color: colors.textSecondary }]}>{s.reason}</Text>
              {SUPPLEMENT_DETAILS[s.name] && <Text style={[styles.suppLink, { color: colors.primary }]}>Xem thêm →</Text>}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tips Card */}
      <View style={[styles.tipsCard, { backgroundColor: colors.surface }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <Image source={require('../../assets/icons/tips-bulb.png')} style={{ width: 20, height: 20 }} />
          <Text style={[styles.tipsTitle, { color: colors.text }]}>Mẹo uống thuốc thai kỳ</Text>
        </View>
        <Text style={[styles.tipsBody, { color: colors.textSecondary }]}>
          • <Text style={{ fontWeight: '800' }}>Sắt:</Text> uống lúc bụng đói, tránh uống cùng canxi/sữa{'\n'}
          • <Text style={{ fontWeight: '800' }}>Canxi:</Text> chia 2 lần/ngày, không uống cùng sắt{'\n'}
          • <Text style={{ fontWeight: '800' }}>Acid Folic:</Text> uống buổi sáng, quan trọng 3 tháng đầu{'\n'}
          • <Text style={{ fontWeight: '800' }}>DHA:</Text> uống sau ăn để hấp thu tốt hơn
        </Text>
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
  section: { padding: 16 },
  sectionTitle: { fontSize: 15, fontWeight: '900', marginBottom: 4 },
  progressCard: { marginHorizontal: 16, marginTop: 12, padding: 16, borderRadius: 22, flexDirection: 'row', alignItems: 'center', gap: 14 },
  progressRing: { width: 56, height: 56, borderRadius: 28, borderWidth: 4, justifyContent: 'center', alignItems: 'center' },
  progressText: { fontSize: 14, fontWeight: '900' },
  progressTitle: { fontSize: 15, fontWeight: '800' },
  progressSub: { fontSize: 12, fontWeight: '700', marginTop: 2 },
  medCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 16, marginBottom: 8 },
  medName: { fontSize: 15, fontWeight: '800' },
  medDose: { fontSize: 12, fontWeight: '600', marginTop: 2 },
  medTime: { fontSize: 11, marginTop: 2 },
  medAction: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12 },
  emptyState: { alignItems: 'center', paddingVertical: 32 },
  emptyTitle: { fontSize: 18, fontWeight: '900', marginTop: 12 },
  emptyDesc: { fontSize: 13, fontWeight: '600', marginTop: 4, marginBottom: 16 },
  addForm: { padding: 16, borderRadius: 16, marginBottom: 8 },
  input: { borderWidth: 1.5, borderRadius: 12, padding: 12, fontSize: 14, fontWeight: '600', marginBottom: 8 },
  submitBtn: { padding: 14, borderRadius: 14, alignItems: 'center', marginTop: 4 },
  submitBtnText: { color: '#fff', fontSize: 14, fontWeight: '800' },
  fab: { position: 'absolute', right: 16, bottom: 0, width: 52, height: 52, borderRadius: 26, justifyContent: 'center', alignItems: 'center', elevation: 6 },
  fabText: { color: '#fff', fontSize: 24, fontWeight: '800' },
  suppCard: { flexDirection: 'row', gap: 12, padding: 14, borderRadius: 16, marginBottom: 6 },
  suppName: { fontSize: 14, fontWeight: '800' },
  suppReason: { fontSize: 12, fontWeight: '600', marginTop: 2, lineHeight: 18 },
  suppLink: { fontSize: 12, fontWeight: '700', marginTop: 4 },
  tipsCard: { marginHorizontal: 16, padding: 16, borderRadius: 16 },
  tipsTitle: { fontSize: 14, fontWeight: '900', marginBottom: 8 },
  tipsBody: { fontSize: 13, fontWeight: '600', lineHeight: 22 },
  detailCard: { padding: 16, borderRadius: 16, marginBottom: 8, borderLeftWidth: 3 },
  detailH: { fontSize: 15, fontWeight: '900', marginBottom: 4 },
  detailT: { fontSize: 13, fontWeight: '600', lineHeight: 22 },
  source: { fontSize: 11, fontWeight: '600', textAlign: 'center', marginTop: 8 },
};
