import { useGame } from '../../game/GameContext';
import { PanelOverlay } from './PanelOverlay';
import { COLORS, ZONE_COLORS, buttonStyle } from '../../game/theme';
import type { Task, LanguageJob } from '../../game/types';

export function LanguagePanel() {
  const { state, dispatch } = useGame();
  const accent = ZONE_COLORS.language;
  const { activeTasks } = state;

  const tasksWithJobs = activeTasks.filter(t => t.accepted);

  return (
    <PanelOverlay zone="language">
      {tasksWithJobs.length === 0 ? (
        <p style={{ color: COLORS.textMuted, fontSize: 14, textAlign: 'center' }}>
          No active tasks. Accept tasks from the CEO Office first.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {tasksWithJobs.map(task => (
            <TaskLanguageView
              key={task.id}
              task={task}
              accent={accent}
              onStartProcessing={() => dispatch({ type: 'START_PROCESSING', taskId: task.id })}
              onRetryLanguage={(lang) => dispatch({ type: 'RETRY_LANGUAGE', taskId: task.id, language: lang })}
            />
          ))}
        </div>
      )}
    </PanelOverlay>
  );
}

function TaskLanguageView({ task, accent, onStartProcessing, onRetryLanguage }: {
  task: Task;
  accent: string;
  onStartProcessing: () => void;
  onRetryLanguage: (lang: string) => void;
}) {
  const allDone = task.languageJobs.every(j => j.completed || j.failed);
  const hasFailed = task.languageJobs.some(j => j.failed);
  const isProcessing = task.processing;

  return (
    <div style={{ background: COLORS.cardBg, borderRadius: 10, padding: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ color: COLORS.textPrimary, fontSize: 14, fontWeight: 600 }}>{task.title}</span>
        {!isProcessing && !allDone && (
          <button style={buttonStyle(accent)} onClick={onStartProcessing}>
            Start All
          </button>
        )}
        {allDone && !hasFailed && (
          <span style={{ color: COLORS.success, fontSize: 12, fontWeight: 600 }}>All Complete!</span>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
        {task.languageJobs.map(job => (
          <LanguageJobCard key={job.language} job={job} accent={accent} onRetry={() => onRetryLanguage(job.language)} />
        ))}
      </div>
    </div>
  );
}

function LanguageJobCard({ job, accent, onRetry }: {
  job: LanguageJob;
  accent: string;
  onRetry: () => void;
}) {
  const progress = job.duration > 0 ? Math.min(100, (job.elapsed / job.duration) * 100) : 0;

  let statusColor = COLORS.textMuted;
  let statusText = 'Waiting';
  if (job.completed) {
    statusColor = COLORS.success;
    statusText = 'Done';
  } else if (job.failed) {
    statusColor = COLORS.error;
    statusText = `Failed (retry #${job.retries})`;
  } else if (job.elapsed > 0) {
    statusColor = accent;
    statusText = `${Math.round(progress)}%`;
  }

  return (
    <div style={langCardStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: COLORS.textPrimary, fontSize: 13, fontWeight: 600 }}>{job.language}</span>
        <span style={{ color: statusColor, fontSize: 11, fontWeight: 600 }}>{statusText}</span>
      </div>

      {/* Progress bar */}
      <div style={progressBarBg}>
        <div style={{
          height: '100%',
          width: `${progress}%`,
          background: job.failed ? COLORS.error : job.completed ? COLORS.success : accent,
          borderRadius: 2,
          transition: 'width 0.5s ease',
        }} />
      </div>

      {job.failed && (
        <button
          style={{ ...buttonStyle(COLORS.error), padding: '4px 10px', fontSize: 11, marginTop: 4 }}
          onClick={onRetry}
        >
          Retry
        </button>
      )}
    </div>
  );
}

const langCardStyle: React.CSSProperties = {
  background: 'rgba(15,15,35,0.6)',
  borderRadius: 8,
  padding: 10,
};

const progressBarBg: React.CSSProperties = {
  width: '100%',
  height: 4,
  background: 'rgba(255,255,255,0.06)',
  borderRadius: 2,
  marginTop: 6,
  overflow: 'hidden',
};
