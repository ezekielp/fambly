import React, { FC, useState } from 'react';
import { useDeleteEmailMutation } from 'client/graphqlTypes';
import { Email } from './EmailsContainer';
import { EmailForm } from './EmailForm';
// import { ProfileFieldContainer } from 'client/common/ProfileFieldContainer';
import { emailTypeColors } from './utils';
import { Dropdown } from 'client/common/Dropdown';
import { gql } from '@apollo/client';
import { colors, spacing } from 'client/shared/styles';
import { Modal } from 'client/common/Modal';
import { Text } from 'client/common/Text';
import { Button } from 'client/common/Button';
import { FieldBadge } from 'client/common/FieldBadge';
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

const EmailItemContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  &:not(:last-child) {
    margin-bottom: ${spacing[0]};
  }
`;

interface EmailProps {
  email: Email;
}

export const EmailItem: FC<EmailProps> = ({ email }) => {
  const { id, emailAddress, emailType } = email;
  const [deleteEmailMutation] = useDeleteEmailMutation();
  const [editFlag, setEditFlag] = useState(false);
  const [deletedFlag, setDeletedFlag] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const deleteEmail = async () => {
    await deleteEmailMutation({
      variables: {
        input: {
          emailId: id,
        },
      },
    });
    setDeletedFlag(true);
    setModalOpen(false);
  };

  const handleEdit = () => {
    setEditFlag(true);
    setModalOpen(true);
  };

  const handleEditModalClose = () => {
    setModalOpen(false);
    setEditFlag(false);
  };

  const dropdownItems = [
    { label: 'Edit', onClick: handleEdit },
    { label: 'Delete', onClick: () => setModalOpen(true) },
  ];

  const initialValues = {
    emailAddress,
    emailType: emailType ? emailType : '',
  };

  return modalOpen ? (
    <>
      {editFlag && (
        <Modal onClose={handleEditModalClose}>
          <EmailForm
            initialValues={initialValues}
            emailId={id}
            setEditFlag={setEditFlag}
            setModalOpen={setModalOpen}
          />
        </Modal>
      )}
      {!editFlag && (
        <Modal onClose={() => setModalOpen(false)}>
          <Text marginBottom={3} fontSize={3} bold>
            Are you sure you want to delete this email address?
          </Text>
          <Button marginRight="1rem" onClick={() => deleteEmail()}>
            Yes
          </Button>
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
        </Modal>
      )}
    </>
  ) : (
    <>
      {!deletedFlag && (
        <EmailItemContainer>
          {emailAddress}
          {emailType && (
            <FieldBadge
              backgroundColor={emailTypeColors[emailType]}
              textColor="white"
            >
              {emailType}
            </FieldBadge>
          )}
          <Dropdown
            menuItems={dropdownItems}
            xMarkSize="20"
            sandwichSize="20"
            color={colors.orange}
            topSpacing="30px"
          />
        </EmailItemContainer>
      )}
    </>
  );
};
