import React, { FC } from 'react';
import { EmailItem } from './EmailItem';

export interface Email {
  id: string;
  emailAddress: string;
  emailType: string;
}

interface EmailsContainerProps {
  emails: Email[];
}

export const EmailsContainer: FC<EmailsContainerProps> = ({ emails }) => {
  const emailComponents = emails.map((email) => (
    <EmailItem email={email} key={email.id} />
  ));
  return <>{emailComponents}</>;
};
