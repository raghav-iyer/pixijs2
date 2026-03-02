import { useEffect, useRef } from "react";
import idle1Url from "../../../images/characters/City_men_1/Idle.png";
import idle2Url from "../../../images/characters/City_men_2/Idle.png";
import idle3Url from "../../../images/characters/City_men_3/Idle.png";

const IDLE_FRAMES = 7;

const characters = [
  { id: "City_men_1", label: "Character 1", idleUrl: idle1Url },
  { id: "City_men_2", label: "Character 2", idleUrl: idle2Url },
  { id: "City_men_3", label: "Character 3", idleUrl: idle3Url },
];

interface CharacterSelectProps {
  onSelect: (characterId: string) => void;
}

function drawPreview(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement,
  frameCount: number
) {
  const frameW = img.naturalWidth / frameCount;
  const frameH = img.naturalHeight;
  canvas.width = frameW;
  canvas.height = frameH;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, frameW, frameH);
  ctx.drawImage(img, 0, 0, frameW, frameH, 0, 0, frameW, frameH);
}

export const CharacterSelect = ({ onSelect }: CharacterSelectProps) => {
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);

  useEffect(() => {
    characters.forEach((char, i) => {
      const img = new Image();
      img.src = char.idleUrl;
      img.onload = () => {
        const canvas = canvasRefs.current[i];
        if (canvas) drawPreview(canvas, img, IDLE_FRAMES);
      };
    });
  }, []);

  return (
    <div style={overlayStyle}>
      <h1 style={titleStyle}>Choose Your Character</h1>
      <div style={gridStyle}>
        {characters.map((char, i) => (
          <button
            key={char.id}
            onClick={() => onSelect(char.id)}
            style={cardStyle}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#ffd700";
              (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#555";
              (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
            }}
          >
            <canvas
              ref={(el) => { canvasRefs.current[i] = el; }}
              style={canvasStyle}
            />
            <span style={labelStyle}>{char.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const overlayStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  background: "#1a1a2e",
  zIndex: 1000,
};

const titleStyle: React.CSSProperties = {
  color: "#fff",
  fontFamily: "sans-serif",
  fontSize: "2rem",
  marginBottom: "2rem",
};

const gridStyle: React.CSSProperties = {
  display: "flex",
  gap: "1.5rem",
  flexWrap: "wrap",
  justifyContent: "center",
  padding: "0 1rem",
};

const cardStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  background: "#16213e",
  border: "3px solid #555",
  borderRadius: "12px",
  padding: "1.5rem 2rem",
  minWidth: 100,
  minHeight: 100,
  cursor: "pointer",
  transition: "border-color 0.2s, transform 0.2s",
};

const canvasStyle: React.CSSProperties = {
  width: 96,
  height: 96,
  imageRendering: "pixelated",
};

const labelStyle: React.CSSProperties = {
  color: "#fff",
  fontFamily: "sans-serif",
  marginTop: "0.75rem",
  fontSize: "1rem",
};
