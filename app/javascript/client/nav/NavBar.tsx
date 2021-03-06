import React, { FC } from 'react';
import { colors, text } from 'client/shared/styles';
import { Dropdown, DropdownMenuItem } from 'client/common/Dropdown';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const NavBarContainer = styled.nav`
  height: 50px;
  background: ${colors.orange};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0.5rem 1.5rem;
  align-items: center;
`;

const FamblyContainer = styled.div`
  font-size: ${text[4]};
  font-variation-settings: 'wght' 700;
  color: ${colors.white};
`;

interface NavBarProps {
  dropdownItems: DropdownMenuItem[];
}

export const NavBar: FC<NavBarProps> = ({ dropdownItems }) => {
  return (
    <NavBarContainer>
      <FamblyContainer>
        <Link to="/home">fambly</Link>
      </FamblyContainer>
      <Dropdown menuItems={dropdownItems} />
    </NavBarContainer>
  );
};
