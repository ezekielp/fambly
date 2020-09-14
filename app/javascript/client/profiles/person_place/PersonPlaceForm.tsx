import React, { FC } from 'react';
import {
  useCreatePersonPlaceMutation,
  useUpdatePersonPlaceMutation,
} from 'client/graphqlTypes';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import {
  FormikTextInput,
  FormikNumberInput,
  FormikTextArea,
  FormikCheckboxGroup,
  FormikSelectInput,
} from 'client/form/inputs';
import { Button } from 'client/common/Button';
import { MONTH_OPTIONS } from 'client/profiles/birthdate/utils';
import { STATE_OPTIONS } from './utils';
import { GlobalError } from 'client/common/GlobalError';
import { Text } from 'client/common/Text';
import { SectionDivider } from 'client/profiles/PersonContainer';
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

gql`
  mutation UpdatePersonPlace($input: UpdatePersonPlaceInput!) {
    updatePersonPlace(input: $input) {
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
  note: yup.string(),
});

interface PersonPlaceFormData {
  country: string;
  stateOrRegion?: string;
  town?: string;
  street?: string;
  zipCode?: string;
  birthPlace: string[];
  startYear?: number | null;
  startMonth?: string;
  endYear?: number | null;
  endMonth?: string;
  note?: string;
}

interface PersonPlaceFormProps {
  setFieldToAdd?: (field: string) => void;
  personId: string;
  initialValues?: PersonPlaceFormData;
  setEditFlag?: (bool: boolean) => void;
  personPlaceId?: string;
}

const blankInitialValues = {
  country: 'USA',
  stateOrRegion: '',
  town: '',
  street: '',
  zipCode: '',
  birthPlace: [],
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
  personPlaceId,
}) => {
  const [createPersonPlace] = useCreatePersonPlaceMutation();
  const [updatePersonPlace] = useUpdatePersonPlaceMutation();

  const cancel = () => {
    if (setFieldToAdd) {
      setFieldToAdd('');
    } else if (setEditFlag) {
      setEditFlag(false);
    }
  };

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
      startYear,
      startMonth,
      endYear,
      endMonth,
      note,
    } = data;
    const { setErrors, setStatus } = formikHelpers;
    const input = {
      country,
      stateOrRegion: stateOrRegion ? stateOrRegion : null,
      town: town ? town : null,
      street: street ? street : null,
      zipCode: zipCode ? zipCode : null,
      birthPlace: birthPlace.length > 0 ? true : false,
      startYear,
      startMonth: startMonth ? parseInt(startMonth) : null,
      endYear,
      endMonth: endMonth ? parseInt(endMonth) : null,
    };

    if (setFieldToAdd) {
      const createResponse = await createPersonPlace({
        variables: {
          input: {
            ...input,
            personId,
            note: note ? note : null,
          },
        },
      });

      const createErrors = createResponse.data?.createPersonPlace.errors;

      if (createErrors) {
        handleFormErrors<PersonPlaceFormData>(
          createErrors,
          setErrors,
          setStatus,
        );
        return;
      }
      setFieldToAdd('');
    } else if (setEditFlag) {
      const updateResponse = await updatePersonPlace({
        variables: {
          input: {
            ...input,
            personPlaceId: personPlaceId ? personPlaceId : '',
          },
        },
      });

      const updateErrors = updateResponse.data?.updatePersonPlace.errors;

      if (updateErrors) {
        handleFormErrors<PersonPlaceFormData>(
          updateErrors,
          setErrors,
          setStatus,
        );
        return;
      }
      setEditFlag(false);
    }
  };

  return (
    <>
      <Text marginBottom={3} fontSize={4} bold>
        Place
      </Text>
      <SectionDivider />
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={PersonPlaceFormValidationSchema}
      >
        {({ values, isSubmitting, status }) => {
          return (
            <Form>
              <Field
                name="country"
                label="Country"
                component={FormikTextInput}
              />
              {values.country === 'USA' && (
                <Field
                  name="stateOrRegion"
                  label="State (optional)"
                  component={FormikSelectInput}
                  options={STATE_OPTIONS}
                />
              )}
              {values.country !== 'USA' && (
                <Field
                  name="stateOrRegion"
                  label="State or region (optional)"
                  component={FormikTextInput}
                />
              )}
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
                label=""
                component={FormikCheckboxGroup}
                options={[{ label: 'Birth place?', value: 'birthPlace' }]}
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
                options={MONTH_OPTIONS}
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
                options={MONTH_OPTIONS}
              />
              {setFieldToAdd && (
                <Field
                  name="note"
                  label="Note (optional)"
                  component={FormikTextArea}
                />
              )}
              {status && <GlobalError>{status}</GlobalError>}
              <Button marginRight="1rem" type="submit" disabled={isSubmitting}>
                Save
              </Button>
              <Button onClick={() => cancel()}>Cancel</Button>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};
