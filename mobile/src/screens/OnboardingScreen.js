import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { calcFromLMP, calcFromEDD } from '../utils/pregnancy';
import { saveJSON } from '../utils/storage';

export default function OnboardingScreen({ onComplete }) {
  const { colors } = useTheme();
  const [step, setStep] = useState(0);
  const [phone, setPhone] = useState('');
  const [sentOtp, setSentOtp] = useState('');
  const [otpInputs, setOtpInputs] = useState(['','','','','','']);
  const [otpError, setOtpError] = useState('');
  const otpRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  const [method, setMethod] = useState('lmp');
  const [name, setName] = useState('');
  const [dateDay, setDateDay] = useState('');
  const [dateMonth, setDateMonth] = useState('');
  const [dateYear, setDateYear] = useState('');

  const dateVal = dateDay && dateMonth && dateYear
    ? `${dateYear}-${dateMonth.padStart(2, '0')}-${dateDay.padStart(2, '0')}`
    : '';
  const preview = dateVal ? (method === 'lmp' ? calcFromLMP(dateVal) : calcFromEDD(dateVal)) : null;
  const curYear = new Date().getFullYear();
  const isPhoneValid = /^0\d{9}$/.test(phone);

  const handleSendOtp = () => {
    if (!isPhoneValid) return;
    const code = String(Math.floor(100000 + Math.random() * 900000));
    setSentOtp(code);
    setOtpInputs(['','','','','','']);
    setOtpError('');
    Alert.alert('Mã OTP', `Mã xác nhận: ${code}`);
    setStep(2);
  };

  const handleOtpChange = (idx, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otpInputs];
    next[idx] = val;
    setOtpInputs(next);
    setOtpError('');
    if (val && idx < 5) otpRefs[idx + 1]?.current?.focus();
  };

  const handleVerifyOtp = () => {
    const entered = otpInputs.join('');
    if (entered === sentOtp) {
      setStep(3);
    } else {
      setOtpError('Mã OTP không đúng, vui lòng thử lại');
    }
  };

  const handleComplete = async () => {
    if (!dateVal || !name) return;
    const cfg = { name, method, dateVal, phone };
    await saveJSON('ponny_onboarding', cfg);
    onComplete(cfg);
  };

  const ds = (c) => [styles, { color: colors }];

  // Step 0: Welcome
  if (step === 0) return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Text style={{ fontSize: 64, marginBottom: 16 }}>🤰</Text>
      <Text style={[styles.title, { color: colors.text }]}>
        <Text style={{ color: colors.primary }}>Ponny</Text>yeuoi!
      </Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Người bạn đồng hành thai kỳ thông minh 🌸</Text>
      <TouchableOpacity 
        style={[styles.mainBtn, { backgroundColor: colors.primary }]} 
        onPress={() => setStep(1)}
      >
        <Text style={styles.mainBtnText}>Bắt đầu hành trình →</Text>
      </TouchableOpacity>
      <Text style={[styles.note, { color: colors.textLight }]}>Dữ liệu y tế chuẩn WHO & Bộ Y tế Việt Nam</Text>
    </View>
  );

  // Step 1: Phone
  if (step === 1) return (
    <ScrollView style={[styles.scroll, { backgroundColor: colors.bg }]} contentContainerStyle={styles.scrollContent}>
      <Text style={{ fontSize: 48, alignSelf: 'center', marginBottom: 16 }}>📱</Text>
      <Text style={[styles.stepTitle, { color: colors.text }]}>Xác thực số điện thoại</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Nhập số điện thoại để đăng ký tài khoản</Text>
      <View style={[styles.inputWrap, { borderColor: colors.primaryLight }]}>
        <Text style={{ fontSize: 14, fontWeight: '700', color: colors.textSecondary }}>🇻🇳 +84</Text>
        <TextInput
          style={[styles.phoneInput, { color: colors.text }]}
          placeholder="0912 345 678"
          placeholderTextColor={colors.textLight}
          keyboardType="phone-pad"
          maxLength={10}
          value={phone}
          onChangeText={t => setPhone(t.replace(/\D/g, ''))}
          autoFocus
        />
      </View>
      {phone && !isPhoneValid && (
        <Text style={[styles.hint, { color: colors.warning }]}>Số điện thoại phải có 10 chữ số, bắt đầu bằng 0</Text>
      )}
      <TouchableOpacity
        style={[styles.mainBtn, { backgroundColor: isPhoneValid ? colors.primary : colors.primaryLight }]}
        onPress={handleSendOtp}
        disabled={!isPhoneValid}
      >
        <Text style={styles.mainBtnText}>Gửi mã OTP</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setStep(0)}>
        <Text style={[styles.backText, { color: colors.primary }]}>← Quay lại</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  // Step 2: OTP
  if (step === 2) return (
    <ScrollView style={[styles.scroll, { backgroundColor: colors.bg }]} contentContainerStyle={styles.scrollContent}>
      <Text style={{ fontSize: 48, alignSelf: 'center', marginBottom: 16 }}>🔐</Text>
      <Text style={[styles.stepTitle, { color: colors.text }]}>Nhập mã xác nhận</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Mã OTP đã gửi đến <Text style={{ fontWeight: '800' }}>{phone}</Text></Text>
      <View style={styles.otpRow}>
        {otpInputs.map((v, i) => (
          <TextInput
            key={i}
            ref={otpRefs[i]}
            style={[styles.otpInput, { borderColor: otpError ? colors.error : colors.primaryLight, color: colors.text }]}
            keyboardType="number-pad"
            maxLength={1}
            value={v}
            onChangeText={val => handleOtpChange(i, val)}
          />
        ))}
      </View>
      {otpError ? <Text style={[styles.hint, { color: colors.error }]}>{otpError}</Text> : null}
      <TouchableOpacity
        style={[styles.mainBtn, { backgroundColor: otpInputs.every(v => v) ? colors.primary : colors.primaryLight }]}
        onPress={handleVerifyOtp}
        disabled={otpInputs.some(v => !v)}
      >
        <Text style={styles.mainBtnText}>Xác nhận</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSendOtp}>
        <Text style={[styles.backText, { color: colors.primary }]}>Gửi lại mã OTP</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setStep(1)}>
        <Text style={[styles.backText, { color: colors.textSecondary }]}>← Đổi số điện thoại</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  // Step 3: Pregnancy setup
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = ['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6','Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12'];
  const years = [curYear - 1, curYear, curYear + 1];

  return (
    <ScrollView style={[styles.scroll, { backgroundColor: colors.bg }]} contentContainerStyle={styles.scrollContent}>
      <Text style={{ fontSize: 48, alignSelf: 'center', marginBottom: 16 }}>🤰</Text>
      <Text style={[styles.stepTitle, { color: colors.text }]}>Thiết lập thai kỳ</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Nhập thông tin để Ponny tính tuần thai chính xác</Text>

      <Text style={[styles.label, { color: colors.textSecondary }]}>Tên gọi thân mật</Text>
      <TextInput
        style={[styles.input, { borderColor: colors.primaryLight, color: colors.text }]}
        placeholder="Ví dụ: Ponny, Mẹ bầu, Mama..."
        placeholderTextColor={colors.textLight}
        value={name}
        onChangeText={setName}
      />

      <Text style={[styles.label, { color: colors.textSecondary }]}>Chọn cách tính</Text>
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

      <Text style={[styles.label, { color: colors.textSecondary }]}>
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

      {preview && preview.week >= 1 && preview.week <= 40 && (
        <View style={[styles.previewCard, { backgroundColor: colors.primaryLighter }]}>
          <Text style={{ fontSize: 24 }}>🌸</Text>
          <View>
            <Text style={[styles.previewWeek, { color: colors.primary }]}>Tuần {preview.week}, Ngày {preview.day}</Text>
            <Text style={[styles.previewDetail, { color: colors.textSecondary }]}>Còn {preview.daysLeft} ngày nữa sẽ gặp bé!</Text>
          </View>
        </View>
      )}

      <TouchableOpacity
        style={[styles.mainBtn, { backgroundColor: (dateVal && name) ? colors.primary : colors.primaryLight }]}
        onPress={handleComplete}
        disabled={!dateVal || !name}
      >
        <Text style={styles.mainBtnText}>Bắt đầu hành trình!</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setStep(2)}>
        <Text style={[styles.backText, { color: colors.textSecondary }]}>← Quay lại</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  scroll: { flex: 1 },
  scrollContent: { padding: 24, paddingTop: 60 },
  title: { fontSize: 32, fontWeight: '900', textAlign: 'center', marginBottom: 8 },
  stepTitle: { fontSize: 24, fontWeight: '900', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 15, textAlign: 'center', marginBottom: 24, lineHeight: 22, fontWeight: '600' },
  note: { fontSize: 12, marginTop: 24, textAlign: 'center', fontWeight: '600' },
  label: { fontSize: 13, fontWeight: '800', marginBottom: 8, marginTop: 16 },
  input: { borderWidth: 1.5, borderRadius: 14, padding: 14, fontSize: 15, fontWeight: '600' },
  inputWrap: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderRadius: 14, padding: 12, gap: 8 },
  phoneInput: { flex: 1, fontSize: 16, fontWeight: '700' },
  otpRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginVertical: 16 },
  otpInput: { width: 46, height: 56, borderWidth: 2, borderRadius: 14, fontSize: 22, fontWeight: '800', textAlign: 'center' },
  mainBtn: { borderRadius: 16, padding: 16, alignItems: 'center', marginTop: 24 },
  mainBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  backText: { textAlign: 'center', marginTop: 16, fontWeight: '700', fontSize: 14 },
  hint: { fontSize: 12, fontWeight: '600', marginTop: 6 },
  methodRow: { flexDirection: 'row', gap: 8 },
  methodBtn: { flex: 1, padding: 12, borderRadius: 14, backgroundColor: 'rgba(0,0,0,0.04)', alignItems: 'center' },
  methodText: { fontWeight: '700', fontSize: 13, color: '#6B5B7B' },
  dateRow: { flexDirection: 'row', gap: 8 },
  dateInput: { flex: 1, borderWidth: 1.5, borderRadius: 14, padding: 14, fontSize: 15, fontWeight: '600', textAlign: 'center' },
  previewCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 16, marginTop: 16 },
  previewWeek: { fontSize: 16, fontWeight: '900' },
  previewDetail: { fontSize: 13, fontWeight: '600', marginTop: 2 },
});
