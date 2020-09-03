import React, { FC } from 'react';
import { SubContactInfoFragment } from 'client/graphqlTypes';

interface ParentItemProps {
  parent: SubContactInfoFragment;
  childLastName?: string;
  childId: string;
}

export const ParentItem: FC<ParentItemProps> = ({
  parent,
  childId,
  childLastName,
}) => {
  const { firstName, lastName, age } = parent;

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

  const ageContent = age ? ` (${age})` : '';

  return (
    <div>
      {firstName}
      {getLastNameContent(lastName, childLastName)}
      {ageContent}
    </div>
  );
};
