import { NormalizedBox, Tool } from "./types";

export interface EditorState {
  boxes: NormalizedBox[];
  selectedIndex: number;
  currentTool: Tool;
  overlayVisible: boolean;
}

const state: EditorState = {
  boxes: [],
  selectedIndex: -1,
  currentTool: "draw",
  overlayVisible: true,
};

type Listener = () => void;
const listeners: Listener[] = [];

export function getState(): EditorState {
  return state;
}

export function setBoxes(boxes: NormalizedBox[]) {
  state.boxes = boxes;
  notify();
}

export function addBox(box: NormalizedBox) {
  state.boxes.push(box);
  state.selectedIndex = state.boxes.length - 1;
  notify();
}

export function updateBox(index: number, box: NormalizedBox) {
  state.boxes[index] = box;
  notify();
}

export function removeBox(index: number) {
  state.boxes.splice(index, 1);
  if (state.selectedIndex >= state.boxes.length) {
    state.selectedIndex = state.boxes.length - 1;
  }
  notify();
}

export function clearBoxes() {
  state.boxes = [];
  state.selectedIndex = -1;
  notify();
}

export function setSelectedIndex(i: number) {
  state.selectedIndex = i;
  notify();
}

export function setTool(tool: Tool) {
  state.currentTool = tool;
  state.selectedIndex = -1;
  notify();
}

export function toggleOverlay() {
  state.overlayVisible = !state.overlayVisible;
  notify();
}

export function onChange(fn: Listener) {
  listeners.push(fn);
}

function notify() {
  for (const fn of listeners) fn();
}
