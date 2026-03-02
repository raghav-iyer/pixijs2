import { useState } from "react";
import { Experience } from "./components/experience/experiennce";
import { CharacterSelect } from "./components/CharacterSelect/CharacterSelect";
import { useForcePortraitLandscape } from "./hooks/useForcePortraitLandscape";

const App = () => {
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const { wrapperStyle } = useForcePortraitLandscape();

  return (
    <div style={wrapperStyle}>
      {!selectedCharacter ? (
        <CharacterSelect onSelect={setSelectedCharacter} />
      ) : (
        <Experience selectedCharacter={selectedCharacter} />
      )}
    </div>
  );
};

export default App;
