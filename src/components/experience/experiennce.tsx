import { Application } from '@pixi/react'
import { useEffect, useCallback, useState, useRef } from 'react';
import { CalculateCanvasSize } from '../../helpers/common';
import { MainContainer } from './MainContainer/MainContainer';
import { Joystick } from '../Joystick/Joystick';

interface ExperienceProps {
  selectedCharacter: string;
}

export const Experience = ({ selectedCharacter }: ExperienceProps) => {
  const [canvasSize, setCanvasSize] = useState(CalculateCanvasSize());
  const inputRef = useRef({ dx: 0, dy: 0 });

  const updateCanvasSize = useCallback(() => {
    setCanvasSize(CalculateCanvasSize());
  }, []);

  useEffect(() => {
    window.addEventListener('resize', updateCanvasSize);
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [updateCanvasSize]);

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
        />
      </Application>
      <Joystick inputRef={inputRef} />
    </>
  );
};
