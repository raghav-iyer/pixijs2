import type { RandomEvent } from './types';
import { registerEventGenerator } from './useGameTick';

const EVENT_POOL: RandomEvent[] = [
  {
    id: 'chai-break',
    name: 'Chai Break',
    description: 'The office chaiwala brought everyone cutting chai!',
    effect: { stressMod: -15 },
    duration: 0,
    severity: 'info',
  },
  {
    id: 'bandh-declared',
    name: 'Bandh Declared',
    description: 'A sudden bandh is called! Clients want everything before shutdown.',
    effect: { deadlineMod: 0.5 },
    duration: 0,
    severity: 'error',
  },
  {
    id: 'power-cut',
    name: 'Power Cut',
    description: 'Inverter backup kicked in but the AI is running slow.',
    effect: { accuracyMod: -20 },
    duration: 60,
    severity: 'error',
  },
  {
    id: 'client-complaint',
    name: 'Client Complaint',
    description: 'A client ranted on Twitter about bad translation quality.',
    effect: { reputationMod: -10 },
    duration: 0,
    severity: 'warning',
  },
  {
    id: 'festival-bonus',
    name: 'Festival Bonus',
    description: 'Happy Diwali! Clients are in a generous mood — bonus reputation.',
    effect: { reputationMod: 8 },
    duration: 0,
    severity: 'info',
  },
  {
    id: 'translator-on-leave',
    name: 'Translator on Leave',
    description: 'A translator took sudden chutti. One language may fail.',
    effect: { failLanguage: true },
    duration: 0,
    severity: 'warning',
  },
  {
    id: 'samosa-delivery',
    name: 'Samosa Delivery',
    description: 'Someone ordered samosas and jalebi for the whole office!',
    effect: { stressMod: -15 },
    duration: 0,
    severity: 'info',
  },
  {
    id: 'server-jugaad',
    name: 'Server Jugaad',
    description: 'The IT guy did some jugaad — server speed temporarily boosted!',
    effect: { speedMod: 15 },
    duration: 60,
    severity: 'info',
  },
];

let lastEventId: string | null = null;

function getRandomEvent(): RandomEvent | null {
  // Don't repeat the same event twice in a row
  const pool = EVENT_POOL.filter(e => e.id !== lastEventId);
  if (pool.length === 0) return null;
  const event = pool[Math.floor(Math.random() * pool.length)];
  lastEventId = event.id;
  return event;
}

// Register with game tick system
registerEventGenerator(getRandomEvent);
