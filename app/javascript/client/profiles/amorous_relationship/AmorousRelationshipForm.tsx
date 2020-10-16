import React, { FC, useState } from 'react';
import { Field, Form, Formik, FormikHelpers, FieldProps } from 'formik';
import {
  FormikTextInput,
  FormikNumberInput,
  FormikRadioGroup,
  FormikSelectInput,
  FormikTextArea,
  FormikCheckboxGroup,
} from 'client/form/inputs';
import { Button } from 'client/common/Button';
import { GlobalError } from 'client/common/GlobalError';
import { Text } from 'client/common/Text';
import { SectionDivider } from 'client/profiles/PersonContainer';
import {
  NEW_OR_CURRENT_CONTACT_OPTIONS,
  filterOutRelationsFromAndSortPeople,
  getFullNameFromPerson,
} from 'client/profiles/utils';
import * as yup from 'yup';
import { gql } from '@apollo/client';
import { handleFormErrors } from 'client/utils/formik';
import { FormikAutosuggest } from 'client/form/FormikAutosuggest';

gql`
  mutation CreateAmorousRelationship($input: CreateAmorousRelationshipInput!) {
    createAmorousRelationship(input: $input) {
      amorousRelationship {
        id
        partnerOne {
          id
          firstName
          lastName
        }
        partnerTwo {
          id
          firstName
          lastName
        }
        relationshipType
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

const AmorousRelationshipFormValidationSchema = yup.object().shape({
  firstName: yup.string().when('newOrCurrentContact', {
    is: (val: string) => val === 'new_person',
    then: yup
      .string()
      .required(
        "To create a new contact, you need to provide at least the person's first name",
      ),
  }),
  lastName: yup.string(),
  newOrCurrentContact: yup.string().required(),
  formPartnerId: yup.string(),
  note: yup.string(),
});

export interface AmorousRelationshipFormData {
  firstName?: string;
  lastName?: string;
  formPartnerId: string;
  newOrCurrentContact: string;
  showOnDashboard: string[];
}
