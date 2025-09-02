import React from 'react';
import styled, { keyframes } from 'styled-components';
import type { GameTip as GameTipType } from '../../types';

const flyInAndFadeOut = keyframes`
  0% {
    opacity: 0;
    transform: translateX(100%);
  }
  5% {
    opacity: 1;
    transform: translateX(0);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
  // 100% {
  //   opacity: 0;
  //   transform: translateX(10px);
  // }
`;

const TipContainer = styled.div<{ index: number }>`
  position: absolute;
  top: ${props => 20 + props.index * 50}px; /* Stack tips vertically */
  right: 20px;
  padding: 8px 20px;
  background: var(--color-dialogue-bg);
  color: var(--color-text);
  border-radius: 20px;
  font-size: 1rem;
  font-weight: bold;
  z-index: 100;
  animation: ${flyInAndFadeOut} 15s ease-in-out forwards;
  border: 1px solid var(--color-dialogue-border);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
`;

interface GameTipProps {
  tip: GameTipType;
  index: number; /* Add index prop */
}

const GameTip: React.FC<GameTipProps> = ({ tip, index }) => {
  return <TipContainer index={index}>{tip.text}</TipContainer>;
};

export default GameTip;