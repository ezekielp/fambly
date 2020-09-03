import React, { FC } from 'react';
import { SubContactInfoFragment } from 'client/graphqlTypes';
import { ChildItem } from './ChildItem';
import styled from 'styled-components';

const ChildrenHeader = styled.div``;

const ChildItemsContainer = styled.div``;

interface ChildrenContainerProps {
  children: SubContactInfoFragment[];
  parentLastName?: string;
  parentId: string;
}

export const ChildrenContainer: FC<ChildrenContainerProps> = ({
  children,
  parentLastName,
  parentId,
}) => {
  const childItems = children.map((child) => {
    return (
      <ChildItem
        key={child.id}
        child={child}
        parentId={parentId}
        parentLastName={parentLastName}
      />
    );
  });

  return (
    <>
      <ChildrenHeader>Children</ChildrenHeader>
      <ChildItemsContainer>{childItems}</ChildItemsContainer>
    </>
  );
};
