import { Application } from '@pixi/react'
import { useEffect, useCallback, useState } from 'react';
import { CalculateCanvasSize } from '../../helpers/common';
import { MainContainer } from './MainContainer/MainContainer';

export const Experience = () => {
  const [canvasSize, setCanvasSize] = useState(CalculateCanvasSize());

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
    <Application
      width={canvasSize.width}
      height={canvasSize.height}
      // use whatever color you’d like; 0x000000 is black, 0xffffff white, etc.
      background={0x000000}
    >
      <MainContainer canvassize={canvasSize} />
    </Application>
  );
};