import React, { FC } from 'react';
// import { Text } from 'client/common/Text';
// import { Button } from 'client/common/Button';
import { ProfileLabel } from 'client/common/ProfileLabel';
import { ProfileFieldContainer } from 'client/common/ProfileFieldContainer';
import styled from 'styled-components';

interface MiddleNameContainerProps {
  middleName: string;
}

const MiddleNameTextContainer = styled.div`
  margin-right: 10px;
`;

export const MiddleNameContainer: FC<MiddleNameContainerProps> = ({
  middleName,
}) => {
  return (
    <ProfileFieldContainer>
      <ProfileLabel>middle name</ProfileLabel>
      <MiddleNameTextContainer>{middleName}</MiddleNameTextContainer>
    </ProfileFieldContainer>
  );
};
