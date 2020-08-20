import { Error } from 'client/graphqlTypes';
import { FormikErrors, FormikHelpers } from 'formik';
import { ExecutionResult } from 'graphql';

type Result = {
  [key: string]: string;
};

export type OnSubmit<FormDataType, MutationType> = (
  data: FormDataType,
) => Promise<ExecutionResult<MutationType>>;

export const handleFormErrors = <FormDataType>(
  errors: Error[],
  setErrors: FormikHelpers<FormDataType>['setErrors'],
  setStatus: FormikHelpers<FormDataType>['setStatus'],
): void => {
  const formErrors = errors
    .filter((error) => error.path !== '')
    .reduce((result: Result, current) => {
      result[current.path] = current.message;
      return result;
    }, {});
  const globalError = errors.find((error) => error.path === '');

  setErrors(formErrors as FormikErrors<FormDataType>);
  globalError && setStatus(globalError.message);
};
