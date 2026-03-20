import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, Image, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { useScaledStyles } from '../hooks/useScaledStyles';
import { calcPregnancy, calcFromLMP, calcFromEDD } from '../utils/pregnancy';
import { loadJSON, saveJSON, clearAll } from '../utils/storage';

export default function SettingsScreen() {
  const { colors, themeName, toggleTheme, fontSizeName, setFontSize, fs } = useTheme();
  const styles = useScaledStyles(RAW_STYLES);
  const [userConfig, setUserConfig] = useState(null);
  const [showDateModal, setShowDateModal] = useState(false);

  // Date modal state — same concept as onboarding
  const [method, setMethod] = useState('lmp');
  const [dateDay, setDateDay] = useState('');
  const [dateMonth, setDateMonth] = useState('');
  const [dateYear, setDateYear] = useState('');

  useEffect(() => {
    loadJSON('ponny_onboarding').then(setUserConfig);
  }, []);

  const pregnancy = calcPregnancy(userConfig);
  const userName = userConfig?.name || 'bạn';
  const curYear = new Date().getFullYear();

  const updateName = async (newName) => {
    const updated = { ...userConfig, name: newName };
    setUserConfig(updated);
    await saveJSON('ponny_onboarding', updated);
  };

  const openDateModal = () => {
    // Pre-fill from current config
    if (userConfig?.dateVal) {
      const d = new Date(userConfig.dateVal);
      setDateDay(String(d.getDate()));
      setDateMonth(String(d.getMonth() + 1));
      setDateYear(String(d.getFullYear()));
      setMethod(userConfig.method || 'lmp');
    } else {
      setDateDay('');
      setDateMonth('');
      setDateYear('');
      setMethod('lmp');
    }
    setShowDateModal(true);
  };

  const dateVal = dateDay && dateMonth && dateYear
    ? `${dateYear}-${dateMonth.padStart(2, '0')}-${dateDay.padStart(2, '0')}`
    : '';
  const preview = dateVal ? (method === 'lmp' ? calcFromLMP(dateVal) : calcFromEDD(dateVal)) : null;

  const saveDate = async () => {
    if (!dateVal) return;
    if (preview && (preview.week < 1 || preview.week > 42)) {
      Alert.alert('Lỗi', 'Ngày nhập không hợp lệ, vui lòng kiểm tra lại');
      return;
    }
    const updated = { ...userConfig, method, dateVal };
    setUserConfig(updated);
    await saveJSON('ponny_onboarding', updated);
    setShowDateModal(false);
    Alert.alert('✅ Đã cập nhật', `Tuần thai: ${preview.week}, còn ${preview.daysLeft} ngày`);
  };

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Tất cả dữ liệu sẽ bị xóa. Bạn chắc chắn?', [
      { text: 'Hủy' },
      { text: 'Đăng xuất', style: 'destructive', onPress: async () => {
        await clearAll();
        Alert.alert('Đã đăng xuất', 'Vui lòng khởi động lại ứng dụng');
      }}
    ]);
  };

  const fontSizes = [
    { key: 'small', label: 'Nhỏ', sample: 12 },
    { key: 'medium', label: 'Vừa', sample: 14 },
    { key: 'large', label: 'Lớn', sample: 17 },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={[styles.header, { backgroundColor: colors.gradientHeader[0] }]}>
        <Text style={styles.headerTitle}>Cài đặt</Text>
      </View>

      {/* Profile */}
      <View style={styles.section}>
        <View style={styles.sectionHead}>
          <Image source={require('../../assets/icons/nav-home.png')} style={styles.sectionIcon} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Hồ sơ</Text>
        </View>
        <View style={[styles.row, { backgroundColor: colors.surface }]}>
          <Text style={[styles.rowLabel, { color: colors.text }]}>Tên gọi</Text>
          <TextInput
            style={[styles.rowInput, { color: colors.text }]}
            value={userName}
            onChangeText={updateName}
            placeholder="Nhập tên..."
            placeholderTextColor={colors.textLight}
          />
        </View>
      </View>

      {/* Appearance */}
      <View style={styles.section}>
        <View style={styles.sectionHead}>
          <Image source={require('../../assets/icons/nav-settings.png')} style={styles.sectionIcon} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Giao diện</Text>
        </View>
        <TouchableOpacity style={[styles.row, { backgroundColor: colors.surface }]} onPress={toggleTheme}>
          <Text style={[styles.rowLabel, { color: colors.text }]}>{themeName === 'pink' ? '❤️ Pink Mode' : '💙 Blue Mode'}</Text>
          <Text style={[styles.rowAction, { color: colors.primary }]}>Đổi →</Text>
        </TouchableOpacity>
      </View>

      {/* Font Size */}
      <View style={styles.section}>
        <View style={styles.sectionHead}>
          <Image source={require('../../assets/icons/tips-bulb.png')} style={styles.sectionIcon} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Cỡ chữ</Text>
        </View>
        <View style={[styles.fontSizeRow, { backgroundColor: colors.surface }]}>
          {fontSizes.map(f => (
            <TouchableOpacity
              key={f.key}
              style={[styles.fontSizeBtn, fontSizeName === f.key && { backgroundColor: colors.primary }]}
              onPress={() => setFontSize(f.key)}
            >
              <Text style={[styles.fontSizeSample, { fontSize: f.sample, color: fontSizeName === f.key ? '#fff' : colors.text }]}>Aa</Text>
              <Text style={[styles.fontSizeLabel, { color: fontSizeName === f.key ? '#fff' : colors.textSecondary }]}>{f.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Pregnancy Info */}
      <View style={styles.section}>
        <View style={styles.sectionHead}>
          <Image source={require('../../assets/icons/nav-baby.png')} style={styles.sectionIcon} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Thai kỳ</Text>
        </View>
        <View style={[styles.row, { backgroundColor: colors.surface }]}>
          <Text style={[styles.rowLabel, { color: colors.text }]}>Tuần thai hiện tại</Text>
          <Text style={[styles.rowValue, { color: colors.text }]}>Tuần {pregnancy.week}, Ngày {pregnancy.day}</Text>
        </View>
        <TouchableOpacity style={[styles.row, { backgroundColor: colors.surface }]} onPress={openDateModal}>
          <Text style={[styles.rowLabel, { color: colors.text }]}>Ngày dự sinh</Text>
          <Text style={[styles.rowAction, { color: colors.primary }]}>
            {pregnancy.edd ? new Date(pregnancy.edd).toLocaleDateString('vi') : '—'} →
          </Text>
        </TouchableOpacity>
        {pregnancy.daysLeft > 0 && (
          <View style={[styles.row, { backgroundColor: colors.surface }]}>
            <Text style={[styles.rowLabel, { color: colors.text }]}>Còn lại</Text>
            <Text style={[styles.rowValue, { color: colors.primary, fontWeight: '900' }]}>{pregnancy.daysLeft} ngày</Text>
          </View>
        )}
      </View>

      {/* Body Measurements for Weight Tracking */}
      <View style={styles.section}>
        <View style={styles.sectionHead}>
          <Image source={require('../../assets/icons/icon-weight.png')} style={styles.sectionIcon} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Chỉ số cơ thể</Text>
        </View>
        <View style={[styles.row, { backgroundColor: colors.surface }]}>
          <Text style={[styles.rowLabel, { color: colors.text }]}>Chiều cao (cm)</Text>
          <TextInput
            style={[styles.rowInput, { color: colors.text }]}
            value={userConfig?.height || ''}
            onChangeText={async (v) => {
              const updated = { ...userConfig, height: v };
              setUserConfig(updated);
              await saveJSON('ponny_onboarding', updated);
            }}
            placeholder="VD: 160"
            placeholderTextColor={colors.textLight}
            keyboardType="decimal-pad"
            maxLength={5}
          />
        </View>
        <View style={[styles.row, { backgroundColor: colors.surface }]}>
          <Text style={[styles.rowLabel, { color: colors.text }]}>Cân trước thai (kg)</Text>
          <TextInput
            style={[styles.rowInput, { color: colors.text }]}
            value={userConfig?.preWeight || ''}
            onChangeText={async (v) => {
              const updated = { ...userConfig, preWeight: v };
              setUserConfig(updated);
              await saveJSON('ponny_onboarding', updated);
            }}
            placeholder="VD: 54"
            placeholderTextColor={colors.textLight}
            keyboardType="decimal-pad"
            maxLength={5}
          />
        </View>
      </View>

      {/* Info */}
      <View style={styles.section}>
        <View style={styles.sectionHead}>
          <Image source={require('../../assets/icons/tips-bulb.png')} style={styles.sectionIcon} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Thông tin</Text>
        </View>
        <View style={[styles.row, { backgroundColor: colors.surface }]}>
          <Text style={[styles.rowLabel, { color: colors.text }]}>Phiên bản</Text>
          <Text style={[styles.rowValue, { color: colors.textSecondary }]}>MVP v2.0</Text>
        </View>
        <View style={[styles.row, { backgroundColor: colors.surface }]}>
          <Text style={[styles.rowLabel, { color: colors.text }]}>Dữ liệu y tế</Text>
          <Text style={[styles.rowValue, { color: colors.textSecondary }]}>WHO, Bộ Y tế VN</Text>
        </View>
      </View>

      {/* Logout */}
      <View style={styles.section}>
        <TouchableOpacity style={[styles.logoutBtn, { backgroundColor: colors.errorLight }]} onPress={handleLogout}>
          <Text style={[styles.logoutText, { color: colors.error }]}>🚪 Đăng xuất</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 32 }} />

      {/* Date Editing Modal — same concept as onboarding */}
      <Modal visible={showDateModal} animationType="slide" transparent>
        <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={() => setShowDateModal(false)} />
          <ScrollView style={[styles.modalContent, { backgroundColor: colors.surface }]} bounces={false} keyboardShouldPersistTaps="handled">
            <TouchableOpacity style={styles.modalClose} onPress={() => setShowDateModal(false)}>
              <Text style={[styles.modalCloseText, { color: colors.text }]}>✕</Text>
            </TouchableOpacity>

            <Text style={[styles.modalTitle, { color: colors.text }]}>Cập nhật thai kỳ</Text>
            <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
              Chọn cách tính và nhập ngày để cập nhật tuần thai
            </Text>

            {/* Method Selector */}
            <Text style={[styles.modalLabel, { color: colors.textSecondary }]}>Chọn cách tính</Text>
            <View style={styles.methodRow}>
              <TouchableOpacity
                style={[styles.methodBtn, method === 'lmp' && { backgroundColor: colors.primary }]}
                onPress={() => setMethod('lmp')}
              >
                <Text style={[styles.methodText, method === 'lmp' && { color: '#fff' }]}>Ngày kinh cuối</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.methodBtn, method === 'edd' && { backgroundColor: colors.primary }]}
                onPress={() => setMethod('edd')}
              >
                <Text style={[styles.methodText, method === 'edd' && { color: '#fff' }]}>Ngày dự sinh</Text>
              </TouchableOpacity>
            </View>

            {/* Date Inputs */}
            <Text style={[styles.modalLabel, { color: colors.textSecondary }]}>
              {method === 'lmp' ? 'Ngày đầu kỳ kinh cuối' : 'Ngày dự sinh'}
            </Text>
            <View style={styles.dateRow}>
              <TextInput
                style={[styles.dateInput, { borderColor: colors.primaryLight, color: colors.text }]}
                placeholder="Ngày"
                placeholderTextColor={colors.textLight}
                keyboardType="number-pad"
                maxLength={2}
                value={dateDay}
                onChangeText={setDateDay}
              />
              <TextInput
                style={[styles.dateInput, { borderColor: colors.primaryLight, color: colors.text, flex: 1.5 }]}
                placeholder="Tháng"
                placeholderTextColor={colors.textLight}
                keyboardType="number-pad"
                maxLength={2}
                value={dateMonth}
                onChangeText={setDateMonth}
              />
              <TextInput
                style={[styles.dateInput, { borderColor: colors.primaryLight, color: colors.text }]}
                placeholder="Năm"
                placeholderTextColor={colors.textLight}
                keyboardType="number-pad"
                maxLength={4}
                value={dateYear}
                onChangeText={setDateYear}
              />
            </View>

            {/* Preview */}
            {preview && preview.week >= 1 && preview.week <= 42 && (
              <View style={[styles.previewCard, { backgroundColor: colors.primaryLighter }]}>
                <Text style={{ fontSize: 24 }}>🌸</Text>
                <View>
                  <Text style={[styles.previewWeek, { color: colors.primary }]}>Tuần {preview.week}, Ngày {preview.day}</Text>
                  <Text style={[styles.previewDetail, { color: colors.textSecondary }]}>Còn {preview.daysLeft} ngày nữa sẽ gặp bé!</Text>
                </View>
              </View>
            )}

            {/* Save Button */}
            <TouchableOpacity
              style={[styles.saveBtn, { backgroundColor: dateVal ? colors.primary : colors.primaryLight }]}
              onPress={saveDate}
              disabled={!dateVal}
            >
              <Text style={styles.saveBtnText}>Lưu thay đổi</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </ScrollView>
  );
}

