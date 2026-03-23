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
    <>
      <style>{selectAnimations}</style>
      <div style={overlayStyle}>
        <h1 style={titleStyle}>Choose Your Character</h1>
        <p style={subtitleStyle}>Tap your hero to begin!</p>
        <div style={gridStyle}>
          {characters.map((char, i) => (
            <button
              key={char.id}
              className="char-card"
              onClick={() => onSelect(char.id)}
              onTouchStart={(e) => {
                e.currentTarget.classList.add('char-card-active');
              }}
              onTouchEnd={(e) => {
                e.currentTarget.classList.remove('char-card-active');
                onSelect(char.id);
              }}
              style={{
                ...cardStyle,
                animationDelay: `${i * 0.15}s`,
              }}
            >
              <div className="char-sparkle" />
              <canvas
                ref={(el) => { canvasRefs.current[i] = el; }}
                style={canvasStyle}
              />
              <span style={labelStyle}>{char.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

const overlayStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)",
  zIndex: 1000,
  overflow: "hidden",
};

const titleStyle: React.CSSProperties = {
  color: "#fff",
  fontFamily: "sans-serif",
  fontSize: "2rem",
  marginBottom: "0.5rem",
  animation: "titleFloat 3s ease-in-out infinite",
  textShadow: "0 0 20px rgba(99,102,241,0.4)",
};

const subtitleStyle: React.CSSProperties = {
  color: "#94a3b8",
  fontFamily: "sans-serif",
  fontSize: "1rem",
  marginBottom: "2rem",
  animation: "fadeInUp 0.6s ease-out",
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
  background: "rgba(22, 33, 62, 0.8)",
  border: "3px solid rgba(99,102,241,0.3)",
  borderRadius: "16px",
  padding: "1.5rem 2rem",
  minWidth: 100,
  minHeight: 100,
  cursor: "pointer",
  position: "relative",
  overflow: "hidden",
  animation: "cardBounceIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both",
  transition: "border-color 0.2s, box-shadow 0.2s",
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
  fontWeight: 600,
};

const selectAnimations = `
@keyframes cardBounceIn {
  0% { transform: scale(0) translateY(30px); opacity: 0; }
  60% { transform: scale(1.08) translateY(-6px); opacity: 1; }
  100% { transform: scale(1) translateY(0); opacity: 1; }
}

@keyframes titleFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

@keyframes fadeInUp {
  0% { transform: translateY(12px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

@keyframes sparkleRotate {
  0% { transform: rotate(0deg); opacity: 0; }
  50% { opacity: 0.15; }
  100% { transform: rotate(360deg); opacity: 0; }
}

.char-card:active,
.char-card-active {
  transform: scale(1.06) !important;
  border-color: #ffd700 !important;
  box-shadow: 0 0 24px rgba(255,215,0,0.3) !important;
}

.char-card:hover {
  border-color: #ffd700;
  box-shadow: 0 0 20px rgba(255,215,0,0.2);
}

.char-sparkle {
  position: absolute;
  inset: -20px;
  background: conic-gradient(from 0deg, transparent, rgba(255,215,0,0.08), transparent, rgba(99,102,241,0.08), transparent);
  animation: sparkleRotate 4s linear infinite;
  pointer-events: none;
}
`;
