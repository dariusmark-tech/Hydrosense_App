// ============================================================
//  HydroSense — Dashboard Screen  (Light Green Theme)
//  File: src/screens/DashboardScreen.js
// ============================================================
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View, Text, ScrollView, StyleSheet, RefreshControl,
  StatusBar, Dimensions, TouchableOpacity, Modal, Animated,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Badge, AlertBanner, SensorBar, Row, CardLabel } from '../components/SharedComponents';
import { COLORS, SPACING, RADIUS, OPTIMAL_RANGES } from '../utils/theme';
import { getLatestReadings, MOCK_GROWTH } from '../utils/api';

const { width: SCREEN_W } = Dimensions.get('window');

function getSensorStatus(key, value) {
  const r = OPTIMAL_RANGES[key];
  if (!r) return 'success';
  if (value < r.min || value > r.max) return 'danger';
  const slack = (r.max - r.min) * 0.1;
  if (value < r.min + slack || value > r.max - slack) return 'warning';
  return 'success';
}

// ── Mini bar chart (replace bars with VictoryChart when ready) ────────────────
function MiniChart({ color }) {
  const bars = [40, 55, 48, 62, 58, 70, 65, 72, 68, 75];
  return (
    <View style={gc.wrap}>
      <View style={gc.bars}>
        {bars.map((h, i) => (
          <View
            key={i}
            style={[
              gc.bar,
              {
                height: h,
                backgroundColor: color,
                opacity: 0.3 + (i / bars.length) * 0.7,
              },
            ]}
          />
        ))}
      </View>
      <View style={gc.xRow}>
        <Text style={gc.xLabel}>6h ago</Text>
        <Text style={gc.xLabel}>3h ago</Text>
        <Text style={gc.xLabel}>Now</Text>
      </View>
    </View>
  );
}

