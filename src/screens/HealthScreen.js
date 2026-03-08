// ============================================================
//  HydroSense — System Health Screen  (Light Green Theme)
//  File: src/screens/HealthScreen.js
// ============================================================
import React from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Badge, Row } from '../components/SharedComponents';
import { COLORS, SPACING, RADIUS } from '../utils/theme';

const SENSORS = [
  { name: 'DHT11 Sensor 1', last: '2s ago', ok: true },
  { name: 'DHT11 Sensor 2', last: '2s ago', ok: true },
  { name: 'DHT11 Sensor 3', last: '2s ago', ok: true },
  { name: 'pH Sensor',       last: '5s ago', ok: true },
  { name: 'TDS Sensor',      last: '5s ago', ok: true },
];
const SD = { used: 13.4, total: 32 };
const sdPct = Math.round((SD.used / SD.total) * 100);

export default function HealthScreen() {
  return (
    <SafeAreaView style={s.screen} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <Text style={s.title}>System Health</Text>
        <Text style={s.subtitle}>Hardware connectivity & diagnostics</Text>

        {/* ESP32 + Sensors Summary */}
        <Row style={s.summaryRow}>
          <Card style={[s.summaryCard, { marginBottom: 0 }]}>
            <View style={s.sumIconWrap}><Text style={{ fontSize: 20 }}>🔧</Text></View>
            <Text style={s.sumSub}>ESP32-S3</Text>
            <Text style={s.sumName}>Controller</Text>
            <View style={s.onlinePill}><Text style={s.onlineDot}>●</Text><Text style={s.onlineText}>Online</Text></View>
          </Card>
          <Card style={[s.summaryCard, { marginBottom: 0 }]}>
            <View style={s.sumIconWrap}><Text style={{ fontSize: 20 }}>📡</Text></View>
            <Text style={s.sumSub}>Sensors</Text>
            <Text style={s.sumName}>All Active</Text>
            <View style={s.onlinePill}><Text style={s.onlineDot}>●</Text><Text style={s.onlineText}>{SENSORS.filter(s=>s.ok).length}/{SENSORS.length}</Text></View>
          </Card>
        </Row>

        {/* SD Card */}
        <Card>
          <Row style={{ justifyContent: 'space-between', marginBottom: SPACING.md }}>
            <Row style={{ gap: 8 }}>
              <View style={s.cardIconWrap}><Text style={{ fontSize: 16 }}>💾</Text></View>
              <View>
                <Text style={s.cardTitle}>SD Card Module</Text>
                <Text style={s.cardSub}>{sdPct}% capacity used</Text>
              </View>
            </Row>
            <Badge label="✓ OK" type="success" size="sm" />
          </Row>

          <Row style={s.sdGrid}>
            {[['Capacity','32 GB'],['Used','13.4 GB'],['Available','18.6 GB'],['Usage',`${sdPct}%`]].map(([l,v])=>(
              <View key={l} style={s.sdItem}>
                <Text style={s.sdLabel}>{l}</Text>
                <Text style={s.sdVal}>{v}</Text>
              </View>
            ))}
          </Row>

          <View style={s.barBg}>
            <View style={[s.barFill, { width: `${sdPct}%`, backgroundColor: sdPct > 85 ? COLORS.danger : sdPct > 65 ? COLORS.chartAmber : COLORS.green }]} />
          </View>
          <Text style={s.barHint}>{sdPct}% used · {(SD.total - SD.used).toFixed(1)} GB available</Text>
        </Card>

        {/* Sensor Array */}
        <View style={s.sensorListCard}>
          <Row style={s.sensorListHeader}>
            <View style={s.cardIconWrap}><Text style={{ fontSize: 14 }}>📡</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={s.cardTitle}>Sensor Array Status</Text>
              <Text style={s.cardSub}>Individual sensor health and connectivity</Text>
            </View>
            <Badge label={`${SENSORS.filter(x=>x.ok).length}/${SENSORS.length} Active`} type="success" size="sm" />
          </Row>
          {SENSORS.map((sensor, i) => (
            <Row key={i} style={[s.sensorItem, i === SENSORS.length - 1 && { borderBottomWidth: 0 }]}>
              <View style={[s.sensorDot, { backgroundColor: sensor.ok ? COLORS.green : COLORS.danger }]} />
              <View style={{ flex: 1 }}>
                <Text style={s.sensorName}>{sensor.name}</Text>
                <Text style={s.sensorLast}>Last reading: {sensor.last}</Text>
              </View>
              <Badge label={sensor.ok ? '⊙ Operational' : '⊗ Offline'} type={sensor.ok ? 'success' : 'danger'} size="sm" />
            </Row>
          ))}
        </View>

        {/* Network */}
        <Card>
          <Text style={s.cardTitle2}>🌐 Network</Text>
          {[['Backend API','Connected','success'],['Firebase DB','Connected','success'],['Last Sync','just now','success']].map(([l,v,t])=>(
            <Row key={l} style={s.netRow}>
              <Text style={s.netLabel}>{l}</Text>
              {l === 'Last Sync'
                ? <Text style={{ color: COLORS.green, fontSize: 11, fontWeight: '700' }}>{v}</Text>
                : <Badge label={v} type={t} size="sm" />}
            </Row>
          ))}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen:         { flex: 1, backgroundColor: COLORS.bg },
  scroll:         { padding: SPACING.md, paddingBottom: 40 },
  title:          { color: COLORS.textPrimary, fontSize: 26, fontWeight: '800', letterSpacing: -0.8, marginTop: SPACING.sm },
  subtitle:       { color: COLORS.textMuted, fontSize: 12, marginBottom: SPACING.md },
  summaryRow:     { gap: 10, marginBottom: 0, alignItems: 'flex-start' },
  summaryCard:    { flex: 1 },
  sumIconWrap:    { width: 38, height: 38, borderRadius: 10, backgroundColor: COLORS.greenLight, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.sm },
  sumSub:         { fontSize: 10, color: COLORS.textMuted, fontWeight: '600', marginBottom: 2 },
  sumName:        { fontSize: 18, fontWeight: '800', color: COLORS.textPrimary, marginBottom: SPACING.sm },
  onlinePill:     { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.greenLight, borderRadius: RADIUS.full, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start', borderWidth: 1, borderColor: COLORS.borderHigh },
  onlineDot:      { color: COLORS.green, fontSize: 10 },
  onlineText:     { color: COLORS.greenDark, fontSize: 10, fontWeight: '700' },
  cardIconWrap:   { width: 28, height: 28, borderRadius: 8, backgroundColor: COLORS.greenLight, alignItems: 'center', justifyContent: 'center' },
  cardTitle:      { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary },
  cardTitle2:     { fontSize: 11, fontWeight: '700', color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: SPACING.sm },
  cardSub:        { fontSize: 10, color: COLORS.textMuted },
  sdGrid:         { flexWrap: 'wrap', marginVertical: SPACING.sm },
  sdItem:         { width: '50%', paddingVertical: 2 },
  sdLabel:        { fontSize: 11, color: COLORS.textMuted },
  sdVal:          { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary },
  barBg:          { height: 8, backgroundColor: '#e8f5ed', borderRadius: 4, overflow: 'hidden', marginTop: SPACING.sm },
  barFill:        { height: '100%', borderRadius: 4 },
  barHint:        { fontSize: 10, color: COLORS.textMuted, marginTop: 4 },
  sensorListCard: { backgroundColor: COLORS.bgCard, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden', marginBottom: SPACING.sm + 4, shadowColor: '#1e7a45', shadowOffset:{width:0,height:1}, shadowOpacity:0.05, shadowRadius:4, elevation:1 },
  sensorListHeader:{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: SPACING.md, backgroundColor: COLORS.bgCardAlt, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  sensorItem:     { flexDirection: 'row', alignItems: 'center', gap: 12, padding: SPACING.md, borderBottomWidth: 1, borderBottomColor: '#f0f8f3' },
  sensorDot:      { width: 9, height: 9, borderRadius: 5, flexShrink: 0 },
  sensorName:     { fontSize: 13, fontWeight: '600', color: COLORS.textPrimary },
  sensorLast:     { fontSize: 10, color: COLORS.textFaint },
  netRow:         { justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#f0f8f3' },
  netLabel:       { fontSize: 12, color: COLORS.textMuted },
});
