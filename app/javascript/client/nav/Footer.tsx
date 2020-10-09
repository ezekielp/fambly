import React, { FC } from 'react';
import { colors } from 'client/shared/styles';
import styled from 'styled-components';

const FooterContainer = styled.div`
  background: ${colors.orange};
  width: 100%;
  height: 125px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
`;

const EmailText = styled.div`
  margin-bottom: 1rem;
`;

const CopyrightText = styled.div`
  font-variation-settings: 'wght' 700;
`;

interface FooterProps {}

export const Footer: FC<FooterProps> = () => {
  return (
    <FooterContainer>
      <EmailText>Questions? Contact Zeke at zeke@fambly.io</EmailText>
      <CopyrightText>© 2020 Fambly</CopyrightText>
    </FooterContainer>
  );
};
