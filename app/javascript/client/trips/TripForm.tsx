import React, { FC, useState } from 'react';
import {
  useCreateTripMutation,
  useCreateTripPersonMutation,
} from 'client/graphqlTypes';
import { AuthContext } from 'client/contexts/AuthContext';
import { Field, Form, Formik, FormikHelpers, FieldProps } from 'formik';
import { TripFormValidationSchema } from './utils';
import { Button, ButtonProps } from 'client/common/Button';
import { Text } from 'client/common/Text';
import { Label, StyledErrorMessage } from 'client/form/withFormik';
import { handleFormErrors } from 'client/utils/formik';
import { gql } from '@apollo/client';

gql`
  mutation CreateTrip($input: CreateTripInput!) {
    createTrip(input: $input) {
      trip {
        id
        name
        departureDay
        departureMonth
        departureYear
        endDay
        endMonth
        endYear
      }
      errors {
        path
        message
      }
    }
  }
`;

gql`
  mutation CreateTripPerson($input: CreateTripPersonInput!) {
    createTripPerson(input: $input) {
      tripPerson {
        id
        person {
          id
          firstName
          lastName
        }
        trip {
          id
        }
      }
      errors {
        path
        message
      }
    }
  }
`;

export interface TripFormData {
  name: string;
  departureYear?: number | null;
  departureMonth?: string;
  departureDay?: string;
  endYear?: number | null;
  endMonth?: string;
  endDay?: string;
  tripPerson?: string;
}

// To add people to the trip: I guess stick in an Autosuggest with all the current people, create a stage variable array to put them in, call however many CreateTripPerson mutations necessary — ooo, get to use a Promise.all or something maybe ... or maybe just a forEach loop? Hmmm — after you `await` creating the trip

export interface TripFormProps {
  setFieldToAdd: (field: string) => void;
  setModalOpen?: (bool: boolean) => void;
  initialValues?: TripFormData;
}

export const blankInitialValues: TripFormData = {
  name: '',
  departureYear: null,
  departureMonth: 'string',
  departureDay: 'string',
  endYear: null,
  endMonth: 'string',
  endDay: 'string',
  tripPerson: 'string',
};

export const TripForm: FC<TripFormProps> = ({
  setFieldToAdd,
  setModalOpen,
  initialValues = blankInitialValues,
}) => {
  const { userId } = useContext(AuthContext);
  const [createTripMutation] = useCreateTripMutation();
  const [createTripPersonMutatation] = useCreateTripPersonMutation();

  return (
    <>
      <Text marginBottom={3} fontSize={4} bold>
        Trip
      </Text>
      <Formik
        initialValues={blankInitialValues}
        validationSchema={TripFormValidationSchema}
      ></Formik>
    </>
  );
};
