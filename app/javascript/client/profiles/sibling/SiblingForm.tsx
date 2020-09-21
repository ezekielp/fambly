import React, { FC } from 'react';
import {
  useCreateSiblingRelationshipMutation,
  useUpdateSiblingRelationshipMutation,
  useGetUserForHomeContainerQuery,
} from 'client/graphqlTypes';
import { Field, Form, Formik, FormikHelpers } from 'formik';
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
  buildPeopleOptions,
} from 'client/profiles/utils';
import { SIBLING_TYPE_OPTIONS } from './utils';
import * as yup from 'yup';
import { gql } from '@apollo/client';
import { handleFormErrors } from 'client/utils/formik';

gql`
  mutation CreateSiblingRelationship($input: CreateSiblingRelationshipInput!) {
    createSiblingRelationship(input: $input) {
      siblingRelationship {
        id
        siblingOne {
          id
          firstName
          lastName
        }
        siblingTwo {
          id
          firstName
          lastName
        }
        siblingType
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
  mutation UpdateSiblingRelationship($input: UpdateSiblingRelationshipInput!) {
    updateSiblingRelationship(input: $input) {
      siblingRelationship {
        id
        siblingOne {
          id
          firstName
          lastName
        }
        siblingTwo {
          id
          firstName
          lastName
        }
        siblingType
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

const SiblingFormValidationSchema = yup.object().shape({
  firstName: yup.string().when('newOrCurrentContact', {
    is: (val: string) => val === 'new_person',
    then: yup
      .string()
      .required(
        "To create a new contact, you need to provide at least the person's first name",
      ),
  }),
  lastName: yup.string(),
  age: yup
    .number()
    .integer()
    .positive()
    .max(1000000, "Wow, that's old! Please enter a lower age")
    .nullable(),
  monthsOld: yup
    .number()
    .integer()
    .positive()
    .max(1000000, "Wow, that's old! Please enter a lower age")
    .nullable(),
  newOrCurrentContact: yup.string().required(),
  formSiblingId: yup.string(),
  siblingType: yup.string(),
  note: yup.string(),
});

export interface SiblingFormData {
  firstName?: string;
  lastName?: string;
  formSiblingId: string;
  age: number | null;
  monthsOld: number | null;
  newOrCurrentContact: string;
  showOnDashboard: string[];
  siblingType?: string;
  note?: string | null | undefined;
}

export interface SiblingFormProps {
  setFieldToAdd?: (field: string) => void;
  personFirstName: string;
  siblingOneId: string;
  initialValues?: SiblingFormData;
  setEditFlag?: (bool: boolean) => void;
  setModalOpen?: (bool: boolean) => void;
}

export const blankInitialValues = {
  firstName: '',
  lastName: '',
  formSiblingId: '',
  age: null,
  monthsOld: null,
  newOrCurrentContact: 'new_person',
  showOnDashboard: [],
  siblingType: '',
  note: '',
};

export const SiblingForm: FC<SiblingFormProps> = ({
  setFieldToAdd,
  initialValues = blankInitialValues,
  personFirstName = '',
  siblingOneId,
  setEditFlag,
  setModalOpen,
}) => {
  const [
    createSiblingRelationshipMutation,
  ] = useCreateSiblingRelationshipMutation();
  const [
    updateSiblingRelationshipMutation,
  ] = useUpdateSiblingRelationshipMutation();
  const { data: userData } = useGetUserForHomeContainerQuery();
  const people = userData?.user?.people ? userData?.user?.people : [];
  const peopleOptions = buildPeopleOptions(people, siblingOneId);

  const cancel = () => {
    if (setFieldToAdd) {
      setFieldToAdd('');
    } else if (setEditFlag && setModalOpen) {
      setEditFlag(false);
      setModalOpen(false);
    }
  };

  const handleSubmit = async (
    data: SiblingFormData,
    formikHelpers: FormikHelpers<SiblingFormData>,
  ) => {
    const {
      firstName,
      lastName,
      age,
      monthsOld,
      showOnDashboard,
      formSiblingId,
      siblingType,
      note,
    } = data;
    const { setErrors, setStatus } = formikHelpers;

    if (setFieldToAdd) {
      const createSiblingRelationshipResponse = await createSiblingRelationshipMutation(
        {
          variables: {
            input: {
              firstName,
              lastName: lastName ? lastName : null,
              showOnDashboard: showOnDashboard.length > 0 ? true : false,
              age,
              monthsOld: age ? null : monthsOld,
              siblingOneId,
              siblingTwoId: formSiblingId ? formSiblingId : null,
              siblingType: siblingType ? siblingType : null,
              note: note ? note : null,
            },
          },
        },
      );
      const createSiblingRelationshipErrors =
        createSiblingRelationshipResponse.data?.createSiblingRelationship
          .errors;

      if (createSiblingRelationshipErrors) {
        handleFormErrors<SiblingFormData>(
          createSiblingRelationshipErrors,
          setErrors,
          setStatus,
        );
      } else {
        setFieldToAdd('');
      }
    } else if (setEditFlag) {
      const updateSiblingRelationshipResponse = await updateSiblingRelationshipMutation(
        {
          variables: {
            input: {
              siblingOneId,
              siblingTwoId: formSiblingId,
              siblingType: siblingType ? siblingType : null,
            },
          },
        },
      );
      const updateSiblingRelationshipErrors =
        updateSiblingRelationshipResponse.data?.updateSiblingRelationship
          .errors;

      if (updateSiblingRelationshipErrors) {
        handleFormErrors<SiblingFormData>(
          updateSiblingRelationshipErrors,
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
        Sibling
      </Text>
      <SectionDivider />
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={SiblingFormValidationSchema}
      >
        {({ values, isSubmitting, status }) => {
          return (
            <Form>
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
                  <Field
                    name="firstName"
                    label="First name"
                    component={FormikTextInput}
                    type="test"
                  />
                  <Field
                    name="lastName"
                    label="Last name (optional)"
                    component={FormikTextInput}
                    type="test"
                  />
                  <Field
                    name="age"
                    label="Age (optional)"
                    component={FormikNumberInput}
                  />
                  <Field
                    name="monthsOld"
                    label="Months old (optional)"
                    component={FormikNumberInput}
                  />
                </>
              )}
              {values.newOrCurrentContact === 'current_person' &&
                setFieldToAdd && (
                  <Field
                    name="formSiblingId"
                    label="Sibling"
                    component={FormikSelectInput}
                    options={peopleOptions}
                  />
                )}
              <Field
                name="siblingType"
                label="Type of sibling (optional)"
                component={FormikSelectInput}
                options={SIBLING_TYPE_OPTIONS}
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
