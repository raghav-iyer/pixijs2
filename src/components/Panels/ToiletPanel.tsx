import { useGame } from '../../game/GameContext';
import { PanelOverlay } from './PanelOverlay';
import { StatGauge } from './StatGauge';
import { COLORS, ZONE_COLORS, buttonStyle } from '../../game/theme';
import { BALANCE } from '../../game/balance';

const FLAVOR_TEXTS = [
  'The Bisleri water cooler gurgles in the corner.',
  'Someone stuck a \'Swachh Bharat\' poster on the mirror.',
  'The smell of phenyl is oddly calming.',
  'A half-empty bottle of Hajmola sits on the shelf.',
  'The tap water is suspicious. Stick to the water cooler.',
];

export function ToiletPanel() {
  const { state, dispatch } = useGame();
  const accent = ZONE_COLORS.toilet;
  const { stress, fatigue, splashCooldown, breakActive, meditateActive, washroomLockout } = state;
  const locked = washroomLockout > 0;

  const flavorText = FLAVOR_TEXTS[Math.floor(state.dayTicks / 60) % FLAVOR_TEXTS.length];

  return (
    <PanelOverlay zone="toilet">
      {/* Lockout banner */}
      {locked && (
        <div style={{
          background: 'rgba(168, 85, 247, 0.15)',
          border: '1px solid rgba(168, 85, 247, 0.4)',
          borderRadius: 8,
          padding: '8px 14px',
          marginBottom: 16,
          textAlign: 'center',
        }}>
          <span style={{ color: '#a855f7', fontSize: 13, fontWeight: 700 }}>
            Washroom Locked — {washroomLockout}s
          </span>
          <div style={{ color: COLORS.textMuted, fontSize: 11, marginTop: 2 }}>
            Someone else is using it. Come back later.
          </div>
        </div>
      )}

      {/* Stress & Fatigue gauges */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 40, marginBottom: 24 }}>
        <StatGauge label="Stress" value={stress} color="#ef4444" invert />
        <StatGauge label="Fatigue" value={fatigue} color="#f59e0b" invert />
      </div>

      <p style={{ color: COLORS.textMuted, fontSize: 13, textAlign: 'center', fontStyle: 'italic', marginBottom: 20 }}>
        {flavorText}
      </p>

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, opacity: locked ? 0.4 : 1, pointerEvents: locked ? 'none' : 'auto' }}>
        {/* Splash Water */}
        <ActionRow
          title="Splash Water"
          description={`Instant -${BALANCE.splashStressReduction} stress`}
          accent={accent}
          disabled={splashCooldown > 0}
          disabledText={`Cooldown: ${splashCooldown}s`}
          onClick={() => dispatch({ type: 'REDUCE_STRESS', method: 'splash' })}
        />

        {/* Splash Face */}
        <ActionRow
          title="Splash Face"
          description={`${BALANCE.breakDurationTicks}s wait, -${BALANCE.breakStressReduction} stress`}
          accent={accent}
          disabled={breakActive}
          disabledText={`In progress: ${state.breakTicksLeft}s left`}
          onClick={() => dispatch({ type: 'REDUCE_STRESS', method: 'break' })}
        />

        {/* Meditate */}
        <ActionRow
          title="Meditate"
          description={`${BALANCE.meditateDurationTicks}s wait, -${BALANCE.meditateStressReduction} stress`}
          accent={accent}
          disabled={meditateActive}
          disabledText={`In progress: ${state.meditateTicksLeft}s left`}
          onClick={() => dispatch({ type: 'REDUCE_STRESS', method: 'meditate' })}
        />
      </div>
    </PanelOverlay>
  );
}

function ActionRow({ title, description, accent, disabled, disabledText, onClick }: {
  title: string;
  description: string;
  accent: string;
  disabled: boolean;
  disabledText: string;
  onClick: () => void;
}) {
  return (
    <div style={actionRowStyle}>
      <div style={{ flex: 1 }}>
        <span style={{ color: COLORS.textPrimary, fontSize: 14, fontWeight: 600 }}>{title}</span>
        <div style={{ color: COLORS.textMuted, fontSize: 12, marginTop: 2 }}>
          {disabled ? disabledText : description}
        </div>
      </div>
      <button
        style={{
          ...buttonStyle(accent),
          opacity: disabled ? 0.4 : 1,
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
        onClick={() => !disabled && onClick()}
        disabled={disabled}
      >
        {disabled ? 'Wait' : 'Go'}
      </button>
    </div>
  );
}

const actionRowStyle: React.CSSProperties = {
  background: COLORS.cardBg,
  borderRadius: 8,
  padding: '12px 14px',
  display: 'flex',
  alignItems: 'center',
  gap: 10,
};
