import { useState } from 'react';
import { COLORS, ZONE_COLORS } from '../../game/theme';

const STEPS = [
  { text: 'Welcome to AI Translation Office!', detail: 'You\'re a project manager at an AI translation company. Walk around the office to manage your business.' },
  { text: 'Visit the CEO Office (gold zone)', detail: 'Accept translation tasks and submit completed work for rating.', color: ZONE_COLORS.ceo },
  { text: 'Visit Language Experts (green zone)', detail: 'Assign languages to translators and monitor processing progress.', color: ZONE_COLORS.language },
  { text: 'Visit Tech Team (blue zone)', detail: 'Upgrade your AI\'s accuracy, hallucination rate, and speed.', color: ZONE_COLORS.tech },
  { text: 'Visit the Washroom (purple zone)', detail: 'Splash water and meditate to manage stress and fatigue.', color: ZONE_COLORS.toilet },
  { text: 'Controls', detail: 'Arrow keys or joystick to move. Tap the interact button (bottom-right) to open zone panels. Tap it again or press Escape to close.' },
  { text: 'Goal', detail: 'Earn $100,000 to win! But watch your reputation, money, and task failures — too many setbacks and it\'s game over.' },
];

const TUTORIAL_KEY = 'ai-office-tutorial-seen';

export function TutorialOverlay() {
  const [seen] = useState(() => localStorage.getItem(TUTORIAL_KEY) === '1');
  const [step, setStep] = useState(0);
  const [dismissed, setDismissed] = useState(seen);

  if (dismissed) return null;

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const dismiss = () => {
    localStorage.setItem(TUTORIAL_KEY, '1');
    setDismissed(true);
  };

  return (
    <div style={overlayStyle}>
      <div style={cardStyle}>
        {/* Step indicator */}
        <div style={{ display: 'flex', gap: 4, justifyContent: 'center', marginBottom: 16 }}>
          {STEPS.map((_, i) => (
            <div key={i} style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: i === step ? '#6366f1' : 'rgba(255,255,255,0.15)',
              transition: 'background 0.2s',
            }} />
          ))}
        </div>

        <h2 style={{
          color: current.color || COLORS.textPrimary,
          fontSize: 20,
          fontWeight: 700,
          margin: '0 0 10px 0',
          textAlign: 'center',
        }}>
          {current.text}
        </h2>

        <p style={{
          color: COLORS.textSecondary,
          fontSize: 14,
          margin: '0 0 24px 0',
          textAlign: 'center',
          lineHeight: 1.5,
        }}>
          {current.detail}
        </p>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          {step > 0 && (
            <button style={secondaryBtnStyle} onClick={() => setStep(s => s - 1)}>
              Back
            </button>
          )}
          {!isLast ? (
            <button style={primaryBtnStyle} onClick={() => setStep(s => s + 1)}>
              Next
            </button>
          ) : (
            <button style={primaryBtnStyle} onClick={dismiss}>
              Let's Go!
            </button>
          )}
          {!isLast && (
            <button style={skipBtnStyle} onClick={dismiss}>
              Skip
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0, 0, 0, 0.7)',
  backdropFilter: 'blur(6px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 600,
  fontFamily: 'system-ui, -apple-system, sans-serif',
};

const cardStyle: React.CSSProperties = {
  background: 'rgba(15, 15, 35, 0.95)',
  borderRadius: 16,
  padding: '32px 40px',
  maxWidth: 420,
  width: '90%',
  border: '1px solid rgba(255,255,255,0.08)',
  boxShadow: '0 24px 48px rgba(0,0,0,0.5)',
};

const primaryBtnStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  border: 'none',
  color: '#fff',
  borderRadius: 8,
  padding: '10px 24px',
  fontSize: 14,
  fontWeight: 700,
  cursor: 'pointer',
  fontFamily: 'system-ui',
};

const secondaryBtnStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.12)',
  color: COLORS.textSecondary,
  borderRadius: 8,
  padding: '10px 20px',
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'system-ui',
};

const skipBtnStyle: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  color: COLORS.textMuted,
  fontSize: 13,
  cursor: 'pointer',
  fontFamily: 'system-ui',
  padding: '10px 12px',
};
