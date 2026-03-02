import type { GameState, GameAction, Task, LanguageJob } from './types';
import { BALANCE } from './balance';

export const initialState: GameState = {
  money: BALANCE.startMoney,
  reputation: BALANCE.startReputation,
  stress: 0,
  fatigue: 0,
  day: 1,
  dayTicks: 0,
  gamePhase: 'playing',
  loseReason: '',

  ai: {
    accuracy: BALANCE.startAccuracy,
    hallucination: BALANCE.startHallucination,
    speed: BALANCE.startSpeed,
  },

  currentZone: null,
  activePanel: null,

  availableTasks: [],
  activeTasks: [],
  completedTaskCount: 0,
  majorFailCount: 0,

  activeEvents: [],
  notifications: [],

  taskResult: null,

  splashCooldown: 0,
  breakActive: false,
  breakTicksLeft: 0,
  meditateActive: false,
  meditateTicksLeft: 0,
  washroomLockout: 0,
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function calculateRating(task: Task, ai: GameState['ai'], timeRemaining: number): number {
  const w = BALANCE;
  const accuracyScore = ai.accuracy / 100;
  const hallucinationScore = 1 - (ai.hallucination / 100);
  const timeScore = clamp(timeRemaining / (task.deadline + task.languageJobs.reduce((s, j) => s + j.duration, 0)), 0, 1);
  const failCount = task.languageJobs.reduce((s, j) => s + j.retries, 0);
  const failScore = Math.max(0, 1 - failCount * 0.2);

  const raw = (
    accuracyScore * w.ratingWeightAccuracy +
    hallucinationScore * w.ratingWeightHallucination +
    timeScore * w.ratingWeightTime +
    failScore * w.ratingWeightFailCount
  ) * 5;

  return clamp(Math.round(raw), 1, 5);
}

function tickLanguageJobs(task: Task, ai: GameState['ai'], fatigue: number): Task {
  if (!task.processing) return task;

  const jobs = task.languageJobs.map((job): LanguageJob => {
    if (job.completed || job.failed) return job;

    const newElapsed = job.elapsed + 1;
    if (newElapsed >= job.duration) {
      // Check for failure
      const failChance = Math.max(0,
        BALANCE.baseFailChance
        - ai.accuracy * BALANCE.accuracyFailReduction
        + ai.hallucination * BALANCE.hallucinationFailIncrease
        + fatigue * BALANCE.fatigueFailIncrease
      );
      const failed = Math.random() < failChance;
      return { ...job, elapsed: newElapsed, completed: !failed, failed };
    }
    return { ...job, elapsed: newElapsed };
  });

  const allDone = jobs.every(j => j.completed || j.failed);
  const allCompleted = jobs.every(j => j.completed);

  return {
    ...task,
    languageJobs: jobs,
    processing: !allDone,
    completed: allCompleted,
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  if (state.gamePhase !== 'playing' && action.type !== 'RESET_GAME') {
    return state;
  }

  switch (action.type) {
    case 'SET_ZONE':
      return { ...state, currentZone: action.zone };

    case 'OPEN_PANEL':
      return { ...state, activePanel: action.panel };

    case 'CLOSE_PANEL':
      return { ...state, activePanel: null };

    case 'TICK': {
      let s = { ...state };

      // Advance day
      s.dayTicks += 1;
      if (s.dayTicks >= BALANCE.dayDurationTicks) {
        s.day += 1;
        s.dayTicks = 0;
      }

      // Stress & fatigue
      s.stress = clamp(s.stress + BALANCE.stressPerTick, 0, 100);
      s.fatigue = clamp(s.fatigue + BALANCE.fatiguePerTick, 0, 100);

      // Toilet cooldowns
      if (s.splashCooldown > 0) s.splashCooldown -= 1;
      if (s.washroomLockout > 0) s.washroomLockout -= 1;
      if (s.breakActive) {
        s.breakTicksLeft -= 1;
        if (s.breakTicksLeft <= 0) {
          s.breakActive = false;
          s.stress = clamp(s.stress - BALANCE.breakStressReduction, 0, 100);
          s.washroomLockout = BALANCE.washroomLockoutTicks;
        }
      }
      if (s.meditateActive) {
        s.meditateTicksLeft -= 1;
        if (s.meditateTicksLeft <= 0) {
          s.meditateActive = false;
          s.stress = clamp(s.stress - BALANCE.meditateStressReduction, 0, 100);
          s.washroomLockout = BALANCE.washroomLockoutTicks;
        }
      }

      // Tick active tasks
      s.activeTasks = s.activeTasks.map(task => {
        let t = { ...task, deadline: task.deadline - 1 };
        t = tickLanguageJobs(t, s.ai, s.fatigue);

        // Apply active event modifiers to AI stats for processing
        // (handled via temporary stat mods in activeEvents)

        return t;
      });

      // Check for expired deadlines
      const expired = s.activeTasks.filter(t => t.deadline <= 0 && !t.completed);
      if (expired.length > 0) {
        const repLoss = expired.length * BALANCE.reputationLossPerMajorFail;
        s.majorFailCount += expired.length;
        s.reputation = clamp(s.reputation - repLoss, 0, 100);
        s.stress = clamp(s.stress + expired.length * BALANCE.stressPerMajorFail, 0, 100);
        s.activeTasks = s.activeTasks.filter(t => t.deadline > 0 || t.completed);
        // Show fail overlay for the first expired task
        s.taskResult = {
          type: 'fail',
          title: expired[0].title,
          repLoss,
          timestamp: Date.now(),
        };
        for (const t of expired) {
          s.notifications = [...s.notifications, {
            id: `fail-${t.id}-${Date.now()}`,
            message: `Task "${t.title}" expired! Major fail.`,
            type: 'error',
            timestamp: Date.now(),
          }];
        }
      }

      // Tick active events
      s.activeEvents = s.activeEvents
        .map(ae => ({ ...ae, ticksRemaining: ae.ticksRemaining - 1 }))
        .filter(ae => ae.ticksRemaining > 0);

      return s;
    }

    case 'ACCEPT_TASK': {
      const task = state.availableTasks.find(t => t.id === action.taskId);
      if (!task) return state;
      return {
        ...state,
        availableTasks: state.availableTasks.filter(t => t.id !== action.taskId),
        activeTasks: [...state.activeTasks, { ...task, accepted: true, processing: false }],
        notifications: [...state.notifications, {
          id: `accept-${task.id}-${Date.now()}`,
          message: `"${task.title}" accepted! Go to Language Experts to start processing.`,
          type: 'info',
          timestamp: Date.now(),
        }],
      };
    }

    case 'START_PROCESSING': {
      const task = state.activeTasks.find(t => t.id === action.taskId);
      return {
        ...state,
        activeTasks: state.activeTasks.map(t =>
          t.id === action.taskId ? { ...t, processing: true } : t
        ),
        notifications: task ? [...state.notifications, {
          id: `start-${action.taskId}-${Date.now()}`,
          message: `Processing started for "${task.title}"`,
          type: 'success',
          timestamp: Date.now(),
        }] : state.notifications,
      };
    }

    case 'SUBMIT_TASK': {
      const task = state.activeTasks.find(t => t.id === action.taskId);
      if (!task || !task.completed) return state;

      const rating = calculateRating(task, state.ai, task.deadline);
      const reputationGain = rating * BALANCE.reputationPerStar;
      const earnedReward = Math.round(task.reward * (rating / 3));

      return {
        ...state,
        money: state.money + earnedReward,
        reputation: clamp(state.reputation + reputationGain, 0, 100),
        activeTasks: state.activeTasks.filter(t => t.id !== action.taskId),
        completedTaskCount: state.completedTaskCount + 1,
        taskResult: {
          type: 'success',
          title: task.title,
          rating,
          reward: earnedReward,
          timestamp: Date.now(),
        },
        notifications: [...state.notifications, {
          id: `submit-${task.id}-${Date.now()}`,
          message: `Task "${task.title}" submitted! ${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}`,
          type: rating >= 3 ? 'success' : 'warning',
          timestamp: Date.now(),
        }],
      };
    }

    case 'RETRY_LANGUAGE': {
      return {
        ...state,
        activeTasks: state.activeTasks.map(t => {
          if (t.id !== action.taskId) return t;
          return {
            ...t,
            processing: true,
            languageJobs: t.languageJobs.map(j => {
              if (j.language !== action.language || !j.failed) return j;
              return { ...j, failed: false, elapsed: 0, retries: j.retries + 1 };
            }),
          };
        }),
      };
    }

    case 'UPGRADE_AI': {
      if (state.money < action.cost) return state;
      const newAi = { ...state.ai };
      newAi[action.stat] = clamp(newAi[action.stat] + action.amount, 0, 100);
      // Apply side effects
      for (const [key, val] of Object.entries(action.sideEffects)) {
        const k = key as keyof typeof newAi;
        newAi[k] = clamp(newAi[k] + (val as number), 0, 100);
      }
      return {
        ...state,
        money: state.money - action.cost,
        ai: newAi,
        notifications: [...state.notifications, {
          id: `upgrade-${Date.now()}`,
          message: `AI ${action.stat} upgraded! -$${action.cost}`,
          type: 'info',
          timestamp: Date.now(),
        }],
      };
    }

    case 'GENERATE_TASKS': {
      return {
        ...state,
        availableTasks: [...state.availableTasks, ...action.tasks],
      };
    }

    case 'REDUCE_STRESS': {
      if (state.washroomLockout > 0) return state; // Washroom is locked
      switch (action.method) {
        case 'splash':
          if (state.splashCooldown > 0) return state;
          return {
            ...state,
            stress: clamp(state.stress - BALANCE.splashStressReduction, 0, 100),
            splashCooldown: BALANCE.splashCooldownTicks,
            washroomLockout: BALANCE.washroomLockoutTicks,
          };
        case 'break':
          if (state.breakActive) return state;
          return { ...state, breakActive: true, breakTicksLeft: BALANCE.breakDurationTicks };
        case 'meditate':
          if (state.meditateActive) return state;
          return { ...state, meditateActive: true, meditateTicksLeft: BALANCE.meditateDurationTicks };
        default:
          return state;
      }
    }

    case 'TRIGGER_EVENT': {
      const { event } = action;
      let s = { ...state };
      const eff = event.effect;

      // Apply instant effects
      if (eff.reputationMod) s.reputation = clamp(s.reputation + eff.reputationMod, 0, 100);
      if (eff.moneyMod) s.money = s.money + eff.moneyMod;
      if (eff.stressMod) s.stress = clamp(s.stress + eff.stressMod, 0, 100);

      // Apply deadline modifier to all active tasks
      if (eff.deadlineMod) {
        s.activeTasks = s.activeTasks.map(t => ({
          ...t,
          deadline: Math.max(1, Math.round(t.deadline * eff.deadlineMod!)),
        }));
      }

      // Fail a random language job
      if (eff.failLanguage && s.activeTasks.length > 0) {
        const taskIdx = Math.floor(Math.random() * s.activeTasks.length);
        const task = s.activeTasks[taskIdx];
        const activeJobs = task.languageJobs.filter(j => !j.completed && !j.failed);
        if (activeJobs.length > 0) {
          const jobIdx = Math.floor(Math.random() * activeJobs.length);
          const targetLang = activeJobs[jobIdx].language;
          s.activeTasks = s.activeTasks.map((t, i) =>
            i === taskIdx ? {
              ...t,
              languageJobs: t.languageJobs.map(j =>
                j.language === targetLang ? { ...j, failed: true } : j
              ),
            } : t
          );
        }
      }

      // Duration-based effects (AI stat mods)
      if (event.duration > 0) {
        s.activeEvents = [...s.activeEvents, { event, ticksRemaining: event.duration }];
        // Apply temporary AI stat mods
        if (eff.accuracyMod) s.ai = { ...s.ai, accuracy: clamp(s.ai.accuracy + eff.accuracyMod, 0, 100) };
        if (eff.hallucinationMod) s.ai = { ...s.ai, hallucination: clamp(s.ai.hallucination + eff.hallucinationMod, 0, 100) };
        if (eff.speedMod) s.ai = { ...s.ai, speed: clamp(s.ai.speed + eff.speedMod, 0, 100) };
      }

      s.notifications = [...s.notifications, {
        id: `event-${event.id}-${Date.now()}`,
        message: event.description,
        type: event.severity === 'error' ? 'error' : event.severity === 'warning' ? 'warning' : 'info',
        timestamp: Date.now(),
      }];

      return s;
    }

    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.notification],
      };

    case 'DISMISS_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.id),
      };

    case 'CLEAR_TASK_RESULT':
      return { ...state, taskResult: null };

    case 'CHECK_WIN_LOSE': {
      if (state.money >= BALANCE.winMoney) {
        return { ...state, gamePhase: 'won' };
      }
      if (state.reputation <= BALANCE.loseReputation) {
        return { ...state, gamePhase: 'lost', loseReason: 'Your reputation dropped too low!' };
      }
      if (state.money < 0) {
        return { ...state, gamePhase: 'lost', loseReason: 'You went bankrupt!' };
      }
      if (state.majorFailCount >= BALANCE.loseMajorFails) {
        return { ...state, gamePhase: 'lost', loseReason: `${BALANCE.loseMajorFails} major task failures!` };
      }
      return state;
    }

    case 'RESET_GAME':
      return { ...initialState };

    default:
      return state;
  }
}
