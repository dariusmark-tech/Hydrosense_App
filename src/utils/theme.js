// ============================================================
//  HydroSense — Theme & Constants  (Light Green Theme)
//  File: src/utils/theme.js
// ============================================================

export const COLORS = {
  bg:           '#eef5f0',
  bgCard:       '#ffffff',
  bgCardAlt:    '#f5faf7',
  bgModal:      '#ffffff',
  greenDeep:    '#1a3a24',
  greenDark:    '#1e7a45',
  green:        '#2fa660',
  greenAccent:  '#4caf7d',
  greenLight:   '#e6f5ec',
  greenBorder:  '#dceee3',
  greenMuted:   '#7da98a',
  greenFaint:   '#aac4b0',
  border:       '#dceee3',
  borderHigh:   '#c3e6ce',
  textPrimary:  '#1a3a24',
  textSecondary:'#4a6b52',
  textMuted:    '#7da98a',
  textFaint:    '#aac4b0',
  white:        '#ffffff',
  success:      '#1e7a45',
  successBg:    '#e6f5ec',
  successBorder:'#c3e6ce',
  warning:      '#92400e',
  warningBg:    '#fef3c7',
  warningBorder:'#fde68a',
  danger:       '#991b1b',
  dangerBg:     '#fee2e2',
  dangerBorder: '#fecaca',
  info:         '#1e40af',
  infoBg:       '#dbeafe',
  infoBorder:   '#bfdbfe',
  chartGreen:   '#1e7a45',
  chartPurple:  '#7c3aed',
  chartBlue:    '#3b82f6',
  chartAmber:   '#f59e0b',
};

export const FONTS = {
  bold:    { fontWeight: '800' },
  semiBold:{ fontWeight: '700' },
  medium:  { fontWeight: '600' },
  regular: { fontWeight: '400' },
  light:   { fontWeight: '300' },
};

export const SPACING = { xs:4, sm:8, md:16, lg:24, xl:32, xxl:48 };
export const RADIUS  = { sm:8, md:12, lg:16, xl:20, full:100 };

export const OPTIMAL_RANGES = {
  temp:     { min: 20, max: 28 },
  humidity: { min: 55, max: 75 },
  ph:       { min: 5.5, max: 7.0 },
  tds:      { min: 800, max: 1200 },
};

export const GROWTH_STAGES = ['Seedling', 'Vegetative', 'Fruiting'];

export const NUTRIENT_TARGETS = {
  Seedling:   { n: 100, p: 50,  k: 150 },
  Vegetative: { n: 200, p: 60,  k: 220 },
  Fruiting:   { n: 150, p: 100, k: 300 },
};
