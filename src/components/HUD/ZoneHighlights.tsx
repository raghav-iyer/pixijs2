import { useMemo } from 'react';
import { useGame } from '../../game/GameContext';
import { getZoneNeeds } from '../../game/zoneNeeds';
import { ZONE_BOUNDS } from '../../game/zones';
import { ZONE_COLORS, ZONE_LABELS } from '../../game/theme';

interface ZoneHighlightsProps {
  canvasWidth: number;
  canvasHeight: number;
}

export function ZoneHighlights({ canvasWidth, canvasHeight }: ZoneHighlightsProps) {
  const { state } = useGame();
  const needs = useMemo(() => getZoneNeeds(state), [state]);

  const techZone = ZONE_BOUNDS.find(z => z.id === 'tech')!;
  const langZone = ZONE_BOUNDS.find(z => z.id === 'language')!;

  // Compute language zone progress: average across all active language jobs
  const langProgress = useMemo(() => {
    const processingTasks = state.activeTasks.filter(t => t.processing);
    if (processingTasks.length === 0) return null;
    const allJobs = processingTasks.flatMap(t => t.languageJobs);
    const total = allJobs.length;
    const done = allJobs.filter(j => j.completed).length;
    const failed = allJobs.filter(j => j.failed).length;
    const inProgress = allJobs.filter(j => !j.completed && !j.failed);
    const partialProgress = inProgress.reduce((s, j) => s + (j.duration > 0 ? j.elapsed / j.duration : 0), 0);
    return {
      percent: Math.round(((done + partialProgress) / total) * 100),
      done,
      failed,
      total,
      taskCount: processingTasks.length,
    };
  }, [state.activeTasks]);

  const showFloatingBars = !state.activePanel;

  return (
    <>
      <style>{pulseKeyframes}</style>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: canvasWidth,
        height: canvasHeight,
        pointerEvents: 'none',
        zIndex: 50,
      }}>
        {/* Urgent zone highlights */}
        {ZONE_BOUNDS.map(zone => {
          const need = needs[zone.id];
          const color = ZONE_COLORS[zone.id];
          const label = ZONE_LABELS[zone.id];

          if (!need.urgent) return null;

          const left = zone.x * canvasWidth;
          const top = zone.y * canvasHeight;
          const width = zone.w * canvasWidth;
          const height = zone.h * canvasHeight;

          return (
            <div key={zone.id}>
              {/* Pulsing zone border */}
              <div style={{
                position: 'absolute',
                left,
                top,
                width,
                height,
                border: `2px solid ${color}`,
                borderRadius: 8,
                animation: 'zonePulse 2s ease-in-out infinite',
                boxShadow: `inset 0 0 30px ${color}15, 0 0 20px ${color}20`,
                background: `${color}08`,
              }} />

              {/* Floating label badge */}
              <div style={{
                position: 'absolute',
                left: left + width / 2,
                top: top + 6,
                transform: 'translateX(-50%)',
                background: `${color}cc`,
                color: '#fff',
                fontSize: 10,
                fontWeight: 700,
                fontFamily: 'system-ui, -apple-system, sans-serif',
                padding: '2px 8px',
                borderRadius: 4,
                whiteSpace: 'nowrap',
                animation: 'badgeBounce 2s ease-in-out infinite',
                letterSpacing: '0.03em',
                textTransform: 'uppercase',
              }}>
                {label}
              </div>
            </div>
          );
        })}

        {/* Floating progress bars — visible when no panel is open */}
        {showFloatingBars && (
          <>
            {/* Tech zone: AI stats mini-bars */}
            <FloatingTechStats
              zone={techZone}
              ai={state.ai}
              canvasWidth={canvasWidth}
              canvasHeight={canvasHeight}
            />

            {/* Language zone: task processing progress */}
            {langProgress && (
              <FloatingLangProgress
                zone={langZone}
                progress={langProgress}
                canvasWidth={canvasWidth}
                canvasHeight={canvasHeight}
              />
            )}
          </>
        )}
      </div>
    </>
  );
}

function FloatingTechStats({ zone, ai, canvasWidth, canvasHeight }: {
  zone: { x: number; y: number; w: number; h: number };
  ai: { accuracy: number; hallucination: number; speed: number };
  canvasWidth: number;
  canvasHeight: number;
}) {
  const left = zone.x * canvasWidth;
  const top = zone.y * canvasHeight - 6;
  const width = zone.w * canvasWidth;

  const stats = [
    { label: 'ACC', value: ai.accuracy, color: '#22c55e' },
    { label: 'HAL', value: ai.hallucination, color: '#ef4444' },
    { label: 'SPD', value: ai.speed, color: '#3b82f6' },
  ];

  return (
    <div style={{
      position: 'absolute',
      left,
      top,
      width,
      transform: 'translateY(-100%)',
      display: 'flex',
      gap: 4,
      padding: '0 4px',
    }}>
      {stats.map(s => (
        <div key={s.label} style={{ flex: 1 }}>
          <div style={{
            fontSize: 8,
            fontWeight: 700,
            color: s.color,
            fontFamily: 'system-ui',
            marginBottom: 1,
            letterSpacing: '0.05em',
          }}>
            {s.label} {s.value}%
          </div>
          <div style={{
            height: 3,
            background: 'rgba(255,255,255,0.08)',
            borderRadius: 2,
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${s.value}%`,
              background: s.color,
              borderRadius: 2,
              transition: 'width 1s ease',
            }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function FloatingLangProgress({ zone, progress, canvasWidth, canvasHeight }: {
  zone: { x: number; y: number; w: number; h: number };
  progress: { percent: number; done: number; failed: number; total: number; taskCount: number };
  canvasWidth: number;
  canvasHeight: number;
}) {
  const left = zone.x * canvasWidth;
  const top = zone.y * canvasHeight - 6;
  const width = zone.w * canvasWidth;

  const barColor = progress.failed > 0 ? '#ef4444' : '#22c55e';

  return (
    <div style={{
      position: 'absolute',
      left,
      top,
      width,
      transform: 'translateY(-100%)',
      padding: '0 4px',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 1,
      }}>
        <span style={{
          fontSize: 8,
          fontWeight: 700,
          color: ZONE_COLORS.language,
          fontFamily: 'system-ui',
          letterSpacing: '0.05em',
        }}>
          {progress.taskCount} TASK{progress.taskCount > 1 ? 'S' : ''} — {progress.done}/{progress.total} langs
        </span>
        {progress.failed > 0 && (
          <span style={{ fontSize: 8, fontWeight: 700, color: '#ef4444', fontFamily: 'system-ui' }}>
            {progress.failed} FAILED
          </span>
        )}
      </div>
      <div style={{
        height: 3,
        background: 'rgba(255,255,255,0.08)',
        borderRadius: 2,
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${progress.percent}%`,
          background: barColor,
          borderRadius: 2,
          transition: 'width 1s ease',
        }} />
      </div>
    </div>
  );
}

const pulseKeyframes = `
@keyframes zonePulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.9; }
}
@keyframes badgeBounce {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(-3px); }
}
`;
