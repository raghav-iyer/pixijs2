import type { GameState, ZoneId } from './types';

export interface ZoneNeed {
  urgent: boolean;
  reason: string;
}

export function getZoneNeeds(state: GameState): Record<NonNullable<ZoneId>, ZoneNeed> {
  const { activeTasks, availableTasks, ai, stress } = state;

  // CEO: needs attention when no active tasks, or tasks ready to submit
  const readyToSubmit = activeTasks.filter(t => t.completed);
  const noActiveTasks = activeTasks.length === 0;
  const ceoUrgent = readyToSubmit.length > 0 || noActiveTasks;
  const ceoReason = readyToSubmit.length > 0
    ? `${readyToSubmit.length} task${readyToSubmit.length > 1 ? 's' : ''} ready to submit!`
    : noActiveTasks
      ? 'Accept new tasks to earn money'
      : 'Tasks in progress';

  // Language: needs attention when tasks accepted but not processing, or failed languages
  const needsProcessing = activeTasks.filter(t => t.accepted && !t.processing && !t.completed);
  const hasFailed = activeTasks.some(t => t.languageJobs.some(j => j.failed));
  const langUrgent = needsProcessing.length > 0 || hasFailed;
  const langReason = hasFailed
    ? 'Languages failed — retry needed!'
    : needsProcessing.length > 0
      ? `${needsProcessing.length} task${needsProcessing.length > 1 ? 's' : ''} waiting to process`
      : activeTasks.some(t => t.processing)
        ? 'Processing in progress...'
        : 'No tasks to process';

  // Tech: needs attention when AI stats are poor
  const techUrgent = ai.accuracy < 50 || ai.hallucination > 50 || ai.speed < 30;
  const techReason = ai.accuracy < 50
    ? 'AI accuracy is low — upgrade recommended'
    : ai.hallucination > 50
      ? 'Hallucination rate is high — fix it!'
      : ai.speed < 30
        ? 'AI speed is slow — tasks take too long'
        : 'AI is performing well';

  // Toilet: needs attention when stress is high (but not if locked)
  const washroomLocked = state.washroomLockout > 0;
  const toiletUrgent = stress > 60 && !washroomLocked;
  const toiletReason = washroomLocked
    ? `Washroom locked — ${state.washroomLockout}s`
    : stress > 80
      ? 'Stress critical! Visit the washroom NOW'
      : stress > 60
        ? 'Stress is building up — visit the washroom'
        : 'Stress is manageable';

  return {
    ceo: { urgent: ceoUrgent, reason: ceoReason },
    language: { urgent: langUrgent, reason: langReason },
    tech: { urgent: techUrgent, reason: techReason },
    toilet: { urgent: toiletUrgent, reason: toiletReason },
  };
}
