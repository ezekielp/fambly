import React, { FC, useState } from 'react';
import {
  useCreateAmorousRelationshipMutation,
  useGetUserPeopleQuery,
  SubContactInfoFragment,
} from 'client/graphqlTypes';
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
        current
        startYear
        startMonth
        startDay
        endYear
        endMonth
        endDay
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
  startYear: yup.number().integer().positive().nullable(),
  startMonth: yup
    .number()
    .integer()
    .positive()
    .nullable()
    .when('startDay', {
      is: (val) => val !== undefined && val !== null,
      then: yup
        .number()
        .integer()
        .positive()
        .required('Month is required if you specify a day')
        .nullable(),
    }),
  startDay: yup.number().integer().positive().nullable(),
  endYear: yup.number().integer().positive().nullable(),
  endMonth: yup
    .number()
    .integer()
    .positive()
    .nullable()
    .when('endDay', {
      is: (val) => val !== undefined && val !== null,
      then: yup
        .number()
        .integer()
        .positive()
        .required('Month is required if you specify a day')
        .nullable(),
    }),
  endDay: yup.number().integer().positive().nullable(),
  formPartnerId: yup.string(),
  note: yup.string(),
});

export interface AmorousRelationshipFormData {
  firstName?: string;
  lastName?: string;
  formPartnerId: string;
  newOrCurrentContact: string;
  showOnDashboard: string[];
  current: string[];
  formRelationshipType?: string;
  startYear?: number | null;
  startMonth?: string;
  startDay?: string;
  endYear?: number | null;
  endMonth?: string;
  endDay?: string;
  note?: string;
}

export interface AmorousRelationshipFormProps {
  setFieldToAdd?: (field: string) => void;
  personFirstName?: string;
  partnerOneId: string;
  initialValues?: AmorousRelationshipFormData;
  setEditFlag?: (bool: boolean) => void;
  setModalOpen?: (bool: boolean) => void;
  relations: SubContactInfoFragment[];
  propRelationshipType: string;
}

export const blankInitialValues = {
  firstName: '',
  lastName: '',
  formPartnerId: '',
  newOrCurrentContact: 'new_person',
  showOnDashboard: [],
  current: ['current'],
  formRelationshipType: '',
  startYear: null,
  startMonth: '',
  startDay: '',
  endYear: null,
  endMonth: '',
  endDay: '',
  note: '',
};

export const AmorousRelationshipForm: FC<AmorousRelationshipFormProps> = ({
  setFieldToAdd,
  personFirstName,
  partnerOneId,
  initialValues = blankInitialValues,
  setEditFlag,
  setModalOpen,
  relations,
  propRelationshipType,
}) => {
  const [
    createAmorousRelationshipMutation,
  ] = useCreateAmorousRelationshipMutation();

  const cancel = () => {
    if (setFieldToAdd) {
      setFieldToAdd('');
    } else if (setEditFlag && setModalOpen) {
      setEditFlag(false);
      setModalOpen(false);
    }
  };

  const handleSubmit = async (
    data: AmorousRelationshipFormData,
    formikHelpers: FormikHelpers<AmorousRelationshipFormData>,
  ) => {
    const {
      firstName,
      lastName,
      formPartnerId,
      newOrCurrentContact,
      showOnDashboard,
      current,
      formRelationshipType,
      startYear,
      startMonth,
      startDay,
      endYear,
      endMonth,
      endDay,
      note,
    } = data;
    const { setErrors, setStatus } = formikHelpers;

    if (setFieldToAdd) {
      const createAmorousRelationshipMutationResponse = await createAmorousRelationshipMutation(
        {
          variables: {
            input: {
              firstName: firstName ? firstName : null,
              lastName: lastName ? lastName : null,
              showOnDashboard: showOnDashboard.length > 0 ? true : false,
              partnerOneId,
              partnerTwoId: formPartnerId ? formPartnerId : null,
              relationshipType: formRelationshipType
                ? formRelationshipType
                : propRelationshipType,
              startYear,
              startMonth: startMonth ? parseInt(startMonth) : null,
              startDay: startDay ? parseInt(startDay) : null,
              endYear,
              endMonth: endMonth ? parseInt(endMonth) : null,
              endDay: endDay ? parseInt(endDay) : null,
            },
          },
        },
      );

      const createAmorousRelationshipErrors =
        createAmorousRelationshipMutationResponse.data
          ?.createAmorousRelationship.errors;

      if (createAmorousRelationshipErrors) {
        handleFormErrors<AmorousRelationshipFormData>(
          createAmorousRelationshipErrors,
          setErrors,
          setStatus,
        );
      } else {
        setFieldToAdd('');
      }
    }
  };
};
