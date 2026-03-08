// ============================================================
//  HydroSense — Shared Components  (Light Green Theme)
//  File: src/components/SharedComponents.js
// ============================================================
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../utils/theme';

// ── Card ──────────────────────────────────────────────────────
export function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

// ── CardLabel ─────────────────────────────────────────────────
export function CardLabel({ children, style }) {
  return <Text style={[styles.cardLabel, style]}>{children}</Text>;
}

// ── Badge ─────────────────────────────────────────────────────
export function Badge({ label, type = 'success', size = 'md' }) {
  const map = {
    success: { bg: COLORS.successBg,  border: COLORS.successBorder, text: COLORS.success },
    warning: { bg: COLORS.warningBg,  border: COLORS.warningBorder, text: COLORS.warning },
    danger:  { bg: COLORS.dangerBg,   border: COLORS.dangerBorder,  text: COLORS.danger  },
    info:    { bg: COLORS.infoBg,     border: COLORS.infoBorder,    text: COLORS.info    },
  };
  const c = map[type] || map.success;
  return (
    <View style={[styles.badge, { backgroundColor: c.bg, borderColor: c.border }, size === 'sm' && styles.badgeSm]}>
      <Text style={[styles.badgeText, { color: c.text }, size === 'sm' && styles.badgeTextSm]}>{label}</Text>
    </View>
  );
}

// ── AlertBanner ───────────────────────────────────────────────
export function AlertBanner({ message, type = 'warning' }) {
  const map = {
    warning: { bg: COLORS.warningBg, border: COLORS.warningBorder, text: COLORS.warning },
    danger:  { bg: COLORS.dangerBg,  border: COLORS.dangerBorder,  text: COLORS.danger  },
  };
  const c = map[type] || map.warning;
  return (
    <View style={[styles.alert, { backgroundColor: c.bg, borderColor: c.border }]}>
      <Text style={[styles.alertText, { color: c.text }]}>{message}</Text>
    </View>
  );
}

// ── SensorBar ─────────────────────────────────────────────────
export function SensorBar({ value, max = 100, color }) {
  const pct = Math.min(Math.max((value / max) * 100, 0), 100);
  return (
    <View style={styles.barBg}>
      <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: color || COLORS.green }]} />
    </View>
  );
}

// ── ScreenHeader ──────────────────────────────────────────────
export function ScreenHeader({ title, subtitle, right }) {
  return (
    <View style={styles.screenHeader}>
      <View style={{ flex: 1 }}>
        <Text style={styles.screenTitle}>{title}</Text>
        {subtitle ? <Text style={styles.screenSubtitle}>{subtitle}</Text> : null}
      </View>
      {right && <View>{right}</View>}
    </View>
  );
}

// ── BigMetric ─────────────────────────────────────────────────
export function BigMetric({ value, unit }) {
  return (
    <Text style={styles.bigMetric}>
      {value}<Text style={styles.bigUnit}> {unit}</Text>
    </Text>
  );
}

// ── Row ───────────────────────────────────────────────────────
export function Row({ children, style }) {
  return <View style={[styles.row, style]}>{children}</View>;
}

// ── Divider ───────────────────────────────────────────────────
export function Divider() {
  return <View style={styles.divider} />;
}

// ── PrimaryButton ─────────────────────────────────────────────
export function PrimaryButton({ label, onPress, style }) {
  return (
    <TouchableOpacity style={[styles.primaryBtn, style]} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.primaryBtnText}>{label}</Text>
    </TouchableOpacity>
  );
}

// ── GhostButton ───────────────────────────────────────────────
export function GhostButton({ label, onPress, style }) {
  return (
    <TouchableOpacity style={[styles.ghostBtn, style]} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.ghostBtnText}>{label}</Text>
    </TouchableOpacity>
  );
}

// ── Loader ────────────────────────────────────────────────────
export function Loader() {
  return (
    <View style={styles.loaderWrap}>
      <Text style={styles.loaderText}>Loading…</Text>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────
const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm + 4,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#1e7a45',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: COLORS.textMuted,
    marginBottom: SPACING.sm,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    marginTop: 4,
  },
  badgeSm:     { paddingHorizontal: 7, paddingVertical: 2 },
  badgeText:   { fontSize: 11, fontWeight: '700' },
  badgeTextSm: { fontSize: 9 },
  alert: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm + 4,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    marginBottom: SPACING.sm + 4,
  },
  alertText:   { fontSize: 12, fontWeight: '500', flex: 1 },
  barBg: {
    height: 5,
    backgroundColor: '#e8f5ed',
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: SPACING.sm,
  },
  barFill:     { height: '100%', borderRadius: 3 },
  screenHeader:{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: SPACING.lg, marginTop: SPACING.sm },
  screenTitle: { color: COLORS.textPrimary, fontSize: 26, fontWeight: '800', letterSpacing: -0.8 },
  screenSubtitle:{ color: COLORS.textMuted, fontSize: 12, marginTop: 1 },
  bigMetric:   { fontSize: 34, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -1 },
  bigUnit:     { fontSize: 15, fontWeight: '400', color: COLORS.textFaint },
  row:         { flexDirection: 'row', alignItems: 'center' },
  divider:     { height: 1, backgroundColor: '#edf5f0', marginVertical: SPACING.sm },
  primaryBtn:  { backgroundColor: COLORS.greenDark, borderRadius: RADIUS.md, paddingVertical: 12, alignItems: 'center', flex: 1 },
  primaryBtnText:{ color: '#fff', fontWeight: '800', fontSize: 13 },
  ghostBtn:    { backgroundColor: COLORS.bgCard, borderRadius: RADIUS.md, paddingVertical: 12, paddingHorizontal: 18, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  ghostBtnText:{ color: COLORS.textPrimary, fontWeight: '700', fontSize: 13 },
  loaderWrap:  { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loaderText:  { color: COLORS.textMuted, fontSize: 16 },
});
