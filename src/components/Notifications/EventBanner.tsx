import { useGame } from '../../game/GameContext';
import { COLORS } from '../../game/theme';

export function EventBanner() {
  const { state } = useGame();
  const { activeEvents } = state;

  if (activeEvents.length === 0) return null;

  return (
    <div style={containerStyle}>
      {activeEvents.map(ae => {
        const severityColor =
          ae.event.severity === 'error' ? COLORS.error :
          ae.event.severity === 'warning' ? COLORS.warning :
          COLORS.info;

        return (
          <div key={ae.event.id + ae.ticksRemaining} style={{
            ...bannerStyle,
            borderLeft: `3px solid ${severityColor}`,
            background: `linear-gradient(90deg, ${severityColor}15 0%, rgba(15,15,35,0.9) 100%)`,
          }}>
            <span style={{ color: severityColor, fontWeight: 700, fontSize: 13 }}>
              {ae.event.name}
            </span>
            <span style={{ color: COLORS.textSecondary, fontSize: 12, flex: 1, marginLeft: 10 }}>
              {ae.event.description}
            </span>
            <span style={{
              color: severityColor,
              fontSize: 11,
              fontWeight: 600,
              fontVariantNumeric: 'tabular-nums',
              minWidth: 30,
              textAlign: 'right',
            }}>
              {ae.ticksRemaining}s
            </span>
          </div>
        );
      })}
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  position: 'fixed',
  top: 48,
  left: 0,
  right: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  zIndex: 95,
  padding: '0 8px',
  fontFamily: 'system-ui, -apple-system, sans-serif',
};

const bannerStyle: React.CSSProperties = {
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  borderRadius: 6,
  padding: '6px 12px',
  display: 'flex',
  alignItems: 'center',
};
