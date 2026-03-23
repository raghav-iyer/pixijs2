import { useEffect } from 'react';
import { useGame } from '../../game/GameContext';
import { COLORS } from '../../game/theme';

const AUTO_DISMISS_MS = 5000;
const MAX_VISIBLE = 3;

const TYPE_CONFIG = {
  success: { color: COLORS.success, icon: '✅', label: 'SUCCESS' },
  error: { color: COLORS.error, icon: '❌', label: 'FAILED' },
  warning: { color: COLORS.warning, icon: '⚠️', label: 'WARNING' },
  info: { color: COLORS.info, icon: 'ℹ️', label: 'INFO' },
} as const;

export function NotificationToast() {
  const { state, dispatch } = useGame();
  const visible = state.notifications.slice(-MAX_VISIBLE);

  // Auto-dismiss
  useEffect(() => {
    if (state.notifications.length === 0) return;
    const oldest = state.notifications[0];
    const age = Date.now() - oldest.timestamp;
    const delay = Math.max(100, AUTO_DISMISS_MS - age);

    const timer = setTimeout(() => {
      dispatch({ type: 'DISMISS_NOTIFICATION', id: oldest.id });
    }, delay);

    return () => clearTimeout(timer);
  }, [state.notifications, dispatch]);

  if (visible.length === 0) return null;

  return (
    <>
      <style>{notificationKeyframes}</style>
      <div style={containerStyle}>
        {visible.map(n => {
          const config = TYPE_CONFIG[n.type];

          return (
            <div
              key={n.id}
              style={{
                ...toastStyle,
                border: `1.5px solid ${config.color}cc`,
                boxShadow: `0 0 16px ${config.color}30, 0 4px 20px rgba(0,0,0,0.5)`,
              }}
              onClick={() => dispatch({ type: 'DISMISS_NOTIFICATION', id: n.id })}
              onTouchStart={(e) => {
                e.preventDefault();
                dispatch({ type: 'DISMISS_NOTIFICATION', id: n.id });
              }}
            >
              {/* Type badge + emoji icon */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 4,
              }}>
                <span style={{
                  fontSize: 16,
                  lineHeight: 1,
                  flexShrink: 0,
                }}>
                  {config.icon}
                </span>
                <span style={{
                  color: config.color,
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}>
                  {config.label}
                </span>
              </div>

              {/* Message */}
              <div style={{
                color: COLORS.textPrimary,
                fontSize: 14,
                lineHeight: 1.4,
                fontWeight: 500,
              }}>
                {n.message}
              </div>

              {/* Progress bar (auto-dismiss timer) */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 3,
                borderRadius: '0 0 10px 10px',
                overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%',
                  background: config.color,
                  opacity: 0.6,
                  animation: `notifShrink ${AUTO_DISMISS_MS}ms linear forwards`,
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

const notificationKeyframes = `
  @keyframes notifBounceIn {
    0% { transform: translateY(16px) scale(0.85); opacity: 0; }
    60% { transform: translateY(-4px) scale(1.03); opacity: 1; }
    100% { transform: translateY(0) scale(1); opacity: 1; }
  }
  @keyframes notifShrink {
    0% { width: 100%; }
    100% { width: 0%; }
  }
`;

const containerStyle: React.CSSProperties = {
  position: 'fixed',
  bottom: 110,
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  zIndex: 150,
  fontFamily: 'system-ui, -apple-system, sans-serif',
  width: 'calc(100% - 32px)',
  maxWidth: 400,
  pointerEvents: 'auto',
};

const toastStyle: React.CSSProperties = {
  position: 'relative',
  background: 'rgba(12, 12, 30, 0.95)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  borderRadius: 10,
  padding: '12px 16px',
  cursor: 'pointer',
  animation: 'notifBounceIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
  overflow: 'hidden',
  touchAction: 'none',
};
