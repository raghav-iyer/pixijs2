import { useEffect, useRef, useState } from 'react';
import { useGame } from '../../game/GameContext';
import { COLORS } from '../../game/theme';
import { BALANCE } from '../../game/balance';

type FlashType = 'none' | 'up' | 'down';

function useValueFlash(value: number): FlashType {
  const prevRef = useRef(value);
  const [flash, setFlash] = useState<FlashType>('none');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (value !== prevRef.current) {
      const dir: FlashType = value > prevRef.current ? 'up' : 'down';
      prevRef.current = value;
      setFlash(dir);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setFlash('none'), 600);
    }
  }, [value]);

  return flash;
}

export function HUD() {
  const { state } = useGame();
  const { money, reputation, stress, day, dayTicks, activeTasks } = state;

  const moneyFlash = useValueFlash(money);
  const repFlash = useValueFlash(Math.round(reputation));
  const stressFlash = useValueFlash(Math.round(stress));
  const taskFlash = useValueFlash(activeTasks.length);

  const dayProgress = (dayTicks / BALANCE.dayDurationTicks) * 100;

  return (
    <>
      <style>{hudAnimations}</style>
      <div style={containerStyle}>
        {/* Money */}
        <div style={sectionStyle}>
          <span style={labelStyle}>$</span>
          <span
            className={moneyFlash === 'up' ? 'hud-flash-up' : moneyFlash === 'down' ? 'hud-flash-down' : ''}
            style={{
              ...valueStyle,
              color: money < 1000 ? COLORS.error : COLORS.textPrimary,
            }}
          >
            {money.toLocaleString()}
          </span>
        </div>

        {/* Reputation bar */}
        <div style={{ ...sectionStyle, flex: 1, maxWidth: 180 }}>
          <span style={labelStyle}>Rep</span>
          <div style={barContainerStyle}>
            <div
              className={repFlash === 'up' ? 'hud-bar-pulse-up' : repFlash === 'down' ? 'hud-bar-pulse-down' : ''}
              style={{
                ...barFillStyle,
                width: `${reputation}%`,
                background: reputation > 60 ? COLORS.success : reputation > 35 ? COLORS.warning : COLORS.error,
              }}
            />
          </div>
          <span style={smallValueStyle}>{Math.round(reputation)}</span>
        </div>

        {/* Stress bar */}
        <div style={{ ...sectionStyle, flex: 1, maxWidth: 180 }}>
          <span style={labelStyle}>Stress</span>
          <div style={barContainerStyle}>
            <div
              className={
                stress > 70
                  ? 'hud-bar-throb'
                  : stressFlash === 'up'
                    ? 'hud-bar-pulse-down'
                    : stressFlash === 'down'
                      ? 'hud-bar-pulse-up'
                      : ''
              }
              style={{
                ...barFillStyle,
                width: `${stress}%`,
                background: stress < 40 ? COLORS.success : stress < 70 ? COLORS.warning : COLORS.error,
              }}
            />
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
          <div
            className={taskFlash !== 'none' ? 'hud-badge-bounce' : ''}
            style={badgeStyle}
          >
            {activeTasks.length} task{activeTasks.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </>
  );
}

const hudAnimations = `
@keyframes hudFlashUp {
  0% { color: #22c55e; transform: scale(1.2); }
  100% { transform: scale(1); }
}
@keyframes hudFlashDown {
  0% { color: #ef4444; transform: scale(1.2); }
  100% { transform: scale(1); }
}
@keyframes hudBarPulseUp {
  0%, 100% { filter: brightness(1); }
  50% { filter: brightness(1.6); }
}
@keyframes hudBarPulseDown {
  0%, 100% { filter: brightness(1); }
  50% { filter: brightness(0.6); }
}
@keyframes hudBarThrob {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
@keyframes hudBadgeBounce {
  0% { transform: scale(1); }
  40% { transform: scale(1.25); }
  100% { transform: scale(1); }
}

.hud-flash-up { animation: hudFlashUp 0.5s ease-out; }
.hud-flash-down { animation: hudFlashDown 0.5s ease-out; }
.hud-bar-pulse-up { animation: hudBarPulseUp 0.5s ease; }
.hud-bar-pulse-down { animation: hudBarPulseDown 0.5s ease; }
.hud-bar-throb { animation: hudBarThrob 1s ease-in-out infinite; }
.hud-badge-bounce { animation: hudBadgeBounce 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
`;

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
