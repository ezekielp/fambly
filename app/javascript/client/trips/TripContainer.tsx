import React, { FC } from 'react';
import { Text } from 'client/common/Text';
import {
  PlaceInfoFragmentDoc,
  TripPlaceInfoFragmentDoc,
  TripStageInfoFragmentDoc,
  TripInfoFragmentDoc,
  useGetTripForTripContainerQuery,
} from 'client/graphqlTypes';
import { gql } from '@apollo/client';
import { RouteComponentProps, useParams } from 'react-router-dom';
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

interface TripContainerProps extends RouteComponentProps {}

export const TripContainer: FC<TripContainerProps> = ({ history }) => {
  const { tripId } = useParams();
  const {
    data: tripData,
    refetch: refetchTripData,
  } = useGetTripForTripContainerQuery({
    variables: { tripId },
  });

  if (!tripData) return null;
  if (!tripData.tripById) {
    history.push('/home');
    return null;
  }
  const {
    id,
    name,
    departureDay,
    departureMonth,
    departureYear,
    endDay,
    endMonth,
    endYear,
    notes,
    tripStages,
    people,
  } = tripData.tripById;

  return (
    <>
      <div>{name}</div>
    </>
  );
};
