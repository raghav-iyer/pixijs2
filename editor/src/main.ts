import { initCanvas, startRenderLoop } from "./canvas";
import { initDrawTool } from "./tools/draw";
import { initSelectTool, updateCursor } from "./tools/select";
import { initUI } from "./ui";
import { loadFromServer } from "./io";
import { setBoxes } from "./state";

async function main() {
  const container = document.getElementById("canvas-container")!;
  const canvas = initCanvas(container);

  // Load existing collision data
  try {
    const boxes = await loadFromServer();
    if (boxes.length > 0) {
      setBoxes(boxes);
    }
  } catch {
    console.warn("Could not load existing collision data");
  }

  // Init tools
  initDrawTool(canvas);
  initSelectTool(canvas);

  // Cursor updates
  canvas.addEventListener("mousemove", (e) => {
    updateCursor(canvas, e.offsetX, e.offsetY);
  });

  // Init UI
  initUI();

  // Start render loop
  startRenderLoop();
}

main();
