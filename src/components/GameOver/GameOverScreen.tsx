import { useGame } from '../../game/GameContext';
import { COLORS } from '../../game/theme';

export function GameOverScreen() {
  const { state, dispatch } = useGame();

  if (state.gamePhase === 'playing') return null;

  const isWin = state.gamePhase === 'won';

  return (
    <div style={overlayStyle}>
      <div style={cardStyle}>
        <h1 style={{
          fontSize: 36,
          fontWeight: 800,
          margin: '0 0 8px 0',
          color: isWin ? '#22c55e' : '#ef4444',
        }}>
          {isWin ? 'You Won!' : 'Game Over'}
        </h1>

        {!isWin && (
          <p style={{ color: COLORS.error, fontSize: 16, margin: '0 0 20px 0' }}>
            {state.loseReason}
          </p>
        )}

        {isWin && (
          <p style={{ color: COLORS.textSecondary, fontSize: 16, margin: '0 0 20px 0' }}>
            You built a successful AI translation empire!
          </p>
        )}

        {/* Stats */}
        <div style={statsGrid}>
          <StatItem label="Money" value={`$${state.money.toLocaleString()}`} />
          <StatItem label="Reputation" value={`${Math.round(state.reputation)}%`} />
          <StatItem label="Tasks Completed" value={`${state.completedTaskCount}`} />
          <StatItem label="Days Survived" value={`${state.day}`} />
          <StatItem label="AI Accuracy" value={`${Math.round(state.ai.accuracy)}%`} />
          <StatItem label="Major Fails" value={`${state.majorFailCount}`} />
        </div>

        <button
          style={playAgainStyle}
          onClick={() => dispatch({ type: 'RESET_GAME' })}
        >
          Play Again
        </button>
      </div>
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ color: COLORS.textMuted, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </div>
      <div style={{ color: COLORS.textPrimary, fontSize: 20, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
        {value}
      </div>
    </div>
  );
}

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
  boxShadow: '0 4px 16px rgba(99,102,241,0.3)',
};
