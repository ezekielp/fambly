import React, { FC, useRef } from 'react';
import { useDetectOutsideClick } from './useDetectOutsideClick';
import { colors } from 'client/shared/styles';
import { Sandwich } from 'client/assets/Sandwich';
import { XMark } from 'client/assets/XMark';
import styled from 'styled-components';

const DropdownContainer = styled.div`
  position: relative;
  margin-top: 8px;
`;

const IconContainer = styled.div`
  cursor: pointer;
`;

const MenuContainer = styled.nav`
  width: 150px;
  height: auto;
  border-radius: 5px;
  border: 1px solid ${colors.black};
  position: absolute;
  top: 50px;
  right: -5px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.3);
  background: ${colors.white};
`;

const MenuList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const MenuItem = styled.li`
  cursor: pointer;
  padding: 0.5rem;
  font-weight: 700;

  &:not(:last-child) {
    border-bottom: 1px solid ${colors.black};
  }
`;

export interface DropdownMenuItem {
  label: string;
  onClick?: (event: React.MouseEvent) => void;
}

interface DropdownProps {
  menuItems: DropdownMenuItem[];
}

export const Dropdown: FC<DropdownProps> = ({ menuItems }) => {
  const dropdownRef = useRef(null);
  const [isActive, setIsActive] = useDetectOutsideClick(dropdownRef, false);
  const onClick = () => setIsActive(!isActive);

  const icon = isActive ? (
    <XMark fill={colors.white} width="30" />
  ) : (
    <Sandwich fill={colors.white} width="35" />
  );

  const items = menuItems.map((item) => {
    const { label, onClick } = item;
    return (
      <MenuItem key={label} onClick={onClick ? onClick : () => null}>
        {label}
      </MenuItem>
    );
  });

  return (
    <DropdownContainer>
      <IconContainer onClick={onClick}>{icon}</IconContainer>
      {isActive && (
        <MenuContainer ref={dropdownRef}>
          <MenuList>{items}</MenuList>
        </MenuContainer>
      )}
    </DropdownContainer>
  );
};