export default function DashboardScreen() {
  const [readings,   setReadings]   = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [alerts,     setAlerts]     = useState([]);
  const [graphOpen,  setGraphOpen]  = useState(false);
  const [graphTab,   setGraphTab]   = useState(0); // 0 = Temp, 1 = Humidity

  const slideAnim  = useRef(new Animated.Value(600)).current;
  const swipeRef   = useRef(null);

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

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // Open graph panel — slide up from bottom
  const openGraph = (tabIndex = 0) => {
    setGraphTab(tabIndex);
    setGraphOpen(true);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 60,
      friction: 12,
    }).start();
  };

  // Close graph panel — slide back down
  const closeGraph = () => {
    Animated.timing(slideAnim, {
      toValue: 600,
      duration: 220,
      useNativeDriver: true,
    }).start(() => setGraphOpen(false));
  };

  // Switch tab and scroll swipeable pages
  const switchTab = (idx) => {
    setGraphTab(idx);
    swipeRef.current?.scrollTo({ x: idx * (SCREEN_W - 32), animated: true });
  };

  if (!readings) return (
    <SafeAreaView style={s.screen} edges={['top']}>
      <View style={s.centered}>
        <Text style={s.loadingText}>Loading…</Text>
      </View>
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={s.screen} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      <ScrollView
        contentContainerStyle={s.scroll}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.greenDark}
          />
        }
        showsVerticalScrollIndicator={false}
      >

        {/* ── HEADER ────────────────────────────────────────────── */}
       <View style={s.header}>
  <View style={s.logoRow}>
    <Image
      source={require('../../assets/logo.png')}
      style={s.logoImg}
      resizeMode="contain"
    />
    <Text style={s.title}>Dashboard</Text>
  </View>
          {alerts.length === 0 && (
            <View style={s.allGoodPill}>
              <View style={s.pulseDot} />
              <Text style={s.allGoodText}>All Optimal</Text>
            </View>
          )}
        </View>

        {/* ── ALERTS ────────────────────────────────────────────── */}
        {alerts.map(a => (
          <AlertBanner key={a.id} message={a.msg} type={a.type} />
        ))}

        {/* ── COMBINED TEMPERATURE + HUMIDITY CARD ────────────── */}
        <Card style={{ marginBottom: CARD_GAP }}>

          {/* Temperature row — tappable, opens graph on Temp tab */}
          <TouchableOpacity
            style={s.sensorRow}
            activeOpacity={0.7}
            onPress={() => openGraph(0)}
          >
            <View style={s.sensorLeft}>
              <Text style={s.sensorLabel}>Temperature</Text>
              {/* S1 / S2 / S3 mini chips */}
              <View style={s.chipRow}>
                {[readings.temp.s1, readings.temp.s2, readings.temp.s3].map((val, i) => (
                  <View key={i} style={s.chip}>
                    <View style={[s.chipDot, {
                      backgroundColor: getSensorStatus('temp', val) === 'success'
                        ? COLORS.green : COLORS.chartAmber,
                    }]} />
                    <Text style={s.chipText}>S{i + 1}  {val}°</Text>
                  </View>
                ))}
              </View>
            </View>
            <View style={s.sensorRight}>
              <Text style={s.bigVal}>
                {readings.temp.avg}
                <Text style={s.bigUnit}>°C</Text>
              </Text>
              <Text style={s.metaText}>avg.</Text>
            </View>
          </TouchableOpacity>

          {/* Divider */}
          <View style={s.divider} />

          {/* Humidity row — tappable, opens graph on Humidity tab */}
          <TouchableOpacity
            style={s.sensorRow}
            activeOpacity={0.7}
            onPress={() => openGraph(1)}
          >
            <View style={s.sensorLeft}>
              <Text style={s.sensorLabel}>Humidity</Text>
              <SensorBar
                value={readings.humidity}
                max={100}
                color={getSensorStatus('humidity', readings.humidity) === 'success'
                  ? COLORS.green : COLORS.chartAmber}
                style={{ marginTop: 8, width: '90%' }}
              />
            </View>
            <View style={s.sensorRight}>
              <Text style={s.bigVal}>
                {readings.humidity}
                <Text style={s.bigUnit}>%</Text>
              </Text>
              <Text style={s.metaText}>avg.</Text>
            </View>
          </TouchableOpacity>

          {/* Graph button */}
          <TouchableOpacity
            style={s.graphBtn}
            activeOpacity={0.75}
            onPress={() => openGraph(0)}
          >
            <Text style={s.graphBtnLabel}>Graph</Text>
            <Text style={s.graphBtnArrow}>→</Text>
          </TouchableOpacity>

        </Card>

        {/* ── GROWTH STAGE — full width ────────────────────────── */}
        <Card>
          <View style={s.cardHeaderRow}>
            <CardLabel style={{ marginBottom: 0 }}>🌿 Growth Stage Classification</CardLabel>
            <Badge
              label={`${MOCK_GROWTH.confidence.Vegetative}% confidence`}
              size="sm"
            />
          </View>

          <View style={s.stageRow}>
            {Object.entries(MOCK_GROWTH.confidence).map(([stage, pct]) => (
              <View
                key={stage}
                style={[s.stageBox, stage === MOCK_GROWTH.stage && s.stageBoxActive]}
              >
                <Text style={[
                  s.stagePct,
                  stage === MOCK_GROWTH.stage && { color: COLORS.greenDark },
                ]}>
                  {pct}%
                </Text>
                <Text style={[
                  s.stageName,
                  stage === MOCK_GROWTH.stage && { color: COLORS.greenDark },
                ]}>
                  {stage}
                </Text>
                <View style={s.stageBar}>
                  <View style={[s.stageBarFill, { width: `${pct}%` }]} />
                </View>
              </View>
            ))}
          </View>

          <View style={s.growthFooter}>
            <View style={{ alignItems: 'center' }}>
              <Text style={s.growthMetaLabel}>Est. Days to Next Stage</Text>
              <Text style={s.growthMetaVal}>{MOCK_GROWTH.daysToNext}</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={s.growthMetaLabel}>Predicted Harvest</Text>
              <Text style={[s.growthMetaVal, { fontSize: 14, color: COLORS.greenDark }]}>
                {MOCK_GROWTH.harvestDate}
              </Text>
            </View>
          </View>
        </Card>

      </ScrollView>

      {/* ════════════════════════════════════════════════════════
          GRAPH BOTTOM SHEET  (slides up as a modal)
          ════════════════════════════════════════════════════════ */}
      <Modal
        visible={graphOpen}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={closeGraph}
      >
        {/* Dimmed backdrop — tap to close */}
        <TouchableOpacity
          style={gs.backdrop}
          activeOpacity={1}
          onPress={closeGraph}
        />

        {/* Sliding panel */}
        <Animated.View style={[gs.panel, { transform: [{ translateY: slideAnim }] }]}>

          {/* Drag handle */}
          <View style={gs.handle} />

          {/* Panel header: ← back  |  GRAPHS */}
          <View style={gs.panelHeader}>
            <TouchableOpacity onPress={closeGraph} style={gs.backBtn}>
              <Text style={gs.backArrow}>←</Text>
              <Text style={gs.backLabel}>back</Text>
            </TouchableOpacity>
            <Text style={gs.panelTitle}>GRAPHS</Text>
            <View style={{ width: 64 }} />
          </View>

          {/* Segment tabs: Temperature | Humidity */}
          <View style={gs.tabs}>
            {['Temperature', 'Humidity'].map((label, i) => (
              <TouchableOpacity
                key={label}
                style={[gs.tab, graphTab === i && gs.tabActive]}
                onPress={() => switchTab(i)}
                activeOpacity={0.75}
              >
                <Text style={[gs.tabText, graphTab === i && gs.tabTextActive]}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Horizontally swipeable chart pages */}
          <ScrollView
            ref={swipeRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onMomentumScrollEnd={e => {
              const page = Math.round(
                e.nativeEvent.contentOffset.x / (SCREEN_W - 32)
              );
              setGraphTab(page);
            }}
            style={{ flex: 1 }}
            contentContainerStyle={{ flexDirection: 'row' }}
          >

            {/* ── PAGE 1: Temperature ───────────────────────────── */}
            <View style={[gs.page, { width: SCREEN_W - 32 }]}>
              <View style={gs.chartCard}>
                <View style={gs.chartHeader}>
                  <Text style={gs.chartTitle}>TEMPERATURE</Text>
                  <Badge label={`${readings.temp.avg}°C avg`} type="success" size="sm" />
                </View>
                <MiniChart color={COLORS.greenDark} />
                {/* 3-sensor detail grid */}
                <View style={gs.sensorGrid}>
                  {[
                    { label: 'Sensor 1', val: readings.temp.s1 },
                    { label: 'Sensor 2', val: readings.temp.s2 },
                    { label: 'Sensor 3', val: readings.temp.s3 },
                  ].map((sr, i) => (
                    <View key={i} style={gs.sensorBox}>
                      <View style={[gs.sensorDot, {
                        backgroundColor: getSensorStatus('temp', sr.val) === 'success'
                          ? COLORS.green : COLORS.chartAmber,
                      }]} />
                      <Text style={gs.sensorBoxLabel}>{sr.label}</Text>
                      <Text style={gs.sensorBoxVal}>{sr.val}°C</Text>
                    </View>
                  ))}
                </View>
                <Text style={gs.rangeNote}>Optimal range: 20–28 °C</Text>
              </View>
            </View>

            {/* ── PAGE 2: Humidity ──────────────────────────────── */}
            <View style={[gs.page, { width: SCREEN_W - 32 }]}>
              <View style={gs.chartCard}>
                <View style={gs.chartHeader}>
                  <Text style={gs.chartTitle}>HUMIDITY</Text>
                  <Badge label={`${readings.humidity}%`} type="success" size="sm" />
                </View>
                <MiniChart color={COLORS.green} />
                {/* 3-box detail row */}
                <View style={gs.humRow}>
                  {[
                    { label: 'Current',  val: `${readings.humidity}%` },
                    { label: 'Status',   val: 'Optimal', green: true },
                    { label: 'Target',   val: '55–75%' },
                  ].map(({ label, val, green }) => (
                    <View key={label} style={gs.humBox}>
                      <Text style={gs.humBoxLabel}>{label}</Text>
                      <Text style={[gs.humBoxVal, green && { color: COLORS.greenDark }]}>
                        {val}
                      </Text>
                    </View>
                  ))}
                </View>
                <SensorBar value={readings.humidity} max={100} color={COLORS.green} />
                <Text style={gs.rangeNote}>Optimal range: 55–75 %</Text>
              </View>
            </View>

          </ScrollView>

          {/* Swipe indicator dots */}
          <View style={gs.dots}>
            {[0, 1].map(i => (
              <View key={i} style={[gs.dot, graphTab === i && gs.dotActive]} />
            ))}
          </View>

        </Animated.View>
      </Modal>

    </SafeAreaView>
  );
}

// ── LAYOUT CONSTANTS ──────────────────────────────────────────────────────────
const PAGE_PAD = SPACING.md;
const CARD_GAP = 10;
const USABLE_W = SCREEN_W - PAGE_PAD * 2;

// ── MAIN STYLES ───────────────────────────────────────────────────────────────
const s = StyleSheet.create({
   logoRow: { flexDirection: 'row', alignItems: 'center', gap: 1,},
  logoImg: { width: 70, height: 70,},
  screen:      { flex: 1, backgroundColor: COLORS.bg },
  scroll:      { padding: PAGE_PAD, paddingBottom: 40 },
  centered:    { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: COLORS.textMuted, fontSize: 16 },

  // Header
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: SPACING.lg, marginTop: SPACING.sm,
  },
  greeting:    { color: COLORS.textMuted, fontSize: 13 },
  title:       { color: COLORS.textPrimary, fontSize: 28, fontWeight: '800', letterSpacing: -1 },
  allGoodPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: COLORS.greenLight,
    borderWidth: 1, borderColor: COLORS.borderHigh,
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: RADIUS.full,
  },
  pulseDot:    { width: 7, height: 7, borderRadius: 10, backgroundColor: COLORS.green },
  allGoodText: { color: COLORS.greenDark, fontSize: 11, fontWeight: '700' },

  // Combined sensor card
  sensorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  sensorLeft:  { flex: 1, paddingRight: 8 },
  sensorRight: { alignItems: 'flex-end' },
  sensorLabel: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 8 },
  bigVal:      { fontSize: 30, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -1 },
  bigUnit:     { fontSize: 14, fontWeight: '400', color: COLORS.textFaint },
  metaText:    { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },

  // S1/S2/S3 chips
  chipRow:  { flexDirection: 'row', gap: 6 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: COLORS.bgCardAlt,
    borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3,
    borderWidth: 1, borderColor: COLORS.border,
  },
  chipDot:  { width: 5, height: 5, borderRadius: 3 },
  chipText: { fontSize: 11, color: COLORS.textMuted, fontWeight: '600' },

  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: -16, // bleed to card edge
  },

  // Graph button
  graphBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    alignSelf: 'flex-end',
    marginTop: 12,
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: RADIUS.full,
    borderWidth: 1, borderColor: COLORS.greenDark,
    backgroundColor: COLORS.greenLight,
  },
  graphBtnLabel: { color: COLORS.greenDark, fontSize: 13, fontWeight: '700' },
  graphBtnArrow: { color: COLORS.greenDark, fontSize: 14 },

  // Card header row (growth stage card)
  cardHeaderRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: SPACING.sm,
  },

  // Growth Stage (unchanged)
  stageRow: { flexDirection: 'row', gap: 8, marginTop: 10, marginBottom: 12 },
  stageBox: {
    flex: 1, backgroundColor: COLORS.bgCardAlt,
    borderRadius: RADIUS.md, padding: 12, alignItems: 'center',
    borderWidth: 1, borderColor: COLORS.border,
  },
  stageBoxActive: { backgroundColor: COLORS.greenLight, borderColor: COLORS.greenDark },
  stagePct:       { color: COLORS.textPrimary, fontSize: 18, fontWeight: '800' },
  stageName: {
    color: COLORS.textMuted, fontSize: 10,
    marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.5,
  },
  stageBar: {
    width: '100%', height: 3,
    backgroundColor: COLORS.border, borderRadius: 2,
    marginTop: 6, overflow: 'hidden',
  },
  stageBarFill:    { height: '100%', backgroundColor: COLORS.green, borderRadius: 2 },
  growthFooter: {
    flexDirection: 'row', justifyContent: 'space-around',
    paddingTop: 10, borderTopWidth: 1, borderTopColor: COLORS.border,
  },
  growthMetaLabel: {
    color: COLORS.textFaint, fontSize: 9,
    textTransform: 'uppercase', letterSpacing: 0.5,
  },
  growthMetaVal:   { color: COLORS.textPrimary, fontSize: 20, fontWeight: '800', marginTop: 2 },
});

