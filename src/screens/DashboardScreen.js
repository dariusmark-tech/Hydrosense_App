// ============================================================
//  HydroSense — Dashboard Screen  (Light Green Theme)
//  File: src/screens/DashboardScreen.js
// ============================================================
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Badge, AlertBanner, SensorBar, Row, CardLabel } from '../components/SharedComponents';
import { COLORS, SPACING, RADIUS, OPTIMAL_RANGES } from '../utils/theme';
import { getLatestReadings, MOCK_GROWTH } from '../utils/api';

function getSensorStatus(key, value) {
  const r = OPTIMAL_RANGES[key];
  if (!r) return 'success';
  if (value < r.min || value > r.max) return 'danger';
  const slack = (r.max - r.min) * 0.1;
  if (value < r.min + slack || value > r.max - slack) return 'warning';
  return 'success';
}

export default function DashboardScreen() {
  const [readings,   setReadings]   = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [alerts,     setAlerts]     = useState([]);

  const loadData = useCallback(async () => {
    try {
      const data = await getLatestReadings();
      setReadings(data);
      const a = [];
      if (data.temp.avg < OPTIMAL_RANGES.temp.min || data.temp.avg > OPTIMAL_RANGES.temp.max)
        a.push({ id: 'temp', msg: `⚠️ Temperature out of range: ${data.temp.avg}°C`, type: 'warning' });
      if (data.ph < OPTIMAL_RANGES.ph.min || data.ph > OPTIMAL_RANGES.ph.max)
        a.push({ id: 'ph', msg: `⚠️ pH out of range: ${data.ph}`, type: 'warning' });
      setAlerts(a);
    } catch {
      setAlerts([{ id: 'err', msg: '🔴 Could not reach backend. Showing cached data.', type: 'danger' }]);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);
  const onRefresh = async () => { setRefreshing(true); await loadData(); setRefreshing(false); };

  if (!readings) return (
    <SafeAreaView style={s.screen} edges={['top']}>
      <View style={s.centered}><Text style={s.loadingText}>Loading…</Text></View>
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={s.screen} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />
      <ScrollView
        contentContainerStyle={s.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.greenDark} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Row style={s.header}>
          <View style={{ flex: 1 }}>
            <Text style={s.greeting}>🌿 HydroSense</Text>
            <Text style={s.title}>Dashboard</Text>
          </View>
          {alerts.length === 0 && (
            <View style={s.allGoodPill}>
              <View style={s.pulseDot} />
              <Text style={s.allGoodText}>All Optimal</Text>
            </View>
          )}
        </Row>

        {alerts.map(a => <AlertBanner key={a.id} message={a.msg} type={a.type} />)}

        {/* 4-card sensor row: Temp | Humidity | pH | TDS */}
        <Row style={s.fourCol}>
          {/* Temperature */}
          <Card style={s.quarterCard}>
            <CardLabel>🌡️ Temperature Sensors</CardLabel>
            {[
              { label: 'Sensor 1', val: readings.temp.s1 },
              { label: 'Sensor 2', val: readings.temp.s2 },
              { label: 'Sensor 3', val: readings.temp.s3 },
            ].map((sr, i) => (
              <Row key={i} style={s.tempRow}>
                <Text style={s.tempLabel}>{sr.label}</Text>
                <Text style={s.tempVal}>{sr.val}°C</Text>
                <View style={[s.dot, { backgroundColor: getSensorStatus('temp', sr.val) === 'success' ? COLORS.green : COLORS.chartAmber }]} />
              </Row>
            ))}
            <Row style={s.avgRow}>
              <Text style={s.avgLabel}>Average</Text>
              <Text style={s.avgVal}>{readings.temp.avg} °C</Text>
            </Row>
          </Card>

          {/* Humidity */}
          <Card style={s.quarterCard}>
            <Row style={{ justifyContent: 'space-between', marginBottom: SPACING.sm }}>
              <CardLabel style={{ marginBottom: 0 }}>💧 Humidity</CardLabel>
              <Badge label="Optimal" type="success" size="sm" />
            </Row>
            <Text style={s.bigNum}>{readings.humidity}<Text style={s.bigUnit}> %</Text></Text>
            <Row style={s.humDrops}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Text key={i} style={{ fontSize: 18, opacity: i < Math.round(readings.humidity / 20) ? 1 : 0.2 }}>💧</Text>
              ))}
            </Row>
            <SensorBar value={readings.humidity} max={100} color={COLORS.green} />
          </Card>

          {/* pH */}
          <Card style={s.quarterCard}>
            <Row style={{ justifyContent: 'space-between', marginBottom: SPACING.sm }}>
              <CardLabel style={{ marginBottom: 0 }}>⚗️ pH Level</CardLabel>
              <Badge label="Optimal" type="success" size="sm" />
            </Row>
            <Text style={s.bigNum}>{readings.ph}</Text>
            <Text style={s.optimalText}>OPTIMAL</Text>
            <View style={s.phStrip}>
              {['#d63f3f','#e67e22','#f1c40f','#c8d444','#2ecc71','#27ae60','#1a8a50','#2980b9','#1a5276','#6c3483','#2d1b40','#0d0618','#060310','#030108'].map((c,i) => (
                <View key={i} style={[s.phSeg, { backgroundColor: c }]} />
              ))}
            </View>
            <Row style={{ justifyContent: 'space-between', marginTop: 2 }}>
              <Text style={s.phHint}>Acid</Text>
              <Text style={s.phHint}>Neutral</Text>
              <Text style={s.phHint}>Alkaline</Text>
            </Row>
          </Card>

          {/* TDS */}
          <Card style={s.quarterCard}>
            <Row style={{ justifyContent: 'space-between', marginBottom: SPACING.sm }}>
              <CardLabel style={{ marginBottom: 0 }}>🧪 TDS Nutrients</CardLabel>
              <Badge label="Good" type="success" size="sm" />
            </Row>
            <Text style={s.bigNum}>{readings.tds}<Text style={s.bigUnit}> ppm</Text></Text>
            <SensorBar value={readings.tds} max={1500} color={COLORS.chartPurple} />
            <Text style={s.rangeHint}>Target: 800–1200 ppm</Text>
          </Card>
        </Row>

        {/* Growth Stage — full width */}
        <Card>
          <Row style={{ justifyContent: 'space-between', marginBottom: 0 }}>
            <CardLabel style={{ marginBottom: 0 }}>🌿 Growth Stage Classification</CardLabel>
            <Badge label={`${MOCK_GROWTH.confidence.Vegetative}% confidence`} size="sm" />
          </Row>
          <Row style={s.stageRow}>
            {Object.entries(MOCK_GROWTH.confidence).map(([stage, pct]) => (
              <View key={stage} style={[s.stageBox, stage === MOCK_GROWTH.stage && s.stageBoxActive]}>
                <Text style={[s.stagePct, stage === MOCK_GROWTH.stage && { color: COLORS.greenDark }]}>{pct}%</Text>
                <Text style={[s.stageName, stage === MOCK_GROWTH.stage && { color: COLORS.greenDark }]}>{stage}</Text>
                <View style={s.stageBar}>
                  <View style={[s.stageBarFill, { width: `${pct}%` }]} />
                </View>
              </View>
            ))}
          </Row>
          <Row style={s.growthFooter}>
            <View style={{ alignItems: 'center' }}>
              <Text style={s.growthMetaLabel}>Est. Days to Next Stage</Text>
              <Text style={s.growthMetaVal}>{MOCK_GROWTH.daysToNext}</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={s.growthMetaLabel}>Predicted Harvest</Text>
              <Text style={[s.growthMetaVal, { fontSize: 14, color: COLORS.greenDark }]}>{MOCK_GROWTH.harvestDate}</Text>
            </View>
          </Row>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen:       { flex: 1, backgroundColor: COLORS.bg },
  scroll:       { padding: SPACING.md, paddingBottom: 40 },
  centered:     { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText:  { color: COLORS.textMuted, fontSize: 16 },
  header:       { justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: SPACING.lg, marginTop: SPACING.sm },
  greeting:     { color: COLORS.textMuted, fontSize: 13 },
  title:        { color: COLORS.textPrimary, fontSize: 28, fontWeight: '800', letterSpacing: -1 },
  allGoodPill:  { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.greenLight, borderWidth: 1, borderColor: COLORS.borderHigh, paddingHorizontal: 12, paddingVertical: 6, borderRadius: RADIUS.full },
  pulseDot:     { width: 7, height: 7, borderRadius: 10, backgroundColor: COLORS.green },
  allGoodText:  { color: COLORS.greenDark, fontSize: 11, fontWeight: '700' },
  fourCol:      { gap: 10, marginBottom: 10, alignItems: 'flex-start' },
  quarterCard:  { flex: 1, marginBottom: 0 },
  tempRow:      { justifyContent: 'space-between', paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: '#f0f8f3' },
  tempLabel:    { flex: 1, color: COLORS.textMuted, fontSize: 11 },
  tempVal:      { color: COLORS.textPrimary, fontSize: 13, fontWeight: '700', marginRight: 6 },
  dot:          { width: 6, height: 6, borderRadius: 3 },
  avgRow:       { justifyContent: 'space-between', paddingTop: 6 },
  avgLabel:     { color: COLORS.green, fontSize: 11, fontWeight: '700' },
  avgVal:       { color: COLORS.textPrimary, fontSize: 15, fontWeight: '800' },
  bigNum:       { fontSize: 28, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -1, marginBottom: 4 },
  bigUnit:      { fontSize: 13, fontWeight: '400', color: COLORS.textFaint },
  humDrops:     { gap: 3, marginVertical: 6 },
  optimalText:  { fontSize: 11, fontWeight: '700', color: COLORS.greenDark, marginVertical: 4 },
  phStrip:      { flexDirection: 'row', height: 8, borderRadius: 4, overflow: 'hidden', marginTop: 8 },
  phSeg:        { flex: 1 },
  phHint:       { fontSize: 8, color: COLORS.textFaint },
  rangeHint:    { fontSize: 9, color: COLORS.textFaint, marginTop: 5 },
  stageRow:     { flexDirection: 'row', gap: 8, marginTop: 10, marginBottom: 12 },
  stageBox:     { flex: 1, backgroundColor: COLORS.bgCardAlt, borderRadius: RADIUS.md, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  stageBoxActive:{ backgroundColor: COLORS.greenLight, borderColor: COLORS.greenDark },
  stagePct:     { color: COLORS.textPrimary, fontSize: 18, fontWeight: '800' },
  stageName:    { color: COLORS.textMuted, fontSize: 10, marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.5 },
  stageBar:     { width: '100%', height: 3, backgroundColor: COLORS.border, borderRadius: 2, marginTop: 6, overflow: 'hidden' },
  stageBarFill: { height: '100%', backgroundColor: COLORS.green, borderRadius: 2 },
  growthFooter: { flexDirection: 'row', justifyContent: 'space-around', paddingTop: 10, borderTopWidth: 1, borderTopColor: COLORS.border },
  growthMetaLabel:{ color: COLORS.textFaint, fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.5 },
  growthMetaVal:  { color: COLORS.textPrimary, fontSize: 20, fontWeight: '800', marginTop: 2 },
});
