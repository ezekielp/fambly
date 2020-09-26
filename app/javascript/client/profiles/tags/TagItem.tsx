import React, { FC, useState } from 'react';
import { useDeletePersonTagMutation } from 'client/graphqlTypes';
import { Tag } from './TagsContainer';
import { gql } from '@apollo/client';
import { Modal } from 'client/common/Modal';
import { Text } from 'client/common/Text';
import { Button } from 'client/common/Button';
import { Swatch } from './PersonTagForm';

gql`
  mutation DeletePersonTag($input: DeletePersonTagInput!) {
    deletePersonTag(input: $input)
  }
`;

interface TagProps {
  personId: string;
  tag: Tag;
}

export const TagItem: FC<TagProps> = ({ tag, personId }) => {
  const { id, name, color } = tag;
  const [deletePersonTagMutation] = useDeletePersonTagMutation();
  const [deletedFlag, setDeletedFlag] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const deletePersonTag = async () => {
    await deletePersonTagMutation({
      variables: {
        input: {
          personId,
          tagId: id,
        },
      },
    });
    setDeletedFlag(true);
    setModalOpen(false);
  };

  return modalOpen ? (
    <Modal onClose={() => setModalOpen(false)}>
      <Text marginBottom={3} fontSize={3} bold>
        Are you sure you want to delete this field?
      </Text>
      <Button marginRight="1rem" onClick={() => deletePersonTag()}>
        Yes
      </Button>
      <Button onClick={() => setModalOpen(false)}>Cancel</Button>
    </Modal>
  ) : (
    <>
      {!deletedFlag && (
        <Swatch
          onClick={() => setModalOpen(true)}
          swatchColor={color}
          cursorPointer={true}
          marginBottom="10px"
        >
          x{'  '}
          {name}
        </Swatch>
      )}
    </>
  );
};
