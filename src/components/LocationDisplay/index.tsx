import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-10px);
  }
`;

const LocationContainer = styled.div<{ isFadingOut: boolean }>`
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.65);
  color: #fff;
  padding: 6px 16px;
  border-radius: 16px;
  font-size: 0.9rem;
  font-weight: bold;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  z-index: 5;
  animation: ${props => (props.isFadingOut ? fadeOut : fadeIn)} 0.5s ease-in-out forwards;
`;

interface LocationDisplayProps {
  name: string;
}

const LocationDisplay: React.FC<LocationDisplayProps> = ({ name }) => {
  const [displayedName, setDisplayedName] = useState(name);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    if (name !== displayedName) {
      setIsFadingOut(true);
      const timer = setTimeout(() => {
        setDisplayedName(name);
        setIsFadingOut(false);
      }, 500); // Duration of fadeOut animation

      return () => clearTimeout(timer);
    }
  }, [name, displayedName]);

  return <LocationContainer isFadingOut={isFadingOut}>{displayedName}</LocationContainer>;
};

export default LocationDisplay;
