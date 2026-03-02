import { useGame } from '../../game/GameContext';
import { CEOPanel } from './CEOPanel';
import { TechPanel } from './TechPanel';
import { LanguagePanel } from './LanguagePanel';
import { ToiletPanel } from './ToiletPanel';

export function PanelRouter() {
  const { state } = useGame();

  switch (state.activePanel) {
    case 'ceo':
      return <CEOPanel />;
    case 'tech':
      return <TechPanel />;
    case 'language':
      return <LanguagePanel />;
    case 'toilet':
      return <ToiletPanel />;
    default:
      return null;
  }
}
