import React, { FC } from 'react';
import { SubContactInfoFragment } from 'client/graphqlTypes';

interface ParentItemProps {
  parent: SubContactInfoFragment;
}

export const ParentItem: FC<ParentItemProps> = ({ parent }) => {
  return <div>{parent.firstName}</div>;
};
