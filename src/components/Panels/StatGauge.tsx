import { COLORS } from '../../game/theme';

interface StatGaugeProps {
  label: string;
  value: number;      // 0-100
  color: string;
  invert?: boolean;   // true = lower is better (hallucination)
}

export function StatGauge({ label, value, color, invert }: StatGaugeProps) {
  const displayValue = Math.round(value);
  const effectiveValue = invert ? 100 - value : value;
  const qualityColor = effectiveValue > 70 ? COLORS.success : effectiveValue > 40 ? COLORS.warning : COLORS.error;

  // Conic gradient for circular gauge
  const angle = (value / 100) * 270; // 270 degree arc
  const gradient = `conic-gradient(from 135deg, ${color} ${angle}deg, rgba(255,255,255,0.06) ${angle}deg 270deg, transparent 270deg)`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div style={{
        width: 80,
        height: 80,
        borderRadius: '50%',
        background: gradient,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}>
        <div style={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: 'rgba(15, 15, 35, 0.95)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}>
          <span style={{
            color: qualityColor,
            fontSize: 20,
            fontWeight: 700,
            fontVariantNumeric: 'tabular-nums',
            lineHeight: 1,
          }}>
            {displayValue}
          </span>
          <span style={{ color: COLORS.textMuted, fontSize: 9, marginTop: 2 }}>
            {invert ? 'LOWER=BETTER' : '/100'}
          </span>
        </div>
      </div>
      <span style={{ color: COLORS.textSecondary, fontSize: 12, fontWeight: 600 }}>{label}</span>
    </div>
  );
}
