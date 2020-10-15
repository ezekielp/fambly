import React, { FC, useState } from 'react';
import { ParentForm } from './ParentForm';
import {
  SubContactInfoFragment,
  useGetParentChildRelationshipQuery,
  useDeleteParentChildRelationshipMutation,
} from 'client/graphqlTypes';
import { getParentTypeText, parentTypeColors } from './utils';
import { ProfileFieldContainer } from 'client/common/ProfileFieldContainer';
import { FieldBadge } from 'client/common/FieldBadge';
import { StyledLink } from 'client/common/StyledLink';
import { Modal } from 'client/common/Modal';
import { colors, spacing } from 'client/shared/styles';
import { Dropdown } from 'client/common/Dropdown';
import { Text } from 'client/common/Text';
import { Button } from 'client/common/Button';
import { gql } from '@apollo/client';
import styled from 'styled-components';

export const StyledProfileFieldContainer = styled(ProfileFieldContainer)`
  margin-bottom: ${spacing[0]};
`;

export const FlexContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-right: 10px;
`;

export const AgeContainer = styled.div`
  margin-left: 5px;
`;

gql`
  query GetParentChildRelationship($input: ParentChildInput!) {
    parentChildRelationshipByParentIdAndChildId(input: $input) {
      id
      parentType
    }
  }
`;

gql`
  mutation DeleteParentChildRelationship(
    $input: DeleteParentChildRelationshipInput!
  ) {
    deleteParentChildRelationship(input: $input)
  }
`;

interface ParentItemProps {
  parent: SubContactInfoFragment;
  childLastName?: string | null | undefined;
  childId: string;
  relations: SubContactInfoFragment[];
}

export const ParentItem: FC<ParentItemProps> = ({
  parent,
  childId,
  childLastName,
  relations,
}) => {
  const { id, firstName, lastName, age, gender } = parent;
  const { data: parentChildData } = useGetParentChildRelationshipQuery({
    variables: {
      input: {
        parentId: id,
        childId,
      },
    },
  });
  const [
    deleteParentChildRelationshipMutation,
  ] = useDeleteParentChildRelationshipMutation();
  const [editFlag, setEditFlag] = useState(false);
  const [deletedFlag, setDeletedFlag] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const deleteParentChildRelationship = async () => {
    await deleteParentChildRelationshipMutation({
      variables: {
        input: {
          parentId: id,
          childId,
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

  const getLastNameContent = (
    parentLastName: string | null | undefined,
    childLastName: string | null | undefined,
  ) => {
    if (
      !parentLastName ||
      (childLastName && childLastName === parentLastName)
    ) {
      return '';
    } else {
      return ` ${parentLastName}`;
    }
  };

  const ageContent = age ? <AgeContainer>{`(${age})`}</AgeContainer> : '';
  const parentType =
    parentChildData?.parentChildRelationshipByParentIdAndChildId?.parentType;

  const editFormInitialValues = {
    formParentId: id,
    newOrCurrentContact: 'current_person',
    parentType: parentType ? parentType : '',
    age: null,
    monthsOld: null,
    showOnDashboard: [],
  };

  return modalOpen ? (
    <>
      {editFlag && (
        <Modal onClose={handleEditModalClose}>
          <ParentForm
            initialValues={editFormInitialValues}
            setEditFlag={setEditFlag}
            childId={childId}
            personFirstName=""
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
            onClick={() => deleteParentChildRelationship()}
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
        <StyledProfileFieldContainer>
          <FlexContainer>
            <StyledLink to={`/profiles/${id}`}>
              {firstName}
              {getLastNameContent(lastName, childLastName)}
            </StyledLink>
            {ageContent}
          </FlexContainer>
          {parentType && (
            <FieldBadge
              backgroundColor={parentTypeColors[parentType]['backgroundColor']}
              textColor={parentTypeColors[parentType]['textColor']}
            >
              {getParentTypeText(parentType, gender)}
            </FieldBadge>
          )}
          <Dropdown
            menuItems={dropdownItems}
            xMarkSize="15"
            sandwichSize="20"
            color={colors.orange}
            topSpacing="30px"
          />
        </StyledProfileFieldContainer>
      )}
    </>
  );
};
