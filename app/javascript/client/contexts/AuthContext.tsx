import React, { FC, createContext, useEffect, useState } from 'react';
import { useGetUserQuery } from '../graphqlTypes';
import gql from 'graphql-tag';

gql`
  query GetUser {
    user {
      id
      email
    }
  }
`;

interface AuthContextState {
  userId?: string | null;
}

export const AuthContext = createContext<AuthContextState>({});

export const AuthContextProvider: FC = (props) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [dataFetched, setDataFetched] = useState<boolean>(false);

  const { data, loading } = useGetUserQuery();

  useEffect(() => {
    const user = data?.user;
    if (user?.id) {
      setUserId(user.id);
    }

    if (!loading) {
      setDataFetched(true);
    }
  }, [data]);

  if (!dataFetched) return null;

  return (
    <AuthContext.Provider value={{ userId }}>
      {props.children}
    </AuthContext.Provider>
  );
};
