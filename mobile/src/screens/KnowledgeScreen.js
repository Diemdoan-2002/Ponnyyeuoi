import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { useScaledStyles } from '../hooks/useScaledStyles';
import { FALLBACK_ARTICLES } from '../data/supplements';

export default function KnowledgeScreen() {
  const { colors, fs } = useTheme();
  const styles = useScaledStyles(RAW_STYLES);
  const [searchQ, setSearchQ] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [bookmarks, setBookmarks] = useState({});
  const [selectedArticle, setSelectedArticle] = useState(null);

  const articles = FALLBACK_ARTICLES;
  const filtered = articles.filter(a => {
    if (searchQ && !a.title.toLowerCase().includes(searchQ.toLowerCase())) return false;
    if (activeFilter === 'saved' && !bookmarks[a.id]) return false;
    if (!['all', 'week', 'saved'].includes(activeFilter) && a.category?.toLowerCase() !== activeFilter) return false;
    return true;
  });

  const filters = ['Tuần này', 'Tất cả', 'Đã lưu', 'Dinh dưỡng', 'Sức khỏe', 'Thai giáo', 'Chuẩn bị sinh'];
  const filterKey = c => c === 'Tuần này' ? 'week' : c === 'Tất cả' ? 'all' : c === 'Đã lưu' ? 'saved' : c.toLowerCase();

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.gradientHeader[0] }]}>
        <Text style={styles.headerTitle}>Kiến thức mẹ bầu</Text>
      </View>

      {/* Search */}
      <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.primaryLight }]}>
        <Text style={{ fontSize: 16 }}>🔍</Text>
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Tìm kiếm bài viết..."
          placeholderTextColor={colors.textLight}
          value={searchQ}
          onChangeText={setSearchQ}
        />
      </View>

      {/* Filter Chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips} contentContainerStyle={{ paddingHorizontal: 16 }}>
        {filters.map(c => {
          const key = filterKey(c);
          return (
            <TouchableOpacity
              key={c}
              style={[styles.chip, activeFilter === key && { backgroundColor: colors.primary }]}
              onPress={() => setActiveFilter(key)}
            >
              <Text style={[styles.chipText, activeFilter === key && { color: '#fff' }]}>{c}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Articles */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
        {filtered.length === 0 && (
          <Text style={[styles.emptyText, { color: colors.textLight }]}>Không có bài viết phù hợp.</Text>
        )}
        {filtered.map(a => (
          <TouchableOpacity
            key={a.id}
            style={[styles.articleCard, { backgroundColor: colors.surface, borderLeftColor: colors.primaryLight }]}
            onPress={() => setSelectedArticle(a)}
          >
            <View style={styles.articleTop}>
              <View style={[styles.tag, { backgroundColor: colors.primaryLighter }]}>
                <Text style={[styles.tagText, { color: colors.primaryDark }]}>{a.category}</Text>
              </View>
              <TouchableOpacity onPress={() => setBookmarks(p => ({ ...p, [a.id]: !p[a.id] }))}>
                <Text style={{ fontSize: 16, opacity: bookmarks[a.id] ? 1 : 0.4 }}>{bookmarks[a.id] ? '❤️' : '🩶'}</Text>
              </TouchableOpacity>
            </View>
            <Text style={[styles.articleTitle, { color: colors.text }]}>{a.title}</Text>
            <Text style={[styles.articleDesc, { color: colors.textSecondary }]}>{a.summary}</Text>
            <Text style={[styles.articleMeta, { color: colors.textLight }]}>📖 {a.readTimeMinutes || 5} phút đọc</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Article Detail Modal */}
      <Modal visible={!!selectedArticle} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <TouchableOpacity style={styles.modalClose} onPress={() => setSelectedArticle(null)}>
              <Text style={[styles.modalCloseText, { color: colors.text }]}>✕</Text>
            </TouchableOpacity>
            {selectedArticle && (
              <ScrollView>
                <View style={[styles.tag, { backgroundColor: colors.primaryLighter, marginBottom: 12 }]}>
                  <Text style={[styles.tagText, { color: colors.primaryDark }]}>{selectedArticle.category}</Text>
                </View>
                <Text style={[styles.modalTitle, { color: colors.text }]}>{selectedArticle.title}</Text>
                <Text style={[styles.modalMeta, { color: colors.textLight }]}>{selectedArticle.readTimeMinutes || 5} phút đọc</Text>
                <Text style={[styles.modalBody, { color: colors.textSecondary }]}>
                  {selectedArticle.content || selectedArticle.summary}
                  {!selectedArticle.content && '\n\nNội dung đầy đủ sẽ được cập nhật trong phiên bản tới.'}
                </Text>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const RAW_STYLES = {
  container: { flex: 1 },
  header: { padding: 16, paddingTop: 48, alignItems: 'center', borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '900' },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 8, marginHorizontal: 16, marginTop: 12, padding: 12, borderRadius: 28, borderWidth: 1 },
  searchInput: { flex: 1, fontSize: 14, fontWeight: '600' },
  chips: { maxHeight: 44, marginTop: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.04)', marginRight: 6 },
  chipText: { fontSize: 12, fontWeight: '700', color: '#6B5B7B' },
  articleCard: { padding: 14, borderRadius: 14, marginBottom: 8, borderLeftWidth: 4 },
  articleTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tag: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20 },
  tagText: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
  articleTitle: { fontSize: 14, fontWeight: '800', marginTop: 6, lineHeight: 20 },
  articleDesc: { fontSize: 12, fontWeight: '600', marginTop: 4, lineHeight: 18 },
  articleMeta: { fontSize: 11, marginTop: 6 },
  emptyText: { textAlign: 'center', fontSize: 14, fontWeight: '600', marginTop: 32 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '80%' },
  modalClose: { position: 'absolute', top: 16, right: 20, zIndex: 1 },
  modalCloseText: { fontSize: 20, fontWeight: '800' },
  modalTitle: { fontSize: 18, fontWeight: '900', marginBottom: 4 },
  modalMeta: { fontSize: 12, marginBottom: 16 },
  modalBody: { fontSize: 14, fontWeight: '600', lineHeight: 24 },
};
