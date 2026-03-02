import { useState, useEffect, useCallback } from "react";

/**
 * Returns CSS properties to rotate the entire UI 90° when the device
 * is held in portrait orientation, making it appear in landscape.
 * No auto-rotate — purely a CSS transform trick.
 */
export function useForcePortraitLandscape() {
  const calc = useCallback(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    return vh > vw; // portrait
  }, []);

  const [portrait, setPortrait] = useState(calc);

  useEffect(() => {
    const onResize = () => setPortrait(calc());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [calc]);

  const wrapperStyle: React.CSSProperties = portrait
    ? {
        position: "fixed",
        top: 0,
        left: 0,
        width: window.innerHeight,
        height: window.innerWidth,
        transformOrigin: "top left",
        transform: `rotate(90deg) translateY(-${window.innerWidth}px)`,
        overflow: "hidden",
      }
    : {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      };

  return { portrait, wrapperStyle };
}
