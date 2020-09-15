import React, { FC } from 'react';
import {
  useCreatePersonMutation,
  useCreateAgeMutation,
  useCreateParentChildRelationshipMutation,
  useUpdateParentChildRelationshipMutation,
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
  PARENT_TYPE_OPTIONS,
  buildParentOrChildOptions,
} from './utils';
import * as yup from 'yup';
import { gql } from '@apollo/client';
import { handleFormErrors } from 'client/utils/formik';

gql`
  mutation CreateParentChildRelationship(
    $input: CreateParentChildRelationshipInput!
  ) {
    createParentChildRelationship(input: $input) {
      parentChildRelationship {
        id
        parent {
          id
          firstName
          lastName
        }
        child {
          id
          firstName
          lastName
        }
        parentType
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
  mutation UpdateParentChildRelationship(
    $input: UpdateParentChildRelationshipInput!
  ) {
    updateParentChildRelationship(input: $input) {
      parentChildRelationship {
        id
        parent {
          id
          firstName
          lastName
        }
        child {
          id
          firstName
          lastName
        }
        parentType
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

const ParentFormValidationSchema = yup.object().shape({
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
  formParentId: yup.string(),
  parentType: yup.string(),
  note: yup.string(),
});

export interface ParentFormData {
  firstName?: string;
  lastName?: string;
  formParentId: string;
  age: number | null;
  monthsOld: number | null;
  newOrCurrentContact: string;
  showOnDashboard: string[];
  parentType?: string;
  note?: string | null | undefined;
}

export interface ParentFormProps {
  setFieldToAdd?: (field: string) => void;
  personFirstName: string;
  childId: string;
  initialValues?: ParentFormData;
  setEditFlag?: (bool: boolean) => void;
}

export const blankInitialValues = {
  firstName: '',
  lastName: '',
  formParentId: '',
  age: null,
  monthsOld: null,
  newOrCurrentContact: 'new_person',
  showOnDashboard: [],
  parentType: '',
  note: '',
};

export const ParentForm: FC<ParentFormProps> = ({
  setFieldToAdd,
  initialValues = blankInitialValues,
  personFirstName,
  childId,
  setEditFlag,
}) => {
  const [
    createParentChildRelationshipMutation,
  ] = useCreateParentChildRelationshipMutation();
  const [createPersonMutation] = useCreatePersonMutation();
  const [createAgeMutation] = useCreateAgeMutation();
  const [
    updateParentChildRelationship,
  ] = useUpdateParentChildRelationshipMutation();
  const { data: userData } = useGetUserForHomeContainerQuery();
  const people = userData?.user?.people ? userData?.user?.people : [];
  const peopleOptions = buildParentOrChildOptions(people, childId);

  const cancel = () => {
    if (setFieldToAdd) {
      setFieldToAdd('');
    } else if (setEditFlag) {
      setEditFlag(false);
    }
  };

  const handleSubmit = async (
    data: ParentFormData,
    formikHelpers: FormikHelpers<ParentFormData>,
  ) => {
    const {
      firstName,
      lastName,
      age,
      monthsOld,
      newOrCurrentContact,
      showOnDashboard,
      formParentId,
      parentType,
      note,
    } = data;
    const { setErrors, setStatus } = formikHelpers;
    let createPersonResponse;
    let newPersonId;

    if (setFieldToAdd) {
      if (newOrCurrentContact === 'new_person' && firstName) {
        createPersonResponse = await createPersonMutation({
          variables: {
            input: {
              firstName,
              lastName: lastName ? lastName : null,
              showOnDashboard: showOnDashboard.length > 0 ? true : false,
            },
          },
        });
        const createPersonErrors =
          createPersonResponse.data?.createPerson.errors;
        if (createPersonErrors) {
          handleFormErrors<ParentFormData>(
            createPersonErrors,
            setErrors,
            setStatus,
          );
          return;
        } else {
          newPersonId = createPersonResponse.data?.createPerson?.person?.id;

          if ((age || monthsOld) && newPersonId) {
            const createAgeResponse = await createAgeMutation({
              variables: {
                input: {
                  age,
                  monthsOld: monthsOld && !age ? monthsOld : null,
                  personId: newPersonId,
                },
              },
            });
            const createAgeErrors = createAgeResponse.data?.createAge.errors;
            if (createAgeErrors) {
              handleFormErrors<ParentFormData>(
                createAgeErrors,
                setErrors,
                setStatus,
              );
              return;
            }
          }
        }
      }
      newPersonId = createPersonResponse
        ? createPersonResponse.data?.createPerson.person?.id
        : null;

      const parentId = newPersonId ? newPersonId : formParentId;

      const createParentChildResponse = await createParentChildRelationshipMutation(
        {
          variables: {
            input: {
              parentId,
              childId,
              parentType: parentType ? parentType : null,
              note: note ? note : null,
            },
          },
        },
      );
      const createParentChildErrors =
        createParentChildResponse.data?.createParentChildRelationship.errors;

      if (createParentChildErrors) {
        handleFormErrors<ParentFormData>(
          createParentChildErrors,
          setErrors,
          setStatus,
        );
      } else {
        setFieldToAdd('');
      }
    } else if (setEditFlag) {
      const updateParentChildResponse = await updateParentChildRelationship({
        variables: {
          input: {
            parentId: formParentId,
            childId,
            parentType,
          },
        },
      });
      const updateParentChildErrors =
        updateParentChildResponse.data?.updateParentChildRelationship.errors;

      if (updateParentChildErrors) {
        handleFormErrors<ParentFormData>(
          updateParentChildErrors,
          setErrors,
          setStatus,
        );
      } else {
        setEditFlag(false);
      }
    }
  };

  return (
    <>
      <Text marginBottom={3} fontSize={4} bold>
        Parent
      </Text>
      <SectionDivider />
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={ParentFormValidationSchema}
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
                    name="formParentId"
                    label="Parent"
                    component={FormikSelectInput}
                    options={peopleOptions}
                  />
                )}
              <Field
                name="parentType"
                label="Type of parent (optional)"
                component={FormikSelectInput}
                options={PARENT_TYPE_OPTIONS}
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
