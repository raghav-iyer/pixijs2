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
