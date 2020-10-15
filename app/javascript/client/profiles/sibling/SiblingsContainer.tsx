import React, { FC } from 'react';
import { SubContactInfoFragment } from 'client/graphqlTypes';
import { SiblingItem } from './SiblingItem';
import { ProfileLabel } from 'client/common/ProfileLabel';
import { ProfileFieldContainer } from 'client/common/ProfileFieldContainer';
import styled from 'styled-components';

const SiblingItemsContainer = styled.div``;

interface SiblingsContainerProps {
  siblings: SubContactInfoFragment[];
  otherSiblingLastName?: string | null | undefined;
  otherSiblingId: string;
  relations: SubContactInfoFragment[];
}

export const SiblingsContainer: FC<SiblingsContainerProps> = ({
  siblings,
  otherSiblingId,
  otherSiblingLastName,
  relations,
}) => {
  const siblingItems = siblings.map((sibling) => {
    return (
      <SiblingItem
        key={sibling.id}
        sibling={sibling}
        otherSiblingId={otherSiblingId}
        otherSiblingLastName={otherSiblingLastName}
        relations={relations}
      />
    );
  });

  return (
    <ProfileFieldContainer>
      <ProfileLabel>siblings</ProfileLabel>
      <SiblingItemsContainer>{siblingItems}</SiblingItemsContainer>
    </ProfileFieldContainer>
  );
};
