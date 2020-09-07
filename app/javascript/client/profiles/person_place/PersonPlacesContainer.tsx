import React, { FC } from 'react';
import { PersonPlaceInfoFragment } from 'client/graphqlTypes';
import { PersonPlaceItem } from './PersonPlaceItem';
import styled from 'styled-components';

const PersonPlacesHeader = styled.div``;

const PersonPlaceItemsContainer = styled.div``;

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
    <div>
      <PersonPlacesHeader>Places {firstName} has lived</PersonPlacesHeader>
      <PersonPlaceItemsContainer>{personPlaceItems}</PersonPlaceItemsContainer>
    </div>
  );
};
