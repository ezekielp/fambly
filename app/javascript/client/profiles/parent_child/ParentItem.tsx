import React, { FC } from 'react';
import { SubContactInfoFragment } from 'client/graphqlTypes';
import { Link } from 'react-router-dom';

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
      <Link to={`/profiles/${id}`}>
        {firstName}
        {getLastNameContent(lastName, childLastName)}
      </Link>
      {ageContent}
    </div>
  );
};
