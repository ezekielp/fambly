import { Error } from 'client/graphqlTypes';
import { FormikErrors, FormikHelpers } from 'formik';

type Result = {
  [key: string]: string;
};

export const handleFormErrors = <FormData>(
  errors: Error[],
  setErrors: FormikHelpers<FormData>['setErrors'],
  setStatus: FormikHelpers<FormData>['setStatus'],
): void => {
  const formErrors = errors
    .filter((error) => error.path !== '')
    .reduce((result: Result, current) => {
      result[current.path] = current.message;
      return result;
    }, {});
  const globalError = errors.find((error) => error.path === '');

  setErrors(formErrors as FormikErrors<FormData>);
  globalError && setStatus(globalError.message);
};
