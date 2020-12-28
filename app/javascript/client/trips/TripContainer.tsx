import React, { FC } from 'react';
import { Text } from 'client/common/Text';
import { gql } from '@apollo/client';
import styled from 'styled-components';

// gql`
//   query GetTripForTripContainer($tripId: String!) {
//     tripById(tripId: $tripId) {
//       ...TripInfo
//     }
//   }

//   ${TripInfoFragmentDoc}
// `;

gql`
  fragment TripInfo on Trip {
    
  }
`;