const RAW_STYLES = {
  container: { flex: 1 },
  header: { padding: 16, paddingTop: 48, alignItems: 'center', borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '900' },
  section: { padding: 16 },
  sectionHead: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  sectionIcon: { width: 22, height: 22 },
  sectionTitle: { fontSize: 15, fontWeight: '900' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderRadius: 16, marginBottom: 4 },
  rowLabel: { fontSize: 14, fontWeight: '700' },
  rowValue: { fontSize: 14, fontWeight: '800' },
  rowAction: { fontSize: 13, fontWeight: '700' },
  rowInput: { fontSize: 14, fontWeight: '800', textAlign: 'right', flex: 1, marginLeft: 16 },
  fontSizeRow: { flexDirection: 'row', borderRadius: 16, overflow: 'hidden' },
  fontSizeBtn: { flex: 1, alignItems: 'center', paddingVertical: 16, gap: 4 },
  fontSizeSample: { fontWeight: '900' },
  fontSizeLabel: { fontSize: 11, fontWeight: '700' },
  logoutBtn: { padding: 16, borderRadius: 16, alignItems: 'center' },
  logoutText: { fontSize: 15, fontWeight: '800' },
  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 40 },
  modalClose: { position: 'absolute', top: 16, right: 20, zIndex: 1 },
  modalCloseText: { fontSize: 20, fontWeight: '800' },
  modalTitle: { fontSize: 20, fontWeight: '900', marginBottom: 4, textAlign: 'center' },
  modalSubtitle: { fontSize: 13, fontWeight: '600', textAlign: 'center', marginBottom: 20, lineHeight: 20 },
  modalLabel: { fontSize: 13, fontWeight: '800', marginBottom: 8, marginTop: 12 },
  methodRow: { flexDirection: 'row', gap: 8 },
  methodBtn: { flex: 1, padding: 12, borderRadius: 14, backgroundColor: 'rgba(0,0,0,0.04)', alignItems: 'center' },
  methodText: { fontWeight: '700', fontSize: 13, color: '#6B5B7B' },
  dateRow: { flexDirection: 'row', gap: 8 },
  dateInput: { flex: 1, borderWidth: 1.5, borderRadius: 14, padding: 14, fontSize: 15, fontWeight: '600', textAlign: 'center' },
  previewCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 16, marginTop: 16 },
  previewWeek: { fontSize: 16, fontWeight: '900' },
  previewDetail: { fontSize: 13, fontWeight: '600', marginTop: 2 },
  saveBtn: { borderRadius: 16, padding: 16, alignItems: 'center', marginTop: 20 },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
};
