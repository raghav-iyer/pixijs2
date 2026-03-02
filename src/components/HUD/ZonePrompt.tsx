import { useMemo } from 'react';
import { useGame } from '../../game/GameContext';
import { getZoneNeeds } from '../../game/zoneNeeds';
import { ZONE_COLORS, ZONE_LABELS, glassmorphism } from '../../game/theme';

interface ZonePromptProps {
  interactFeedback: 'none' | 'ok' | 'not-needed';
}

export function ZonePrompt({ interactFeedback }: ZonePromptProps) {
  const { state } = useGame();
  const { currentZone, activePanel } = state;
  const needs = useMemo(() => getZoneNeeds(state), [state]);

  if (!currentZone || activePanel) return null;

  const color = ZONE_COLORS[currentZone];
  const label = ZONE_LABELS[currentZone];
  const need = needs[currentZone];

  const shakeClass = interactFeedback === 'not-needed' ? 'prompt-shake' : '';
  const flashClass = interactFeedback === 'ok' ? 'prompt-flash' : '';

  return (
    <>
      <style>{promptAnimations}</style>
      <div
        className={`${shakeClass} ${flashClass}`}
        style={{
          position: 'fixed',
          bottom: 80,
          left: '50%',
          transform: 'translateX(-50%)',
          ...glassmorphism(color),
          padding: '10px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
          zIndex: 90,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          boxShadow: need.urgent
            ? `0 0 24px ${color}40, 0 0 8px ${color}20`
            : `0 0 20px ${color}15`,
          borderColor: need.urgent ? `${color}aa` : `${color}40`,
          minWidth: 200,
        }}
      >
        {/* Top row: zone name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: color,
            boxShadow: need.urgent ? `0 0 10px ${color}` : `0 0 4px ${color}80`,
            animation: need.urgent ? 'dotPulse 1s ease-in-out infinite' : 'none',
          }} />
          <span style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 600 }}>
            {label}
          </span>
        </div>

        {/* Status row */}
        <div style={{
          fontSize: 12,
          fontWeight: 500,
          color: need.urgent ? color : '#64748b',
          textAlign: 'center',
        }}>
          {need.reason}
        </div>

        {/* "Not needed" feedback message */}
        {interactFeedback === 'not-needed' && (
          <div style={{
            fontSize: 11,
            color: '#94a3b8',
            fontStyle: 'italic',
            animation: 'fadeIn 0.15s ease',
          }}>
            Nothing urgent here right now
          </div>
        )}
      </div>
    </>
  );
}

// Shown when not in any zone and E is pressed
export function NoZoneHint({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <>
      <style>{promptAnimations}</style>
      <div style={{
        position: 'fixed',
        bottom: 80,
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(15, 15, 35, 0.85)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 10,
        padding: '8px 20px',
        zIndex: 90,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        color: '#94a3b8',
        fontSize: 13,
        animation: 'fadeInUp 0.2s ease, fadeOut 0.3s ease 1.2s forwards',
        whiteSpace: 'nowrap',
      }}>
        Walk to a highlighted zone to interact
      </div>
    </>
  );
}

const promptAnimations = `
@keyframes prompt-shake {
  0%, 100% { transform: translateX(-50%); }
  10%, 50%, 90% { transform: translateX(calc(-50% - 4px)); }
  30%, 70% { transform: translateX(calc(-50% + 4px)); }
}
.prompt-shake {
  animation: prompt-shake 0.4s ease !important;
}
@keyframes prompt-flash-glow {
  0% { box-shadow: 0 0 20px rgba(34,197,94,0.5); }
  100% { box-shadow: none; }
}
.prompt-flash {
  animation: prompt-flash-glow 0.5s ease !important;
}
@keyframes dotPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.4); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateX(-50%) translateY(8px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}
@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}
`;
