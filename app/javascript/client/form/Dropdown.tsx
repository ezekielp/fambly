import React, { FC, useRef } from 'react';
import { useDetectOutsideClick } from './useDetectOutsideClick';
import { colors } from 'client/shared/styles';
import { Sandwich } from 'client/assets/Sandwich';
import { XMark } from 'client/assets/XMark';
import styled from 'styled-components';

const DropdownContainer = styled.div`
  position: relative;
`;

const IconContainer = styled.div``;

const MenuContainer = styled.nav`
  width: 150px;
  height: auto;
  border-radius: 5px;
  border: 1px solid ${colors.black};
  position: absolute;
  top: 50px;
  right: 0;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.3);
`;

const MenuList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const MenuItem = styled.li`
  border-bottom: 1px solid ${colors.black};
`;

interface DropdownMenuItem {
  label: string;
  onClick?: (arg?: boolean | string) => void;
}

interface DropdownProps {
  menuItems: DropdownMenuItem[];
}

export const Dropdown: FC<DropdownProps> = ({ menuItems }) => {
  const dropdownRef = useRef(null);
  const [isActive, setIsActive] = useDetectOutsideClick(dropdownRef, false);
  const onClick = () => setIsActive(!isActive);

  const icon = isActive ? <XMark /> : <Sandwich width="35" height="35" />;

  const items = menuItems.map((item) => {
    const { label, onClick } = item;
    return (
      <MenuItem key={label} onClick={() => (onClick ? onClick : null)}>
        {label}
      </MenuItem>
    );
  });

  return (
    <DropdownContainer>
      <IconContainer onClick={onClick}>{icon}</IconContainer>
      {isActive && (
        <MenuContainer>
          <MenuList>{items}</MenuList>
        </MenuContainer>
      )}
    </DropdownContainer>
  );
};
