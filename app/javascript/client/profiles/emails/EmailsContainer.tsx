import React, { FC } from 'react';
import { EmailItem } from './EmailItem';
import { ProfileLabel } from 'client/common/ProfileLabel';
import { ProfileFieldContainer } from 'client/common/ProfileFieldContainer';

export interface Email {
  id: string;
  emailAddress: string;
  emailType?: string | null | undefined;
}

interface EmailsContainerProps {
  emails: Email[];
}

export const EmailsContainer: FC<EmailsContainerProps> = ({ emails }) => {
  const emailComponents = emails.map((email) => (
    <EmailItem email={email} key={email.id} />
  ));
  const labelText = emails.length === 1 ? 'email address' : 'email addresses';

  return (
    <ProfileFieldContainer>
      <ProfileLabel>{labelText}</ProfileLabel>
      <div>{emailComponents}</div>
    </ProfileFieldContainer>
  );
};
