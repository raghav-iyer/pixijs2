export const isPortrait = () =>
  window.innerHeight > window.innerWidth;

export const CalculateCanvasSize = () => {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // In portrait mode, we'll rotate the view 90°, so the canvas
  // should use the swapped dimensions (height becomes width).
  if (isPortrait()) {
    return { width: vh, height: vw };
  }

  return { width: vw, height: vh };
};

// Safe area insets — keeps the character visible between HUD and controls
export const HUD_HEIGHT = 44;
export const BOTTOM_CONTROLS_HEIGHT = 110;

export const getSafeArea = (canvasW: number, canvasH: number) => ({
  top: HUD_HEIGHT,
  bottom: BOTTOM_CONTROLS_HEIGHT,
  playableHeight: canvasH - HUD_HEIGHT - BOTTOM_CONTROLS_HEIGHT,
  width: canvasW,
});
