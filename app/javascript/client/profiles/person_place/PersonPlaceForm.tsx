import React, { FC } from 'react';
import { useCreatePersonPlaceMutation } from 'client/graphqlTypes';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import {
  FormikTextInput,
  FormikNumberInput,
  FormikTextArea,
  FormikCheckbox,
  FormikSelectInput,
} from 'client/form/inputs';
import { GlobalError } from 'client/common/GlobalError';
import { gql } from '@apollo/client';
import { handleFormErrors } from 'client/utils/formik';
import * as yup from 'yup';

gql`
  mutation CreatePersonPlace($input: CreatePersonPlaceInput!) {
    createPersonPlace(input: $input) {
      personPlace {
        id
        person {
          id
          firstName
        }
        place {
          id
          country
          stateOrRegion
          town
          street
          zipCode
        }
        birthPlace
        current
        startMonth
        startYear
        endMonth
        endYear
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

const PersonPlaceFormValidationSchema = yup.object().shape({
  country: yup.string().required('You must provide at least a country!'),
  stateOrRegion: yup.string(),
  town: yup.string(),
  street: yup.string(),
  zipCode: yup.string(),
  birthPlace: yup.boolean(),
  current: yup.boolean(),
  startYear: yup.number().integer().positive().nullable(),
  startMonth: yup
    .string()
    .nullable()
    .when('startYear', {
      is: (val) => val !== undefined && val !== null,
      then: yup
        .string()
        .required('Month is required if you specify a year')
        .nullable(),
    }),
  endYear: yup.number().integer().positive().nullable(),
  endMonth: yup
    .string()
    .nullable()
    .when('endYear', {
      is: (val) => val !== undefined && val !== null,
      then: yup
        .string()
        .required('Month is required if you specify a year')
        .nullable(),
    }),
  note: yup.string(),
});

interface PersonPlaceFormData {
  country: string;
  stateOrRegion?: string;
  town?: string;
  street?: string;
  zipCode?: string;
  birthPlace?: boolean;
  current?: boolean;
  startYear?: number | null;
  startMonth?: string;
  endYear?: number | null;
  endMonth?: string;
  note: string;
}

interface PersonPlaceFormProps {
  setFieldToAdd?: (field: string) => void;
  personId: string;
  initialValues?: PersonPlaceFormData;
  setEditFlag?: (bool: boolean) => void;
}

const blankInitialValues = {
  country: '',
  stateOrRegion: '',
  town: '',
  street: '',
  zipCode: '',
  birthPlace: false,
  current: false,
  startYear: null,
  startMonth: '',
  endYear: null,
  endMonth: '',
  note: '',
};

export const PersonPlaceForm: FC<PersonPlaceFormProps> = ({
  setFieldToAdd,
  personId,
  initialValues = blankInitialValues,
  setEditFlag,
}) => {
  const [createPersonPlace] = useCreatePersonPlaceMutation();

  const handleSubmit = async (
    data: PersonPlaceFormData,
    formikHelpers: FormikHelpers<PersonPlaceFormData>,
  ) => {
    const {
      country,
      stateOrRegion,
      town,
      street,
      zipCode,
      birthPlace,
      current,
      startYear,
      startMonth,
      endYear,
      endMonth,
      note,
    } = data;
    const { setErrors, setStatus } = formikHelpers;

    const response = await createPersonPlace({
      variables: {
        input: {
          personId,
          country,
          stateOrRegion: stateOrRegion ? stateOrRegion : null,
          town: town ? town : null,
          street: street ? street : null,
          zipCode: zipCode ? zipCode : null,
          birthPlace,
          current,
          startYear,
          startMonth: startMonth ? parseInt(startMonth) : null,
          endYear,
          endMonth: endMonth ? parseInt(endMonth) : null,
          note: note ? note : null,
        },
      },
    });

    const errors = response.data?.createPersonPlace.errors;

    if (errors) {
      handleFormErrors<PersonPlaceFormData>(errors, setErrors, setStatus);
      return;
    }
    if (setFieldToAdd) {
      setFieldToAdd('');
    } else if (setEditFlag) {
      setEditFlag(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={PersonPlaceFormValidationSchema}
    >
      {({ isSubmitting, status }) => {
        return (
          <Form>
            <Field name="country" label="Country" component={FormikTextInput} />
            <Field
              name="stateOrRegion"
              label="State or region (optional)"
              component={FormikTextInput}
            />
            <Field
              name="town"
              label="City or town (optional)"
              component={FormikTextInput}
            />
            <Field
              name="street"
              label="Street address (optional)"
              component={FormikTextInput}
            />
            <Field
              name="zipCode"
              label="Zip code (optional)"
              component={FormikTextInput}
            />
            <Field
              name="birthPlace"
              label="Birth place?"
              component={FormikCheckbox}
            />
            <Field
              name="current"
              label="Current home address?"
              component={FormikCheckbox}
            />
            <Field
              name="startYear"
              label="Start year (optional)"
              component={FormikNumberInput}
            />
            <Field
              name="startMonth"
              label="Start month (optional)"
              component={FormikSelectInput}
              options={}
            />
            <Field
              name="endYear"
              label="End year (optional)"
              component={FormikNumberInput}
            />
            <Field
              name="endMonth"
              label="End month (optional)"
              component={FormikSelectInput}
              options={}
            />
            <Field
              name="note"
              label="Note (optional)"
              component={FormikTextArea}
            />
            {status && <GlobalError>{status}</GlobalError>}
            <button type="submit" disabled={isSubmitting}>
              Save
            </button>
          </Form>
        );
      }}
    </Formik>
  );
};
