// ============================================================
//  HydroSense — Records & Logs Screen  (Light Green Theme)
//  File: src/screens/LogsScreen.js
// ============================================================
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Badge, Row } from '../components/SharedComponents';
import { COLORS, SPACING, RADIUS } from '../utils/theme';
import { MOCK_LOGS } from '../utils/api';

const FILTERS = ['All', 'Optimal', 'Warning', 'Critical'];

export default function LogsScreen() {
  const [filter, setFilter] = useState('All');
  const filtered = filter === 'All' ? MOCK_LOGS : MOCK_LOGS.filter(l => l.status === filter);

  return (
    <SafeAreaView style={s.screen} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <Text style={s.title}>Records & Logs</Text>
        <Text style={s.subtitle}>{MOCK_LOGS.length} entries recorded</Text>

        {/* Filter chips */}
        <Row style={s.filterRow}>
          {FILTERS.map(f => (
            <TouchableOpacity key={f} style={[s.chip, filter === f && s.chipActive]} onPress={() => setFilter(f)}>
              <Text style={[s.chipText, filter === f && s.chipTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </Row>

        {/* Table */}
        <View style={s.table}>
          {/* Header */}
          <View style={[s.tableRow, s.tableHeader]}>
            {['Timestamp','Temp °C','Hum %','pH','TDS ppm','Status'].map(h => (
              <Text key={h} style={s.th}>{h}</Text>
            ))}
          </View>
          {/* Rows */}
          {filtered.map((log, i) => (
            <View key={i} style={[s.tableRow, i % 2 === 1 && s.tableRowAlt]}>
              <Text style={[s.td, s.tdMuted]}>{log.timestamp}</Text>
              <Text style={s.td}>{log.temp}</Text>
              <Text style={s.td}>{log.humidity}</Text>
              <Text style={s.td}>{log.ph}</Text>
              <Text style={s.td}>{log.tds}</Text>
              <View style={s.tdStatus}>
                <Badge
                  label={log.status}
                  type={log.status === 'Optimal' ? 'success' : log.status === 'Warning' ? 'warning' : 'danger'}
                  size="sm"
                />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen:       { flex: 1, backgroundColor: COLORS.bg },
  scroll:       { padding: SPACING.md, paddingBottom: 40 },
  title:        { color: COLORS.textPrimary, fontSize: 26, fontWeight: '800', letterSpacing: -0.8, marginTop: SPACING.sm },
  subtitle:     { color: COLORS.textMuted, fontSize: 12, marginBottom: SPACING.md },
  filterRow:    { gap: 6, marginBottom: SPACING.md, flexWrap: 'wrap' },
  chip:         { paddingHorizontal: 14, paddingVertical: 6, borderRadius: RADIUS.full, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.bgCard },
  chipActive:   { backgroundColor: COLORS.greenDark, borderColor: COLORS.greenDark },
  chipText:     { fontSize: 11, fontWeight: '700', color: COLORS.textMuted },
  chipTextActive:{ color: '#fff' },
  table:        { backgroundColor: COLORS.bgCard, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden', shadowColor: '#1e7a45', shadowOffset:{width:0,height:1}, shadowOpacity:0.05, shadowRadius:4, elevation:1 },
  tableHeader:  { backgroundColor: COLORS.bgCardAlt, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  tableRow:     { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#f0f8f3' },
  tableRowAlt:  { backgroundColor: '#fafcfb' },
  th:           { flex: 1, padding: SPACING.sm + 2, fontSize: 9, fontWeight: '700', color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 },
  td:           { flex: 1, padding: SPACING.sm + 2, fontSize: 12, color: COLORS.textPrimary },
  tdMuted:      { color: COLORS.textMuted, fontSize: 10 },
  tdStatus:     { flex: 1, padding: SPACING.sm + 2, justifyContent: 'center' },
});
