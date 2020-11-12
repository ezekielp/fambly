import React, { FC } from 'react';
import { PersonPlaceInfoFragment } from 'client/graphqlTypes';
import { PersonPlaceItem } from './PersonPlaceItem';
import { ProfileLabel } from 'client/common/ProfileLabel';
import { ProfileFieldContainer } from 'client/common/ProfileFieldContainer';
import styled from 'styled-components';

const PersonPlaceItemsContainer = styled.div`
  margin-left: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

interface PersonPlacesContainerProps {
  personPlaces: PersonPlaceInfoFragment[];
  firstName: string;
  current: boolean;
}

export const PersonPlacesContainer: FC<PersonPlacesContainerProps> = ({
  personPlaces,
  firstName,
  current,
}) => {
  const personPlaceItems = personPlaces.map((personPlace) => {
    return (
      <PersonPlaceItem
        personPlace={personPlace}
        current={current}
        key={personPlace.id}
        personFirstName={firstName}
      />
    );
  });

  const labelText = current ? 'addresses' : `places ${firstName} has lived`;

  return (
    <ProfileFieldContainer>
      <ProfileLabel>{labelText}</ProfileLabel>
      <PersonPlaceItemsContainer>{personPlaceItems}</PersonPlaceItemsContainer>
    </ProfileFieldContainer>
  );
};
