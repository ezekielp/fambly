import React, { FC, useState } from 'react';
import { AgeForm } from './AgeForm';
import { gql } from '@apollo/client';

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

interface AgeContainerProps {
  age?: number | null;
  monthsOld?: number | null;
  personId: string;
}

export const AgeContainer: FC<AgeContainerProps> = ({
  age,
  monthsOld,
  personId,
}) => {
  const [editFlag, setEditFlag] = useState(false);

  const ageContainerContent = (
    <>
      <div>Age: {age ? `${age} years` : `${monthsOld} months`} old</div>
      <button onClick={() => setEditFlag(true)}>Edit</button>
    </>
  );

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

  return editFlag ? editAgeForm : ageContainerContent;
};
