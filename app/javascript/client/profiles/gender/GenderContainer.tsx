import React, { FC, useState } from 'react';
import { useDeleteGenderMutation } from 'client/graphqlTypes';
import { GenderForm } from './GenderForm';

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

  const genderTextContent = <div>Gender: {gender}</div>;

  const editAndDeleteButtons = (
    <>
      <button onClick={() => setEditFlag(true)}>Edit</button>
      <button onClick={() => deleteGender()}>Delete</button>
    </>
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
      {!deletedFlag && genderTextContent}
      {!deletedFlag && editAndDeleteButtons}
    </>
  );
};
