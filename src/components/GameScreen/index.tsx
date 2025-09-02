import React from 'react';
import styled from 'styled-components';

const ScreenContainer = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #000; // Default background
  background-size: cover;
  background-position: center;
`;

interface GameScreenProps {
  backgroundImage?: string;
  children: React.ReactNode;
}

const GameScreen: React.FC<GameScreenProps> = ({ backgroundImage, children }) => {
  return (
    <ScreenContainer style={{ backgroundImage: `url(${backgroundImage})` }}>
      {children}
    </ScreenContainer>
  );
};

export default GameScreen;
