import React, { FC, ReactNode, useState } from 'react';
import { useCreatePersonTagMutation } from 'client/graphqlTypes';
import { Field, Form, Formik, FormikHelpers, FieldProps } from 'formik';
import { Button } from 'client/common/Button';
import { Text } from 'client/common/Text';
import { handleFormErrors } from 'client/utils/formik';
import * as yup from 'yup';
import { gql } from '@apollo/client';
import Autosuggest, {
  SuggestionsFetchRequestedParams,
  ShouldRenderSuggestions,
} from 'react-autosuggest';

gql`
  mutation CreatePersonTag($input: CreatePersonTagInput!) {
    createPersonTag(input: $input) {
      personTag {
        id
        tag {
          id
          user {
            id
          }
          name
          color
        }
        person {
          id
          firstName
          lastName
        }
      }
      errors {
        path
        message
      }
    }
  }
`;

const PersonTagFormValidationSchema = yup.object().shape({
  name: yup
    .string()
    .required('Please add a tag name or hit the cancel button!'),
});

export interface PersonTagFormData {
  name: string;
  color: string;
}

export interface PersonTagFormProps {
  setFieldToAdd: (field: string) => void;
  personId: string;
  initialValues?: PersonTagFormData;
}

export const blankInitialValues: PersonTagFormData = {
  name: '',
  color: '',
};

export const PersonTagForm: FC<PersonTagFormProps> = ({
  setFieldToAdd,
  personId,
  initialValues = blankInitialValues,
}) => {
  const tags: PersonTagFormData[] = [
    { name: 'Rubyists', color: '#ff0000' },
    { name: 'Gophers', color: '40e0D0' },
    { name: 'Pythonistas', color: 'ffff00' },
  ];

  const [createPersonTagMutation] = useCreatePersonTagMutation();
  const [filteredSuggestions, setFilteredSuggestions] = useState(tags);
  const [tagName, setTagName] = useState('');

  const cancel = () => {
    setFieldToAdd('');
  };

  const escapeRegexCharacters = (str: string) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  const getSuggestions = (inputValue: string): PersonTagFormData[] => {
    const trimmedInputValue = escapeRegexCharacters(
      inputValue.trim().toLowerCase(),
    );
    const regex = new RegExp('^' + trimmedInputValue, 'i');
    return tags.filter((tag) => regex.test(tag.name));
  };

  const getSuggestionValue = (suggestion: PersonTagFormData): string =>
    suggestion.name;

  const renderSuggestion = (suggestion: PersonTagFormData): ReactNode => (
    <div>{suggestion.name}</div>
  );

  const onSuggestionsFetchRequested = (
    props: SuggestionsFetchRequestedParams,
  ) => {
    setFilteredSuggestions(getSuggestions(props.value));
  };

  const onSuggestionsClearRequested = () => {
    setFilteredSuggestions([]);
  };

  const shouldRenderSuggestions = (): boolean => true;

  const handleSubmit = async (
    data: PersonTagFormData,
    formikHelpers: FormikHelpers<PersonTagFormData>,
  ) => {
    const { name, color } = data;
    const { setErrors, setStatus } = formikHelpers;

    const response = await createPersonTagMutation({
      variables: {
        input: {
          name,
          color: color ? color : null,
          personId,
        },
      },
    });
    const errors = response.data?.createPersonTag.errors;

    if (errors) {
      handleFormErrors<PersonTagFormData>(errors, setErrors, setStatus);
    } else {
      setFieldToAdd('');
    }
  };

  return (
    <>
      <Text marginBottom={3} fontSize={4} bold>
        Group
      </Text>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={PersonTagFormValidationSchema}
      >
        {({ isSubmitting }) => (
          <Form>
            <Field name="name">
              {({ form }: FieldProps) => (
                <Autosuggest
                  suggestions={filteredSuggestions}
                  onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                  onSuggestionsClearRequested={onSuggestionsClearRequested}
                  getSuggestionValue={getSuggestionValue}
                  renderSuggestion={renderSuggestion}
                  shouldRenderSuggestions={shouldRenderSuggestions}
                  onSuggestionSelected={(event, data) => {
                    if (data.method === 'enter') {
                      event.preventDefault();
                    }
                    setTagName(data.suggestion.name);
                    form.setFieldValue('name', data.suggestion.name);
                  }}
                  inputProps={{
                    onChange: (event: any) => {
                      setTagName(event.target.value);
                    },
                    value: tagName,
                    onBlur: () => form.setFieldTouched('name', true),
                  }}
                />
              )}
            </Field>
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
