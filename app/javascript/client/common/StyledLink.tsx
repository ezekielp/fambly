import { Link } from 'react-router-dom';
import { colors } from 'client/shared/styles';
import styled from 'styled-components';

export const StyledLink = styled(Link)`
  text-decoration: underline;

  &:active {
    background: ${colors.orange};
    color: ${colors.white};
  }
`;
