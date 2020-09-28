import React, { FC } from 'react';
import { Text } from 'client/common/Text';
import { spacing } from 'client/shared/styles';
import styled from 'styled-components';

const LandingPageContainer = styled.section`
  margin-bottom: ${spacing[2]};
`;

interface LandingPageProps {}

export const LandingPage: FC<LandingPageProps> = () => {
  return (
    <LandingPageContainer>
      <Text fontSize={4} bold>
        fambly (n.)
      </Text>
      <Text fontSize={2}>
        A group of unrelated people who are full of platonic love for each
        other.
      </Text>
      <Text fontSize={0}>Source: Urban Dictionary</Text>
    </LandingPageContainer>
  );
};
