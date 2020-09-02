import React, { FC } from 'react';
import { SubContactInfoFragment } from 'client/graphqlTypes';
import { ParentItem } from './ParentItem';

interface ParentsContainerProps {
  parents: SubContactInfoFragment[];
}

export const ParentsContainer: FC<ParentsContainerProps> = ({ parents }) => {
  const parentItems = parents.map((parent) => {
    return <ParentItem key={parent.id} parent={parent} />;
  });

  return <>{parentItems}</>;
};
