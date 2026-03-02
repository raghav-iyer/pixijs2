import { type PropsWithChildren, useEffect, useState } from "react";
import { extend } from "@pixi/react";
import { Assets, Container, Sprite, Texture } from "pixi.js";
import bgsceneUrl from "../../../../office.png";

// Register PixiJS classes — makes <container> and <sprite> available as JSX tags
extend({ Container, Sprite });

interface MainContainerProps {
    canvassize: {
        width: number;
        height: number;
    };
}

export const MainContainer = ({ canvassize, children }: PropsWithChildren<MainContainerProps>) => {
    const [bgTexture, setBgTexture] = useState<Texture | null>(null);

    useEffect(() => {
        // Assets.load is async — Texture.from() is synchronous and returns empty on first call
        Assets.load(bgsceneUrl).then((texture: Texture) => {
            setBgTexture(texture);
        });
    }, []);

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
            {children}
        </pixiContainer>
    );
};