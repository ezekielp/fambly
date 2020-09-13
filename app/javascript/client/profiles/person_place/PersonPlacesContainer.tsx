import React, { FC } from 'react';
import { PersonPlaceInfoFragment } from 'client/graphqlTypes';
import { PersonPlaceItem } from './PersonPlaceItem';
import { ProfileLabel } from 'client/common/ProfileLabel';
import { ProfileFieldContainer } from 'client/common/ProfileFieldContainer';
import styled from 'styled-components';

const PersonPlaceItemsContainer = styled.div`
  margin: 0 auto;
`;

interface PersonPlacesContainerProps {
  personPlaces: PersonPlaceInfoFragment[];
  firstName: string;
}

export const PersonPlacesContainer: FC<PersonPlacesContainerProps> = ({
  personPlaces,
  firstName,
}) => {
  const personPlaceItems = personPlaces.map((personPlace) => {
    return <PersonPlaceItem personPlace={personPlace} key={personPlace.id} />;
  });

  return (
    <ProfileFieldContainer>
      <ProfileLabel>places {firstName} has lived</ProfileLabel>
      <PersonPlaceItemsContainer>{personPlaceItems}</PersonPlaceItemsContainer>
    </ProfileFieldContainer>
  );
};
