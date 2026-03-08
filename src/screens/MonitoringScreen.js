// ============================================================
//  HydroSense — Monitoring Screen  (Light Green Theme)
//  File: src/screens/MonitoringScreen.js
// ============================================================
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Badge, SensorBar, Row, CardLabel, BigMetric } from '../components/SharedComponents';
import { COLORS, SPACING, RADIUS } from '../utils/theme';
import { MOCK_CHART_DATA } from '../utils/api';

const TIME_TABS = ['1h', '6h', '24h', '7d'];

export default function MonitoringScreen() {
  const [activeTime, setActiveTime] = useState('1h');

  return (
    <SafeAreaView style={s.screen} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <Text style={s.title}>Monitoring</Text>
        <Text style={s.subtitle}>Real-time sensor readings & trends</Text>

        {/* Time Tabs */}
        <Row style={s.timeTabs}>
          {TIME_TABS.map(t => (
            <TouchableOpacity key={t} style={[s.tt, activeTime === t && s.ttActive]} onPress={() => setActiveTime(t)}>
              <Text style={[s.ttText, activeTime === t && s.ttTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </Row>

        {/* Temperature */}
        <Card>
          <Row style={{ justifyContent: 'space-between', marginBottom: SPACING.sm }}>
            <CardLabel style={{ marginBottom: 0 }}>🌡️ Temperature</CardLabel>
            <Badge label="OPTIMAL · 24.4°C avg" type="success" size="sm" />
          </Row>
          {[['Sensor 1','22.4'],['Sensor 2','25.1'],['Sensor 3','25.7']].map(([l,v],i)=>(
            <Row key={i} style={s.sensorDetailRow}>
              <Text style={s.sdLabel}>{l}</Text>
              <Text style={s.sdVal}>{v} °C</Text>
              <View style={[s.dot,{backgroundColor:COLORS.green}]}/>
            </Row>
          ))}
          <View style={s.divider}/>
          <Row style={{justifyContent:'space-between'}}>
            <Text style={s.avgLabel}>Average</Text>
            <Text style={s.avgVal}>24.4 °C</Text>
          </Row>
          {/* Temp gradient bar */}
          <View style={s.gradBar}>
            <View style={[s.gradFill,{left:'61%'}]}/>
          </View>
          <Row style={{justifyContent:'space-between',marginBottom:SPACING.sm}}>
            {['0°C Cold','20°C','30°C','40°C Hot'].map(l=><Text key={l} style={s.gradLabel}>{l}</Text>)}
          </Row>
          <Text style={s.chartPlaceholder}>📈 Temp chart renders here (VictoryLine)</Text>
        </Card>

        {/* Humidity */}
        <Card>
          <Row style={{justifyContent:'space-between',marginBottom:SPACING.sm}}>
            <CardLabel style={{marginBottom:0}}>💧 Humidity</CardLabel>
            <Badge label="OPTIMAL" type="success" size="sm"/>
          </Row>
          <BigMetric value="62.1" unit="%" />
          <View style={s.humBar}>
            <View style={[s.humFill,{width:'62%'}]}/>
          </View>
          <Text style={s.rangeHint}>Filling: 62.1% — Target: 55–75%</Text>
          <Text style={s.chartPlaceholder}>📈 Humidity chart renders here (VictoryLine)</Text>
        </Card>

        {/* pH */}
        <Card>
          <Row style={{justifyContent:'space-between',marginBottom:SPACING.sm}}>
            <CardLabel style={{marginBottom:0}}>⚗️ pH Level</CardLabel>
            <Badge label="OPTIMAL" type="success" size="sm"/>
          </Row>
          <BigMetric value="6.29" unit="" />
          <View style={s.phFullScale}>
            {[{c:'#d63f3f',l:'1'},{c:'#e67e22',l:'2'},{c:'#f1c40f',l:'3'},{c:'#c8d444',l:'4'},{c:'#2ecc71',l:'5'},{c:'#27ae60',l:'6',a:true},{c:'#1a8a50',l:'7'},{c:'#2980b9',l:'8'},{c:'#1a5276',l:'9'},{c:'#6c3483',l:'10'},{c:'#4a235a',l:'11'},{c:'#2d1b40',l:'12'},{c:'#1a0d2e',l:'13'},{c:'#0d0618',l:'14'}]
            .map(seg=>(
              <View key={seg.l} style={[s.phSeg,{backgroundColor:seg.c},seg.a&&s.phActive]}>
                <Text style={s.phSegLabel}>{seg.l}</Text>
              </View>
            ))}
          </View>
          <Row style={{justifyContent:'space-between',marginTop:3,marginBottom:SPACING.sm}}>
            {['← Acidic','Neutral','Alkaline →'].map(l=><Text key={l} style={s.phHint}>{l}</Text>)}
          </Row>
          <Text style={s.chartPlaceholder}>📈 pH chart renders here (VictoryLine)</Text>
        </Card>

        {/* TDS */}
        <Card>
          <Row style={{justifyContent:'space-between',marginBottom:SPACING.sm}}>
            <CardLabel style={{marginBottom:0}}>🧪 TDS Nutrients</CardLabel>
            <Badge label="GOOD" type="success" size="sm"/>
          </Row>
          <BigMetric value="925" unit="ppm" />
          <SensorBar value={925} max={2000} color={COLORS.chartPurple} />
          <Text style={s.rangeHint}>Target range: 800–1200 ppm</Text>
          <Text style={s.chartPlaceholder}>📈 TDS chart renders here (VictoryLine)</Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen:      { flex: 1, backgroundColor: COLORS.bg },
  scroll:      { padding: SPACING.md, paddingBottom: 40 },
  title:       { color: COLORS.textPrimary, fontSize: 26, fontWeight: '800', letterSpacing: -0.8, marginTop: SPACING.sm },
  subtitle:    { color: COLORS.textMuted, fontSize: 12, marginBottom: SPACING.md },
  timeTabs:    { gap: 6, marginBottom: SPACING.md },
  tt:          { paddingHorizontal: 16, paddingVertical: 7, borderRadius: RADIUS.full, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.bgCard },
  ttActive:    { backgroundColor: COLORS.greenDark, borderColor: COLORS.greenDark },
  ttText:      { fontSize: 11, fontWeight: '700', color: COLORS.textMuted },
  ttTextActive:{ color: '#fff' },
  sensorDetailRow:{ justifyContent: 'space-between', paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: '#f0f8f3' },
  sdLabel:     { flex: 1, fontSize: 12, color: COLORS.textMuted },
  sdVal:       { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary, marginRight: 6 },
  dot:         { width: 7, height: 7, borderRadius: 4 },
  divider:     { height: 1, backgroundColor: COLORS.border, marginVertical: SPACING.sm },
  avgLabel:    { fontSize: 12, fontWeight: '700', color: COLORS.green },
  avgVal:      { fontSize: 16, fontWeight: '800', color: COLORS.textPrimary },
  gradBar:     { height: 10, borderRadius: 5, overflow: 'hidden', marginVertical: 8, backgroundColor: '#2980b9',
                 backgroundImage: 'linear-gradient(90deg,#2980b9,#27ae60,#f1c40f,#e67e22,#d63f3f)', position: 'relative' },
  gradFill:    { position: 'absolute', top: -2, width: 3, height: 14, backgroundColor: COLORS.textPrimary, borderRadius: 2 },
  gradLabel:   { fontSize: 8, color: COLORS.textFaint },
  humBar:      { height: 14, borderRadius: 7, backgroundColor: '#e8f5ed', overflow: 'hidden', marginVertical: 8 },
  humFill:     { height: '100%', backgroundColor: COLORS.green, borderRadius: 7 },
  rangeHint:   { fontSize: 10, color: COLORS.textMuted, marginBottom: 8 },
  phFullScale: { flexDirection: 'row', borderRadius: 6, overflow: 'hidden', height: 24, marginVertical: 10 },
  phSeg:       { flex: 1, alignItems: 'center', justifyContent: 'center' },
  phActive:    { borderWidth: 2, borderColor: COLORS.textPrimary },
  phSegLabel:  { fontSize: 7, color: 'rgba(255,255,255,0.7)', fontWeight: '700' },
  phHint:      { fontSize: 9, color: COLORS.textFaint },
  chartPlaceholder:{ backgroundColor: COLORS.bgCardAlt, borderRadius: 8, padding: 16, textAlign: 'center', color: COLORS.textMuted, fontSize: 11, borderWidth: 1, borderColor: COLORS.border, borderStyle: 'dashed' },
});
