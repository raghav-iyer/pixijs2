import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { extend, useTick } from "@pixi/react";
import {
  AnimatedSprite,
  Assets,
  Rectangle,
  Texture,
} from "pixi.js";
import { type CollisionBox, overlaps } from "../../collisions";

extend({ AnimatedSprite });

interface CharacterProps {
  walkSheetUrl: string;
  idleSheetUrl: string;
  walkFrameCount: number;
  idleFrameCount: number;
  startX: number;
  startY: number;
  scale?: number;
  canvasWidth: number;
  canvasHeight: number;
  inputRef: RefObject<{ dx: number; dy: number }>;
  collisionBoxes: CollisionBox[];
}

function sliceFrames(
  baseTexture: Texture,
  frameCount: number
): Texture[] {
  const frameWidth = baseTexture.width / frameCount;
  const frameHeight = baseTexture.height;
  const frames: Texture[] = [];
  for (let i = 0; i < frameCount; i++) {
    const rect = new Rectangle(i * frameWidth, 0, frameWidth, frameHeight);
    frames.push(new Texture({ source: baseTexture.source, frame: rect }));
  }
  return frames;
}

const ARROW_KEYS = new Set(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"]);
const SPEED = 3;
// Player hitbox size (fraction of canvas height, centered on sprite anchor)
const HITBOX_W = 20;
const HITBOX_H = 10;

export const Character = ({
  walkSheetUrl,
  idleSheetUrl,
  walkFrameCount,
  idleFrameCount,
  startX,
  startY,
  scale = 1,
  canvasWidth,
  canvasHeight,
  inputRef,
  collisionBoxes,
}: CharacterProps) => {
  const walkFramesRef = useRef<Texture[]>([]);
  const idleFramesRef = useRef<Texture[]>([]);
  const [ready, setReady] = useState(false);

  const posRef = useRef({ x: startX, y: startY });
  const facingRef = useRef<1 | -1>(1);
  const keysRef = useRef(new Set<string>());
  const spriteRef = useRef<AnimatedSprite | null>(null);
  const isMovingRef = useRef(false);

  // Load sprite sheets
  useEffect(() => {
    let cancelled = false;
    Promise.all([Assets.load(walkSheetUrl), Assets.load(idleSheetUrl)]).then(
      ([walkTex, idleTex]) => {
        if (cancelled) return;
        walkFramesRef.current = sliceFrames(walkTex, walkFrameCount);
        idleFramesRef.current = sliceFrames(idleTex, idleFrameCount);
        setReady(true);
      }
    );
    return () => { cancelled = true; };
  }, [walkSheetUrl, idleSheetUrl, walkFrameCount, idleFrameCount]);

  // Recalculate inputRef from held keys
  const syncKeysToInput = useCallback(() => {
    let dx = 0;
    let dy = 0;
    if (keysRef.current.has("ArrowLeft")) dx -= 1;
    if (keysRef.current.has("ArrowRight")) dx += 1;
    if (keysRef.current.has("ArrowUp")) dy -= 1;
    if (keysRef.current.has("ArrowDown")) dy += 1;
    inputRef.current!.dx = dx;
    inputRef.current!.dy = dy;
  }, [inputRef]);

  // Keyboard input — writes to shared inputRef
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (ARROW_KEYS.has(e.key)) {
        e.preventDefault();
        keysRef.current.add(e.key);
        syncKeysToInput();
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (ARROW_KEYS.has(e.key)) {
        e.preventDefault();
        keysRef.current.delete(e.key);
        syncKeysToInput();
      }
    };
    const onBlur = () => {
      keysRef.current.clear();
      inputRef.current!.dx = 0;
      inputRef.current!.dy = 0;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
    };
  }, [inputRef, syncKeysToInput]);

  // Game loop — reads inputRef for movement, applies collision per-axis
  useTick((ticker) => {
    const sprite = spriteRef.current;
    const walkFrames = walkFramesRef.current;
    const idleFrames = idleFramesRef.current;
    if (!sprite || walkFrames.length === 0 || idleFrames.length === 0) return;

    let dx = inputRef.current!.dx;
    let dy = inputRef.current!.dy;
    const moving = dx !== 0 || dy !== 0;

    // Position update
    if (moving) {
      const dt = ticker.deltaTime;

      // Normalize diagonal
      const len = Math.sqrt(dx * dx + dy * dy);
      if (len > 1) {
        dx /= len;
        dy /= len;
      }

      const newX = posRef.current.x + SPEED * dx * dt;
      const newY = posRef.current.y + SPEED * dy * dt;

      // Collision check per-axis (allows wall sliding)
      // Player hitbox: centered on x, bottom-anchored on y
      const hbHalfW = HITBOX_W / 2;

      // Try X axis
      const tryX = Math.max(HITBOX_W, Math.min(canvasWidth - HITBOX_W, newX));
      let blockedX = false;
      for (const box of collisionBoxes) {
        if (overlaps(tryX - hbHalfW, posRef.current.y - HITBOX_H, HITBOX_W, HITBOX_H, box)) {
          blockedX = true;
          break;
        }
      }
      if (!blockedX) posRef.current.x = tryX;

      // Try Y axis
      const tryY = Math.max(HITBOX_H, Math.min(canvasHeight - HITBOX_H, newY));
      let blockedY = false;
      for (const box of collisionBoxes) {
        if (overlaps(posRef.current.x - hbHalfW, tryY - HITBOX_H, HITBOX_W, HITBOX_H, box)) {
          blockedY = true;
          break;
        }
      }
      if (!blockedY) posRef.current.y = tryY;

      sprite.x = posRef.current.x;
      sprite.y = posRef.current.y;

      if (dx !== 0) {
        facingRef.current = dx > 0 ? 1 : -1;
        sprite.scale.x = facingRef.current * Math.abs(sprite.scale.x);
      }
    }

    // Animation swap
    if (moving && !isMovingRef.current) {
      sprite.textures = walkFrames;
      sprite.animationSpeed = 0.15;
      sprite.play();
      isMovingRef.current = true;
    } else if (!moving && isMovingRef.current) {
      sprite.textures = idleFrames;
      sprite.gotoAndStop(0);
      isMovingRef.current = false;
    }
  });

  const onMount = useCallback(
    (ref: AnimatedSprite | null) => {
      spriteRef.current = ref;
      if (!ref) return;
      ref.anchor.set(0.5, 1);
      ref.gotoAndStop(0);
      ref.x = startX;
      ref.y = startY;
      ref.scale.set(scale);
    },
    [startX, startY, scale]
  );

  if (!ready) return null;

  return (
    <pixiAnimatedSprite
      ref={onMount}
      textures={idleFramesRef.current}
      isPlaying={false}
    />
  );
};
