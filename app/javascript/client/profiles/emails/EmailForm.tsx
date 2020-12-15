import React, { FC } from 'react';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { EMAIL_TYPE_OPTIONS } from './utils';
import { Button } from 'client/common/Button';
import { Text } from 'client/common/Text';
import * as yup from 'yup';
import { gql } from '@apollo/client';
import { handleFormErrors } from 'client/utils/formik';

gql`
  mutation CreateEmail($input: CreateEmailInput!) {
    createEmail(input: $input) {
      email {
        id
        email
        emailType
      }
      errors {
        path
        message
      }
    }
  }
`;
