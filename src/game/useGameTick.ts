import { useEffect, useRef } from 'react';
import type { GameAction, RandomEvent } from './types';
import { BALANCE } from './balance';

// Random events are imported lazily to avoid circular deps
// They'll be defined in events.ts (Chunk 6); for now use a placeholder
let getRandomEvent: (() => RandomEvent | null) | null = null;

export function registerEventGenerator(fn: () => RandomEvent | null) {
  getRandomEvent = fn;
}

export function useGameTick(dispatch: React.Dispatch<GameAction>, active: boolean) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!active) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      dispatch({ type: 'TICK' });
      dispatch({ type: 'CHECK_WIN_LOSE' });

      // Random event chance
      if (getRandomEvent && Math.random() < BALANCE.eventChancePerTick) {
        const event = getRandomEvent();
        if (event) {
          dispatch({ type: 'TRIGGER_EVENT', event });
        }
      }
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [dispatch, active]);
}
