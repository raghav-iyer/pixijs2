import { useEffect, useState, useRef } from 'react';
import { useGame } from '../../game/GameContext';

const CELEBRATION_WORDS = ['GREAT JOB!', 'AMAZING!', 'WELL DONE!', 'FANTASTIC!', 'AWESOME!'];

export function TaskResultOverlay() {
  const { state, dispatch } = useGame();
  const { taskResult } = state;
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const celebWordRef = useRef(CELEBRATION_WORDS[0]);

  useEffect(() => {
    if (!taskResult) {
      setVisible(false);
      setFading(false);
      return;
    }

    // Pick a random celebration word
    celebWordRef.current = CELEBRATION_WORDS[Math.floor(Math.random() * CELEBRATION_WORDS.length)];

    setVisible(true);
    setFading(false);

    const duration = taskResult.type === 'success' ? 3500 : 2000;
    const fadeStart = duration - 500;

    timerRef.current = setTimeout(() => setFading(true), fadeStart);
    const clearTimer = setTimeout(() => {
      dispatch({ type: 'CLEAR_TASK_RESULT' });
    }, duration);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      clearTimeout(clearTimer);
    };
  }, [taskResult, dispatch]);

  if (!visible || !taskResult) return null;

  const isSuccess = taskResult.type === 'success';

  return (
    <>
      <style>{overlayKeyframes}</style>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 900,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          animation: isSuccess
            ? 'taskGlowPulse 1.2s ease-out'
            : 'taskRedFlash 0.4s ease-out, taskScreenShake 0.3s ease-out',
          opacity: fading ? 0 : 1,
          transition: 'opacity 0.5s ease-out',
        }}
      >
        {/* Background overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: isSuccess
              ? 'radial-gradient(circle, rgba(34,197,94,0.2) 0%, rgba(255,215,0,0.05) 40%, rgba(0,0,0,0.4) 70%)'
              : 'radial-gradient(circle, rgba(239,68,68,0.15) 0%, rgba(0,0,0,0.4) 70%)',
          }}
        />

        {/* Content */}
        <div style={{ position: 'relative', textAlign: 'center' }}>
          {isSuccess ? (
            <>
              {/* Stars */}
              <div
                style={{
                  fontSize: 56,
                  animation: 'taskScaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  marginBottom: 12,
                  textShadow: '0 0 20px rgba(255,215,0,0.6)',
                  filter: 'drop-shadow(0 0 8px rgba(255,215,0,0.4))',
                }}
              >
                {'★'.repeat(taskResult.rating ?? 0)}
                {'☆'.repeat(5 - (taskResult.rating ?? 0))}
              </div>

              {/* Celebration Title — rainbow gradient */}
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  background: 'linear-gradient(90deg, #ff6b6b, #ffd700, #48dbfb, #ff9ff3, #22c55e)',
                  backgroundSize: '200% auto',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: 'taskScaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), taskRainbowShift 2s linear infinite',
                  marginBottom: 8,
                }}
              >
                {celebWordRef.current}
              </div>

              {/* Task name */}
              <div
                style={{
                  color: '#94a3b8',
                  fontSize: 14,
                  animation: 'taskSlideUp 0.3s ease-out 0.2s both',
                }}
              >
                {taskResult.title}
              </div>

              {/* Reward with floating coins */}
              {taskResult.reward != null && (
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <div
                    style={{
                      color: '#fbbf24',
                      fontSize: 28,
                      fontWeight: 700,
                      marginTop: 16,
                      animation: 'taskSlideUp 0.3s ease-out 0.3s both',
                      textShadow: '0 0 16px rgba(251,191,36,0.5)',
                    }}
                  >
                    +${taskResult.reward.toLocaleString()}
                  </div>
                  {/* Floating coin particles */}
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={`coin-${i}`}
                      style={{
                        position: 'absolute',
                        left: `${20 + i * 12}%`,
                        bottom: 0,
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #ffd700, #fbbf24)',
                        animation: `taskCoinFloat 1.2s ease-out ${0.3 + i * 0.1}s both`,
                        boxShadow: '0 0 6px rgba(255,215,0,0.5)',
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Confetti particles — 40 particles, 16 directional variants */}
              <div style={{ position: 'absolute', inset: -120, pointerEvents: 'none', overflow: 'hidden' }}>
                {Array.from({ length: 40 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      width: i % 4 === 0 ? 10 : 8,
                      height: i % 4 === 0 ? 10 : 8,
                      borderRadius: i % 3 === 0 ? '50%' : '2px',
                      background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
                      animation: `taskConfetti${i % 16} 1.4s ease-out forwards`,
                      opacity: 0,
                    }}
                  />
                ))}
              </div>
            </>
          ) : (
            <>
              {/* FAILED stamp */}
              <div
                style={{
                  color: '#ef4444',
                  fontSize: 42,
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  textShadow: '0 0 30px rgba(239,68,68,0.6)',
                  animation: 'taskStampIn 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                  border: '4px solid #ef4444',
                  padding: '8px 32px',
                  borderRadius: 8,
                }}
              >
                Task Failed
              </div>

              {/* Task name */}
              <div
                style={{
                  color: '#94a3b8',
                  fontSize: 14,
                  marginTop: 12,
                  animation: 'taskSlideUp 0.3s ease-out 0.2s both',
                }}
              >
                {taskResult.title}
              </div>

              {/* Rep loss */}
              {taskResult.repLoss != null && (
                <div
                  style={{
                    color: '#ef4444',
                    fontSize: 20,
                    fontWeight: 700,
                    marginTop: 12,
                    animation: 'taskSlideUp 0.3s ease-out 0.3s both',
                  }}
                >
                  -{taskResult.repLoss} Reputation
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

const CONFETTI_COLORS = ['#22c55e', '#fbbf24', '#3b82f6', '#f59e0b', '#a855f7', '#ec4899', '#ff6b6b', '#48dbfb'];

const confettiKeyframes = Array.from({ length: 16 })
  .map((_, i) => {
    const angle = (i / 16) * 360;
    const rad = (angle * Math.PI) / 180;
    const dist = 150 + Math.random() * 100;
    const x = Math.cos(rad) * dist;
    const y = Math.sin(rad) * dist;
    const rot = Math.floor(Math.random() * 720);
    return `
      @keyframes taskConfetti${i} {
        0% { opacity: 1; transform: translate(0, 0) rotate(0deg) scale(1); }
        100% { opacity: 0; transform: translate(${x}px, ${y}px) rotate(${rot}deg) scale(0.2); }
      }
    `;
  })
  .join('\n');

const overlayKeyframes = `
  @keyframes taskScaleIn {
    0% { transform: scale(0); opacity: 0; }
    70% { transform: scale(1.2); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
  }

  @keyframes taskSlideUp {
    0% { transform: translateY(20px); opacity: 0; }
    100% { transform: translateY(0); opacity: 1; }
  }

  @keyframes taskGlowPulse {
    0% { box-shadow: inset 0 0 60px rgba(34,197,94,0.3); }
    30% { box-shadow: inset 0 0 120px rgba(34,197,94,0.5); }
    60% { box-shadow: inset 0 0 60px rgba(34,197,94,0.3); }
    80% { box-shadow: inset 0 0 80px rgba(34,197,94,0.4); }
    100% { box-shadow: inset 0 0 0 rgba(34,197,94,0); }
  }

  @keyframes taskRainbowShift {
    0% { background-position: 0% center; }
    100% { background-position: 200% center; }
  }

  @keyframes taskCoinFloat {
    0% { transform: translateY(0) scale(1); opacity: 1; }
    100% { transform: translateY(-50px) scale(0.4); opacity: 0; }
  }

  @keyframes taskStampIn {
    0% { transform: scale(3) rotate(-5deg); opacity: 0; }
    60% { transform: scale(0.95) rotate(1deg); opacity: 1; }
    100% { transform: scale(1) rotate(0deg); opacity: 1; }
  }

  @keyframes taskScreenShake {
    0%, 100% { transform: translateX(0); }
    10% { transform: translateX(-6px); }
    20% { transform: translateX(5px); }
    30% { transform: translateX(-4px); }
    40% { transform: translateX(3px); }
    50% { transform: translateX(-2px); }
  }

  @keyframes taskRedFlash {
    0% { background: rgba(239,68,68,0.2); }
    100% { background: transparent; }
  }

  ${confettiKeyframes}
`;
