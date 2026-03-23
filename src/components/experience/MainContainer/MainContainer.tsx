import { type PropsWithChildren, useEffect, useMemo, useState, type RefObject } from "react";
import { extend } from "@pixi/react";
import { Assets, Container, Sprite, Texture } from "pixi.js";
import bgsceneUrl from "../../../../images/office.png";
import { Character } from "../../Player/Character";
import { getCollisionBoxes } from "../../../collisions";
import { getSafeArea } from "../../../helpers/common";

// Character sprite sheet imports
import walk1Url from "../../../../images/characters/City_men_1/Walk.png";
import idle1Url from "../../../../images/characters/City_men_1/Idle.png";
import walk2Url from "../../../../images/characters/City_men_2/Walk.png";
import idle2Url from "../../../../images/characters/City_men_2/Idle.png";
import walk3Url from "../../../../images/characters/City_men_3/Walk.png";
import idle3Url from "../../../../images/characters/City_men_3/Idle.png";

extend({ Container, Sprite });

const WALK_FRAMES = 10;
const IDLE_FRAMES = 7;

const characterAssets: Record<string, { walk: string; idle: string }> = {
  City_men_1: { walk: walk1Url, idle: idle1Url },
  City_men_2: { walk: walk2Url, idle: idle2Url },
  City_men_3: { walk: walk3Url, idle: idle3Url },
};

interface MainContainerProps {
  canvassize: {
    width: number;
    height: number;
  };
  selectedCharacter: string;
  inputRef: RefObject<{ dx: number; dy: number }>;
  onZoneChange?: (zone: string | null) => void;
  onInteract?: () => void;
}

export const MainContainer = ({
  canvassize,
  selectedCharacter,
  inputRef,
  onZoneChange,
  onInteract,
  children,
}: PropsWithChildren<MainContainerProps>) => {
  const [bgTexture, setBgTexture] = useState<Texture | null>(null);

  useEffect(() => {
    Assets.load(bgsceneUrl).then((texture: Texture) => {
      setBgTexture(texture);
    });
  }, []);

  const collisionBoxes = useMemo(
    () => getCollisionBoxes(canvassize.width, canvassize.height),
    [canvassize.width, canvassize.height]
  );

  const safeArea = getSafeArea(canvassize.width, canvassize.height);
  const charScale = (safeArea.playableHeight / 600) * 0.8 * 1.3;
  const assets = characterAssets[selectedCharacter];

  return (
    <pixiContainer>
      {bgTexture && (
        <pixiSprite
          texture={bgTexture}
          width={canvassize.width}
          height={canvassize.height}
          x={0}
          y={0}
        />
      )}

      {assets && (
        <Character
          walkSheetUrl={assets.walk}
          idleSheetUrl={assets.idle}
          walkFrameCount={WALK_FRAMES}
          idleFrameCount={IDLE_FRAMES}
          startX={canvassize.width * 0.5}
          startY={safeArea.top + safeArea.playableHeight * 0.5}
          scale={charScale}
          canvasWidth={canvassize.width}
          canvasHeight={canvassize.height}
          inputRef={inputRef}
          collisionBoxes={collisionBoxes}
          onZoneChange={onZoneChange}
          onInteract={onInteract}
        />
      )}

      {children}
    </pixiContainer>
  );
};
