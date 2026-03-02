import { useState } from "react";
import { Experience } from "./components/experience/experiennce";
import { CharacterSelect } from "./components/CharacterSelect/CharacterSelect";
import { useForcePortraitLandscape } from "./hooks/useForcePortraitLandscape";
import { GameProvider } from "./game/GameContext";

const App = () => {
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const { wrapperStyle } = useForcePortraitLandscape();

  return (
    <div style={wrapperStyle}>
      {!selectedCharacter ? (
        <CharacterSelect onSelect={setSelectedCharacter} />
      ) : (
        <GameProvider>
          <Experience selectedCharacter={selectedCharacter} />
        </GameProvider>
      )}
    </div>
  );
};

export default App;
