import { Application } from '@pixi/react'
import { useEffect, useCallback, useState, useRef, useMemo } from 'react';
import { CalculateCanvasSize } from '../../helpers/common';
import { MainContainer } from './MainContainer/MainContainer';
import { Joystick } from '../Joystick/Joystick';
import { HUD } from '../HUD/HUD';
import { ZonePrompt, NoZoneHint } from '../HUD/ZonePrompt';
import { ZoneHighlights } from '../HUD/ZoneHighlights';
import { PanelRouter } from '../Panels/PanelRouter';
import { EventBanner } from '../Notifications/EventBanner';
import { NotificationToast } from '../Notifications/NotificationToast';
import { GameOverScreen } from '../GameOver/GameOverScreen';
import { InteractButton } from '../HUD/MobileInteractButton';
import { TutorialOverlay } from '../HUD/TutorialOverlay';
import { TaskResultOverlay } from '../HUD/TaskResultOverlay';
import { useGame } from '../../game/GameContext';
import { useGameTick } from '../../game/useGameTick';
import { getZoneNeeds } from '../../game/zoneNeeds';
import '../../game/events'; // Register random event generator
import type { ZoneId } from '../../game/types';

interface ExperienceProps {
  selectedCharacter: string;
}

export const Experience = ({ selectedCharacter }: ExperienceProps) => {
  const [canvasSize, setCanvasSize] = useState(CalculateCanvasSize());
  const inputRef = useRef({ dx: 0, dy: 0 });
  const { state, dispatch } = useGame();

  // Interaction feedback state
  const [interactFeedback, setInteractFeedback] = useState<'none' | 'ok' | 'not-needed'>('none');
  const [showNoZoneHint, setShowNoZoneHint] = useState(false);
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useGameTick(dispatch, state.gamePhase === 'playing');

  const needs = useMemo(() => getZoneNeeds(state), [state]);

  const updateCanvasSize = useCallback(() => {
    setCanvasSize(CalculateCanvasSize());
  }, []);

  useEffect(() => {
    window.addEventListener('resize', updateCanvasSize);
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [updateCanvasSize]);

  const handleZoneChange = useCallback((zone: string | null) => {
    dispatch({ type: 'SET_ZONE', zone: zone as ZoneId });
  }, [dispatch]);

  const triggerFeedback = useCallback((type: 'ok' | 'not-needed' | 'no-zone') => {
    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);

    if (type === 'no-zone') {
      setShowNoZoneHint(true);
      feedbackTimerRef.current = setTimeout(() => setShowNoZoneHint(false), 1500);
    } else {
      setInteractFeedback(type);
      feedbackTimerRef.current = setTimeout(() => setInteractFeedback('none'), 600);
    }
  }, []);

  const handleInteract = useCallback(() => {
    if (state.activePanel) {
      // Close panel
      dispatch({ type: 'CLOSE_PANEL' });
      return;
    }

    if (!state.currentZone) {
      // Not in any zone — show hint
      triggerFeedback('no-zone');
      return;
    }

    const need = needs[state.currentZone];
    if (need.urgent) {
      // Zone needs attention — open panel with success flash
      triggerFeedback('ok');
      dispatch({ type: 'OPEN_PANEL', panel: state.currentZone });
    } else {
      // Zone doesn't need attention — show "not needed" shake + still open
      triggerFeedback('not-needed');
      // Still open the panel after a brief delay so the shake is visible
      setTimeout(() => {
        dispatch({ type: 'OPEN_PANEL', panel: state.currentZone });
      }, 400);
    }
  }, [state.currentZone, state.activePanel, dispatch, needs, triggerFeedback]);

  return (
    <>
      <Application
        width={canvasSize.width}
        height={canvasSize.height}
        background={0x000000}
      >
        <MainContainer
          canvassize={canvasSize}
          selectedCharacter={selectedCharacter}
          inputRef={inputRef}
          onZoneChange={handleZoneChange}
          onInteract={handleInteract}
        />
      </Application>
      <Joystick inputRef={inputRef} />
      <ZoneHighlights canvasWidth={canvasSize.width} canvasHeight={canvasSize.height} />
      <HUD />
      <ZonePrompt interactFeedback={interactFeedback} />
      <NoZoneHint visible={showNoZoneHint} />
      <PanelRouter />
      <InteractButton onInteract={handleInteract} />
      <EventBanner />
      <NotificationToast />
      <TaskResultOverlay />
      <GameOverScreen />
      <TutorialOverlay />
    </>
  );
};
