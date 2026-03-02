import { useGame } from '../../game/GameContext';
import { COLORS } from '../../game/theme';
import { BALANCE } from '../../game/balance';

export function HUD() {
  const { state } = useGame();
  const { money, reputation, stress, day, dayTicks, activeTasks } = state;

  const dayProgress = (dayTicks / BALANCE.dayDurationTicks) * 100;

  return (
    <div style={containerStyle}>
      {/* Money */}
      <div style={sectionStyle}>
        <span style={labelStyle}>$</span>
        <span style={{ ...valueStyle, color: money < 1000 ? COLORS.error : COLORS.textPrimary }}>
          {money.toLocaleString()}
        </span>
      </div>

      {/* Reputation bar */}
      <div style={{ ...sectionStyle, flex: 1, maxWidth: 180 }}>
        <span style={labelStyle}>Rep</span>
        <div style={barContainerStyle}>
          <div style={{
            ...barFillStyle,
            width: `${reputation}%`,
            background: reputation > 60 ? COLORS.success : reputation > 35 ? COLORS.warning : COLORS.error,
          }} />
        </div>
        <span style={smallValueStyle}>{Math.round(reputation)}</span>
      </div>

      {/* Stress bar */}
      <div style={{ ...sectionStyle, flex: 1, maxWidth: 180 }}>
        <span style={labelStyle}>Stress</span>
        <div style={barContainerStyle}>
          <div style={{
            ...barFillStyle,
            width: `${stress}%`,
            background: stress < 40 ? COLORS.success : stress < 70 ? COLORS.warning : COLORS.error,
          }} />
        </div>
        <span style={smallValueStyle}>{Math.round(stress)}</span>
      </div>

      {/* Day counter */}
      <div style={sectionStyle}>
        <span style={labelStyle}>Day {day}</span>
        <div style={{ ...barContainerStyle, width: 60 }}>
          <div style={{ ...barFillStyle, width: `${dayProgress}%`, background: '#6366f1' }} />
        </div>
      </div>

      {/* Active tasks badge */}
      {activeTasks.length > 0 && (
        <div style={badgeStyle}>
          {activeTasks.length} task{activeTasks.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  height: 44,
  background: COLORS.hudBg,
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  borderBottom: '1px solid rgba(255,255,255,0.08)',
  display: 'flex',
  alignItems: 'center',
  padding: '0 16px',
  gap: 16,
  zIndex: 100,
  fontFamily: 'system-ui, -apple-system, sans-serif',
  boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
};

const sectionStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
};

const labelStyle: React.CSSProperties = {
  color: COLORS.textMuted,
  fontSize: 12,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const valueStyle: React.CSSProperties = {
  color: COLORS.textPrimary,
  fontSize: 16,
  fontWeight: 700,
  fontVariantNumeric: 'tabular-nums',
};

const smallValueStyle: React.CSSProperties = {
  color: COLORS.textSecondary,
  fontSize: 11,
  fontWeight: 600,
  minWidth: 20,
  textAlign: 'right',
  fontVariantNumeric: 'tabular-nums',
};

const barContainerStyle: React.CSSProperties = {
  width: 80,
  height: 6,
  background: 'rgba(255,255,255,0.08)',
  borderRadius: 3,
  overflow: 'hidden',
};

const barFillStyle: React.CSSProperties = {
  height: '100%',
  borderRadius: 3,
  transition: 'width 0.3s ease, background 0.3s ease',
};

const badgeStyle: React.CSSProperties = {
  background: 'rgba(99, 102, 241, 0.2)',
  border: '1px solid rgba(99, 102, 241, 0.4)',
  color: '#818cf8',
  borderRadius: 12,
  padding: '2px 10px',
  fontSize: 12,
  fontWeight: 600,
  marginLeft: 'auto',
};
