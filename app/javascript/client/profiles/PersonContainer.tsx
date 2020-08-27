import React, { FC, useState } from 'react';
import { useGetPersonForPersonContainerQuery } from 'client/graphqlTypes';
import { useParams } from 'react-router-dom';
import { gql } from '@apollo/client';

gql`
  query GetPersonForPersonContainer($personId: String!) {
    personById(personId: $personId) {
      id
      firstName
      lastName
      notes {
        id
        content
      }
    }
  }
`;

interface PersonContainerProps {}

export const PersonContainer: FC = () => {
  const [fieldToAdd, setFieldToAdd] = useState('');
  const { urlParams } = useParams();

  const personId = urlParams.split('/')[1];
  const { data: personData } = useGetPersonForPersonContainerQuery(personId);

  return (
    <>
      <div>Hello from a person page!</div>
      <select
        value={fieldToAdd}
        onChange={(e) => setFieldToAdd(e.target.value)}
      >
        <option value=""></option>
        <option value="note">Note</option>
      </select>
    </>
  );
};
