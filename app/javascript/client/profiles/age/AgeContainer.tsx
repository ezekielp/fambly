import React, { FC, useState } from 'react';
import { useDeleteAgeMutation } from 'client/graphqlTypes';
import { Dropdown } from 'client/common/Dropdown';
import { AgeForm } from './AgeForm';
import { colors } from 'client/shared/styles';
import { ProfileLabel } from 'client/common/ProfileLabel';
import { ProfileFieldContainer } from 'client/common/ProfileFieldContainer';
import { Modal } from 'client/common/Modal';
import { Text } from 'client/common/Text';
import { Button } from 'client/common/Button';
import { gql } from '@apollo/client';
import styled from 'styled-components';

gql`
  mutation UpdateAge($input: UpdateAgeInput!) {
    updateAge(input: $input) {
      person {
        id
        age
        monthsOld
      }
      errors {
        path
        message
      }
    }
  }
`;

gql`
  mutation DeleteAge($input: DeleteAgeInput!) {
    deleteAge(input: $input)
  }
`;

const AgeTextContainer = styled.div`
  margin-right: 10px;
`;

interface AgeContainerProps {
  age?: number | null;
  monthsOld?: number | null;
  hasBirthYear: boolean;
  personId: string;
}

export const AgeContainer: FC<AgeContainerProps> = ({
  age,
  monthsOld,
  personId,
  hasBirthYear,
}) => {
  const [deleteAgeMutation] = useDeleteAgeMutation();
  const [editFlag, setEditFlag] = useState(false);
  const [deletedFlag, setDeletedFlag] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const deleteAge = async () => {
    await deleteAgeMutation({
      variables: {
        input: {
          personId,
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

  const yearsText = age && age !== 1 ? 'years' : 'year';

  const ageContainerContent = (
    <AgeTextContainer>
      {age ? `${age} ${yearsText}` : `${monthsOld} months`} old
    </AgeTextContainer>
  );

  const dropdownItems = [
    { label: 'Edit', onClick: handleEdit },
    { label: 'Delete', onClick: () => setModalOpen(true) },
  ];

  const initialValues = {
    age,
    monthsOld,
  };

  return modalOpen ? (
    <>
      {editFlag && (
        <Modal onClose={handleEditModalClose}>
          <AgeForm
            initialValues={initialValues}
            personId={personId}
            setEditFlag={setEditFlag}
            setModalOpen={setModalOpen}
          />
        </Modal>
      )}
      {!editFlag && (
        <Modal onClose={() => setModalOpen(false)}>
          <Text marginBottom={3} fontSize={3} bold>
            Are you sure you want to delete this field?
          </Text>
          <Button marginRight="1rem" onClick={() => deleteAge()}>
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
          <ProfileLabel>age</ProfileLabel>
          {ageContainerContent}
          {!hasBirthYear && (
            <Dropdown
              menuItems={dropdownItems}
              xMarkSize="15"
              sandwichSize="20"
              color={colors.orange}
              topSpacing="30px"
            />
          )}
        </ProfileFieldContainer>
      )}
    </>
  );
};
