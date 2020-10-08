import React, { FC, createContext, useState, useEffect } from 'react';
import { useGetUserForHomeContainerQuery } from 'client/graphqlTypes';

interface PeopleContextState {
  tagNames: string[];
  setTagNames: (tags: string[]) => void;
}

export const PeopleContext = createContext<PeopleContextState>({
  tagNames: [],
  setTagNames: () => null,
});

export const PeopleContextProvider: FC = ({ children }) => {
  const [tagNames, setTagNames] = useState<string[]>([]);

  const { data } = useGetUserForHomeContainerQuery();

  useEffect(() => {
    const user = data?.user;
    if (user?.people) {
      const initialTagNames = user.people.reduce((tagNames, person) => {
        if (person.tags) {
          const newTagNames = person.tags.map((tag) => tag.name);
          return tagNames.concat(newTagNames);
        }
        return tagNames;
      }, [] as string[]);

      setTagNames(initialTagNames);
    }
  }, [data]);

  return (
    <PeopleContext.Provider value={{ tagNames, setTagNames }}>
      {children}
    </PeopleContext.Provider>
  );
};
