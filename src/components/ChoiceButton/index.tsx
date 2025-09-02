import styled from 'styled-components';

const StyledButton = styled.button`
  background: var(--color-choice-bg);
  border: 1px solid var(--color-choice-border);
  color: var(--color-choice-text);
  padding: 12px 25px;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  text-align: center;
  transition: background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  min-width: 300px;

  &:hover:not(:disabled) {
    background: var(--color-choice-hover-bg);
    box-shadow: 0 0 10px rgba(180, 200, 255, 0.5);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

interface ChoiceButtonProps {
  text: string;
  onClick: () => void;
  disabled?: boolean;
}

const ChoiceButton = ({ text, onClick, disabled }: ChoiceButtonProps) => {
  return (
    <StyledButton onClick={onClick} disabled={disabled}>
      {text}
    </StyledButton>
  );
};

export default ChoiceButton;
