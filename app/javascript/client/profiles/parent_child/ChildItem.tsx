import React, { FC } from 'react';
import { SubContactInfoFragment } from 'client/graphqlTypes';

interface ChildItemProps {
  child: SubContactInfoFragment;
  parentId: string;
  parentLastName?: string;
}

export const ChildItem: FC<ChildItemProps> = ({
  child,
  parentId,
  parentLastName,
}) => {
  const { firstName, lastName, age, monthsOld } = child;

  const getLastNameContent = (
    childLastName: string | null | undefined,
    parentLastName: string | null | undefined,
  ) => {
    if (
      !childLastName ||
      (parentLastName && parentLastName === childLastName)
    ) {
      return '';
    } else {
      return ` ${childLastName}`;
    }
  };

  const getAgeContent = (
    age: number | null | undefined,
    monthsOld: number | null | undefined,
  ) => {
    if (monthsOld) {
      return ` (${monthsOld} months)`;
    } else if (age) {
      return ` (${age})`;
    }
    return '';
  };

  return (
    <div>
      {firstName}
      {getLastNameContent(lastName, parentLastName)}
      {getAgeContent(age, monthsOld)}
    </div>
  );
};
