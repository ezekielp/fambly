import React, { FC, useState } from 'react';
import { ParentForm } from './ParentForm';
import {
  SubContactInfoFragment,
  useGetParentChildRelationshipQuery,
} from 'client/graphqlTypes';
import { ProfileFieldContainer } from 'client/common/ProfileFieldContainer';
import { StyledLink } from 'client/common/StyledLink';
import { Modal } from 'client/common/Modal';
import { colors, spacing } from 'client/shared/styles';
import { Dropdown } from 'client/common/Dropdown';
import { gql } from '@apollo/client';
import styled from 'styled-components';

const StyledProfileFieldContainer = styled(ProfileFieldContainer)`
  margin-bottom: ${spacing[0]};
`;

const FlexContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-right: 10px;
`;

const AgeContainer = styled.div`
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

interface ParentItemProps {
  parent: SubContactInfoFragment;
  childLastName?: string | null | undefined;
  childId: string;
}

export const ParentItem: FC<ParentItemProps> = ({
  parent,
  childId,
  childLastName,
}) => {
  const { id, firstName, lastName, age } = parent;
  const { data: parentChildData } = useGetParentChildRelationshipQuery({
    variables: {
      input: {
        parentId: id,
        childId,
      },
    },
  });
  const [editFlag, setEditFlag] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handleEdit = () => {
    setEditFlag(true);
    setModalOpen(true);
  };

  const dropdownItems = [{ label: 'Edit', onClick: handleEdit }];

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
    formParentId: parent.id,
    newOrCurrentContact: 'current_person',
    parentType: parentType ? parentType : '',
    age: null,
    monthsOld: null,
    showOnDashboard: [],
  };

  return editFlag ? (
    <>
      {modalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <ParentForm
            initialValues={editFormInitialValues}
            setEditFlag={setEditFlag}
            childId={childId}
            personFirstName=""
          />
        </Modal>
      )}
    </>
  ) : (
    <>
      <StyledProfileFieldContainer>
        <FlexContainer>
          <StyledLink to={`/profiles/${id}`}>
            {firstName}
            {getLastNameContent(lastName, childLastName)}
          </StyledLink>
          {ageContent}
        </FlexContainer>
        <Dropdown
          menuItems={dropdownItems}
          xMarkSize="20"
          sandwichSize="20"
          color={colors.orange}
          topSpacing="30px"
        />
      </StyledProfileFieldContainer>
    </>
  );
};
