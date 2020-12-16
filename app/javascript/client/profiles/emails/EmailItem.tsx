import React, { FC, useState } from 'react';
import { Email } from './EmailsContainer';
import { ProfileFieldContainer } from 'client/common/ProfileFieldContainer';
import { Dropdown } from 'client/common/Dropdown';
import { gql } from '@apollo/client';
import { colors } from 'client/shared/styles';
import { Modal } from 'client/common/Modal';
import { Text } from 'client/common/Text';
import { Button } from 'client/common/Button';
import styled from 'styled-components';

gql`
  mutation UpdateEmail($input: UpdateEmailInput!) {
    updateEmail(input: $input) {
      email {
        id
        emailAddress
        emailType
      }
      errors {
        path
        message
      }
    }
  }
`;

gql`
  mutation DeleteEmail($input: DeleteEmailInput!) {
    deleteEmail(input: $input)
  }
`;

interface EmailProps {
  email: Email;
}

export const EmailItem: FC<EmailProps> = ({ email }) => {
  const { id, emailAddress, emailType } = email;

  return <></>;
};
