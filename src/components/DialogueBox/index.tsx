import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Spin } from 'antd';

const DialogueBoxContainer = styled.div`
  position: absolute;
  bottom: 2vw;
  left: 50%;
  transform: translateX(-50%);
  width: 96vw;
  height: 30vh;
  background: var(--color-dialogue-bg);
  border: 2px solid var(--color-dialogue-border);
  border-radius: 10px;
  padding: 20px;
  box-sizing: border-box;
  color: var(--color-text);
  display: flex;
  flex-direction: column;
  
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border-radius: 10px;
    box-shadow: var(--color-dialogue-glow);
    pointer-events: none;
  }
`;

const SpeakerName = styled.div`
  font-weight: bold;
  font-size: 1.2rem;
  margin-bottom: 15px;
  color: var(--color-speaker);
  text-shadow: 1px 1px 2px rgba(0,0,0,0.7);
  flex-shrink: 0; /* Prevent speaker name from shrinking */
`;

const DialogueText = styled.div`
  font-size: 1.1rem;
  line-height: 1.6;
  flex-grow: 1;
  overflow-y: auto; /* Allow scrolling for long text */
  padding-right: 10px; /* Add some space for the scrollbar */

  /* Custom scrollbar for webkit browsers */
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5);
  }
`;

const LoadingSpinnerContainer = styled.div`
  position: absolute;
  right: 25px;
  bottom: 15px;
`;

interface DialogueBoxProps {
  speaker: string;
  text: string;
  isLoading?: boolean;
}

const DialogueBox: React.FC<DialogueBoxProps> = ({ speaker, text, isLoading }) => {
  const textRef = useRef<HTMLDivElement>(null);
  const userHasScrolledUp = useRef(false);

  const handleScroll = () => {
    const element = textRef.current;
    if (element) {
      // Check if the user is scrolled to the bottom, with a 5px tolerance
      const atBottom = element.scrollHeight - element.scrollTop - element.clientHeight < 5;
      userHasScrolledUp.current = !atBottom;
    }
  };

  useEffect(() => {
    const element = textRef.current;
    // Auto-scroll only if the user hasn't manually scrolled up
    if (element && !userHasScrolledUp.current) {
      element.scrollTop = element.scrollHeight;
    }
  }, [text]); // Effect triggers whenever the text content changes

  return (
    <DialogueBoxContainer>
      {speaker && <SpeakerName>{speaker}</SpeakerName>}
      <DialogueText ref={textRef} onScroll={handleScroll}>
        {text}
      </DialogueText>
      {isLoading && (
        <LoadingSpinnerContainer>
          <Spin />
        </LoadingSpinnerContainer>
      )}
    </DialogueBoxContainer>
  );
};

export default DialogueBox;
