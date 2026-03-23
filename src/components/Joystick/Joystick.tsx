import { useRef, useCallback, useState, type RefObject } from "react";

interface JoystickProps {
  inputRef: RefObject<{ dx: number; dy: number }>;
}

const BASE_SIZE = 160;
const STICK_SIZE = 64;
const MAX_DIST = (BASE_SIZE - STICK_SIZE) / 2; // 48px — more travel needed
const DEAD_ZONE = 0.15; // Ignore stick deflection below 15%

export const Joystick = ({ inputRef }: JoystickProps) => {
  const stickRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef({ x: 0, y: 0 });
  const touchIdRef = useRef<number | null>(null);
  const [dragging, setDragging] = useState(false);

  const updateStick = useCallback(
    (clientX: number, clientY: number) => {
      const rawDx = clientX - centerRef.current.x;
      const rawDy = clientY - centerRef.current.y;
      const dist = Math.sqrt(rawDx * rawDx + rawDy * rawDy);
      const clamped = Math.min(dist, MAX_DIST);
      const angle = Math.atan2(rawDy, rawDx);

      const offsetX = clamped * Math.cos(angle);
      const offsetY = clamped * Math.sin(angle);

      if (stickRef.current) {
        stickRef.current.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      }

      // Normalize to 0..1 magnitude
      const rawMag = dist > 0 ? clamped / MAX_DIST : 0;

      if (rawMag < DEAD_ZONE) {
        // Inside dead zone — no movement
        inputRef.current!.dx = 0;
        inputRef.current!.dy = 0;
      } else {
        // Remap [DEAD_ZONE..1] to [0..1], then apply cubic damping
        const scaled = (rawMag - DEAD_ZONE) / (1 - DEAD_ZONE);
        const damped = scaled * scaled * scaled; // cubic curve
        const dirX = rawDx / dist;
        const dirY = rawDy / dist;
        inputRef.current!.dx = dirX * damped;
        inputRef.current!.dy = dirY * damped;
      }
    },
    [inputRef]
  );

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (touchIdRef.current !== null) return;
      const touch = e.changedTouches[0];
      touchIdRef.current = touch.identifier;

      const base = e.currentTarget.getBoundingClientRect();
      centerRef.current = {
        x: base.left + base.width / 2,
        y: base.top + base.height / 2,
      };
      setDragging(true);
      updateStick(touch.clientX, touch.clientY);
    },
    [updateStick]
  );

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === touchIdRef.current) {
          updateStick(touch.clientX, touch.clientY);
          break;
        }
      }
    },
    [updateStick]
  );

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === touchIdRef.current) {
          touchIdRef.current = null;
          setDragging(false);
          if (stickRef.current) {
            stickRef.current.style.transform = "translate(0px, 0px)";
          }
          inputRef.current!.dx = 0;
          inputRef.current!.dy = 0;
          break;
        }
      }
    },
    [inputRef]
  );

  return (
    <>
      <style>{joystickKeyframes}</style>
      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
        style={{
          position: "fixed",
          bottom: 24,
          left: 24,
          width: BASE_SIZE,
          height: BASE_SIZE,
          borderRadius: "50%",
          background: dragging
            ? "rgba(255,255,255,0.2)"
            : "rgba(255,255,255,0.12)",
          border: `2px solid ${dragging ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.25)"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          touchAction: "none",
          pointerEvents: "auto",
          zIndex: 1000,
          userSelect: "none",
          WebkitUserSelect: "none",
          boxShadow: dragging
            ? "0 0 24px rgba(255,255,255,0.15), inset 0 0 20px rgba(255,255,255,0.05)"
            : "0 0 16px rgba(255,255,255,0.08)",
          transition: "background 0.2s, border-color 0.2s, box-shadow 0.2s",
          animation: dragging ? "none" : "joystickBreath 3s ease-in-out infinite",
        }}
      >
        <div
          ref={stickRef}
          style={{
            width: STICK_SIZE,
            height: STICK_SIZE,
            borderRadius: "50%",
            background: dragging
              ? "rgba(255,255,255,0.65)"
              : "rgba(255,255,255,0.4)",
            pointerEvents: "none",
            transition: "background 0.15s",
            boxShadow: dragging
              ? "0 0 12px rgba(255,255,255,0.3)"
              : "0 0 6px rgba(255,255,255,0.15)",
          }}
        />
      </div>
    </>
  );
};

const joystickKeyframes = `
@keyframes joystickBreath {
  0%, 100% { box-shadow: 0 0 16px rgba(255,255,255,0.08); }
  50% { box-shadow: 0 0 24px rgba(255,255,255,0.14); }
}
`;
