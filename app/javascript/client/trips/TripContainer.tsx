import React, { FC } from 'react';
import { Text } from 'client/common/Text';
import {
  PlaceInfoFragmentDoc,
  TripPlaceInfoFragmentDoc,
  TripStageInfoFragmentDoc,
  TripInfoFragmentDoc,
} from 'client/graphqlTypes';
import { gql } from '@apollo/client';
import styled from 'styled-components';

gql`
  query GetTripForTripContainer($tripId: String!) {
    tripById(tripId: $tripId) {
      ...TripInfo
    }
  }

  ${TripInfoFragmentDoc}
`;

gql`
  fragment TripInfo on Trip {
    id
    name
    departureDay
    departureMonth
    departureYear
    endDay
    endMonth
    endYear
    notes {
      id
      content
    }
    tripStages {
      ...TripStageInfo
    }
    people {
      id
      firstName
      lastName
    }
  }

  ${TripStageInfoFragmentDoc}
`;

gql`
  fragment TripStageInfo on TripStage {
    id
    place {
      ...PlaceInfo
    }
    accommodation {
      ...PlaceInfo
    }
    startDay
    startMonth
    startYear
    endDay
    endMonth
    endYear
    tripPlaces {
      ...TripPlaceInfo
    }
    people {
      id
      firstName
      lastName
    }
  }

  ${PlaceInfoFragmentDoc}
  ${TripPlaceInfoFragmentDoc}
`;

gql`
  fragment TripPlaceInfo on TripPlace {
    id
    place {
      ...PlaceInfo
    }
    placeType
    visitDay
    visitMonth
    visitYear
    notes {
      id
      content
    }
  }

  ${PlaceInfoFragmentDoc}
`;

gql`
  fragment PlaceInfo on Place {
    id
    country
    name
    stateOrRegion
    town
    street
    zipCode
  }
`;
