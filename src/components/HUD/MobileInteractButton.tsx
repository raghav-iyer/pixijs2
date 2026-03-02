import { useMemo } from 'react';
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

  // When a panel is open, show a close button
  if (activePanel) {
    return (
      <button
        onClick={() => onInteract()}
        onTouchStart={(e) => { e.preventDefault(); onInteract(); }}
        style={{
          ...baseStyle,
          background: 'rgba(239,68,68,0.25)',
          border: '2px solid rgba(239,68,68,0.6)',
          color: '#ef4444',
          boxShadow: '0 0 16px rgba(239,68,68,0.2)',
        }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </button>
    );
  }

  // Determine button appearance based on zone and urgency
  const inZone = currentZone !== null;
  const urgent = inZone && needs[currentZone!].urgent;
  const color = inZone ? ZONE_COLORS[currentZone!] : '#6366f1';

  return (
    <>
      <style>{buttonAnimations}</style>
      <button
        onClick={() => onInteract()}
        onTouchStart={(e) => { e.preventDefault(); onInteract(); }}
        className={urgent ? 'interact-btn-pulse' : ''}
        style={{
          ...baseStyle,
          background: inZone ? `${color}30` : 'rgba(255,255,255,0.08)',
          border: `2px solid ${inZone ? `${color}88` : 'rgba(255,255,255,0.2)'}`,
          color: inZone ? color : '#64748b',
          boxShadow: urgent ? `0 0 20px ${color}40` : inZone ? `0 0 12px ${color}20` : 'none',
          opacity: inZone ? 1 : 0.5,
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          {/* Hand/interact icon */}
          <path d="M18 8V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 13v-2a1 1 0 0 1 2 0v1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M8 12v-1a1 1 0 0 1 2 0v1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M10 12a1 1 0 0 1 2 0v4l2.5-1.5a1.5 1.5 0 0 1 2 .5l-4 5H6l-1-6.5a1.5 1.5 0 0 1 1-1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </>
  );
}

const baseStyle: React.CSSProperties = {
  position: 'fixed',
  bottom: 44,
  right: 32,
  width: 60,
  height: 60,
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
  transition: 'all 0.25s ease',
  outline: 'none',
};

const buttonAnimations = `
@keyframes interactPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}
.interact-btn-pulse {
  animation: interactPulse 1.5s ease-in-out infinite;
}
`;
