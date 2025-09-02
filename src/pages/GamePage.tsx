import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import styled from 'styled-components';
import { Alert } from 'antd';

import GameScreen from '../components/GameScreen';
import DialogueBox from '../components/DialogueBox';
import ChoiceButton from '../components/ChoiceButton';

const ChoicesOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  gap: 15px;
  z-index: 10;
`;

// No longer need a full-screen loading overlay

const SPEAKER_DIALOGUE_SEPARATOR = ':';

const GamePage = () => {
  const navigate = useNavigate();
  const {
    storyContext,
    history,
    isLoading,
    error,
    makeChoice,
  } = useGameStore();

  useEffect(() => {
    if (!storyContext) {
      navigate('/');
    }
  }, [storyContext, navigate]);

  const currentScene = history[history.length - 1];

  if (!currentScene) {
    // Initial loading before the first scene is ready
    return <GameScreen />;
  }

  const { speaker, dialogue, command, playerChoice } = currentScene;
  // If a choice has been made for the current scene, we don't show choices
  const choices = playerChoice ? [] : command?.choices || [];
  const backgroundImage = command?.background;

  // Extract only the dialogue text for rendering
  const dialogueText = dialogue.includes(SPEAKER_DIALOGUE_SEPARATOR)
    ? dialogue.substring(dialogue.indexOf(SPEAKER_DIALOGUE_SEPARATOR) + 1).trim()
    : dialogue;

  return (
    <GameScreen backgroundImage={backgroundImage ? `/assets/images/backgrounds/${backgroundImage}` : undefined}>
      {error && <Alert message={error} type="error" closable style={{ position: 'absolute', top: 20, left: 20, zIndex: 30 }} />}
      
      <DialogueBox speaker={speaker} text={dialogueText} isLoading={isLoading} />
      
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