// ── GRAPH PANEL STYLES ────────────────────────────────────────────────────────
const gs = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  panel: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: '82%',
    backgroundColor: COLORS.bg,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 16,
    paddingBottom: 28,
  },
  handle: {
    width: 40, height: 4,
    backgroundColor: COLORS.border, borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10, marginBottom: 4,
  },

  // Panel header
  panelHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
    marginBottom: 14,
  },
  backBtn:   { flexDirection: 'row', alignItems: 'center', gap: 4, width: 64 },
  backArrow: { color: COLORS.greenDark, fontSize: 17, fontWeight: '700' },
  backLabel: { color: COLORS.greenDark, fontSize: 14, fontWeight: '600' },
  panelTitle:{ color: COLORS.textPrimary, fontSize: 13, fontWeight: '800', letterSpacing: 1.5 },

  // Segment tabs
  tabs: {
    flexDirection: 'row',
    backgroundColor: COLORS.bgCardAlt,
    borderRadius: 10, padding: 3,
    marginBottom: 16,
  },
  tab: {
    flex: 1, paddingVertical: 9,
    borderRadius: 8, alignItems: 'center',
  },
  tabActive:      { backgroundColor: COLORS.greenDark },
  tabText:        { fontSize: 13, color: COLORS.textMuted, fontWeight: '600' },
  tabTextActive:  { color: COLORS.greenLight, fontWeight: '700' },

  // Chart pages
  page: { paddingHorizontal: 0 },
  chartCard: {
    backgroundColor: COLORS.bg,
    borderRadius: 14,
    borderWidth: 1, borderColor: COLORS.border,
    padding: 16,
  },
  chartHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 12,
  },
  chartTitle: {
    fontSize: 11, fontWeight: '800',
    color: COLORS.textMuted, letterSpacing: 1.5,
  },
  rangeNote: { fontSize: 10, color: COLORS.textFaint, marginTop: 10, textAlign: 'right' },

  // Temperature — 3-sensor grid
  sensorGrid: { flexDirection: 'row', gap: 8, marginTop: 14 },
  sensorBox: {
    flex: 1, alignItems: 'center',
    backgroundColor: COLORS.bgCardAlt,
    borderRadius: 8, paddingVertical: 10,
    borderWidth: 1, borderColor: COLORS.border,
  },
  sensorDot:      { width: 8, height: 8, borderRadius: 4, marginBottom: 5 },
  sensorBoxLabel: { fontSize: 10, color: COLORS.textMuted, marginBottom: 3 },
  sensorBoxVal:   { fontSize: 15, fontWeight: '800', color: COLORS.textPrimary },

  // Humidity — 3-box detail row
  humRow:   { flexDirection: 'row', gap: 8, marginTop: 12, marginBottom: 12 },
  humBox: {
    flex: 1, alignItems: 'center',
    backgroundColor: COLORS.bgCardAlt,
    borderRadius: 8, paddingVertical: 10,
    borderWidth: 1, borderColor: COLORS.border,
  },
  humBoxLabel: { fontSize: 10, color: COLORS.textMuted, marginBottom: 4 },
  humBoxVal:   { fontSize: 15, fontWeight: '800', color: COLORS.textPrimary },

  // Swipe indicator dots
  dots:     { flexDirection: 'row', justifyContent: 'center', gap: 6, paddingTop: 14 },
  dot:      { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.border },
  dotActive:{ width: 20, height: 6, borderRadius: 3, backgroundColor: COLORS.greenDark },
});

// ── MINI CHART STYLES ─────────────────────────────────────────────────────────
const gc = StyleSheet.create({
  wrap:  { height: 90, justifyContent: 'flex-end' },
  bars:  { flexDirection: 'row', alignItems: 'flex-end', gap: 3, height: 72 },
  bar:   { flex: 1, borderRadius: 3, minHeight: 4 },
  xRow:  { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  xLabel:{ fontSize: 9, color: COLORS.textFaint },
});
