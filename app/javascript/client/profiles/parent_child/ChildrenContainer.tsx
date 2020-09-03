import React, { FC } from 'react';
import { SubContactInfoFragment } from 'client/graphqlTypes';
import { ChildItem } from './ChildItem';
import styled from 'styled-components';

const ChildrenHeader = styled.div``;

const ChildItemsContainer = styled.div``;

interface ChildrenContainerProps {
  actualChildren: SubContactInfoFragment[];
  parentLastName?: string | null | undefined;
  parentId: string;
}

export const ChildrenContainer: FC<ChildrenContainerProps> = ({
  actualChildren,
  parentLastName,
  parentId,
}) => {
  const childItems = actualChildren.map((child) => {
    return (
      <ChildItem
        key={child.id}
        child={child}
        parentId={parentId}
        parentLastName={parentLastName ? parentLastName : ''}
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
