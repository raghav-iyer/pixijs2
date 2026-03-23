import { useRef } from 'react';
import { useGame } from '../../game/GameContext';
import { COLORS } from '../../game/theme';

const WIN_MESSAGES = [
  'You built a successful AI translation empire!',
  'Your company is the talk of the industry!',
  'The AI world bows to your expertise!',
];

export function GameOverScreen() {
  const { state, dispatch } = useGame();
  const touchHandledRef = useRef(false);

  if (state.gamePhase === 'playing') return null;

  const isWin = state.gamePhase === 'won';
  const winMsg = WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)];

  const handlePlayAgain = () => dispatch({ type: 'RESET_GAME' });

  const handleTouch = (e: React.TouchEvent) => {
    e.preventDefault();
    touchHandledRef.current = true;
    handlePlayAgain();
  };

  const handleClick = () => {
    if (touchHandledRef.current) {
      touchHandledRef.current = false;
      return;
    }
    handlePlayAgain();
  };

  const stats = [
    { label: 'Money', value: `$${state.money.toLocaleString()}` },
    { label: 'Reputation', value: `${Math.round(state.reputation)}%` },
    { label: 'Tasks Done', value: `${state.completedTaskCount}` },
    { label: 'Days', value: `${state.day}` },
    { label: 'AI Accuracy', value: `${Math.round(state.ai.accuracy)}%` },
    { label: 'Fails', value: `${state.majorFailCount}` },
  ];

  return (
    <>
      <style>{gameOverKeyframes}</style>
      <div style={overlayStyle}>
        <div style={{
          ...cardStyle,
          animation: isWin
            ? 'goCardBounceIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
            : 'goCardFadeIn 0.4s ease-out',
        }}>
          {/* Win/Lose header */}
          {isWin ? (
            <>
              <div style={{ fontSize: 48, marginBottom: 8, animation: 'goTrophySpin 0.6s ease-out' }}>
                🏆
              </div>
              <h1 style={{
                fontSize: 36,
                fontWeight: 900,
                margin: '0 0 8px 0',
                background: 'linear-gradient(90deg, #ffd700, #ff6b6b, #48dbfb, #22c55e, #ffd700)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'goRainbow 3s linear infinite',
              }}>
                You Won!
              </h1>
            </>
          ) : (
            <h1 style={{
              fontSize: 36,
              fontWeight: 800,
              margin: '0 0 8px 0',
              color: '#ef4444',
              animation: 'goShake 0.4s ease-out',
            }}>
              Game Over
            </h1>
          )}

          {!isWin && (
            <p style={{ color: COLORS.error, fontSize: 16, margin: '0 0 20px 0' }}>
              {state.loseReason}
            </p>
          )}

          {isWin && (
            <p style={{ color: COLORS.textSecondary, fontSize: 16, margin: '0 0 20px 0' }}>
              {winMsg}
            </p>
          )}

          {/* Stats with staggered entrance */}
          <div style={statsGrid}>
            {stats.map((s, i) => (
              <div
                key={s.label}
                style={{
                  textAlign: 'center',
                  animation: `goStatSlideIn 0.3s ease-out ${0.2 + i * 0.08}s both`,
                }}
              >
                <div style={{ color: COLORS.textMuted, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {s.label}
                </div>
                <div style={{ color: COLORS.textPrimary, fontSize: 20, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                  {s.value}
                </div>
              </div>
            ))}
          </div>

          {/* Confetti for win */}
          {isWin && (
            <div style={{ position: 'absolute', inset: -40, pointerEvents: 'none', overflow: 'hidden' }}>
              {Array.from({ length: 24 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '40%',
                    width: 8,
                    height: 8,
                    borderRadius: i % 3 === 0 ? '50%' : '2px',
                    background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
                    animation: `goConfetti${i % 12} 1.5s ease-out ${0.3 + (i * 0.05)}s both`,
                  }}
                />
              ))}
            </div>
          )}

          <button
            className="go-play-btn"
            style={playAgainStyle}
            onClick={handleClick}
            onTouchStart={handleTouch}
          >
            Play Again
          </button>
        </div>
      </div>
    </>
  );
}

const CONFETTI_COLORS = ['#22c55e', '#fbbf24', '#3b82f6', '#f59e0b', '#a855f7', '#ec4899', '#ff6b6b', '#48dbfb'];

const confettiKeyframes = Array.from({ length: 12 })
  .map((_, i) => {
    const angle = (i / 12) * 360;
    const rad = (angle * Math.PI) / 180;
    const dist = 120 + Math.random() * 80;
    const x = Math.cos(rad) * dist;
    const y = Math.sin(rad) * dist;
    const rot = Math.floor(Math.random() * 720);
    return `@keyframes goConfetti${i} {
      0% { opacity: 1; transform: translate(0, 0) rotate(0deg) scale(1); }
      100% { opacity: 0; transform: translate(${x}px, ${y}px) rotate(${rot}deg) scale(0.2); }
    }`;
  })
  .join('\n');

const gameOverKeyframes = `
@keyframes goCardBounceIn {
  0% { transform: scale(0.5) translateY(40px); opacity: 0; }
  60% { transform: scale(1.05) translateY(-8px); opacity: 1; }
  100% { transform: scale(1) translateY(0); opacity: 1; }
}
@keyframes goCardFadeIn {
  0% { transform: scale(0.95); opacity: 0; filter: blur(4px); }
  100% { transform: scale(1); opacity: 1; filter: blur(0); }
}
@keyframes goTrophySpin {
  0% { transform: scale(0) rotate(-30deg); }
  60% { transform: scale(1.2) rotate(10deg); }
  100% { transform: scale(1) rotate(0deg); }
}
@keyframes goRainbow {
  0% { background-position: 0% center; }
  100% { background-position: 200% center; }
}
@keyframes goShake {
  0%, 100% { transform: translateX(0); }
  15% { transform: translateX(-8px); }
  30% { transform: translateX(6px); }
  45% { transform: translateX(-4px); }
  60% { transform: translateX(2px); }
}
@keyframes goStatSlideIn {
  0% { transform: translateY(12px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}
@keyframes goPlayPulse {
  0%, 100% { box-shadow: 0 4px 16px rgba(99,102,241,0.3); }
  50% { box-shadow: 0 4px 28px rgba(99,102,241,0.6); }
}
.go-play-btn {
  animation: goPlayPulse 2s ease-in-out infinite;
}
.go-play-btn:active {
  transform: scale(0.95) !important;
}
${confettiKeyframes}
`;

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0, 0, 0, 0.75)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 500,
  fontFamily: 'system-ui, -apple-system, sans-serif',
  animation: 'fadeIn 0.3s ease',
};

const cardStyle: React.CSSProperties = {
  background: COLORS.panelBg,
  backdropFilter: 'blur(12px)',
  borderRadius: 20,
  padding: '40px 48px',
  textAlign: 'center',
  maxWidth: 480,
  width: '90%',
  border: '1px solid rgba(255,255,255,0.08)',
  boxShadow: '0 24px 48px rgba(0,0,0,0.5)',
  position: 'relative',
  overflow: 'hidden',
};

const statsGrid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: 16,
  marginBottom: 28,
  padding: '16px 0',
  borderTop: '1px solid rgba(255,255,255,0.06)',
  borderBottom: '1px solid rgba(255,255,255,0.06)',
};

const playAgainStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  border: 'none',
  color: '#fff',
  borderRadius: 10,
  padding: '12px 32px',
  fontSize: 16,
  fontWeight: 700,
  cursor: 'pointer',
  fontFamily: 'system-ui',
  touchAction: 'none',
};

const fadeInKf = `
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
`;
// Append fadeIn to the gameOverKeyframes if needed — it's already in overlayStyle animation
