import React, { FC, useState } from 'react';
import { SiblingForm } from './SiblingForm';
import {
  SubContactInfoFragment,
  useGetSiblingRelationshipQuery,
  useDeleteSiblingRelationshipMutation,
} from 'client/graphqlTypes';
import { FieldBadge } from 'client/common/FieldBadge';
import { StyledLink } from 'client/common/StyledLink';
import { Modal } from 'client/common/Modal';
import { colors } from 'client/shared/styles';
import { Dropdown } from 'client/common/Dropdown';
import { Text } from 'client/common/Text';
import { Button } from 'client/common/Button';
import { gql } from '@apollo/client';
import { getSiblingTypeText, siblingTypeColors } from './utils';
import {
  RelativeItemContainer,
  FlexContainer,
  AgeContainer,
} from 'client/profiles/parent_child/ParentItem';
import { getLastNameContent } from 'client/profiles/utils';

gql`
  query GetSiblingRelationship($input: SiblingRelationshipInput!) {
    siblingRelationshipBySiblingIds(input: $input) {
      id
      siblingType
    }
  }
`;

gql`
  mutation DeleteSiblingRelationship($input: DeleteSiblingRelationshipInput!) {
    deleteSiblingRelationship(input: $input)
  }
`;

interface SiblingItemProps {
  sibling: SubContactInfoFragment;
  otherSiblingLastName?: string | null | undefined;
  otherSiblingId: string;
  relations: SubContactInfoFragment[];
}

export const SiblingItem: FC<SiblingItemProps> = ({
  sibling,
  otherSiblingId,
  otherSiblingLastName,
  relations,
}) => {
  const { id, firstName, lastName, age, gender } = sibling;
  const { data: siblingRelationshipData } = useGetSiblingRelationshipQuery({
    variables: {
      input: {
        siblingOneId: otherSiblingId,
        siblingTwoId: id,
      },
    },
  });
  const [
    deleteSiblingRelationshipMutation,
  ] = useDeleteSiblingRelationshipMutation();
  const [editFlag, setEditFlag] = useState(false);
  const [deletedFlag, setDeletedFlag] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const deleteSiblingRelationship = async () => {
    await deleteSiblingRelationshipMutation({
      variables: {
        input: {
          siblingOneId: otherSiblingId,
          siblingTwoId: id,
        },
      },
    });
    setDeletedFlag(true);
    setModalOpen(false);
  };

  const handleEdit = () => {
    setEditFlag(true);
    setModalOpen(true);
  };

  const handleEditModalClose = () => {
    setModalOpen(false);
    setEditFlag(false);
  };

  const dropdownItems = [
    { label: 'Edit', onClick: handleEdit },
    { label: 'Delete', onClick: () => setModalOpen(true) },
  ];

  const ageContent = age ? <AgeContainer>{`(${age})`}</AgeContainer> : '';
  const siblingType =
    siblingRelationshipData?.siblingRelationshipBySiblingIds?.siblingType;

  const editFormInitialValues = {
    formSiblingId: id,
    newOrCurrentContact: 'current_person',
    siblingType: siblingType ? siblingType : '',
    age: null,
    monthsOld: null,
    showOnDashboard: [],
  };

  return modalOpen ? (
    <>
      {editFlag && (
        <Modal onClose={handleEditModalClose}>
          <SiblingForm
            initialValues={editFormInitialValues}
            setEditFlag={setEditFlag}
            siblingOneId={otherSiblingId}
            setModalOpen={setModalOpen}
            relations={relations}
          />
        </Modal>
      )}
      {!editFlag && (
        <Modal onClose={() => setModalOpen(false)}>
          <Text marginBottom={3} fontSize={3} bold>
            Are you sure you want to delete this field?
          </Text>
          <Button
            marginRight="1rem"
            onClick={() => deleteSiblingRelationship()}
          >
            Yes
          </Button>
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
        </Modal>
      )}
    </>
  ) : (
    <>
      {!deletedFlag && (
        <RelativeItemContainer>
          <FlexContainer>
            <StyledLink to={`/profiles/${id}`}>
              {firstName}
              {getLastNameContent(lastName, otherSiblingLastName)}
            </StyledLink>
            {ageContent}
          </FlexContainer>
          {siblingType && (
            <FieldBadge
              backgroundColor={
                siblingTypeColors[siblingType]['backgroundColor']
              }
              textColor={siblingTypeColors[siblingType]['textColor']}
            >
              {getSiblingTypeText(siblingType, gender)}
            </FieldBadge>
          )}
          <Dropdown
            menuItems={dropdownItems}
            xMarkSize="15"
            sandwichSize="20"
            color={colors.orange}
            topSpacing="30px"
          />
        </RelativeItemContainer>
      )}
    </>
  );
};
