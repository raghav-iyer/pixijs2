import { NormalizedBox } from "./types";
import { getState, setBoxes } from "./state";

export async function loadFromServer(): Promise<NormalizedBox[]> {
  const res = await fetch("/__load");
  const data = await res.json();
  return data as NormalizedBox[];
}

export async function saveToServer(): Promise<boolean> {
  const state = getState();
  const res = await fetch("/__save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(state.boxes, null, 2),
  });
  const result = await res.json();
  return result.ok === true;
}

export function exportJSON() {
  const state = getState();
  const blob = new Blob([JSON.stringify(state.boxes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "collision-data.json";
  a.click();
  URL.revokeObjectURL(url);
}

export function importJSON() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";
  input.onchange = () => {
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string) as NormalizedBox[];
        setBoxes(data);
      } catch {
        alert("Invalid JSON file");
      }
    };
    reader.readAsText(file);
  };
  input.click();
}
