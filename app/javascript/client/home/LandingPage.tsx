import React, { FC, useState, useContext } from 'react';
import { useCreateDummyUserMutation } from 'client/graphqlTypes';
import { AuthContext } from 'client/contexts/AuthContext';
import { Accordion } from 'client/common/accordion/Accordion';
import { AccordionSection } from 'client/common/accordion/AccordionSection';
import { frequentlyAskedQuestions } from './utils';
import { Text } from 'client/common/Text';
import { spacing, text, colors } from 'client/shared/styles';
import { Button } from 'client/common/Button';
import hangout_illustration from 'client/assets/hangout_illustration.svg';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { gql } from '@apollo/client';

gql`
  mutation CreateDummyUser {
    createDummyUser {
      dummyEmail {
        id
        email
        user {
          id
        }
      }
      errors {
        path
        message
      }
    }
  }
`;

const LandingPageContainer = styled.div`
  margin-bottom: ${spacing[2]};
  padding: 1rem 2rem;
`;

const HeaderContainer = styled.section`
  margin-bottom: 2rem;
`;

const HangoutIllustration = styled.img`
  width: 100%;
  margin-bottom: 1.5rem;
`;

const DescriptionContainer = styled.section`
  margin-bottom: 2rem;
`;

const ExamplesList = styled.ul``;

const Example = styled.li`
  list-style: outside;
  margin-bottom: 0.5rem;
`;

const ButtonsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledButton = styled(Button)`
  font-size: ${text[3]};
  font-variation-settings: 'wght' 700;
  border: 3px solid ${colors.black};
  margin-bottom: ${spacing[2]};
  text-align: center;
`;

const FAQContainer = styled.section``;

interface LandingPageProps {}

export const LandingPage: FC<LandingPageProps> = () => {
  const { userId } = useContext(AuthContext);
  if (userId) window.location.href = '/home';

  const [createDummyUser] = useCreateDummyUserMutation();
  const [creatingDummyUser, setCreatingDummyUser] = useState<boolean>(false);

  const handleCreateDummyUser = async () => {
    setCreatingDummyUser(true);
    const createDummyUserResponse = await createDummyUser();
    const errors = createDummyUserResponse.data?.createDummyUser.errors;
    if (!errors) {
      window.location.href = '/home';
    }
  };

  return (
    <LandingPageContainer>
      <HeaderContainer>
        <Text fontSize={5} bold marginBottom={2}>
          fambly (n.)
        </Text>
        <Text fontSize={3} marginBottom={2} semiBold>
          A group of unrelated people full of platonic love for each other.
        </Text>
        <Text fontSize={0}>Source: Urban Dictionary</Text>
      </HeaderContainer>
      <HangoutIllustration src={hangout_illustration} />
      <DescriptionContainer>
        <Text fontSize={2}>
          Fambly is a tool to help you store and organize information about
          people you love and people you know. Here are some examples of
          information it can help you store:
        </Text>
        <ExamplesList>
          <Example>Names, birthdays and ages of your friends&#39; kids</Example>
          <Example>
            Personal histories, e.g., where your parents lived, worked, and went
            to college
          </Example>
          <Example>
            Addresses and other contact information of colleagues and community
            members
          </Example>
        </ExamplesList>
      </DescriptionContainer>
      <ButtonsContainer>
        <StyledButton
          type="button"
          onClick={handleCreateDummyUser}
          disabled={creatingDummyUser}
        >
          Try it without signing up
        </StyledButton>
        <Text marginBottom={2}>Or</Text>
        <Link to="/signup">
          <StyledButton>Sign up</StyledButton>
        </Link>
      </ButtonsContainer>
      <FAQContainer>
        <Text fontSize={4} bold marginBottom={2}>
          FAQ
        </Text>
        <Accordion>
          {frequentlyAskedQuestions.map((qAndA) => (
            <AccordionSection header={qAndA.question} key={qAndA.question}>
              {qAndA.answer.map((paragraph) => (
                <Text marginBottom={3} key={paragraph}>
                  {paragraph}
                </Text>
              ))}
            </AccordionSection>
          ))}
        </Accordion>
      </FAQContainer>
    </LandingPageContainer>
  );
};
