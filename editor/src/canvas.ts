import { getState } from "./state";
import { NormalizedBox } from "./types";

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let bgImage: HTMLImageElement;
let bgLoaded = false;

// Preview rect drawn by tools (normalized coords)
export let previewRect: NormalizedBox | null = null;
export function setPreviewRect(r: NormalizedBox | null) {
  previewRect = r;
}

export function initCanvas(container: HTMLElement): HTMLCanvasElement {
  canvas = document.createElement("canvas");
  container.appendChild(canvas);
  ctx = canvas.getContext("2d")!;

  bgImage = new Image();
  bgImage.src = "/office.png";
  bgImage.onload = () => {
    bgLoaded = true;
  };

  window.addEventListener("resize", resize);
  resize();
  return canvas;
}

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 44 - 24; // toolbar + info bar
}

export function getCanvasSize() {
  return { w: canvas.width, h: canvas.height };
}

/** Convert pixel coords to normalized 0-1 */
export function toNormalized(px: number, py: number): { nx: number; ny: number } {
  return { nx: px / canvas.width, ny: py / canvas.height };
}

/** Convert normalized to pixel coords */
export function toPixel(nx: number, ny: number): { px: number; py: number } {
  return { px: nx * canvas.width, py: ny * canvas.height };
}

export function render() {
  const { w, h } = getCanvasSize();
  ctx.clearRect(0, 0, w, h);

  // Draw background
  if (bgLoaded) {
    ctx.drawImage(bgImage, 0, 0, w, h);
  } else {
    ctx.fillStyle = "#2a2a3e";
    ctx.fillRect(0, 0, w, h);
  }

  const state = getState();

  if (!state.overlayVisible) return;

  // Draw all boxes
  for (let i = 0; i < state.boxes.length; i++) {
    const box = state.boxes[i];
    const isSelected = i === state.selectedIndex;
    drawBox(box, isSelected);
  }

  // Draw preview rect
  if (previewRect) {
    ctx.fillStyle = "rgba(255, 200, 0, 0.25)";
    ctx.strokeStyle = "rgba(255, 200, 0, 0.8)";
    ctx.lineWidth = 2;
    const { px, py } = toPixel(previewRect.x, previewRect.y);
    const pw = previewRect.w * w;
    const ph = previewRect.h * h;
    ctx.fillRect(px, py, pw, ph);
    ctx.strokeRect(px, py, pw, ph);
  }
}

function drawBox(box: NormalizedBox, selected: boolean) {
  const { w, h } = getCanvasSize();
  const px = box.x * w;
  const py = box.y * h;
  const pw = box.w * w;
  const ph = box.h * h;

  if (selected) {
    ctx.fillStyle = "rgba(0, 120, 255, 0.35)";
    ctx.strokeStyle = "rgba(0, 120, 255, 0.9)";
    ctx.lineWidth = 2;
  } else {
    ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
    ctx.strokeStyle = "rgba(255, 0, 0, 0.8)";
    ctx.lineWidth = 1;
  }

  ctx.fillRect(px, py, pw, ph);
  ctx.strokeRect(px, py, pw, ph);

  // Draw resize handles for selected box
  if (selected) {
    const hs = 8; // handle size
    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "rgba(0, 120, 255, 0.9)";
    ctx.lineWidth = 1;
    const corners = [
      [px, py],
      [px + pw, py],
      [px, py + ph],
      [px + pw, py + ph],
    ];
    for (const [cx, cy] of corners) {
      ctx.fillRect(cx - hs / 2, cy - hs / 2, hs, hs);
      ctx.strokeRect(cx - hs / 2, cy - hs / 2, hs, hs);
    }
  }
}

export function startRenderLoop() {
  function loop() {
    render();
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}
