import React, { FC } from 'react';

export interface Email {
  id: string;
  emailAddress: string;
  emailType: string;
}

interface EmailsContainerProps {
  emails: Email[];
}

export const EmailsContainer: FC<EmailsContainerProps> = ({ emails }) => {
  // const emailComponents = emails
};
