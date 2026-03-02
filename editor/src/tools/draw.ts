import { toNormalized, setPreviewRect } from "../canvas";
import { addBox, getState } from "../state";

const MIN_AREA = 0.0001; // minimum normalized area to avoid accidental clicks

let drawing = false;
let startNx = 0;
let startNy = 0;

export function initDrawTool(canvas: HTMLCanvasElement) {
  canvas.addEventListener("mousedown", onMouseDown);
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mouseup", onMouseUp);
}

function onMouseDown(e: MouseEvent) {
  if (getState().currentTool !== "draw") return;
  drawing = true;
  const { nx, ny } = toNormalized(e.offsetX, e.offsetY);
  startNx = nx;
  startNy = ny;
}

function onMouseMove(e: MouseEvent) {
  if (!drawing || getState().currentTool !== "draw") return;
  const { nx, ny } = toNormalized(e.offsetX, e.offsetY);
  setPreviewRect(makeRect(startNx, startNy, nx, ny));
}

function onMouseUp(e: MouseEvent) {
  if (!drawing || getState().currentTool !== "draw") return;
  drawing = false;
  setPreviewRect(null);

  const { nx, ny } = toNormalized(e.offsetX, e.offsetY);
  const rect = makeRect(startNx, startNy, nx, ny);
  if (rect.w * rect.h >= MIN_AREA) {
    addBox(rect);
  }
}

function makeRect(x1: number, y1: number, x2: number, y2: number) {
  return {
    x: Math.min(x1, x2),
    y: Math.min(y1, y2),
    w: Math.abs(x2 - x1),
    h: Math.abs(y2 - y1),
  };
}
