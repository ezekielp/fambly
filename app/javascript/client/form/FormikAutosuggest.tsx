import React from 'react';
import { FieldProps, ErrorMessage } from 'formik';
import Autosuggest, { AutosuggestPropsSingleSection } from 'react-autosuggest';
import styled from 'styled-components';

interface WithFormikProps {
  label?: string;
  onChange?: (newVal: any) => any;
  innerRef?: React.RefObject<HTMLInputElement>;
}

export const Label = styled.div`
  margin-bottom: 15px;
`;

export const FormFieldWrapper = styled.div`
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
`;

export const StyledErrorMessage = styled(ErrorMessage)`
  color: red;
  margin-top: 15px;
`;

// WrappedComponent: ComponentType<
// AutosuggestPropsSingleSection<SuggestionType>
// >,

export const FormikAutosuggest = <SuggestionType extends object>(
  props: FieldProps &
    AutosuggestPropsSingleSection<SuggestionType> &
    WithFormikProps,
) => {
  const {
    label,
    field,
    form,
    onChange,
    suggestions,
    onSuggestionsFetchRequested,
    onSuggestionsClearRequested,
    getSuggestionValue,
    renderSuggestion,
  } = props;
  const { name } = field;

  const handleOnChange = (arg: any) => {
    const newVal = arg && arg.target ? arg.target.value : arg;
    const withOnChange = onChange ? onChange(newVal) : newVal;
    form.setFieldValue(name, withOnChange);
  };

  const onBlur = () => {
    form.setFieldTouched(name, true);
  };

  const inputProps = {
    onChange: handleOnChange,
    onBlur,
    value: field.value,
  };

  return (
    <FormFieldWrapper>
      {label && (
        <Label as="label" htmlFor={name}>
          {label}
        </Label>
      )}
      <Autosuggest
        // {...(rest as AdditionalFieldPropsType)}
        {...field}
        inputProps={inputProps}
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
      />
      <StyledErrorMessage name={name} component="div" />
    </FormFieldWrapper>
  );
};
