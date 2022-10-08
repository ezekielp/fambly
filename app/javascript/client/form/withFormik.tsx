import React, { ComponentType } from 'react';
import { FieldProps, ErrorMessage } from 'formik';
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
  margin-bottom: 1rem;
`;

export const withFormik = <AdditionalFieldPropsType extends object>(
  WrappedComponent: ComponentType<AdditionalFieldPropsType>,
) => (props: FieldProps & AdditionalFieldPropsType & WithFormikProps) => {
  const { label, field, form, onChange, innerRef, ...rest } = props;
  const { name } = field;

  const handleOnChange = (arg: any) => {
    const newVal = arg && arg.target ? arg.target.value : arg;
    const withOnChange = onChange ? onChange(newVal) : newVal;
    form.setFieldValue(name, withOnChange);
  };

  const onBlur = () => {
    form.setFieldTouched(name, true);
  };

  return (
    <FormFieldWrapper>
      {label && (
        <Label as="label" htmlFor={name}>
          {label}
        </Label>
      )}
      <WrappedComponent
        {...(rest as AdditionalFieldPropsType)}
        {...field}
        onChange={handleOnChange}
        onBlur={onBlur}
        ref={innerRef}
      />
      <ErrorMessage name={name} component="div" />
    </FormFieldWrapper>
  );
};
