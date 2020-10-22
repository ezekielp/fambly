import React, { FC, useState } from 'react';
import {
  useCreatePersonMutation,
  useCreateParentChildRelationshipMutation,
  useUpdateParentChildRelationshipMutation,
  useGetUserPeopleQuery,
  SubContactInfoFragment,
  UserPersonInfoFragmentDoc,
} from 'client/graphqlTypes';
import { Field, Form, Formik, FormikHelpers, FieldProps } from 'formik';
import {
  FormikRadioGroup,
  FormikSelectInput,
  FormikTextInput,
  FormikTextArea,
  FormikCheckboxGroup,
} from 'client/form/inputs';
import { TextInput } from 'client/form/TextInput';
import {
  NameRowWrapper,
  RightHalfWrapper,
  LeftHalfWrapper,
  FirstNameLabel,
  LastNameLabel,
} from 'client/form/inputWrappers';
import { StyledErrorMessage } from 'client/form/withFormik';
import { Button } from 'client/common/Button';
import { GlobalError } from 'client/common/GlobalError';
import { Text } from 'client/common/Text';
import { SectionDivider } from 'client/profiles/PersonContainer';
import { PARENT_TYPE_OPTIONS } from './utils';
import {
  NEW_OR_CURRENT_CONTACT_OPTIONS,
  filterOutRelationsFromAndSortPeople,
  getFullNameFromPerson,
} from 'client/profiles/utils';
import * as yup from 'yup';
import { gql } from '@apollo/client';
import { handleFormErrors } from 'client/utils/formik';
import { FormikAutosuggest } from 'client/form/FormikAutosuggest';
import styled from 'styled-components';

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

gql`
  query GetUserPeople {
    people {
      ...UserPersonInfo
    }
  }

  ${UserPersonInfoFragmentDoc}
`;

gql`
  fragment UserPersonInfo on Person {
    id
    firstName
    lastName
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
  newOrCurrentContact: yup.string().required(),
  formParentId: yup.string(),
  parentType: yup.string(),
  note: yup.string(),
});

export interface ParentFormData {
  firstName?: string;
  lastName?: string;
  formParentId: string;
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
  setModalOpen?: (bool: boolean) => void;
  relations: SubContactInfoFragment[];
}

export const blankInitialValues = {
  firstName: '',
  lastName: '',
  formParentId: '',
  newOrCurrentContact: 'new_person',
  showOnDashboard: [],
  parentType: '',
  note: '',
};

export const ParentForm: FC<ParentFormProps> = ({
  setFieldToAdd,
  initialValues = blankInitialValues,
  personFirstName = '',
  childId,
  setEditFlag,
  setModalOpen,
  relations,
}) => {
  const [
    createParentChildRelationshipMutation,
  ] = useCreateParentChildRelationshipMutation();
  const [createPersonMutation] = useCreatePersonMutation();
  const [
    updateParentChildRelationship,
  ] = useUpdateParentChildRelationshipMutation();
  const { data: userPeople } = useGetUserPeopleQuery();
  const personRelationIds = new Set(relations.map((person) => person.id));
  personRelationIds.add(childId);
  const filteredPeople = userPeople?.people
    ? filterOutRelationsFromAndSortPeople(userPeople.people, personRelationIds)
    : [];
  const [peopleSuggestions, setPeopleSuggestions] = useState(filteredPeople);
  const [parentInputValue, setParentInputValue] = useState('');

  const cancel = () => {
    if (setFieldToAdd) {
      setFieldToAdd('');
    } else if (setEditFlag && setModalOpen) {
      setEditFlag(false);
      setModalOpen(false);
    }
  };

  const handleSubmit = async (
    data: ParentFormData,
    formikHelpers: FormikHelpers<ParentFormData>,
  ) => {
    const {
      firstName,
      lastName,
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
        setModalOpen && setModalOpen(false);
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
                  <NameRowWrapper>
                    <LeftHalfWrapper>
                      <FirstNameLabel>First name</FirstNameLabel>
                      <Field name="firstName" component={FormikTextInput} />
                    </LeftHalfWrapper>
                    <RightHalfWrapper>
                      <LastNameLabel>Last name (optional)</LastNameLabel>
                      <Field name="lastName" component={FormikTextInput} />
                    </RightHalfWrapper>
                  </NameRowWrapper>
                </>
              )}
              {values.newOrCurrentContact === 'current_person' &&
                setFieldToAdd && (
                  <Field name="formParentId">
                    {({ form }: FieldProps) => (
                      <FormikAutosuggest<SubContactInfoFragment>
                        records={filteredPeople}
                        suggestions={peopleSuggestions}
                        setSuggestions={setPeopleSuggestions}
                        getSuggestionValue={getFullNameFromPerson}
                        inputValue={parentInputValue}
                        onSuggestionSelected={(event, data) => {
                          form.setFieldValue(
                            'formParentId',
                            data.suggestion.id,
                          );
                          setParentInputValue(
                            getFullNameFromPerson(data.suggestion),
                          );
                        }}
                        onChange={(event) => {
                          setParentInputValue(event.target.value);
                        }}
                      />
                    )}
                  </Field>
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
