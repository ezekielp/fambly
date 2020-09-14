import React, { FC, useState } from 'react';
import { useDeleteGenderMutation } from 'client/graphqlTypes';
import { Dropdown } from 'client/common/Dropdown';
import { colors } from 'client/shared/styles';
import { ProfileLabel } from 'client/common/ProfileLabel';
import { ProfileFieldContainer } from 'client/common/ProfileFieldContainer';
import { GenderForm } from './GenderForm';
import { GENDER_TEXT_RENDERINGS } from './utils';
import { Modal } from 'client/common/Modal';
import { Text } from 'client/common/Text';
import { Button } from 'client/common/Button';
import styled from 'styled-components';

const GenderTextContainer = styled.div`
  margin-right: 10px;
`;

interface GenderContainerProps {
  gender: string;
  personId: string;
}

export const GenderContainer: FC<GenderContainerProps> = ({
  gender,
  personId,
}) => {
  const [deleteGenderMutation] = useDeleteGenderMutation();
  const [editFlag, setEditFlag] = useState(false);
  const [deletedFlag, setDeletedFlag] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const deleteGender = async () => {
    await deleteGenderMutation({
      variables: {
        input: {
          personId,
        },
      },
    });
    setDeletedFlag(true);
    setModalOpen(false);
  };

  const dropdownItems = [
    { label: 'Edit', onClick: () => setEditFlag(true) },
    { label: 'Delete', onClick: () => setModalOpen(true) },
  ];

  const genderText = GENDER_TEXT_RENDERINGS[gender]
    ? GENDER_TEXT_RENDERINGS[gender]
    : gender;

  const genderTextComponent = (
    <GenderTextContainer>{genderText}</GenderTextContainer>
  );

  const customGender =
    gender !== 'male' && gender !== 'female' && gender !== 'non_binary';

  const initialValues = {
    gender: customGender ? 'custom' : gender,
    customGender: customGender ? gender : '',
  };

  const editGenderForm = (
    <GenderForm
      initialValues={initialValues}
      personId={personId}
      setEditFlag={setEditFlag}
    />
  );

  return editFlag ? (
    editGenderForm
  ) : (
    <>
      {!deletedFlag && (
        <ProfileFieldContainer>
          <ProfileLabel>gender</ProfileLabel>
          {genderTextComponent}
          <Dropdown
            menuItems={dropdownItems}
            xMarkSize="20"
            sandwichSize="20"
            color={colors.orange}
            topSpacing="30px"
          />
        </ProfileFieldContainer>
      )}
      {modalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <Text marginBottom={3} fontSize={3} bold>
            Are you sure you want to delete this field?
          </Text>
          <Button marginRight="1rem" onClick={() => deleteGender()}>
            Yes
          </Button>
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
        </Modal>
      )}
    </>
  );
};
