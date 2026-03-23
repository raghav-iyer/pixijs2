import { useEffect, useRef, type ReactNode } from 'react';
import { useGame } from '../../game/GameContext';
import { ZONE_COLORS, ZONE_LABELS, COLORS, sharedKeyframes } from '../../game/theme';
import type { ZoneId } from '../../game/types';

interface PanelOverlayProps {
  zone: NonNullable<ZoneId>;
  children: ReactNode;
}

export function PanelOverlay({ zone, children }: PanelOverlayProps) {
  const { dispatch } = useGame();
  const color = ZONE_COLORS[zone];
  const label = ZONE_LABELS[zone];
  const touchHandledRef = useRef(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dispatch({ type: 'CLOSE_PANEL' });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dispatch]);

  const closePanel = () => dispatch({ type: 'CLOSE_PANEL' });

  const handleBackdropTouch = (e: React.TouchEvent) => {
    e.preventDefault();
    touchHandledRef.current = true;
    closePanel();
  };

  const handleBackdropClick = () => {
    if (touchHandledRef.current) {
      touchHandledRef.current = false;
      return;
    }
    closePanel();
  };

  return (
    <>
      <style>{sharedKeyframes}{panelKeyframes}</style>
      <div
        style={backdropStyle}
        onClick={handleBackdropClick}
        onTouchStart={handleBackdropTouch}
      >
        <div
          style={{
            ...cardStyle,
            border: `1px solid ${color}66`,
            boxShadow: `0 0 40px ${color}15, 0 8px 32px rgba(0,0,0,0.4)`,
            animation: 'slideUpBounce 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
          onClick={e => e.stopPropagation()}
          onTouchStart={e => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: color, boxShadow: `0 0 10px ${color}` }} />
              <h2 style={{ margin: 0, color: COLORS.textPrimary, fontSize: 20, fontWeight: 700 }}>{label}</h2>
            </div>
            <button
              onClick={closePanel}
              onTouchStart={(e) => { e.preventDefault(); e.stopPropagation(); closePanel(); }}
              style={closeButtonStyle}
            >
              ✕
            </button>
          </div>
          {children}
        </div>
      </div>
    </>
  );
}

const panelKeyframes = `
@keyframes panelBackdropFade {
  from { opacity: 0; }
  to { opacity: 1; }
}
`;

const backdropStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0, 0, 0, 0.5)',
  backdropFilter: 'blur(4px)',
  WebkitBackdropFilter: 'blur(4px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 200,
  fontFamily: 'system-ui, -apple-system, sans-serif',
  touchAction: 'none',
  animation: 'panelBackdropFade 0.2s ease',
};

const cardStyle: React.CSSProperties = {
  background: COLORS.panelBg,
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  borderRadius: 16,
  padding: 24,
  width: '90%',
  maxWidth: 560,
  maxHeight: '80vh',
  overflowY: 'auto',
  color: COLORS.textPrimary,
};

const closeButtonStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.12)',
  color: COLORS.textMuted,
  borderRadius: 8,
  width: 32,
  height: 32,
  cursor: 'pointer',
  fontSize: 14,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  touchAction: 'none',
};
