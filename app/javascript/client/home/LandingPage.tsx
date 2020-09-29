import React, { FC } from 'react';
import { Accordion } from 'client/common/accordion/Accordion';
import { AccordionSection } from 'client/common/accordion/AccordionSection';
import { frequentlyAskedQuestions } from './utils';
import { Text } from 'client/common/Text';
import { spacing } from 'client/shared/styles';
import hangout_illustration from 'client/assets/hangout_illustration.svg';
import styled from 'styled-components';

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

const FAQContainer = styled.section``;

interface LandingPageProps {}

export const LandingPage: FC<LandingPageProps> = () => {
  return (
    <LandingPageContainer>
      <HeaderContainer>
        <Text fontSize={5} bold marginBottom={2}>
          fambly (n.)
        </Text>
        <Text fontSize={3} marginBottom={2} semiBold>
          A group of unrelated people who are full of platonic love for each
          other.
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
            Personal histories, e.g., when and where your parents lived, worked,
            and went to college
          </Example>
          <Example>
            Addresses and other contact information of colleagues and community
            members
          </Example>
        </ExamplesList>
      </DescriptionContainer>
      <FAQContainer>
        <Text fontSize={4} bold marginBottom={2}>
          FAQ
        </Text>
        <Accordion>
          {frequentlyAskedQuestions.map((qAndA) => (
            <AccordionSection header={qAndA.question} key={qAndA.question}>
              {qAndA.answer.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </AccordionSection>
          ))}
        </Accordion>
      </FAQContainer>
    </LandingPageContainer>
  );
};
