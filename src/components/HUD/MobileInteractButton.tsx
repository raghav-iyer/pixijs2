import { useMemo, useRef } from 'react';
import { useGame } from '../../game/GameContext';
import { getZoneNeeds } from '../../game/zoneNeeds';
import { ZONE_COLORS } from '../../game/theme';

interface InteractButtonProps {
  onInteract: () => void;
}

export function InteractButton({ onInteract }: InteractButtonProps) {
  const { state } = useGame();
  const { currentZone, activePanel } = state;
  const needs = useMemo(() => getZoneNeeds(state), [state]);
  const touchHandledRef = useRef(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    touchHandledRef.current = true;
    // Touch feedback — scale down
    const btn = e.currentTarget as HTMLElement;
    btn.style.transform = 'scale(0.88)';
    onInteract();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const btn = e.currentTarget as HTMLElement;
    btn.style.transform = '';
  };

  const handleClick = () => {
    // Prevent double-fire: if touch already handled this interaction, skip
    if (touchHandledRef.current) {
      touchHandledRef.current = false;
      return;
    }
    onInteract();
  };

  // When a panel is open, show a close button
  if (activePanel) {
    return (
      <button
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          ...baseStyle,
          background: 'rgba(239,68,68,0.25)',
          border: '2px solid rgba(239,68,68,0.6)',
          color: '#ef4444',
          boxShadow: '0 0 16px rgba(239,68,68,0.2)',
        }}
      >
        <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
          <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </button>
    );
  }

  // Determine button appearance based on zone and urgency
  const inZone = currentZone !== null;
  const urgent = inZone && needs[currentZone!].urgent;
  const color = inZone ? ZONE_COLORS[currentZone!] : '#6366f1';

  // Pick the right animation class
  const animClass = urgent
    ? 'interact-btn-pulse'
    : inZone
      ? 'interact-btn-wiggle'
      : '';

  return (
    <>
      <style>{buttonAnimations}</style>
      <button
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={animClass}
        style={{
          ...baseStyle,
          background: inZone ? `${color}30` : 'rgba(255,255,255,0.08)',
          border: `2px solid ${inZone ? `${color}88` : 'rgba(255,255,255,0.2)'}`,
          color: inZone ? color : '#64748b',
          boxShadow: urgent
            ? `0 0 24px ${color}50, 0 0 8px ${color}30`
            : inZone
              ? `0 0 16px ${color}25`
              : 'none',
          opacity: inZone ? 1 : 0.5,
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          {/* Hand/interact icon */}
          <path d="M18 8V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 13v-2a1 1 0 0 1 2 0v1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M8 12v-1a1 1 0 0 1 2 0v1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M10 12a1 1 0 0 1 2 0v4l2.5-1.5a1.5 1.5 0 0 1 2 .5l-4 5H6l-1-6.5a1.5 1.5 0 0 1 1-1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

        {/* Bouncing arrow indicator when urgent */}
        {urgent && (
          <div className="interact-arrow" style={{
            position: 'absolute',
            top: -18,
            left: '50%',
            marginLeft: -6,
            fontSize: 14,
            color: color,
            pointerEvents: 'none',
          }}>
            ▼
          </div>
        )}
      </button>
    </>
  );
}

const baseStyle: React.CSSProperties = {
  position: 'fixed',
  bottom: 24,
  right: 24,
  width: 72,
  height: 72,
  borderRadius: '50%',
  fontSize: 20,
  fontWeight: 800,
  fontFamily: 'system-ui',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  touchAction: 'none',
  cursor: 'pointer',
  // Explicit transitions — excludes transform so CSS animations work cleanly
  transition: 'background 0.25s ease, border-color 0.25s ease, color 0.25s ease, opacity 0.25s ease, box-shadow 0.25s ease',
  outline: 'none',
};

const buttonAnimations = `
@keyframes interactPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}
.interact-btn-pulse {
  animation: interactPulse 1.2s ease-in-out infinite;
}

@keyframes interactWiggle {
  0%, 100% { transform: rotate(0deg); }
  20% { transform: rotate(-4deg); }
  40% { transform: rotate(4deg); }
  60% { transform: rotate(-2deg); }
  80% { transform: rotate(2deg); }
}
.interact-btn-wiggle {
  animation: interactWiggle 2s ease-in-out infinite;
}

@keyframes arrowBounce {
  0%, 100% { transform: translateY(0); opacity: 1; }
  50% { transform: translateY(-6px); opacity: 0.6; }
}
.interact-arrow {
  animation: arrowBounce 0.8s ease-in-out infinite;
}
`;
