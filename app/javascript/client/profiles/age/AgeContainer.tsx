import React, { FC, useState } from 'react';
import { useDeleteAgeMutation } from 'client/graphqlTypes';
import { Dropdown } from 'client/common/Dropdown';
import { AgeForm } from './AgeForm';
import { colors } from 'client/shared/styles';
import { ProfileLabel } from 'client/common/ProfileLabel';
import { ProfileFieldContainer } from 'client/common/ProfileFieldContainer';
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
  hasFullBirthdate: boolean;
  personId: string;
}

export const AgeContainer: FC<AgeContainerProps> = ({
  age,
  monthsOld,
  personId,
  hasFullBirthdate,
}) => {
  const [deleteAgeMutation] = useDeleteAgeMutation();
  const [editFlag, setEditFlag] = useState(false);
  const [deletedFlag, setDeletedFlag] = useState(false);

  const deleteAge = async () => {
    await deleteAgeMutation({
      variables: {
        input: {
          personId,
        },
      },
    });
    setDeletedFlag(true);
  };

  const ageContainerContent = (
    <AgeTextContainer>
      {age ? `${age} years` : `${monthsOld} months`} old
    </AgeTextContainer>
  );

  const dropdownItems = [
    { label: 'Edit', onClick: () => setEditFlag(true) },
    { label: 'Delete', onClick: () => deleteAge() },
  ];

  const initialValues = {
    age,
    monthsOld,
  };

  const editAgeForm = (
    <AgeForm
      initialValues={initialValues}
      personId={personId}
      setEditFlag={setEditFlag}
    />
  );

  return editFlag ? (
    editAgeForm
  ) : (
    <>
      {!deletedFlag && (
        <ProfileFieldContainer>
          <ProfileLabel>age</ProfileLabel>
          {ageContainerContent}
          {!hasFullBirthdate && (
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
