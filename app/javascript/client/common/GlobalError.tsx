import React, { FC } from 'react';
import styled from 'styled-components';

const ErrorMessage = styled.div`
  color: red;
`;

interface GlobalErrorProps {
  children: React.ReactNode;
}

export const GlobalError: FC<GlobalErrorProps> = ({ children }) => (
  <ErrorMessage>{children}</ErrorMessage>
);
