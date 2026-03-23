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

// Zone emoji icons for kid-friendly labels
export const ZONE_ICONS: Record<NonNullable<ZoneId>, string> = {
  tech: '⚙️',
  ceo: '💼',
  language: '🌍',
  toilet: '💧',
};

// Kid-friendly fun colors
export const FUN_COLORS = {
  celebration: '#ffd700',
  sparkle: '#fff176',
  fun1: '#ff6b6b',
  fun2: '#48dbfb',
  fun3: '#ff9ff3',
  fun4: '#feca57',
  fun5: '#54a0ff',
};

// Easing presets
export const EASING = {
  bounceIn: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  springIn: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  snapOut: 'cubic-bezier(0.22, 1, 0.36, 1)',
};

// Shared keyframe CSS for reuse across components
export const sharedKeyframes = `
@keyframes bounceIn {
  0% { transform: scale(0) translateY(20px); opacity: 0; }
  60% { transform: scale(1.1) translateY(-4px); opacity: 1; }
  100% { transform: scale(1) translateY(0); opacity: 1; }
}
@keyframes wiggle {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-3deg); }
  75% { transform: rotate(3deg); }
}
@keyframes sparkle {
  0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
  50% { opacity: 1; transform: scale(1) rotate(180deg); }
}
@keyframes rainbowText {
  0% { filter: hue-rotate(0deg); }
  100% { filter: hue-rotate(360deg); }
}
@keyframes gentleFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}
@keyframes pulseGlow {
  0%, 100% { box-shadow: 0 0 8px rgba(255,215,0,0.3); }
  50% { box-shadow: 0 0 24px rgba(255,215,0,0.6); }
}
@keyframes slideUpBounce {
  0% { transform: translateY(100%) scale(0.95); opacity: 0; }
  60% { transform: translateY(-8px) scale(1.02); opacity: 1; }
  100% { transform: translateY(0) scale(1); opacity: 1; }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes bounceScale {
  0% { transform: scale(1); }
  50% { transform: scale(1.15); }
  100% { transform: scale(1); }
}
@keyframes coinFloat {
  0% { transform: translateY(0) scale(1); opacity: 1; }
  100% { transform: translateY(-40px) scale(0.5); opacity: 0; }
}
`;
