import { toNormalized, toPixel, getCanvasSize } from "../canvas";
import { getState, setSelectedIndex, updateBox, removeBox } from "../state";
import { NormalizedBox } from "../types";

type DragMode = "none" | "move" | "resize";
type Corner = "tl" | "tr" | "bl" | "br";

let dragMode: DragMode = "none";
let dragCorner: Corner = "tl";
let dragOffsetNx = 0;
let dragOffsetNy = 0;
let origBox: NormalizedBox | null = null;

const HANDLE_PX = 8;

export function initSelectTool(canvas: HTMLCanvasElement) {
  canvas.addEventListener("mousedown", onMouseDown);
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mouseup", onMouseUp);
  window.addEventListener("keydown", onKeyDown);
}

function hitTestHandle(box: NormalizedBox, mx: number, my: number): Corner | null {
  const { w, h } = getCanvasSize();
  const px = box.x * w;
  const py = box.y * h;
  const pw = box.w * w;
  const ph = box.h * h;

  const corners: [Corner, number, number][] = [
    ["tl", px, py],
    ["tr", px + pw, py],
    ["bl", px, py + ph],
    ["br", px + pw, py + ph],
  ];

  for (const [corner, cx, cy] of corners) {
    if (Math.abs(mx - cx) <= HANDLE_PX && Math.abs(my - cy) <= HANDLE_PX) {
      return corner;
    }
  }
  return null;
}

function hitTestBox(mx: number, my: number): number {
  const state = getState();
  const { nx, ny } = toNormalized(mx, my);
  // Search in reverse so topmost (latest) box is picked first
  for (let i = state.boxes.length - 1; i >= 0; i--) {
    const b = state.boxes[i];
    if (nx >= b.x && nx <= b.x + b.w && ny >= b.y && ny <= b.y + b.h) {
      return i;
    }
  }
  return -1;
}

function onMouseDown(e: MouseEvent) {
  if (getState().currentTool !== "select") return;
  const state = getState();
  const mx = e.offsetX;
  const my = e.offsetY;

  // Check resize handles on selected box first
  if (state.selectedIndex >= 0) {
    const box = state.boxes[state.selectedIndex];
    const corner = hitTestHandle(box, mx, my);
    if (corner) {
      dragMode = "resize";
      dragCorner = corner;
      origBox = { ...box };
      return;
    }
  }

  // Check box hit
  const hitIdx = hitTestBox(mx, my);
  if (hitIdx >= 0) {
    setSelectedIndex(hitIdx);
    dragMode = "move";
    const box = state.boxes[hitIdx];
    const { nx, ny } = toNormalized(mx, my);
    dragOffsetNx = nx - box.x;
    dragOffsetNy = ny - box.y;
    origBox = { ...box };
  } else {
    setSelectedIndex(-1);
    dragMode = "none";
  }
}

function onMouseMove(e: MouseEvent) {
  if (getState().currentTool !== "select" || dragMode === "none") return;
  const state = getState();
  if (state.selectedIndex < 0) return;

  const { nx, ny } = toNormalized(e.offsetX, e.offsetY);

  if (dragMode === "move") {
    const box = state.boxes[state.selectedIndex];
    updateBox(state.selectedIndex, {
      ...box,
      x: clamp(nx - dragOffsetNx, 0, 1 - box.w),
      y: clamp(ny - dragOffsetNy, 0, 1 - box.h),
    });
  }

  if (dragMode === "resize" && origBox) {
    const ob = origBox;
    let x = ob.x;
    let y = ob.y;
    let w = ob.w;
    let h = ob.h;

    if (dragCorner === "br") {
      w = Math.max(0.005, nx - ob.x);
      h = Math.max(0.005, ny - ob.y);
    } else if (dragCorner === "bl") {
      w = Math.max(0.005, ob.x + ob.w - nx);
      h = Math.max(0.005, ny - ob.y);
      x = ob.x + ob.w - w;
    } else if (dragCorner === "tr") {
      w = Math.max(0.005, nx - ob.x);
      h = Math.max(0.005, ob.y + ob.h - ny);
      y = ob.y + ob.h - h;
    } else if (dragCorner === "tl") {
      w = Math.max(0.005, ob.x + ob.w - nx);
      h = Math.max(0.005, ob.y + ob.h - ny);
      x = ob.x + ob.w - w;
      y = ob.y + ob.h - h;
    }

    updateBox(state.selectedIndex, { x, y, w, h });
  }
}

function onMouseUp() {
  dragMode = "none";
  origBox = null;
}

function onKeyDown(e: KeyboardEvent) {
  if (getState().currentTool !== "select") return;
  if (e.key === "Delete" || e.key === "Backspace") {
    const state = getState();
    if (state.selectedIndex >= 0) {
      e.preventDefault();
      removeBox(state.selectedIndex);
    }
  }
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

// Update cursor based on hover state
export function updateCursor(canvas: HTMLCanvasElement, mx: number, my: number) {
  const state = getState();
  if (state.currentTool !== "select") {
    canvas.style.cursor = "crosshair";
    return;
  }

  if (state.selectedIndex >= 0) {
    const box = state.boxes[state.selectedIndex];
    const corner = hitTestHandle(box, mx, my);
    if (corner === "tl" || corner === "br") {
      canvas.style.cursor = "nwse-resize";
      return;
    }
    if (corner === "tr" || corner === "bl") {
      canvas.style.cursor = "nesw-resize";
      return;
    }
  }

  const hitIdx = hitTestBox(mx, my);
  canvas.style.cursor = hitIdx >= 0 ? "move" : "default";
}
