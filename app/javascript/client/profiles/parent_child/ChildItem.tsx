import React, { FC, useState } from 'react';
import { ChildForm } from './ChildForm';
import {
  SubContactInfoFragment,
  useGetParentChildRelationshipQuery,
  useDeleteParentChildRelationshipMutation,
} from 'client/graphqlTypes';
import { StyledLink } from 'client/common/StyledLink';
import {
  StyledProfileFieldContainer,
  FlexContainer,
  AgeContainer,
} from './ParentItem';
import { Modal } from 'client/common/Modal';
import { colors } from 'client/shared/styles';
import { Dropdown } from 'client/common/Dropdown';
import { Text } from 'client/common/Text';
import { Button } from 'client/common/Button';

interface ChildItemProps {
  child: SubContactInfoFragment;
  parentId: string;
  parentLastName?: string | null | undefined;
}

export const ChildItem: FC<ChildItemProps> = ({
  child,
  parentId,
  parentLastName,
}) => {
  const { id, firstName, lastName, age, monthsOld } = child;
  const { data: parentChildData } = useGetParentChildRelationshipQuery({
    variables: {
      input: {
        parentId,
        childId: id,
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
          parentId,
          childId: id,
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
    childLastName: string | null | undefined,
    parentLastName: string | null | undefined,
  ) => {
    if (
      !childLastName ||
      (parentLastName && parentLastName === childLastName)
    ) {
      return '';
    } else {
      return ` ${childLastName}`;
    }
  };

  const getAgeContent = (
    age: number | null | undefined,
    monthsOld: number | null | undefined,
  ) => {
    if (monthsOld) {
      return <AgeContainer>{`(${monthsOld} months)`}</AgeContainer>;
    } else if (age) {
      return <AgeContainer>{`(${age})`}</AgeContainer>;
    }
    return '';
  };

  const parentType =
    parentChildData?.parentChildRelationshipByParentIdAndChildId?.parentType;

  const editFormInitialValues = {
    formChildId: id,
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
          <ChildForm
            initialValues={editFormInitialValues}
            setEditFlag={setEditFlag}
            parentId={parentId}
            personFirstName=""
            setModalOpen={setModalOpen}
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
              {getLastNameContent(lastName, parentLastName)}
            </StyledLink>
            {getAgeContent(age, monthsOld)}
          </FlexContainer>
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
