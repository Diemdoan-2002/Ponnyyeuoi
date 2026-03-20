import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { useScaledStyles } from '../hooks/useScaledStyles';
import { calcPregnancy } from '../utils/pregnancy';
import { loadJSON, saveJSON } from '../utils/storage';

const GEMINI_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';

export default function ChatScreen({ navigation }) {
  const { colors, fs } = useTheme();
  const styles = useScaledStyles(RAW_STYLES);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [userConfig, setUserConfig] = useState(null);
  const [meds, setMeds] = useState([]);
  const scrollRef = useRef();

  useEffect(() => {
    const load = async () => {
      setMessages(await loadJSON('ponny_chat_history', []));
      setUserConfig(await loadJSON('ponny_onboarding'));
      setMeds(await loadJSON('ponny_meds', []));
    };
    load();
  }, []);

  useEffect(() => {
    saveJSON('ponny_chat_history', messages);
  }, [messages]);

  const pregnancy = calcPregnancy(userConfig);
  const userName = userConfig?.name || 'bạn';
  const weekNum = pregnancy.week;
  const trimester = weekNum <= 12 ? 1 : weekNum <= 27 ? 2 : 3;

  const sendChat = useCallback(async () => {
    const msg = input.trim();
    if (!msg || loading) return;
    setInput('');
    const userMsg = { role: 'user', content: msg };
    const updatedMsgs = [...messages, userMsg];
    setMessages(updatedMsgs);
    setLoading(true);

    try {
      if (!GEMINI_KEY) {
        throw new Error('Chưa cấu hình API key. Hãy thêm key vào file .env');
      }

      const medsStr = meds.length > 0
        ? meds.map(m => `  • ${m.name} (${m.dose}, ${m.freq}) — ${m.taken ? 'đã uống' : 'chưa uống'}`).join('\n')
        : '  Chưa thiết lập';

      const systemPrompt = `Bạn là Ponny — trợ lý AI chuyên sức khỏe thai kỳ, có kiến thức sâu rộng theo WHO và Bộ Y tế Việt Nam.\n\nTHÔNG TIN MẸ BẦU:\n- Tên: ${userName}\n- Tuần thai: Tuần ${weekNum}\n- Tam cá nguyệt: ${trimester}\n- Còn ${pregnancy.daysLeft} ngày nữa\n\nTHUỐC ĐANG DÙNG:\n${medsStr}\n\nQUY TẮC:\n1. Trả lời tiếng Việt, thân thiện, dùng emoji\n2. Gọi mẹ bầu bằng tên "${userName}"\n3. ĐƯỢC PHÉP đưa lời khuyên sức khỏe\n4. Triệu chứng nghiêm trọng thì khuyên cấp cứu NGAY\n5. Trả lời tối đa 300 từ`;

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`;
      const history = updatedMsgs.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: history,
          generationConfig: { maxOutputTokens: 500, temperature: 0.7 }
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || `HTTP ${res.status}`);
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Không nhận được phản hồi';
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      const errText = err.message || 'Không rõ lỗi';
      let errMsg = '❌ ' + errText;
      if (errText.includes('quota') || errText.includes('429')) errMsg = '⏳ API đang quá tải, thử lại sau vài giây nhé!';
      else if (errText.includes('403') || errText.includes('API_KEY_INVALID')) errMsg = '🔑 API key không hợp lệ. Kiểm tra lại file .env';
      setMessages(prev => [...prev, { role: 'assistant', content: errMsg }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, userName, weekNum, trimester, pregnancy.daysLeft, meds]);

  const clearChat = async () => {
    setMessages([]);
    await saveJSON('ponny_chat_history', []);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.bg }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.gradientHeader[0] }]}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Image source={require('../../assets/icons/nav-chat.png')} style={{ width: 30, height: 30 }} />
        <Text style={styles.headerTitle}>Ponny AI</Text>
        <TouchableOpacity onPress={clearChat} style={styles.clearBtn}>
          <Image source={require('../../assets/icons/icon-trash.png')} style={{ width: 28, height: 28 }} />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <ScrollView
        style={styles.messagesWrap}
        ref={scrollRef}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.length === 0 && (
          <View style={styles.welcome}>
            <Image source={require('../../assets/icons/nav-chat.png')} style={{ width: 64, height: 64, marginBottom: 12 }} />
            <Text style={[styles.welcomeTitle, { color: colors.text }]}>Xin chào {userName}!</Text>
            <Text style={[styles.welcomeDesc, { color: colors.textSecondary }]}>Mình là Ponny — trợ lý AI thai kỳ. Hỏi mình bất cứ điều gì nhé!</Text>
            <View style={styles.suggestions}>
              {['Bé tuần này ra sao?', 'Tôi nên ăn gì?', 'Nhắc uống thuốc'].map(s => (
                <TouchableOpacity
                  key={s}
                  style={[styles.suggestion, { backgroundColor: colors.primaryLighter }]}
                  onPress={() => setInput(s)}
                >
                  <Text style={[styles.suggestionText, { color: colors.primary }]}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {messages.map((m, i) => (
          <View key={i} style={[styles.bubble, m.role === 'user' ? styles.bubbleUser : styles.bubbleAssistant]}>
            {m.role === 'assistant' && <Image source={require('../../assets/icons/nav-chat.png')} style={styles.avatarImg} />}
            <View style={[
              styles.bubbleContent,
              { backgroundColor: m.role === 'user' ? colors.primary : colors.surface }
            ]}>
              <Text style={[styles.bubbleText, { color: m.role === 'user' ? '#fff' : colors.text }]}>
                {m.content}
              </Text>
            </View>
          </View>
        ))}

        {loading && (
          <View style={[styles.bubble, styles.bubbleAssistant]}>
            <Image source={require('../../assets/icons/nav-chat.png')} style={styles.avatarImg} />
            <View style={[styles.bubbleContent, { backgroundColor: colors.surface }]}>
              <Text style={[styles.bubbleText, { color: colors.textLight }]}>Đang trả lời...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Input */}
      <View style={[styles.inputBar, { backgroundColor: colors.surface, borderTopColor: 'rgba(0,0,0,0.06)' }]}>
        <TextInput
          style={[styles.input, { color: colors.text, borderColor: colors.primaryLight }]}
          placeholder="Hỏi Ponny bất cứ điều gì..."
          placeholderTextColor={colors.textLight}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={sendChat}
          returnKeyType="send"
        />
        <TouchableOpacity
          style={[styles.sendBtn, { backgroundColor: colors.primary, opacity: (!input.trim() || loading) ? 0.5 : 1 }]}
          onPress={sendChat}
          disabled={!input.trim() || loading}
        >
          <Text style={styles.sendBtnText}>Gửi</Text>
        </TouchableOpacity>
      </View>
      <Text style={[styles.disclaimer, { color: colors.textLight }]}>Câu trả lời của AI chỉ mang tính chất tham khảo, không thay thế bác sĩ</Text>
    </KeyboardAvoidingView>
  );
}

const RAW_STYLES = {
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 16, paddingTop: 48, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '900', flex: 1 },
  backBtn: { backgroundColor: 'rgba(255,255,255,0.2)', width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  backBtnText: { color: '#fff', fontSize: 18, fontWeight: '800' },
  clearBtn: { backgroundColor: 'rgba(255,255,255,0.2)', width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  messagesWrap: { flex: 1, padding: 16 },
  welcome: { alignItems: 'center', paddingTop: 40 },
  welcomeTitle: { fontSize: 20, fontWeight: '900', marginBottom: 4 },
  welcomeDesc: { fontSize: 14, fontWeight: '600', textAlign: 'center', marginBottom: 16 },
  suggestions: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 },
  suggestion: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  suggestionText: { fontSize: 13, fontWeight: '700' },
  bubble: { flexDirection: 'row', marginBottom: 8, gap: 8 },
  bubbleUser: { justifyContent: 'flex-end' },
  bubbleAssistant: { justifyContent: 'flex-start' },
  avatar: { fontSize: 20, marginTop: 4 },
  avatarImg: { width: 24, height: 24, marginTop: 4 },
  bubbleContent: { maxWidth: '80%', padding: 12, borderRadius: 16 },
  bubbleText: { fontSize: 14, fontWeight: '600', lineHeight: 22 },
  inputBar: { flexDirection: 'row', gap: 8, padding: 12, borderTopWidth: 1, alignItems: 'center' },
  input: { flex: 1, borderWidth: 1.5, borderRadius: 24, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14, fontWeight: '600' },
  sendBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 24 },
  sendBtnText: { color: '#fff', fontSize: 14, fontWeight: '800' },
  disclaimer: { textAlign: 'center', fontSize: 11, fontWeight: '600', paddingVertical: 6, opacity: 0.7 },
};
