import React, { FC, useState } from 'react';
import {
  useCreateAmorousRelationshipMutation,
  useUpdateAmorousRelationshipMutation,
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
import {
  RowWrapper,
  LeftHalfWrapper,
  RightHalfWrapper,
  MiddleQuarterWrapper,
  RightQuarterWrapper,
  FirstNameLabel,
  LastNameLabel,
} from 'client/form/inputWrappers';
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
import {
  MONTH_OPTIONS,
  determineDaysOptions,
  FEBRUARY_DAYS_OPTIONS,
  THIRTY_DAYS_OPTIONS,
  THIRTY_ONE_DAYS_OPTIONS,
} from 'client/profiles/birthdate/utils';
import { PARTNER_TYPE_OPTIONS } from './utils';
import styled from 'styled-components';

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
        weddingYear
        weddingMonth
        weddingDay
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

gql`
  mutation UpdateAmorousRelationship($input: UpdateAmorousRelationshipInput!) {
    updateAmorousRelationship(input: $input) {
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
        weddingYear
        weddingMonth
        weddingDay
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

const StartMonthLabel = styled.div`
  width: 70%;
  margin-bottom: 15px;
`;

const EndMonthLabel = styled(StartMonthLabel)``;

const StartYearLabel = styled.div`
  width: 103%;
  margin-bottom: 15px;
`;

const WeddingMonthLabel = styled.div`
  margin-top: 19px;
  margin-bottom: 15px;
`;

const AmorousPartnerFormValidationSchema = yup.object().shape({
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
  weddingYear: yup.number().integer().positive().nullable(),
  weddingMonth: yup
    .number()
    .integer()
    .positive()
    .nullable()
    .when('weddingDay', {
      is: (val) => val !== undefined && val !== null,
      then: yup
        .number()
        .integer()
        .positive()
        .required('Month is required if you specify a day')
        .nullable(),
    }),
  weddingDay: yup.number().integer().positive().nullable(),
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

export interface AmorousPartnerFormData {
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
  weddingYear?: number | null;
  weddingMonth?: string;
  weddingDay?: string;
  endYear?: number | null;
  endMonth?: string;
  endDay?: string;
  note?: string;
}

export interface AmorousPartnerFormProps {
  setFieldToAdd?: (field: string) => void;
  personFirstName?: string;
  partnerOneId: string;
  initialValues?: AmorousPartnerFormData;
  setEditFlag?: (bool: boolean) => void;
  setModalOpen?: (bool: boolean) => void;
  relations: SubContactInfoFragment[];
  propRelationshipType: string;
  partnerFirstName?: string;
  propCurrent?: boolean;
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
  weddingYear: null,
  weddingMonth: '',
  weddingDay: '',
  endYear: null,
  endMonth: '',
  endDay: '',
  note: '',
};

export const AmorousPartnerForm: FC<AmorousPartnerFormProps> = ({
  setFieldToAdd,
  personFirstName,
  partnerOneId,
  initialValues = blankInitialValues,
  setEditFlag,
  setModalOpen,
  relations,
  propRelationshipType,
  partnerFirstName,
  propCurrent,
}) => {
  const [
    createAmorousRelationshipMutation,
  ] = useCreateAmorousRelationshipMutation();
  const [
    updateAmorousRelationshipMutation,
  ] = useUpdateAmorousRelationshipMutation();
  const { data: userPeople } = useGetUserPeopleQuery();
  const personRelationIds = new Set(relations.map((person) => person.id));
  personRelationIds.add(partnerOneId);
  const filteredPeople = userPeople?.people
    ? filterOutRelationsFromAndSortPeople(userPeople.people, personRelationIds)
    : [];
  const [peopleSuggestions, setPeopleSuggestions] = useState(filteredPeople);
  const [partnerTwoInputValue, setPartnerTwoInputValue] = useState('');

  const formHeader = propRelationshipType === 'marriage' ? 'Spouse' : 'Partner';

  const cancel = () => {
    if (setFieldToAdd) {
      setFieldToAdd('');
    } else if (setEditFlag && setModalOpen) {
      setEditFlag(false);
      setModalOpen(false);
    }
  };

  const handleSubmit = async (
    data: AmorousPartnerFormData,
    formikHelpers: FormikHelpers<AmorousPartnerFormData>,
  ) => {
    const {
      firstName,
      lastName,
      formPartnerId,
      showOnDashboard,
      current,
      formRelationshipType,
      startYear,
      startMonth,
      startDay,
      weddingYear,
      weddingMonth,
      weddingDay,
      endYear,
      endMonth,
      endDay,
      note,
    } = data;
    const { setErrors, setStatus } = formikHelpers;
    const input = {
      partnerOneId,
      startYear,
      startMonth: startMonth ? parseInt(startMonth) : null,
      startDay: startDay ? parseInt(startDay) : null,
      weddingYear,
      weddingMonth: weddingMonth ? parseInt(weddingMonth) : null,
      weddingDay: weddingDay ? parseInt(weddingDay) : null,
      endYear,
      endMonth: endMonth ? parseInt(endMonth) : null,
      endDay: endDay ? parseInt(endDay) : null,
    };

    if (setFieldToAdd) {
      const createAmorousRelationshipMutationResponse = await createAmorousRelationshipMutation(
        {
          variables: {
            input: {
              ...input,
              firstName: firstName ? firstName : null,
              lastName: lastName ? lastName : null,
              showOnDashboard: showOnDashboard.length > 0 ? true : false,
              relationshipType: propRelationshipType,
              current: propCurrent,
              partnerTwoId: formPartnerId ? formPartnerId : null,
              note: note ? note : null,
            },
          },
        },
      );

      const createAmorousRelationshipErrors =
        createAmorousRelationshipMutationResponse.data
          ?.createAmorousRelationship.errors;

      if (createAmorousRelationshipErrors) {
        handleFormErrors<AmorousPartnerFormData>(
          createAmorousRelationshipErrors,
          setErrors,
          setStatus,
        );
      } else {
        setFieldToAdd('');
      }
    } else if (setEditFlag) {
      const updateResponse = await updateAmorousRelationshipMutation({
        variables: {
          input: {
            ...input,
            partnerTwoId: formPartnerId,
            current: current.length > 0 ? true : false,
            relationshipType: formRelationshipType,
          },
        },
      });

      const updateAmorousRelationshipErrors =
        updateResponse.data?.updateAmorousRelationship.errors;
      if (updateAmorousRelationshipErrors) {
        handleFormErrors<AmorousPartnerFormData>(
          updateAmorousRelationshipErrors,
          setErrors,
          setStatus,
        );
      } else {
        setEditFlag(false);
        setModalOpen && setModalOpen(false);
      }
    }
  };

  return (
    <>
      <Text marginBottom={3} fontSize={4} bold>
        {formHeader}
      </Text>
      <SectionDivider />
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={AmorousPartnerFormValidationSchema}
      >
        {({ values, isSubmitting, status }) => {
          const startDaysOptions = determineDaysOptions(
            values.startMonth,
            FEBRUARY_DAYS_OPTIONS,
            THIRTY_DAYS_OPTIONS,
            THIRTY_ONE_DAYS_OPTIONS,
          );
          const weddingDaysOptions = determineDaysOptions(
            values.weddingMonth,
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
          const showEndDatesFlag = (): boolean => {
            if (
              (setFieldToAdd && propCurrent === false) ||
              (setEditFlag && values.current.length === 0)
            ) {
              console.log('hello');
              return true;
            }
            return false;
          };
          return (
            <Form>
              {setEditFlag && partnerFirstName && (
                <Field
                  name="current"
                  label=""
                  component={FormikCheckboxGroup}
                  options={[
                    {
                      label: `Are ${personFirstName} and ${partnerFirstName} still together?`,
                      value: 'current',
                    },
                  ]}
                />
              )}
              {setEditFlag && (
                <Field
                  name="formRelationshipType"
                  label="Type of partner (optional)"
                  component={FormikSelectInput}
                  options={PARTNER_TYPE_OPTIONS}
                />
              )}
              {setFieldToAdd && (
                <Field
                  name="newOrCurrentContact"
                  label=""
                  component={FormikRadioGroup}
                  options={NEW_OR_CURRENT_CONTACT_OPTIONS}
                />
              )}
              {values.newOrCurrentContact === 'new_person' && (
                <>
                  <Field
                    name="showOnDashboard"
                    label=""
                    component={FormikCheckboxGroup}
                    options={[
                      {
                        label: `Add this person to your dashboard of contacts? (Even if you don't add them to your dashboard, you will always be able to access and add to their profile from ${personFirstName}'s page.)`,
                        value: 'showOnDashboard',
                      },
                    ]}
                  />
                  <RowWrapper>
                    <LeftHalfWrapper>
                      <FirstNameLabel>First name</FirstNameLabel>
                      <Field name="firstName" component={FormikTextInput} />
                    </LeftHalfWrapper>
                    <RightHalfWrapper>
                      <LastNameLabel>Last name (optional)</LastNameLabel>
                      <Field name="lastName" component={FormikTextInput} />
                    </RightHalfWrapper>
                  </RowWrapper>
                </>
              )}
              {values.newOrCurrentContact === 'current_person' &&
                setFieldToAdd && (
                  <Field name="formPartnerId">
                    {({ form }: FieldProps) => (
                      <FormikAutosuggest<SubContactInfoFragment>
                        records={filteredPeople}
                        suggestions={peopleSuggestions}
                        setSuggestions={setPeopleSuggestions}
                        getSuggestionValue={getFullNameFromPerson}
                        inputValue={partnerTwoInputValue}
                        onSuggestionSelected={(event, data) => {
                          form.setFieldValue(
                            'formPartnerId',
                            data.suggestion.id,
                          );
                          setPartnerTwoInputValue(
                            getFullNameFromPerson(data.suggestion),
                          );
                        }}
                        onChange={(event) => {
                          setPartnerTwoInputValue(event.target.value);
                        }}
                      />
                    )}
                  </Field>
                )}
              <RowWrapper>
                <LeftHalfWrapper>
                  <StartMonthLabel>Start month (optional)</StartMonthLabel>
                  <Field
                    name="startMonth"
                    component={FormikSelectInput}
                    options={MONTH_OPTIONS}
                  />
                </LeftHalfWrapper>
                <MiddleQuarterWrapper>
                  <Field
                    name="startDay"
                    label="Start day (optional)"
                    component={FormikSelectInput}
                    options={startDaysOptions}
                  />
                </MiddleQuarterWrapper>
                <RightQuarterWrapper>
                  <StartYearLabel>Start year (optional)</StartYearLabel>
                  <Field name="startYear" component={FormikNumberInput} />
                </RightQuarterWrapper>
              </RowWrapper>
              {propRelationshipType === 'marriage' && (
                <RowWrapper>
                  <LeftHalfWrapper>
                    <WeddingMonthLabel>
                      Wedding month (optional)
                    </WeddingMonthLabel>
                    <Field
                      name="weddingMonth"
                      component={FormikSelectInput}
                      options={MONTH_OPTIONS}
                    />
                  </LeftHalfWrapper>
                  <MiddleQuarterWrapper>
                    <Field
                      name="weddingDay"
                      label="Wedding day (optional)"
                      component={FormikSelectInput}
                      options={weddingDaysOptions}
                    />
                  </MiddleQuarterWrapper>
                  <RightQuarterWrapper>
                    <Field
                      name="weddingYear"
                      label="Wedding year (optional)"
                      component={FormikNumberInput}
                    />
                  </RightQuarterWrapper>
                </RowWrapper>
              )}
              {showEndDatesFlag() && (
                <RowWrapper>
                  <LeftHalfWrapper>
                    <EndMonthLabel>End month (optional)</EndMonthLabel>
                    <Field
                      name="endMonth"
                      component={FormikSelectInput}
                      options={MONTH_OPTIONS}
                    />
                  </LeftHalfWrapper>
                  <MiddleQuarterWrapper>
                    <Field
                      name="endDay"
                      label="End day (optional)"
                      component={FormikSelectInput}
                      options={endDaysOptions}
                    />
                  </MiddleQuarterWrapper>
                  <RightQuarterWrapper>
                    <Field
                      name="endYear"
                      label="End year (optional)"
                      component={FormikNumberInput}
                    />
                  </RightQuarterWrapper>
                </RowWrapper>
              )}
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
