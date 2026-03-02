import type { Task, LanguageJob } from './types';
import { BALANCE } from './balance';

let taskIdCounter = 0;

const TASK_TITLES = [
  'NCERT Class 10 Science Chapter',
  'NCERT Class 12 History Textbook',
  'CBSE Board Exam Paper',
  'NCERT Hindi Sahitya Guide',
  'National Education Policy Document',
  'Kendriya Vidyalaya Circular',
  'NCERT Environmental Studies Manual',
  'UGC Research Paper Abstract',
  'IGNOU Course Material',
  'Navodaya Vidyalaya Handbook',
  'NCERT Class 8 Geography Atlas',
  'CBSE Practical Lab Manual',
  'NCERT Teacher Training Module',
  'Mid-Day Meal Scheme Notice',
  'Sarva Shiksha Abhiyan Report',
];

function pickRandom<T>(arr: readonly T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function generateTasks(day: number, reputation: number, count: number): Task[] {
  const tasks: Task[] = [];

  for (let i = 0; i < count; i++) {
    const difficulty = Math.min(5, Math.max(1, Math.floor(1 + day * 0.3 + Math.random() * 2)));
    const langCount = Math.min(5, Math.max(1, difficulty + Math.floor(Math.random() * 2) - 1));
    const languages = pickRandom(BALANCE.languages, langCount);

    const reward = BALANCE.baseReward + difficulty * BALANCE.rewardPerDifficulty + Math.floor(Math.random() * 500);
    const deadline = Math.max(30, BALANCE.baseDeadline + difficulty * BALANCE.deadlinePerDifficulty + Math.floor(Math.random() * 30));
    const reputationBonus = Math.floor(difficulty * 2 + reputation * 0.05);

    const languageJobs: LanguageJob[] = languages.map(lang => ({
      language: lang,
      elapsed: 0,
      duration: BALANCE.baseProcessingDuration + Math.floor(Math.random() * 10),
      failed: false,
      completed: false,
      retries: 0,
    }));

    const title = TASK_TITLES[Math.floor(Math.random() * TASK_TITLES.length)];

    tasks.push({
      id: `task-${++taskIdCounter}`,
      title: `${title} (${languages.join(', ')})`,
      languages,
      deadline,
      reward,
      reputationBonus,
      difficulty,
      accepted: false,
      languageJobs,
      processing: false,
      completed: false,
      rating: 0,
    });
  }

  return tasks;
}
