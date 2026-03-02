import { getState, setTool, toggleOverlay, clearBoxes, onChange } from "./state";
import { saveToServer, exportJSON, importJSON } from "./io";
import { Tool } from "./types";

export function initUI() {
  const toolbar = document.getElementById("toolbar")!;

  const drawBtn = createButton("Draw", () => setTool("draw"));
  const selectBtn = createButton("Select", () => setTool("select"));
  const sep1 = createSeparator();
  const overlayBtn = createButton("Toggle Overlay", () => toggleOverlay());
  const clearBtn = createButton("Clear All", () => {
    if (confirm("Remove all collision boxes?")) clearBoxes();
  });
  const sep2 = createSeparator();
  const saveBtn = createButton("Save", async () => {
    const ok = await saveToServer();
    if (ok) {
      saveBtn.textContent = "Saved!";
      setTimeout(() => (saveBtn.textContent = "Save"), 1500);
    }
  });
  const exportBtn = createButton("Export JSON", () => exportJSON());
  const importBtn = createButton("Import JSON", () => importJSON());

  toolbar.append(drawBtn, selectBtn, sep1, overlayBtn, clearBtn, sep2, saveBtn, exportBtn, importBtn);

  // Update active tool button
  function updateToolButtons() {
    const tool = getState().currentTool;
    drawBtn.classList.toggle("active", tool === "draw");
    selectBtn.classList.toggle("active", tool === "select");
  }

  onChange(updateToolButtons);
  onChange(updateInfoBar);
  updateToolButtons();
  updateInfoBar();
}

function updateInfoBar() {
  const state = getState();
  const bar = document.getElementById("info-bar")!;
  let text = `Boxes: ${state.boxes.length}`;
  if (state.selectedIndex >= 0 && state.selectedIndex < state.boxes.length) {
    const b = state.boxes[state.selectedIndex];
    text += ` | Selected #${state.selectedIndex}: x=${b.x.toFixed(3)} y=${b.y.toFixed(3)} w=${b.w.toFixed(3)} h=${b.h.toFixed(3)}`;
  }
  bar.textContent = text;
}

function createButton(label: string, onClick: () => void): HTMLButtonElement {
  const btn = document.createElement("button");
  btn.textContent = label;
  btn.addEventListener("click", onClick);
  return btn;
}

function createSeparator(): HTMLDivElement {
  const div = document.createElement("div");
  div.className = "separator";
  return div;
}
