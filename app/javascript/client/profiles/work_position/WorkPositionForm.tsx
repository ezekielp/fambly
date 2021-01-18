import React, { FC } from 'react';
import { useCreateWorkPositionMutation } from 'client/graphqlTypes';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import {
  FormikTextInput,
  FormikNumberInput,
  FormikTextArea,
  FormikCheckboxGroup,
  FormikSelectInput,
} from 'client/form/inputs';
import { Button } from 'client/common/Button';
import { Text } from 'client/common/Text';
import { SectionDivider } from 'client/profiles/PersonContainer';
import * as yup from 'yup';
import { gql } from '@apollo/client';
import { handleFormErrors } from 'client/utils/formik';

gql`
  mutation CreateWorkPosition($input: CreateWorkPositionInput!) {
    createWorkPosition(input: $input) {
      workPosition {
        id
        person {
          id
          firstName
          lastName
        }
        place {
          id
          country
          stateOrRegion
          town
          street
          zipCode
        }
        title
        companyName
        description
        workType
        current
        startYear
        startMonth
        endYear
        endMonth
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

export const WorkPositionFormValidationSchema = yup.object().shape({
  title: yup.string(),
  companyName: yup.string(),
  description: yup.string(),
  workType: yup.string(),
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
  stateOrRegion: yup.string(),
  town: yup.string(),
  country: yup
    .string()
    .when('town', {
      is: (val) => val !== undefined && val !== null && val !== '',
      then: yup.string().required('Country is required if you specify a town'),
    })
    .when('stateOrRegion', {
      is: (val) => val !== undefined && val !== null && val !== '',
      then: yup
        .string()
        .required('Country is required if you specify a state or region'),
    }),
});

export interface WorkPositionFormData {
  title?: string;
  companyName?: string;
  description?: string;
  workType?: string;
  startYear?: number | null;
  startMonth?: number | null;
  endYear?: number | null;
  endMonth?: number | null;
  country?: string;
  stateOrRegion?: string;
  town?: string;
  current: string[];
}

export interface WorkPositionFormProps {
  setFieldToAdd?: (field: string) => void;
  personId?: string;
  initialValues?: WorkPositionFormData;
  workPositionId?: string;
  setEditFlag?: (bool: boolean) => void;
  setModalOpen?: (bool: boolean) => void;
}

export const blankInitialValues: WorkPositionFormData = {
  title: '',
  companyName: '',
  description: '',
  workType: '',
  startYear: null,
  startMonth: null,
  endYear: null,
  endMonth: null,
  country: '',
  stateOrRegion: '',
  town: '',
};

export const WorkPositionForm: FC<WorkPositionFormProps> = ({
  setFieldToAdd,
  personId,
  initialValues = blankInitialValues,
  workPositionId,
  setEditFlag,
  setModalOpen,
}) => {
  const [createWorkPositionMutation] = useCreateWorkPositionMutation();

  const cancel = () => {
    if (setFieldToAdd) {
      setFieldToAdd('');
    } else if (setEditFlag && setModalOpen) {
      setEditFlag(false);
      setModalOpen(false);
    }
  };

  const handleSubmit = async (
    data: WorkPositionFormData,
    formikHelpers: FormikHelpers<WorkPositionFormData>,
  ) => {
    const {
      title,
      companyName,
      description,
      workType,
      startYear,
      startMonth,
      endYear,
      endMonth,
      country,
      stateOrRegion,
      town,
      current,
    } = data;
    const { setErrors, setStatus } = formikHelpers;

    if (personId && setFieldToAdd) {
      const createResponse = await createWorkPositionMutation({
        variables: {
          input: {
            personId,
            title: title ? title : null,
            companyName: companyName ? companyName : null,
            description: description ? description : null,
            workType: workType ? workType : null,
            startYear,
            startMonth: startMonth ? startMonth : null,
            endYear,
            endMonth: endMonth ? endMonth : null,
            country: country ? country : null,
            stateOrRegion: stateOrRegion ? stateOrRegion : null,
            town: town ? town : null,
            current: !!(current.length > 0),
          },
        },
      });
      const createErrors = createResponse.data?.createWorkPosition.errors;
      if (createErrors) {
        handleFormErrors<WorkPositionFormData>(
          createErrors,
          setErrors,
          setStatus,
        );
      } else {
        setFieldToAdd('');
      }
    }
  };

  return (
    <>
      <Text marginBottom={3} fontSize={4} bold>
        Job
      </Text>
      <SectionDivider />
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={WorkPositionFormValidationSchema}
      >
        {({ isSubmitting }) => (
          <Form>
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
