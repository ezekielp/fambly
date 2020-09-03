import React, { FC, useState } from 'react';
import { useDeleteBirthdateMutation } from 'client/graphqlTypes';
import { BirthdateForm } from './BirthdateForm';
import { MONTHS } from './utils';
import { gql } from '@apollo/client';

gql`
  mutation DeleteBirthdate($input: DeleteBirthdateInput!) {
    deleteBirthdate(input: $input)
  }
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

  const birthdateContainerContent = (
    year: number | null | undefined,
    month: string,
    day: string,
  ) => {
    if (deletedFlag) return <></>;

    if (year && month && !day) {
      return (
        <div>
          Born in: {MONTHS[month]} {year}
        </div>
      );
    } else if (year && !month && !day) {
      return <div>Born in: {year}</div>;
    } else if (month && day && !year) {
      return (
        <div>
          Birthdate: {MONTHS[month]} {day}
        </div>
      );
    } else if (month && day && year) {
      return (
        <div>
          Birthdate: {MONTHS[month]} {day}, {year}
        </div>
      );
    } else {
      return <></>;
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
      {birthdateContainerContent(birthYear, month, day)}
      <button onClick={() => setEditFlag(true)}>Edit</button>
      <button onClick={() => deleteBirthdate()}>Delete</button>
    </>
  );
};
