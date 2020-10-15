import React, { FC } from 'react';
import { SubContactInfoFragment } from 'client/graphqlTypes';
import { ParentItem } from './ParentItem';
import { ProfileLabel } from 'client/common/ProfileLabel';
import { ProfileFieldContainer } from 'client/common/ProfileFieldContainer';
import styled from 'styled-components';

const ParentItemsContainer = styled.div``;

interface ParentsContainerProps {
  parents: SubContactInfoFragment[];
  childLastName?: string | null | undefined;
  childId: string;
  relations: SubContactInfoFragment[];
}

export const ParentsContainer: FC<ParentsContainerProps> = ({
  parents,
  childId,
  childLastName,
  relations,
}) => {
  const parentItems = parents.map((parent) => {
    return (
      <ParentItem
        key={parent.id}
        parent={parent}
        childId={childId}
        childLastName={childLastName ? childLastName : ''}
        relations={relations}
      />
    );
  });

  return (
    <ProfileFieldContainer>
      <ProfileLabel>parents</ProfileLabel>
      <ParentItemsContainer>{parentItems}</ParentItemsContainer>
    </ProfileFieldContainer>
  );
};
