import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import styled from 'styled-components';
import { Alert, Button } from 'antd';

import GameScreen from '../components/GameScreen';
import DialogueBox from '../components/DialogueBox';
import ChoiceButton from '../components/ChoiceButton';
import LocationDisplay from '../components/LocationDisplay';
import GameTip from '../components/GameTip';

const ChoicesOverlay = styled.div`
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  gap: 15px;
  z-index: 10;
`;

const TipOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; /* Allow clicks to pass through */
  z-index: 100;
`;



const GamePage = () => {
  const navigate = useNavigate();
  const {
    storyContext,
    history,
    isLoading,
    error,
    makeChoice,
    tips,
    retryLastRequest,
  } = useGameStore();

  useEffect(() => {
    if (!storyContext) {
      navigate('/');
    }
  }, [storyContext, navigate]);

  const currentScene = history[history.length - 1];

  if (!currentScene) {
    return <GameScreen />;
  }

  const { speaker, dialogue, command, playerChoice } = currentScene;
  const choices = playerChoice ? [] : command?.choices || [];
  const backgroundImage = command?.background;
  const locationName = command?.location_name;

  

  return (
    <GameScreen backgroundImage={backgroundImage ? `/assets/images/backgrounds/${backgroundImage}` : undefined}>
      <TipOverlay>
        {tips.map((tip, index) => (
          <GameTip key={tip.id} tip={tip} index={index} />
        ))}
      </TipOverlay>

      {locationName && <LocationDisplay name={locationName} />}
      {error && (
        <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 30 }}>
          <Alert message={error} type="error" closable />
          <Button type="primary" onClick={retryLastRequest} disabled={isLoading}>Retry</Button>
        </div>
      )}

      <DialogueBox speaker={speaker} text={dialogue} isLoading={isLoading} />

      {choices.length > 0 && (
        <ChoicesOverlay>
          {choices.map((choice) => (
            <ChoiceButton
              key={choice.action}
              text={choice.text}
              onClick={() => makeChoice(choice.text, choice.action)}
              disabled={isLoading}
            />
          ))}
        </ChoicesOverlay>
      )}

    </GameScreen>
  );
};

export default GamePage;