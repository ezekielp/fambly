import React, { FC } from 'react';
import { SubContactInfoFragment } from 'client/graphqlTypes';
import { ChildItem } from './ChildItem';
import { ProfileLabel } from 'client/common/ProfileLabel';
import { ProfileFieldContainer } from 'client/common/ProfileFieldContainer';
import styled from 'styled-components';

const ChildItemsContainer = styled.div``;

interface ChildrenContainerProps {
  actualChildren: SubContactInfoFragment[];
  parentLastName?: string | null | undefined;
  parentId: string;
  relations: SubContactInfoFragment[];
}

export const ChildrenContainer: FC<ChildrenContainerProps> = ({
  actualChildren,
  parentLastName,
  parentId,
  relations,
}) => {
  const childItems = actualChildren.map((child) => {
    return (
      <ChildItem
        key={child.id}
        child={child}
        parentId={parentId}
        parentLastName={parentLastName ? parentLastName : ''}
        relations={relations}
      />
    );
  });

  return (
    <ProfileFieldContainer>
      <ProfileLabel>children</ProfileLabel>
      <ChildItemsContainer>{childItems}</ChildItemsContainer>
    </ProfileFieldContainer>
  );
};
