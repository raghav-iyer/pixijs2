export type ZoneId = 'ceo' | 'tech' | 'language' | 'toilet' | null;

export interface AIStats {
  accuracy: number;      // 0-100
  hallucination: number; // 0-100 (lower is better)
  speed: number;         // 0-100
}

export interface LanguageJob {
  language: string;
  elapsed: number;       // ticks elapsed
  duration: number;      // ticks needed
  failed: boolean;
  completed: boolean;
  retries: number;
}

export interface Task {
  id: string;
  title: string;
  languages: string[];
  deadline: number;        // ticks remaining
  reward: number;          // money on completion
  reputationBonus: number;
  difficulty: number;      // 1-5
  accepted: boolean;
  languageJobs: LanguageJob[];
  processing: boolean;     // languages currently being processed
  completed: boolean;
  rating: number;          // 1-5 stars, set on submission
}

export interface RandomEvent {
  id: string;
  name: string;
  description: string;
  effect: EventEffect;
  duration: number;        // ticks (0 = instant)
  severity: 'info' | 'warning' | 'error';
}

export interface EventEffect {
  accuracyMod?: number;
  hallucinationMod?: number;
  speedMod?: number;
  reputationMod?: number;
  moneyMod?: number;
  stressMod?: number;
  failLanguage?: boolean;  // randomly fail one language
  deadlineMod?: number;    // multiplier (0.5 = halve deadlines)
}

export interface ActiveEvent {
  event: RandomEvent;
  ticksRemaining: number;
}

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  timestamp: number;
}

export type GamePhase = 'playing' | 'won' | 'lost';

export interface GameState {
  money: number;
  reputation: number;         // 0-100
  stress: number;             // 0-100
  fatigue: number;            // 0-100
  day: number;
  dayTicks: number;           // ticks elapsed in current day
  gamePhase: GamePhase;
  loseReason: string;

  ai: AIStats;
  currentZone: ZoneId;
  activePanel: ZoneId;

  availableTasks: Task[];
  activeTasks: Task[];
  completedTaskCount: number;
  majorFailCount: number;

  activeEvents: ActiveEvent[];
  notifications: Notification[];

  // Task result overlay
  taskResult: {
    type: 'success' | 'fail';
    title: string;
    rating?: number;
    reward?: number;
    repLoss?: number;
    timestamp: number;
  } | null;

  // Toilet cooldowns
  splashCooldown: number;     // ticks remaining
  breakActive: boolean;
  breakTicksLeft: number;
  meditateActive: boolean;
  meditateTicksLeft: number;
  washroomLockout: number;    // ticks remaining before washroom reopens
}

export type GameAction =
  | { type: 'SET_ZONE'; zone: ZoneId }
  | { type: 'OPEN_PANEL'; panel: ZoneId }
  | { type: 'CLOSE_PANEL' }
  | { type: 'TICK' }
  | { type: 'ACCEPT_TASK'; taskId: string }
  | { type: 'START_PROCESSING'; taskId: string }
  | { type: 'SUBMIT_TASK'; taskId: string }
  | { type: 'RETRY_LANGUAGE'; taskId: string; language: string }
  | { type: 'UPGRADE_AI'; stat: keyof AIStats; amount: number; cost: number; sideEffects: Partial<AIStats> }
  | { type: 'GENERATE_TASKS'; tasks: Task[] }
  | { type: 'REDUCE_STRESS'; method: 'splash' | 'break' | 'meditate' }
  | { type: 'TRIGGER_EVENT'; event: RandomEvent }
  | { type: 'ADD_NOTIFICATION'; notification: Notification }
  | { type: 'DISMISS_NOTIFICATION'; id: string }
  | { type: 'CHECK_WIN_LOSE' }
  | { type: 'CLEAR_TASK_RESULT' }
  | { type: 'RESET_GAME' };
