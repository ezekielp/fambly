import React, { FC, useState } from 'react';
import { useDeleteBirthdateMutation } from 'client/graphqlTypes';
import { Dropdown } from 'client/common/Dropdown';
import { colors } from 'client/shared/styles';
import { BirthdateForm } from './BirthdateForm';
import { MONTHS } from './utils';
import { gql } from '@apollo/client';
import styled from 'styled-components';

gql`
  mutation DeleteBirthdate($input: DeleteBirthdateInput!) {
    deleteBirthdate(input: $input)
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
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

  const birthdateContainerContent = (
    year: number | null | undefined,
    month: string,
    day: string,
  ) => {
    if (deletedFlag) return <></>;

    let textContent;

    if (year && month && !day) {
      textContent = `Born in: ${MONTHS[month]} ${year}`;
    } else if (year && !month && !day) {
      textContent = `Born in: ${year}`;
    } else if (month && day && !year) {
      textContent = `Birthdate: ${MONTHS[month]} ${day}`;
    } else if (month && day && year) {
      textContent = `Birthdate: ${MONTHS[month]} ${day}, ${year}`;
    } else {
      textContent = <></>;
    }

    return (
      <Container>
        <BirthdateTextContainer>{textContent}</BirthdateTextContainer>
        <Dropdown
          menuItems={dropdownItems}
          xMarkSize="15"
          sandwichSize="20"
          color={colors.orange}
          topSpacing="30px"
        />
      </Container>
    );
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
    <>{birthdateContainerContent(birthYear, month, day)}</>
  );
};
