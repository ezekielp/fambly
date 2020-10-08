import React, { FC, useRef, MouseEvent } from 'react';
import { useDetectOutsideClick } from './useDetectOutsideClick';
import { colors } from 'client/shared/styles';
import { Sandwich } from 'client/assets/Sandwich';
import { XMark } from 'client/assets/XMark';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const DropdownContainer = styled.div`
  position: relative;
  margin-top: 8px;
`;

const IconContainer = styled.div`
  cursor: pointer;
`;

const StyledXMark = styled(XMark)`
  margin-bottom: 3px;
`;

interface MenuContainerProps {
  topSpacing: string;
}

const MenuContainer = styled.nav`
  width: 150px;
  height: auto;
  border-radius: 5px;
  border: 1px solid ${colors.black};
  position: absolute;
  top: ${({ topSpacing }: MenuContainerProps) => topSpacing};
  right: -5px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.3);
  background: ${colors.white};
  z-index: 1;
`;

const MenuList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const MenuItem = styled.li`
  cursor: pointer;
  padding: 0.5rem;

  &:not(:last-child) {
    border-bottom: 1px solid ${colors.black};
  }
`;

export interface DropdownMenuItem {
  label: string;
  onClick?: (event: React.MouseEvent) => void;
  href?: string;
}

interface DropdownProps {
  menuItems: DropdownMenuItem[];
  xMarkSize?: string;
  sandwichSize?: string;
  color?: string;
  topSpacing?: string;
}

export const Dropdown: FC<DropdownProps> = ({
  menuItems,
  xMarkSize = '30',
  sandwichSize = '35',
  color = colors.white,
  topSpacing = '50px',
}) => {
  const dropdownRef = useRef(null);
  const [isActive, setIsActive] = useDetectOutsideClick(dropdownRef, false);
  const handleClick = () => setIsActive(!isActive);

  const icon = isActive ? (
    <StyledXMark fill={color} width={xMarkSize} />
  ) : (
    <Sandwich fill={color} width={sandwichSize} />
  );

  const items = menuItems.map((item) => {
    const { label, onClick: onItemClick, href } = item;
    const handleClick = (event: MouseEvent) => {
      setIsActive(!isActive);
      if (onItemClick) {
        onItemClick(event);
      }
    };

    if (onItemClick)
      return (
        <MenuItem key={label} onClick={handleClick}>
          {label}
        </MenuItem>
      );
    if (href)
      return (
        <MenuItem key={label} onClick={handleClick}>
          <Link to={href}>{label}</Link>
        </MenuItem>
      );
  });

  return (
    <DropdownContainer>
      <IconContainer onClick={handleClick}>{icon}</IconContainer>
      {isActive && (
        <MenuContainer topSpacing={topSpacing} ref={dropdownRef}>
          <MenuList>{items}</MenuList>
        </MenuContainer>
      )}
    </DropdownContainer>
  );
};
