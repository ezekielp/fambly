import React, { FC } from 'react';
import {
  useCreatePersonMutation,
  useCreateAgeMutation,
  useCreateParentChildRelationshipMutation,
  useGetUserForHomeContainerQuery,
} from 'client/graphqlTypes';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import {
  FormikTextInput,
  FormikNumberInput,
  FormikRadioGroup,
  FormikSelectInput,
  FormikTextArea,
  FormikCheckbox,
} from 'client/form/inputs';
import {
  NEW_OR_CURRENT_CONTACT_OPTIONS,
  PARENT_TYPE_OPTIONS,
  buildParentOrChildOptions,
  getParentAndChildIds,
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
        note
      }
      errors {
        path
        message
      }
    }
  }
`;

const ParentChildFormValidationSchema = yup.object().shape({
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
  fullContact: yup.boolean().required(),
  formParentId: yup.string(),
  formChildId: yup.string(),
  parentType: yup.string(),
  note: yup.string(),
});

interface ParentChildFormData {
  firstName?: string;
  lastName?: string;
  formParentId: string;
  formChildId: string;
  age: number | null;
  monthsOld: number | null;
  newOrCurrentContact: string;
  fullContact?: boolean;
  parentType?: string;
  note?: string | null | undefined;
}

interface ParentChildFormProps {
  setFieldToAdd?: (field: string) => void;
  personFirstName: string;
  parentId?: string;
  childId?: string;
  initialValues?: ParentChildFormData;
  setEditFlag?: (bool: boolean) => void;
}

const blankInitialValues = {
  firstName: '',
  lastName: '',
  formParentId: '',
  formChildId: '',
  age: null,
  monthsOld: null,
  newOrCurrentContact: 'new_person',
  fullContact: false,
  parentType: '',
  note: null,
};

export const ParentChildForm: FC<ParentChildFormProps> = ({
  setFieldToAdd,
  initialValues = blankInitialValues,
  personFirstName,
  parentId: propParentId,
  childId: propChildId,
  setEditFlag,
}) => {
  const [
    createParentChildRelationshipMutation,
  ] = useCreateParentChildRelationshipMutation();
  const [createPersonMutation] = useCreatePersonMutation();
  const [createAgeMutation] = useCreateAgeMutation();
  const { data: userData } = useGetUserForHomeContainerQuery();
  const people = userData?.user?.people ? userData?.user?.people : [];
  const peopleOptions = buildParentOrChildOptions(
    people,
    propParentId ? propParentId : propChildId,
  );
  const parentChildName = propParentId ? 'formChildId' : 'formParentId';
  const parentChildLabel = propParentId ? 'Child' : 'Parent';

  const handleSubmit = async (
    data: ParentChildFormData,
    formikHelpers: FormikHelpers<ParentChildFormData>,
  ) => {
    const {
      firstName,
      lastName,
      age,
      monthsOld,
      newOrCurrentContact,
      fullContact,
      formParentId,
      formChildId,
      parentType,
      note,
    } = data;
    const { setErrors, setStatus } = formikHelpers;
    const currentPersonId = propParentId ? propParentId : propChildId;
    let createPersonResponse;

    if (newOrCurrentContact === 'new_person' && firstName) {
      createPersonResponse = await createPersonMutation({
        variables: {
          input: {
            firstName,
            lastName: lastName ? lastName : null,
          },
        },
      });
      const createPersonErrors = createPersonResponse.data?.createPerson.errors;
      if (createPersonErrors) {
        handleFormErrors<ParentChildFormData>(
          createPersonErrors,
          setErrors,
          setStatus,
        );
        return;
      } else {
        if (age || monthsOld) {
          const createAgeResponse = await createAgeMutation({
            variables: {
              input: {
                age,
                monthsOld: monthsOld && !age ? monthsOld : null,
                personId: currentPersonId ? currentPersonId : '',
              },
            },
          });
          const createAgeErrors = createAgeResponse.data?.createAge.errors;
          if (createAgeErrors) {
            handleFormErrors<ParentChildFormData>(
              createAgeErrors,
              setErrors,
              setStatus,
            );
            return;
          }
        }
      }
    }
    const newPersonId = createPersonResponse
      ? createPersonResponse.data?.createPerson.person?.id
      : null;

    const { parentId, childId } = getParentAndChildIds({
      newPersonId,
      propParentId,
      propChildId,
      formParentId,
      formChildId,
    });

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
      handleFormErrors<ParentChildFormData>(
        createParentChildErrors,
        setErrors,
        setStatus,
      );
    } else {
      if (setFieldToAdd) {
        setFieldToAdd('');
      } else if (setEditFlag) {
        setEditFlag(false);
      }
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={ParentChildFormValidationSchema}
    >
      {({ values, isSubmitting }) => {
        return (
          <Form>
            <Field
              name="newOrCurrentContact"
              label=""
              component={FormikRadioGroup}
              options={NEW_OR_CURRENT_CONTACT_OPTIONS}
              checked="new_person"
            />
            {values.newOrCurrentContact === 'new_person' && (
              <>
                <Field
                  name="fullContact"
                  label={`Add this person to your dashboard of contacts? (Even if you don't add them to your dashboard, you will always be able to access and add to their profile from ${personFirstName}'s page.`}
                  component={FormikCheckbox}
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
            {values.newOrCurrentContact === 'current_person' && (
              <Field
                name={parentChildName}
                label={parentChildLabel}
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
            <Field
              name="note"
              label="Note (optional)"
              component={FormikTextArea}
            />
            <button type="submit" disabled={isSubmitting}>
              Save
            </button>
          </Form>
        );
      }}
    </Formik>
  );
};
