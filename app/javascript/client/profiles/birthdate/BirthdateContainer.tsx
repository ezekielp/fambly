import React, { FC, useState } from 'react';
import { useDeleteBirthdateMutation } from 'client/graphqlTypes';
import { Dropdown } from 'client/common/Dropdown';
import { colors } from 'client/shared/styles';
import { BirthdateForm } from './BirthdateForm';
import { ProfileLabel } from 'client/common/ProfileLabel';
import { ProfileFieldContainer } from 'client/common/ProfileFieldContainer';
import { MONTHS } from './utils';
import { gql } from '@apollo/client';
import styled from 'styled-components';

gql`
  mutation DeleteBirthdate($input: DeleteBirthdateInput!) {
    deleteBirthdate(input: $input)
  }
`;

const BirthdateTextContainer = styled.div`
  margin-right: 10px;
`;

interface BirthdateContainerProps {
  birthYear?: number | null;
  birthMonth?: number | null;
  birthDay?: number | null;
  personId: string;
}

export const BirthdateContainer: FC<BirthdateContainerProps> = (props) => {
  const [deleteBirthdateMutation] = useDeleteBirthdateMutation();
  const { birthYear, birthMonth, birthDay, personId } = props;
  const [editFlag, setEditFlag] = useState(false);
  const [deletedFlag, setDeletedFlag] = useState(false);

  const deleteBirthdate = async () => {
    await deleteBirthdateMutation({
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
    { label: 'Delete', onClick: () => deleteBirthdate() },
  ];

  const birthdateLabel = birthMonth && birthDay ? 'birthdate' : 'birth year';

  const birthdateText = (
    year: number | null | undefined,
    month: string,
    day: string,
  ) => {
    if (year && month && !day) {
      return `${MONTHS[month]} ${year}`;
    } else if (year && !month && !day) {
      return `${year}`;
    } else if (month && day && !year) {
      return `${MONTHS[month]} ${day}`;
    } else if (month && day && year) {
      return `${MONTHS[month]} ${day}, ${year}`;
    }
  };

  const month = birthMonth ? birthMonth.toString() : '';
  const day = birthDay ? birthDay.toString() : '';

  const initialValues = {
    birthYear,
    birthMonth: month,
    birthDay: day,
  };

  const editBirthdateForm = (
    <BirthdateForm
      initialValues={initialValues}
      personId={personId}
      setEditFlag={setEditFlag}
    />
  );

  return editFlag ? (
    editBirthdateForm
  ) : (
    <>
      {!deletedFlag && (
        <ProfileFieldContainer>
          <ProfileLabel>{birthdateLabel}</ProfileLabel>
          <BirthdateTextContainer>
            {birthdateText(birthYear, month, day)}
          </BirthdateTextContainer>
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
