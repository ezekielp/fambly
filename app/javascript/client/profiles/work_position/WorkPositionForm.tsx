import React, { FC } from 'react';
import { useCreateWorkPositionMutation } from 'client/graphqlTypes';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { Button } from 'client/common/Button';
import { Text } from 'client/common/Text';
import { SectionDivider } from 'client/profiles/PersonContainer';
import * as yup from 'yup';
import { gql } from '@apollo/client';
import { handleFormErrors } from 'client/utils/formik';

gql`
  mutation CreateWorkPosition($input: CreateWorkPositionInput!) {
    createWorkPosition(input: $input) {
      workPosition {
        id
        person {
          id
          firstName
          lastName
        }
        place {
          id
          country
          stateOrRegion
          town
          street
          zipCode
        }
        title
        companyName
        description
        workType
        current
        startYear
        startMonth
        endYear
        endMonth
        notes {
          id
          content
        }
      }
      errors {
        path
        message
      }
    }
  }
`;

export const WorkPositionFormValidationSchema = yup.object().shape({
  title: yup.string(),
  companyName: yup.string(),
  description: yup.string(),
  workType: yup.string(),
  startYear: yup
    .number()
    .integer()
    .positive()
    .nullable()
    .when('startMonth', {
      is: (val) => val !== undefined && val !== null,
      then: yup
        .number()
        .integer()
        .positive()
        .required('Year is required if you specify a month')
        .nullable(),
    }),
  startMonth: yup.string().nullable(),
  endYear: yup
    .number()
    .integer()
    .positive()
    .nullable()
    .when('endMonth', {
      is: (val) => val !== undefined && val !== null && val !== '',
      then: yup
        .number()
        .integer()
        .positive()
        .required('Year is required if you specify a month')
        .nullable(),
    }),
  endMonth: yup.string().nullable(),
  // TO DO: Do the conditional validation for country -- if town OR stateOrRegion are not null, country should be required
  country: yup.string(),
  placeType: yup.string(),
  stateOrRegion: yup.string(),
  town: yup.string(),
});
