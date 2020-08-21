import React, { FC } from 'react';
import styled from 'styled-components';

const ErrorMessage = styled.div`
  color: red;
`;

export const GlobalError: FC = ({ children }) => (
  <ErrorMessage>{children}</ErrorMessage>
);
