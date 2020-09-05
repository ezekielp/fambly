import React, { FC, useState } from 'react';
import { useDeleteAgeMutation } from 'client/graphqlTypes';
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

gql`
  mutation DeleteAge($input: DeleteAgeInput!) {
    deleteAge(input: $input)
  }
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
    <div>Age: {age ? `${age} years` : `${monthsOld} months`} old</div>
  );

  const editAndDeleteButtons = hasFullBirthdate ? (
    <></>
  ) : (
    <>
      <button onClick={() => setEditFlag(true)}>Edit</button>
      <button onClick={() => deleteAge()}>Delete</button>
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

  return editFlag ? (
    editAgeForm
  ) : (
    <>
      {!deletedFlag && ageContainerContent}
      {!deletedFlag && editAndDeleteButtons}
    </>
  );
};
