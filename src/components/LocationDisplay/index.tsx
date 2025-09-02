import React from 'react';
import styled from 'styled-components';

const LocationContainer = styled.div`
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
`;

interface LocationDisplayProps {
  name: string;
}

const LocationDisplay: React.FC<LocationDisplayProps> = ({ name }) => {
  return <LocationContainer>{name}</LocationContainer>;
};

export default LocationDisplay;
