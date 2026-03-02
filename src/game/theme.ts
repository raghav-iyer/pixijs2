import type { ZoneId } from './types';

export const ZONE_COLORS: Record<NonNullable<ZoneId>, string> = {
  tech: '#3b82f6',
  ceo: '#f59e0b',
  language: '#22c55e',
  toilet: '#a855f7',
};

export const ZONE_LABELS: Record<NonNullable<ZoneId>, string> = {
  tech: 'Tech Team',
  ceo: 'CEO Office',
  language: 'Language Experts',
  toilet: 'Washroom',
};

export const COLORS = {
  panelBg: 'rgba(15, 15, 35, 0.92)',
  hudBg: 'rgba(15, 15, 35, 0.85)',
  cardBg: 'rgba(35, 35, 70, 0.9)',
  textPrimary: '#e2e8f0',
  textSecondary: '#94a3b8',
  textMuted: '#64748b',
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
};

export const glassmorphism = (accentColor?: string) => ({
  background: COLORS.panelBg,
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: `1px solid ${accentColor ? `${accentColor}66` : 'rgba(255,255,255,0.1)'}`,
  borderRadius: '12px',
} as const);

export const buttonStyle = (accentColor: string): React.CSSProperties => ({
  background: `${accentColor}21`,
  border: `1px solid ${accentColor}66`,
  color: accentColor,
  borderRadius: '8px',
  padding: '8px 16px',
  cursor: 'pointer',
  fontFamily: 'system-ui, -apple-system, sans-serif',
  fontSize: '14px',
  fontWeight: 600,
  transition: 'all 0.2s',
});
