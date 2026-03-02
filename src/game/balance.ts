// All tunable game constants in one place

export const BALANCE = {
  // Starting values
  startMoney: 10000,
  startReputation: 50,
  startAccuracy: 60,
  startHallucination: 30,
  startSpeed: 40,

  // Win/lose thresholds
  winMoney: 100000,
  loseReputation: 20,
  loseMajorFails: 3,

  // Day settings
  dayDurationTicks: 180,     // 180 seconds = 3 minutes per day

  // Task generation
  minTasksAvailable: 3,
  maxTasksAvailable: 6,
  baseReward: 2000,
  rewardPerDifficulty: 500,
  baseDeadline: 75,          // ticks — tight deadlines
  deadlinePerDifficulty: -10,

  // Language processing
  baseProcessingDuration: 20,   // ticks per language — faster processing
  speedDurationReduction: 0.5,  // per speed point, ticks reduced
  baseFailChance: 0.18,         // 18% base fail chance per language
  accuracyFailReduction: 0.001, // per accuracy point
  hallucinationFailIncrease: 0.002, // per hallucination point
  fatigueFailIncrease: 0.0015,  // per fatigue point — fatigue hurts more

  // Stress & fatigue
  stressPerTick: 0.2,
  fatiguePerTick: 0.1,
  stressPerTaskFail: 12,
  stressPerMajorFail: 30,

  // Toilet actions
  splashStressReduction: 5,
  splashCooldownTicks: 20,
  breakStressReduction: 20,
  breakDurationTicks: 10,
  meditateStressReduction: 40,
  meditateDurationTicks: 20,

  // Washroom lockout
  washroomLockoutTicks: 60,    // 60s lockout after using any washroom action

  // Random events
  eventChancePerTick: 0.04,    // 4% per tick — events hit more often

  // Rating calculation weights
  ratingWeightAccuracy: 0.3,
  ratingWeightHallucination: 0.25,
  ratingWeightTime: 0.25,
  ratingWeightFailCount: 0.2,

  // Reputation
  reputationPerStar: 3,       // reputation gained per star rating
  reputationLossPerFail: 5,
  reputationLossPerMajorFail: 15,

  // Languages pool
  languages: [
    'Hindi', 'Tamil', 'Telugu', 'Bengali', 'Marathi',
    'Gujarati', 'Kannada', 'Malayalam', 'Punjabi', 'Odia',
    'Assamese', 'Urdu', 'Sanskrit', 'Konkani', 'Maithili',
  ],
} as const;
