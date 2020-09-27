import React, { FC } from 'react';
import { TagItem } from './TagItem';
import { PersonTagForm } from 'client/profiles/tags/PersonTagForm';
import { Button } from 'client/common/Button';
import { Modal } from 'client/common/Modal';
import { text } from 'client/shared/styles';
import styled from 'styled-components';

const StyledTagsContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 30px;
`;

const AddTagButton = styled(Button)`
  border-radius: 10px;
  font-size: ${text[0]};
  padding: 0.5rem 1rem;
  margin-bottom: 10px;
`;

export interface Tag {
  id: string;
  name: string;
  color?: string | null | undefined;
}

interface TagsContainerProps {
  setFieldToAdd: (field: string) => void;
  fieldToAdd: string;
  personId: string;
  tags: Tag[];
}

export const TagsContainer: FC<TagsContainerProps> = ({
  tags,
  personId,
  setFieldToAdd,
  fieldToAdd,
}) => {
  const handleAddTagButtonClick = () => {
    setFieldToAdd('person_tag');
  };

  const tagItems = tags.map((tag) => (
    <TagItem personId={personId} tag={tag} key={tag.id} />
  ));
  return (
    <>
      <StyledTagsContainer>
        {tagItems}
        <AddTagButton onClick={handleAddTagButtonClick}>
          + Add group
        </AddTagButton>
      </StyledTagsContainer>
      {fieldToAdd === 'person_tag' && (
        <Modal onClose={() => setFieldToAdd('')}>
          <PersonTagForm
            setFieldToAdd={setFieldToAdd}
            personId={personId}
            tags={tags}
          />
        </Modal>
      )}
    </>
  );
};
