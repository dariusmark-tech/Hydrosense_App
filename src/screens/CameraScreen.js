// ============================================================
//  HydroSense — Camera Analysis Screen  (Light Green Theme)
//  File: src/screens/CameraScreen.js
// ============================================================
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, StatusBar, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Badge, Row, CardLabel } from '../components/SharedComponents';
import { COLORS, SPACING, RADIUS } from '../utils/theme';
import { MOCK_GROWTH, NUTRIENT_TARGETS } from '../utils/theme';

const STAGE = 'Vegetative';
const TARGETS = { n: 200, p: 60, k: 220 };
const CURRENT = { n: 180, p: 60,  k: 240 };

function nutStatus(curr, tgt) {
  const d = ((curr - tgt) / tgt) * 100;
  if (d > 10)  return { type: 'danger',  label: '↓ Decrease' };
  if (d < -10) return { type: 'warning', label: '↑ Increase' };
  return                { type: 'success', label: '✓ Optimal'  };
}

export default function CameraScreen() {
  const [hasImage, setHasImage] = useState(false);

  return (
    <SafeAreaView style={s.screen} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <Text style={s.title}>Camera Analysis</Text>
        <Text style={s.subtitle}>Capture & classify plant growth</Text>

        {/* Meta row */}
        <Row style={s.metaRow}>
          <View style={s.metaCard}>
            <Text style={s.metaIcon}>📅</Text>
            <View>
              <Text style={s.metaLabel}>Date & Time</Text>
              <Text style={s.metaVal}>2/22/26 | 8:00 AM</Text>
            </View>
          </View>
          <View style={s.metaCard}>
            <Text style={[s.metaIcon, { color: COLORS.green }]}>●</Text>
            <View>
              <Text style={s.metaLabel}>Status</Text>
              <Text style={[s.metaVal, { color: COLORS.greenDark }]}>Connected</Text>
            </View>
          </View>
        </Row>

        {/* Camera Preview */}
        <View style={s.camPreview}>
          <Text style={s.camIcon}>📷</Text>
          <Text style={s.camText}>No image captured yet</Text>
          <Text style={s.camHint}>Tap Capture Image to take a photo</Text>
        </View>

        {/* Buttons */}
        <Row style={s.btnRow}>
          <TouchableOpacity style={s.btnMain} onPress={() => setHasImage(true)}>
            <Text style={s.btnMainText}>📸  Capture Image</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.btnGhost} onPress={() => setHasImage(false)}>
            <Text style={s.btnGhostText}>↺  Refresh</Text>
          </TouchableOpacity>
        </Row>

        {/* Growth Classification */}
        <Card>
          <Row style={{ justifyContent: 'space-between', marginBottom: 0 }}>
            <CardLabel style={{ marginBottom: 0 }}>🌿 Growth Stage Classification</CardLabel>
            <Badge label="90% confidence" size="sm" />
          </Row>
          <Row style={s.stageRow}>
            {[['Seedling',8],['Vegetative',90],['Fruiting',24]].map(([stage,pct])=>(
              <View key={stage} style={[s.stageBox, stage===STAGE && s.stageBoxActive]}>
                <Text style={[s.stagePct, stage===STAGE && { color: COLORS.greenDark }]}>{pct}%</Text>
                <Text style={[s.stageName, stage===STAGE && { color: COLORS.greenDark }]}>{stage}</Text>
                <View style={s.stageBar}><View style={[s.stageBarFill,{width:`${pct}%`}]}/></View>
              </View>
            ))}
          </Row>
          <Row style={s.growthFooter}>
            <View style={{ alignItems: 'center' }}>
              <Text style={s.gmLabel}>Est. Days to Next Stage</Text>
              <Text style={s.gmVal}>21</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={s.gmLabel}>Predicted Harvest</Text>
              <Text style={[s.gmVal, { fontSize: 14, color: COLORS.greenDark }]}>May 5, 2026</Text>
            </View>
          </Row>
        </Card>

        {/* Nutrient Adjustments */}
        <Card>
          <Row style={{ justifyContent: 'space-between', marginBottom: SPACING.md }}>
            <CardLabel style={{ marginBottom: 0 }}>⚗️ Recommended Nutrient Adjustments</CardLabel>
          </Row>

          {[
            { label: 'Nitrogen (N)',    curr: CURRENT.n, tgt: TARGETS.n, color: COLORS.chartAmber  },
            { label: 'Phosphorus (P)', curr: CURRENT.p, tgt: TARGETS.p, color: COLORS.green        },
            { label: 'Potassium (K)',  curr: CURRENT.k, tgt: TARGETS.k, color: COLORS.chartBlue    },
          ].map(({ label, curr, tgt, color }) => {
            const st = nutStatus(curr, tgt);
            return (
              <View key={label} style={s.nutRow}>
                <Row style={{ justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text style={s.nutLabel}>{label}</Text>
                  <Badge label={st.label} type={st.type} size="sm" />
                </Row>
                <Row style={{ justifyContent: 'flex-end', gap: 16, marginBottom: 5 }}>
                  <Text style={s.nutMeta}>Current: <Text style={s.nutMetaBold}>{curr} ppm</Text></Text>
                  <Text style={s.nutMeta}>Target: <Text style={s.nutMetaBold}>{tgt} ppm</Text></Text>
                </Row>
                <View style={s.barBg}>
                  <View style={[s.barFill, { width: `${(curr/400)*100}%`, backgroundColor: color }]} />
                </View>
              </View>
            );
          })}

          <Row style={s.exportRow}>
            <TouchableOpacity style={[s.exportBtn, { borderColor: COLORS.dangerBorder }]}>
              <Text style={{ color: COLORS.danger, fontWeight: '700', fontSize: 12 }}>📄 Export PDF</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.exportBtn, { borderColor: COLORS.successBorder }]}>
              <Text style={{ color: COLORS.success, fontWeight: '700', fontSize: 12 }}>📊 Export CSV</Text>
            </TouchableOpacity>
          </Row>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen:       { flex: 1, backgroundColor: COLORS.bg },
  scroll:       { padding: SPACING.md, paddingBottom: 40 },
  title:        { color: COLORS.textPrimary, fontSize: 26, fontWeight: '800', letterSpacing: -0.8, marginTop: SPACING.sm },
  subtitle:     { color: COLORS.textMuted, fontSize: 12, marginBottom: SPACING.md },
  metaRow:      { gap: 10, marginBottom: SPACING.sm + 4 },
  metaCard:     { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: COLORS.bgCardAlt, borderRadius: RADIUS.md, padding: SPACING.sm + 4, borderWidth: 1, borderColor: COLORS.border },
  metaIcon:     { fontSize: 18 },
  metaLabel:    { fontSize: 9, color: COLORS.textMuted, fontWeight: '600' },
  metaVal:      { fontSize: 12, fontWeight: '700', color: COLORS.textPrimary },
  camPreview:   { backgroundColor: COLORS.bgCardAlt, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, borderStyle: 'dashed', height: 160, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.sm + 4 },
  camIcon:      { fontSize: 32, marginBottom: 6 },
  camText:      { fontSize: 13, fontWeight: '600', color: COLORS.textMuted },
  camHint:      { fontSize: 10, color: COLORS.textFaint, marginTop: 3 },
  btnRow:       { gap: 8, marginBottom: SPACING.md },
  btnMain:      { flex: 1, backgroundColor: COLORS.greenDark, borderRadius: RADIUS.md, padding: 12, alignItems: 'center' },
  btnMainText:  { color: '#fff', fontWeight: '800', fontSize: 13 },
  btnGhost:     { backgroundColor: COLORS.bgCard, borderRadius: RADIUS.md, padding: 12, paddingHorizontal: 18, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  btnGhostText: { color: COLORS.textPrimary, fontWeight: '700', fontSize: 13 },
  stageRow:     { flexDirection: 'row', gap: 8, marginTop: 10, marginBottom: 12 },
  stageBox:     { flex: 1, backgroundColor: COLORS.bgCardAlt, borderRadius: RADIUS.md, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  stageBoxActive:{ backgroundColor: COLORS.greenLight, borderColor: COLORS.greenDark },
  stagePct:     { color: COLORS.textPrimary, fontSize: 18, fontWeight: '800' },
  stageName:    { color: COLORS.textMuted, fontSize: 10, marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.5 },
  stageBar:     { width: '100%', height: 3, backgroundColor: COLORS.border, borderRadius: 2, marginTop: 6, overflow: 'hidden' },
  stageBarFill: { height: '100%', backgroundColor: COLORS.green, borderRadius: 2 },
  growthFooter: { flexDirection: 'row', justifyContent: 'space-around', paddingTop: 10, borderTopWidth: 1, borderTopColor: COLORS.border },
  gmLabel:      { color: COLORS.textFaint, fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.5 },
  gmVal:        { color: COLORS.textPrimary, fontSize: 20, fontWeight: '800', marginTop: 2 },
  nutRow:       { marginBottom: SPACING.md },
  nutLabel:     { fontSize: 13, fontWeight: '600', color: COLORS.textPrimary },
  nutMeta:      { fontSize: 11, color: COLORS.textMuted },
  nutMetaBold:  { fontWeight: '700', color: COLORS.textPrimary },
  barBg:        { height: 5, backgroundColor: '#e8f5ed', borderRadius: 3, overflow: 'hidden' },
  barFill:      { height: '100%', borderRadius: 3 },
  exportRow:    { gap: 8, marginTop: SPACING.md, paddingTop: SPACING.md, borderTopWidth: 1, borderTopColor: COLORS.border },
  exportBtn:    { flex: 1, borderRadius: RADIUS.sm, padding: 10, alignItems: 'center', borderWidth: 1, backgroundColor: COLORS.bgCard },
});
