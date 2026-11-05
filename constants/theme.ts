import colors from '../assets/colors/colors';

// Brand colors come from assets/colors/colors.ts; everything else is derived here.
// Contrast ratios (WCAG 2.1) are noted for each text/fill pairing.

export const brand = {
  blue: colors.light_blue,
  orange: colors.orange,
  red: colors.red,
  purple: colors.purple,
} as const;

export const text = {
  primary: '#1a1a1a', // 17.4:1 on white
  secondary: '#5c5c5c', // 6.7:1 on white
  inverse: '#ffffff',
  onBlue: '#1a1a1a', // 6.6:1 on brand blue
  onOrange: '#1a1a1a', // 6.9:1 on brand orange
  onRed: '#ffffff', // 6.3:1 on brand red
  onPurple: '#ffffff', // 8.0:1 on brand purple
  onSuccess: '#ffffff', // 5.3:1 on success
  link: brand.purple, // 8.0:1 on white
} as const;

export const surface = {
  background: '#f5f5f5',
  card: '#ffffff',
  transparent: 'transparent',
} as const;

export const border = {
  subtle: '#dddddd',
  strong: '#8a8a8a', // 3.5:1 on white, meets non-text contrast
  focus: brand.blue,
} as const;

// No brand green exists, so success uses a dark green that keeps white text readable.
export const status = {
  success: '#1e7b34',
  danger: brand.red,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 4,
  md: 8,
  lg: 12,
  pill: 999,
} as const;

export const touchTarget = {
  min: 44,
} as const;

const theme = { brand, text, surface, border, status, spacing, radius, touchTarget };

export default theme;
