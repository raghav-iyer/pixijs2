import { useEffect } from 'react';
import { useGame } from '../../game/GameContext';
import { PanelOverlay } from './PanelOverlay';
import { generateTasks } from '../../game/taskGenerator';
import { COLORS, ZONE_COLORS, buttonStyle } from '../../game/theme';
import { BALANCE } from '../../game/balance';
import type { Task } from '../../game/types';

const submitButtonKeyframes = `
  @keyframes submitPulse {
    0%, 100% { box-shadow: 0 0 8px rgba(251,191,36,0.3), 0 0 16px rgba(251,191,36,0.1); }
    50% { box-shadow: 0 0 16px rgba(251,191,36,0.6), 0 0 32px rgba(251,191,36,0.2); }
  }
  @keyframes submitShimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes taskRowShimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
`;

export function CEOPanel() {
  const { state, dispatch } = useGame();
  const accent = ZONE_COLORS.ceo;

  // Generate tasks if board is empty
  useEffect(() => {
    if (state.availableTasks.length < BALANCE.minTasksAvailable) {
      const count = BALANCE.maxTasksAvailable - state.availableTasks.length;
      const tasks = generateTasks(state.day, state.reputation, count);
      dispatch({ type: 'GENERATE_TASKS', tasks });
    }
  }, [state.availableTasks.length, state.day, state.reputation, dispatch]);

  const completedTasks = state.activeTasks.filter(t => t.completed);

  return (
    <PanelOverlay zone="ceo">
      <style>{submitButtonKeyframes}</style>
      {/* Task Board */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={sectionTitle}>Available Tasks</h3>
        {state.availableTasks.length === 0 ? (
          <p style={{ color: COLORS.textMuted, fontSize: 14 }}>No tasks available right now.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {state.availableTasks.map(task => (
              <TaskCard key={task.id} task={task} onAccept={() => dispatch({ type: 'ACCEPT_TASK', taskId: task.id })} accent={accent} />
            ))}
          </div>
        )}
      </div>

      {/* Active Tasks */}
      {state.activeTasks.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h3 style={sectionTitle}>Active Tasks</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {state.activeTasks.map(task => (
              <div key={task.id} style={{
                ...activeTaskStyle,
                ...(task.completed ? {
                  backgroundImage: 'linear-gradient(90deg, transparent 0%, rgba(251,191,36,0.06) 50%, transparent 100%)',
                  backgroundSize: '200% 100%',
                  animation: 'taskRowShimmer 3s linear infinite',
                  borderLeft: '2px solid rgba(251,191,36,0.4)',
                } : {}),
              }}>
                <div style={{ flex: 1 }}>
                  <span style={{ color: COLORS.textPrimary, fontSize: 14, fontWeight: 600 }}>{task.title}</span>
                  <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                    <span style={{ color: COLORS.textMuted, fontSize: 12 }}>
                      Deadline: {task.deadline}s
                    </span>
                    <span style={{ color: COLORS.textMuted, fontSize: 12 }}>
                      {task.processing ? 'Processing...' : task.completed ? 'Ready to submit!' : 'Go to Language Experts'}
                    </span>
                  </div>
                </div>
                {task.completed && (
                  <button
                    style={{
                      ...buttonStyle(accent),
                      background: 'linear-gradient(90deg, #f59e0b, #fbbf24, #f59e0b)',
                      backgroundSize: '200% auto',
                      animation: 'submitPulse 1.5s ease-in-out infinite, submitShimmer 2s linear infinite',
                      color: '#1a1a2e',
                      fontWeight: 800,
                      fontSize: 13,
                      letterSpacing: '0.04em',
                      border: '1px solid #fbbf24',
                    }}
                    onClick={() => dispatch({ type: 'SUBMIT_TASK', taskId: task.id })}
                  >
                    SUBMIT FOR REVIEW
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed count */}
      <div style={{ color: COLORS.textMuted, fontSize: 13, textAlign: 'center' }}>
        Completed: {state.completedTaskCount} tasks | Fails: {state.majorFailCount}/{BALANCE.loseMajorFails}
      </div>
    </PanelOverlay>
  );
}

function TaskCard({ task, onAccept, accent }: { task: Task; onAccept: () => void; accent: string }) {
  const difficultyStars = '★'.repeat(task.difficulty) + '☆'.repeat(5 - task.difficulty);

  return (
    <div style={taskCardStyle}>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: COLORS.textPrimary, fontSize: 14, fontWeight: 600 }}>{task.title}</span>
          <span style={{ color: accent, fontSize: 12 }}>{difficultyStars}</span>
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 6, flexWrap: 'wrap' }}>
          <span style={tagStyle}>
            ${task.reward.toLocaleString()}
          </span>
          <span style={tagStyle}>
            {task.deadline}s deadline
          </span>
          <span style={tagStyle}>
            {task.languages.length} lang{task.languages.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
      <button style={buttonStyle(accent)} onClick={onAccept}>
        Accept
      </button>
    </div>
  );
}

const sectionTitle: React.CSSProperties = {
  color: COLORS.textSecondary,
  fontSize: 13,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  marginBottom: 10,
  margin: '0 0 10px 0',
};

const taskCardStyle: React.CSSProperties = {
  background: COLORS.cardBg,
  borderRadius: 10,
  padding: 14,
  display: 'flex',
  alignItems: 'center',
  gap: 12,
};

const activeTaskStyle: React.CSSProperties = {
  background: 'rgba(35,35,70,0.6)',
  borderRadius: 8,
  padding: 12,
  display: 'flex',
  alignItems: 'center',
  gap: 10,
};

const tagStyle: React.CSSProperties = {
  color: COLORS.textMuted,
  fontSize: 12,
  background: 'rgba(255,255,255,0.04)',
  padding: '2px 8px',
  borderRadius: 4,
};
