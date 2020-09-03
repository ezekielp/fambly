import React, { FC } from 'react';
import { SubContactInfoFragment } from 'client/graphqlTypes';
import { ParentItem } from './ParentItem';
import styled from 'styled-components';

const ParentsHeader = styled.div``;

const ParentItemsContainer = styled.div``;

interface ParentsContainerProps {
  parents: SubContactInfoFragment[];
  childLastName?: string;
  childId: string;
}

export const ParentsContainer: FC<ParentsContainerProps> = ({
  parents,
  childId,
  childLastName,
}) => {
  const parentItems = parents.map((parent) => {
    return (
      <ParentItem
        key={parent.id}
        parent={parent}
        childId={childId}
        childLastName={childLastName}
      />
    );
  });

  return (
    <>
      <ParentsHeader>Parents</ParentsHeader>
      <ParentItemsContainer>{parentItems}</ParentItemsContainer>
    </>
  );
};
