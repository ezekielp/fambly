import React, { FC, useState } from 'react';
import { useDeleteGenderMutation } from 'client/graphqlTypes';
import { Dropdown } from 'client/common/Dropdown';
import { colors, spacing } from 'client/shared/styles';
import { ProfileLabel } from 'client/common/ProfileLabel';
import { GenderForm } from './GenderForm';
import { GENDER_TEXT_RENDERINGS } from './utils';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: ${spacing[2]};
`;

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

  const deleteGender = async () => {
    await deleteGenderMutation({
      variables: {
        input: {
          personId,
        },
      },
    });
    setDeletedFlag(true);
  };

  const dropdownItems = [
    { label: 'Edit', onClick: () => setEditFlag(true) },
    { label: 'Delete', onClick: () => deleteGender() },
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
        <Container>
          <ProfileLabel>gender</ProfileLabel>
          {genderTextComponent}
          <Dropdown
            menuItems={dropdownItems}
            xMarkSize="15"
            sandwichSize="20"
            color={colors.orange}
            topSpacing="30px"
          />
        </Container>
      )}
    </>
  );
};
