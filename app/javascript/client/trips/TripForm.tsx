import React, { FC, useState } from 'react';
import {
  useCreateTripMutation,
  useCreateTripPersonMutation,
} from 'client/graphqlTypes';
import { AuthContext } from 'client/contexts/AuthContext';
import { Field, Form, Formik, FormikHelpers, FieldProps } from 'formik';
import { Label } from 'client/form/withFormik';
import {
  FormikTextInput,
  FormikSelectInput,
  FormikNumberInput,
} from 'client/form/inputs';
import {
  RowWrapper,
  LeftHalfWrapper,
  MiddleQuarterWrapper,
  RightQuarterWrapper,
} from 'client/form/inputWrappers';
import { TripFormValidationSchema } from './utils';
import {
  MONTH_OPTIONS,
  determineDaysOptions,
  FEBRUARY_DAYS_OPTIONS,
  THIRTY_DAYS_OPTIONS,
  THIRTY_ONE_DAYS_OPTIONS,
} from 'client/profiles/birthdate/utils';
import { MonthLabel } from 'client/profiles/birthdate/BirthdateForm';
import { Button } from 'client/common/Button';
import { Text } from 'client/common/Text';
import { FormikAutosuggest } from 'client/form/FormikAutosuggest';
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

  const cancel = () => {
    setFieldToAdd('');
    setModalOpen && setModalOpen(false);
  };

  const handleSubmit = async (
    data: TripFormData,
    formikHelpers: FormikHelpers<TripFormData>,
  ) => {
    const {
      name,
      departureYear,
      departureMonth,
      departureDay,
      endYear,
      endMonth,
      endDay,
    } = data;
    const { setErrors, setStatus } = formikHelpers;

    const response = await createTripMutation({
      variables: {
        input: {
          name,
          departureYear,
          departureMonth: departureMonth ? parseInt(departureMonth) : null,
          departureDay: departureDay ? parseInt(departureDay) : null,
          endYear,
          endMonth: endMonth ? parseInt(endMonth) : null,
          endDay: endDay ? parseInt(endDay) : null,
        },
      },
    });

    const errors = response.data?.createTrip.errors;

    if (errors) {
      handleFormErrors<TripFormData>(errors, setErrors, setStatus);
    } else {
      // TO DO: Add mutation(s) for adding trip_people
      // TO DO: Take the user to the trip page
      setFieldToAdd('');
    }
  };

  return (
    <>
      <Text marginBottom={3} fontSize={4} bold>
        Trip
      </Text>
      <Formik
        initialValues={initialValues}
        validationSchema={TripFormValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, isSubmitting }) => {
          const departureDaysOptions = determineDaysOptions(
            values.departureMonth,
            FEBRUARY_DAYS_OPTIONS,
            THIRTY_DAYS_OPTIONS,
            THIRTY_ONE_DAYS_OPTIONS,
          );
          const endDaysOptions = determineDaysOptions(
            values.endMonth,
            FEBRUARY_DAYS_OPTIONS,
            THIRTY_DAYS_OPTIONS,
            THIRTY_ONE_DAYS_OPTIONS,
          );
          return (
            <Form>
              <Field
                name="name"
                label="Please provide a name for this trip."
                component={FormikTextInput}
              />
              <Label as="label">When did the trip begin?</Label>
              <RowWrapper>
                <LeftHalfWrapper>
                  <MonthLabel>Month (optional)</MonthLabel>
                  <Field
                    name="departureMonth"
                    component={FormikSelectInput}
                    options={MONTH_OPTIONS}
                  />
                </LeftHalfWrapper>
                <MiddleQuarterWrapper>
                  <Field
                    name="departureDay"
                    label="Day (optional)"
                    component={FormikSelectInput}
                    options={departureDaysOptions}
                  />
                </MiddleQuarterWrapper>
                <RightQuarterWrapper>
                  <Field
                    name="departureYear"
                    label="Year (optional)"
                    component={FormikNumberInput}
                  />
                </RightQuarterWrapper>
              </RowWrapper>
              <Label as="label">When did the trip conclude?</Label>
              <RowWrapper>
                <LeftHalfWrapper>
                  <MonthLabel>Month (optional)</MonthLabel>
                  <Field
                    name="endMonth"
                    component={FormikSelectInput}
                    options={MONTH_OPTIONS}
                  />
                </LeftHalfWrapper>
                <MiddleQuarterWrapper>
                  <Field
                    name="endDay"
                    label="Day (optional)"
                    component={FormikSelectInput}
                    options={endDaysOptions}
                  />
                </MiddleQuarterWrapper>
                <RightQuarterWrapper>
                  <Field
                    name="endYear"
                    label="Year (optional)"
                    component={FormikNumberInput}
                  />
                </RightQuarterWrapper>
              </RowWrapper>
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
