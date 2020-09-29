import React, {
  FC,
  ReactNode,
  useState,
  useRef,
  useEffect,
  HTMLProps,
} from 'react';
import { useCreatePersonTagMutation } from 'client/graphqlTypes';
import { Field, Form, Formik, FormikHelpers, FieldProps } from 'formik';
import { Button, ButtonProps } from 'client/common/Button';
import { Text } from 'client/common/Text';
import { Label, StyledErrorMessage } from 'client/form/withFormik';
import { handleFormErrors } from 'client/utils/formik';
import * as yup from 'yup';
import { gql } from '@apollo/client';
import Autosuggest, {
  SuggestionsFetchRequestedParams,
} from 'react-autosuggest';
import { SwatchesPicker } from 'react-color';
import { useDetectOutsideClick } from 'client/common/useDetectOutsideClick';
import styled from 'styled-components';
import { colors, text } from 'client/shared/styles';
import { Tag } from './TagsContainer';

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

const StyledStyledErrorMessage = styled(StyledErrorMessage)`
  margin-bottom: 15px;
`;

interface ColorPickerButtonProps extends ButtonProps {
  buttonActive?: boolean;
}

const ColorPickerButton = styled(Button)`
  color: ${({ buttonActive }: ColorPickerButtonProps) =>
    buttonActive ? `${colors.white}` : `${colors.black}`};
  background-color: ${({ buttonActive }: ColorPickerButtonProps) =>
    buttonActive ? `${colors.black}` : `${colors.white}`};

  &:active {
    color: ${colors.white};
    background-color: ${colors.black};
  }
`;

const ColorPickerOuterContainer = styled.div`
  position: relative;
  margin-bottom: 50px;
  display: flex;
  width: 50%;
  justify-content: space-between;
`;

const ColorPickerInnerContainer = styled.div`
  position: absolute;
  top: 60px;
  border-radius: 5px;
  border: 1px solid ${colors.black};
  padding: 15px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.3);
  background: ${colors.white};
  z-index: 2;
`;

interface SwatchProps extends Omit<HTMLProps<HTMLDivElement>, 'as' | 'ref'> {
  swatchColor?: string | null | undefined;
  cursorPointer?: boolean;
  marginBottom?: string | null | undefined;
}

export const Swatch = styled.div`
  height: 20px;
  padding: 0.5rem 1rem;
  background-color: ${({ swatchColor }: SwatchProps) =>
    swatchColor ? swatchColor : `${colors.white}`};
  border-radius: 10px;
  border: ${({ swatchColor }: SwatchProps) =>
    swatchColor ? 'none' : `1px solid ${colors.black}`};
  font-size: ${text[0]};
  color: ${({ swatchColor }: SwatchProps) =>
    swatchColor ? `${colors.white}` : `${colors.black}`};
  line-height: 20px;
  font-variation-settings: 'wght' 550;
  cursor: ${({ cursorPointer }: SwatchProps) =>
    cursorPointer ? 'pointer' : 'default'};
  margin-right: 10px;
  margin-bottom: ${({ marginBottom }: SwatchProps) =>
    marginBottom ? marginBottom : '0'};
`;

const PersonTagFormValidationSchema = yup.object().shape({
  name: yup.string().required('Please add a tag name!'),
});

export interface PersonTagFormData {
  name: string;
  color: string;
}

export interface PersonTagFormProps {
  setFieldToAdd: (field: string) => void;
  setModalOpen?: (bool: boolean) => void;
  personId: string;
  initialValues?: PersonTagFormData;
  tags: Tag[];
}

export const blankInitialValues: PersonTagFormData = {
  name: '',
  color: '',
};

export const PersonTagForm: FC<PersonTagFormProps> = ({
  personId,
  tags,
  initialValues = blankInitialValues,
  setModalOpen,
  setFieldToAdd,
}) => {
  const [createPersonTagMutation] = useCreatePersonTagMutation();
  const colorPickerRef = useRef(null);
  const formikRef: React.RefObject<any> = useRef();
  const [filteredSuggestions, setFilteredSuggestions] = useState(tags);
  const [tagName, setTagName] = useState('');
  const [colorPickerActive, setColorPickerActive] = useDetectOutsideClick(
    colorPickerRef,
    false,
  );
  const tagsToColorsHash = tags.reduce((hash: any, tag) => {
    if (tag.color) {
      if (hash[tag.name]) {
        hash[tag.name] = '#fff';
      } else {
        hash[tag.name] = tag.color;
      }
    }
    return hash;
  }, {});

  useEffect(() => {
    if (tagName in tagsToColorsHash && formikRef.current) {
      formikRef.current.setFieldValue('color', tagsToColorsHash[tagName]);
    }
  }, [tagName]);

  const cancel = () => {
    setFieldToAdd('');
    setModalOpen && setModalOpen(false);
  };

  const escapeRegexCharacters = (str: string) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  const getSuggestions = (inputValue: string): Tag[] => {
    const trimmedInputValue = escapeRegexCharacters(
      inputValue.trim().toLowerCase(),
    );
    const regex = new RegExp('^' + trimmedInputValue, 'i');
    return tags.filter((tag) => regex.test(tag.name));
  };

  const getSuggestionValue = (suggestion: Tag): string => suggestion.name;

  const renderSuggestion = (suggestion: Tag): ReactNode => (
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

  const handleChooseColorClick = () => {
    setColorPickerActive(!colorPickerActive);
  };

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
      setModalOpen && setModalOpen(false);
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
        innerRef={formikRef}
      >
        {({ values, isSubmitting }) => (
          <Form>
            <Label as="label" htmlFor="name">
              Name
            </Label>
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
                    event.preventDefault();
                    event.stopPropagation();
                    setTagName(data.suggestion.name);
                    form.setFieldValue('name', data.suggestion.name);
                  }}
                  inputProps={{
                    onChange: (event: any) => {
                      setTagName(event.target.value);
                      form.setFieldValue('name', event.target.value);
                    },
                    value: tagName,
                    onBlur: () => form.setFieldTouched('name', true),
                  }}
                />
              )}
            </Field>
            <StyledStyledErrorMessage name="name" component="div" />
            <ColorPickerOuterContainer>
              <ColorPickerButton
                onClick={handleChooseColorClick}
                buttonActive={colorPickerActive}
                type="button"
              >
                Choose color
              </ColorPickerButton>
              {colorPickerActive && (
                <ColorPickerInnerContainer ref={colorPickerRef}>
                  <Field name="color">
                    {({ form }: FieldProps) => (
                      <SwatchesPicker
                        onChangeComplete={(color) => {
                          form.setFieldValue('color', color.hex);
                        }}
                      />
                    )}
                  </Field>
                </ColorPickerInnerContainer>
              )}
              {values.name && (
                <Swatch swatchColor={values.color}>{values.name}</Swatch>
              )}
            </ColorPickerOuterContainer>
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