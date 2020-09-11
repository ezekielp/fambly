import { colors } from 'client/shared/styles';
import styled from 'styled-components';

export const Button = styled.button`
  border: 1px solid ${colors.black};
  border-radius: 50px;
  padding: 0.5rem;

  &:active {
    background: ${colors.orange};
    color: ${colors.white};
    border: 1px solid ${colors.white};
  }
`;
