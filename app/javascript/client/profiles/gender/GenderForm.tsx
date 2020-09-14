import React, { FC } from 'react';
import { useCreateOrUpdateGenderMutation } from 'client/graphqlTypes';
import { GENDER_OPTIONS } from './utils';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { FormikSelectInput, FormikTextInput } from 'client/form/inputs';
import { Button } from 'client/common/Button';
import { Text } from 'client/common/Text';
import { SectionDivider } from 'client/profiles/PersonContainer';
import * as yup from 'yup';
import { gql } from '@apollo/client';
import { handleFormErrors } from 'client/utils/formik';

gql`
  mutation CreateOrUpdateGender($input: CreateOrUpdateGenderInput!) {
    createOrUpdateGender(input: $input) {
      person {
        id
        gender
      }
      errors {
        path
        message
      }
    }
  }
`;

gql`
  mutation DeleteGender($input: DeleteGenderInput!) {
    deleteGender(input: $input)
  }
`;

export const GenderFormValidationSchema = yup.object().shape({
  gender: yup.string(),
  customGender: yup.string().when('gender', {
    is: (val: string) => val === 'custom',
    then: yup
      .string()
      .required(
        'You must choose a gender to save to this profile, or you can press the cancel button!',
      ),
  }),
});

export interface GenderFormData {
  gender: string;
  customGender?: string;
}

export interface GenderFormProps {
  setFieldToAdd?: (field: string) => void;
  personId: string;
  initialValues?: GenderFormData;
  setEditFlag?: (bool: boolean) => void;
}

export const blankInitialValues: GenderFormData = {
  gender: '',
  customGender: '',
};

export const GenderForm: FC<GenderFormProps> = ({
  setFieldToAdd,
  personId,
  initialValues = blankInitialValues,
  setEditFlag,
}) => {
  const [createOrUpdateGenderMutation] = useCreateOrUpdateGenderMutation();

  const cancel = () => {
    if (setFieldToAdd) {
      setFieldToAdd('');
    } else if (setEditFlag) {
      setEditFlag(false);
    }
  };

  const handleSubmit = async (
    data: GenderFormData,
    formikHelpers: FormikHelpers<GenderFormData>,
  ) => {
    const { gender, customGender } = data;
    if (!gender) return;
    const { setErrors, setStatus } = formikHelpers;

    const response = await createOrUpdateGenderMutation({
      variables: {
        input: {
          personId,
          gender: gender === 'custom' && customGender ? customGender : gender,
        },
      },
    });
    const errors = response.data?.createOrUpdateGender.errors;

    if (errors) {
      handleFormErrors<GenderFormData>(errors, setErrors, setStatus);
    } else {
      if (setFieldToAdd) {
        setFieldToAdd('');
      } else if (setEditFlag) {
        setEditFlag(false);
      }
    }
  };

  return (
    <>
      <Text marginBottom={3} fontSize={4} bold>
        Gender
      </Text>
      <SectionDivider />
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={GenderFormValidationSchema}
      >
        {({ values, isSubmitting }) => (
          <Form>
            <Field
              name="gender"
              label="Gender"
              component={FormikSelectInput}
              options={GENDER_OPTIONS}
            />
            {values.gender === 'custom' && (
              <Field
                name="customGender"
                label="Other (please specify)"
                component={FormikTextInput}
              />
            )}
            <Button marginRight="1rem" type="submit" disabled={isSubmitting}>
              Save
            </Button>
            <Button onClick={() => cancel()}>Cancel</Button>
          </Form>
        )}
      </Formik>
    </>
  );
};
