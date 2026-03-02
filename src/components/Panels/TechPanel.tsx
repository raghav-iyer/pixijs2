import { useGame } from '../../game/GameContext';
import { PanelOverlay } from './PanelOverlay';
import { StatGauge } from './StatGauge';
import { COLORS, ZONE_COLORS, buttonStyle } from '../../game/theme';
import type { AIStats } from '../../game/types';

interface Upgrade {
  label: string;
  stat: keyof AIStats;
  amount: number;
  cost: number;
  sideEffects: Partial<AIStats>;
  description: string;
}

const UPGRADES: Upgrade[] = [
  { label: 'Accuracy +5%', stat: 'accuracy', amount: 5, cost: 500, sideEffects: { hallucination: 2 }, description: 'Fine-tune ECo-clubs content moderation — Hallucination +2%' },
  { label: 'Accuracy +10%', stat: 'accuracy', amount: 10, cost: 1200, sideEffects: { hallucination: 5, speed: -3 }, description: 'Upgrade ECo-clubs species classifier — Hallucination +5%, Speed -3%' },
  { label: 'Hallucination -5%', stat: 'hallucination', amount: -5, cost: 800, sideEffects: {}, description: 'Fix Hyped Messenger auto-translate garbling — no trade-offs' },
  { label: 'Hallucination -10%', stat: 'hallucination', amount: -10, cost: 2000, sideEffects: { speed: -5 }, description: 'Patch Hyped Messenger context hallucinations — Speed -5%' },
  { label: 'Speed +10%', stat: 'speed', amount: 10, cost: 300, sideEffects: { accuracy: -3 }, description: 'Optimize Fanbase booking engine response time — Accuracy -3%' },
  { label: 'Speed +20%', stat: 'speed', amount: 20, cost: 800, sideEffects: { accuracy: -5, hallucination: 3 }, description: 'Turbocharge Fanbase search indexing — Accuracy -5%, Hallucination +3%' },
];

export function TechPanel() {
  const { state, dispatch } = useGame();
  const accent = ZONE_COLORS.tech;
  const { ai, money } = state;

  const handleUpgrade = (upgrade: Upgrade) => {
    dispatch({
      type: 'UPGRADE_AI',
      stat: upgrade.stat,
      amount: upgrade.amount,
      cost: upgrade.cost,
      sideEffects: upgrade.sideEffects,
    });
  };

  return (
    <PanelOverlay zone="tech">
      {/* Product context */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 20 }}>
        {['ECo-clubs', 'Fanbase', 'Hyped Messenger'].map(product => (
          <span key={product} style={{
            color: COLORS.textSecondary,
            fontSize: 11,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            background: 'rgba(255,255,255,0.05)',
            padding: '4px 10px',
            borderRadius: 6,
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            {product}
          </span>
        ))}
      </div>

      {/* AI Stats gauges */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginBottom: 28 }}>
        <StatGauge label="Accuracy" value={ai.accuracy} color="#22c55e" />
        <StatGauge label="Hallucination" value={ai.hallucination} color="#ef4444" invert />
        <StatGauge label="Speed" value={ai.speed} color="#3b82f6" />
      </div>

      <div style={{ color: COLORS.textMuted, fontSize: 12, textAlign: 'center', marginBottom: 20 }}>
        Budget: <span style={{ color: COLORS.textPrimary, fontWeight: 700 }}>${money.toLocaleString()}</span>
      </div>

      {/* Upgrade options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {UPGRADES.map((upgrade, i) => {
          const canAfford = money >= upgrade.cost;
          return (
            <div key={i} style={upgradeRowStyle}>
              <div style={{ flex: 1 }}>
                <span style={{ color: COLORS.textPrimary, fontSize: 14, fontWeight: 600 }}>
                  {upgrade.label}
                </span>
                <span style={{ color: COLORS.textMuted, fontSize: 12, marginLeft: 10 }}>
                  {upgrade.description}
                </span>
              </div>
              <button
                style={{
                  ...buttonStyle(accent),
                  opacity: canAfford ? 1 : 0.4,
                  cursor: canAfford ? 'pointer' : 'not-allowed',
                }}
                onClick={() => canAfford && handleUpgrade(upgrade)}
                disabled={!canAfford}
              >
                ${upgrade.cost}
              </button>
            </div>
          );
        })}
      </div>
    </PanelOverlay>
  );
}

const upgradeRowStyle: React.CSSProperties = {
  background: COLORS.cardBg,
  borderRadius: 8,
  padding: '10px 14px',
  display: 'flex',
  alignItems: 'center',
  gap: 10,
};
