import { useRef, useCallback, type RefObject } from "react";

interface JoystickProps {
  inputRef: RefObject<{ dx: number; dy: number }>;
}

const BASE_SIZE = 120;
const STICK_SIZE = 50;
const MAX_DIST = (BASE_SIZE - STICK_SIZE) / 2;

export const Joystick = ({ inputRef }: JoystickProps) => {
  const stickRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef({ x: 0, y: 0 });
  const touchIdRef = useRef<number | null>(null);

  const updateStick = useCallback(
    (clientX: number, clientY: number) => {
      const dx = clientX - centerRef.current.x;
      const dy = clientY - centerRef.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const clamped = Math.min(dist, MAX_DIST);
      const angle = Math.atan2(dy, dx);

      const offsetX = clamped * Math.cos(angle);
      const offsetY = clamped * Math.sin(angle);

      if (stickRef.current) {
        stickRef.current.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      }

      // Normalize to -1..1
      inputRef.current!.dx = dist > 0 ? (offsetX / MAX_DIST) : 0;
      inputRef.current!.dy = dist > 0 ? (offsetY / MAX_DIST) : 0;
    },
    [inputRef]
  );

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (touchIdRef.current !== null) return; // already tracking a touch
      const touch = e.changedTouches[0];
      touchIdRef.current = touch.identifier;

      const base = e.currentTarget.getBoundingClientRect();
      centerRef.current = {
        x: base.left + base.width / 2,
        y: base.top + base.height / 2,
      };
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
    <div
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchEnd}
      style={{
        position: "fixed",
        bottom: 32,
        left: 32,
        width: BASE_SIZE,
        height: BASE_SIZE,
        borderRadius: "50%",
        background: "rgba(255,255,255,0.15)",
        border: "2px solid rgba(255,255,255,0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        touchAction: "none",
        pointerEvents: "auto",
        zIndex: 1000,
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
    >
      <div
        ref={stickRef}
        style={{
          width: STICK_SIZE,
          height: STICK_SIZE,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.5)",
          pointerEvents: "none",
          transition: "none",
        }}
      />
    </div>
  );
};
