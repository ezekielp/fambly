import React, { FC, useState, ReactNode } from 'react';
import {
  useCreatePersonMutation,
  useCreateAgeMutation,
  useCreateParentChildRelationshipMutation,
  useUpdateParentChildRelationshipMutation,
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
import { PARENT_TYPE_OPTIONS, getFullNameFromPerson } from './utils';
import { NEW_OR_CURRENT_CONTACT_OPTIONS } from 'client/profiles/utils';
import * as yup from 'yup';
import { gql } from '@apollo/client';
import { handleFormErrors } from 'client/utils/formik';
import Autosuggest, {
  SuggestionsFetchRequestedParams,
} from 'react-autosuggest';
import { escapeRegexCharacters } from 'client/profiles/utils';

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
      id
      firstName
      lastName
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
  setModalOpen?: (bool: boolean) => void;
  relations: SubContactInfoFragment[];
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
  const [createAgeMutation] = useCreateAgeMutation();
  const [
    updateParentChildRelationship,
  ] = useUpdateParentChildRelationshipMutation();
  const { data: userPeople } = useGetUserPeopleQuery();
  const personRelationIds = new Set(relations.map((person) => person.id));
  personRelationIds.add(childId);
  const filteredPeople = userPeople?.people
    ? userPeople?.people
        .filter((person) => !personRelationIds.has(person.id))
        .slice()
        .sort((p1, p2) => {
          const personName1 = p1.firstName.toUpperCase();
          const personName2 = p2.firstName.toUpperCase();
          if (personName1 < personName2) {
            return -1;
          } else if (personName2 > personName1) {
            return 1;
          } else {
            return 0;
          }
        })
    : [];
  const [peopleSuggestions, setPeopleSuggestions] = useState(filteredPeople);
  const [parentInputValue, setParentInputValue] = useState('');

  const getSuggestions = (inputValue: string): SubContactInfoFragment[] => {
    const trimmedInputValue = escapeRegexCharacters(
      inputValue.trim().toLowerCase(),
    );
    const regex = new RegExp('^' + trimmedInputValue, 'i');
    return filteredPeople.filter((person) => {
      return regex.test(getFullNameFromPerson(person));
    });
  };

  const getSuggestionValue = (suggestion: SubContactInfoFragment): string =>
    getFullNameFromPerson(suggestion);

  const renderSuggestion = (suggestion: SubContactInfoFragment): ReactNode => (
    <div>{getFullNameFromPerson(suggestion)}</div>
  );

  const onSuggestionsFetchRequested = (
    props: SuggestionsFetchRequestedParams,
  ) => setPeopleSuggestions(getSuggestions(props.value));

  const onSuggestionsClearRequested = () => setPeopleSuggestions([]);

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
                  <Field name="formParentId">
                    {({ form }: FieldProps) => (
                      <Autosuggest
                        suggestions={peopleSuggestions}
                        onSuggestionsFetchRequested={
                          onSuggestionsFetchRequested
                        }
                        onSuggestionsClearRequested={
                          onSuggestionsClearRequested
                        }
                        getSuggestionValue={getSuggestionValue}
                        renderSuggestion={renderSuggestion}
                        shouldRenderSuggestions={() => true}
                        onSuggestionSelected={(event, data) => {
                          event.preventDefault();
                          event.stopPropagation();
                          form.setFieldValue(
                            'formParentId',
                            data.suggestion.id,
                          );
                          setParentInputValue(
                            getFullNameFromPerson(data.suggestion),
                          );
                        }}
                        inputProps={{
                          onChange: (event: any) => {
                            setParentInputValue(event.target.value);
                          },
                          value: parentInputValue,
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
