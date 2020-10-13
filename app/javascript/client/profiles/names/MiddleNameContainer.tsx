import React, { FC, useState } from 'react';
import { useUpdatePersonMutation } from 'client/graphqlTypes';
import { Text } from 'client/common/Text';
import { Button } from 'client/common/Button';
import { ProfileLabel } from 'client/common/ProfileLabel';
import { ProfileFieldContainer } from 'client/common/ProfileFieldContainer';
import { PersonForm } from 'client/profiles/PersonForm';
import { Modal } from 'client/common/Modal';
import { Dropdown } from 'client/common/Dropdown';
import { colors } from 'client/shared/styles';
import styled from 'styled-components';

interface MiddleNameContainerProps {
  personId: string;
  firstName: string;
  middleName: string;
  lastName: string;
}

const MiddleNameTextContainer = styled.div`
  margin-right: 10px;
`;

export const MiddleNameContainer: FC<MiddleNameContainerProps> = ({
  firstName,
  middleName,
  lastName,
  personId,
}) => {
  const [updatePersonMutation] = useUpdatePersonMutation();
  const [editFlag, setEditFlag] = useState(false);
  const [deletedFlag, setDeletedFlag] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const deleteMiddleName = async () => {
    await updatePersonMutation({
      variables: {
        input: {
          personId,
          middleName: null,
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
    setEditFlag(false);
    setModalOpen(false);
  };

  const dropdownItems = [
    { label: 'Edit', onClick: handleEdit },
    { label: 'Delete', onClick: () => setModalOpen(true) },
  ];

  return modalOpen ? (
    <>
      {editFlag && (
        <Modal onClose={handleEditModalClose}>
          <PersonForm
            setEditFlag={setEditFlag}
            initialValues={{ firstName, middleName, lastName }}
            personId={personId}
            updateMiddleName={true}
            setModalOpen={setModalOpen}
          />
        </Modal>
      )}
      {!editFlag && (
        <Modal onClose={() => setModalOpen(false)}>
          <Text marginBottom={3} fontSize={3} bold>
            Are you sure you want to delete this field?
          </Text>
          <Button marginRight="1rem" onClick={() => deleteMiddleName()}>
            Yes
          </Button>
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
        </Modal>
      )}
    </>
  ) : (
    <>
      {!deletedFlag && (
        <ProfileFieldContainer>
          <ProfileLabel>middle name</ProfileLabel>
          <MiddleNameTextContainer>{middleName}</MiddleNameTextContainer>
          <Dropdown
            menuItems={dropdownItems}
            xMarkSize="15"
            sandwichSize="20"
            color={colors.orange}
            topSpacing="30px"
          />
        </ProfileFieldContainer>
      )}
    </>
  );
};
