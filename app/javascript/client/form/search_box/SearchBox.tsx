import React, { FC, ChangeEvent, ReactNode, useState } from 'react';
import { HomeContainerPersonInfoFragment } from 'client/graphqlTypes';
import { TextInput } from 'client/form/TextInput';
import { SelectWrapper, StyledSelect, Option } from 'client/form/SelectInput';
import { Tag } from 'client/profiles/tags/TagsContainer';
import Autosuggest, {
  SuggestionsFetchRequestedParams,
} from 'react-autosuggest';
import {
  SEARCH_FILTER_OPTIONS,
  SEARCH_TYPE_OPTIONS,
  SEARCH_VARIABLE_OPTIONS,
} from './utils';
import styled from 'styled-components';

// Need the list of people — their ids, first names, and last names — and their tags (tag names)
// For now I think just pass them down from HomeContainer?

const SearchBoxContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

interface SearchBoxProps {
  people: HomeContainerPersonInfoFragment[];
  tags: Tag[];
}

export const SearchBox: FC<SearchBoxProps> = ({ people }) => {
  const firstNames = people.map((person) => person.firstName);
  const lastNames = people
    .map((person) => person.lastName)
    .filter((lastName) => lastName !== null);
  const fullNames = people.map((person) =>
    person.lastName ? person.firstName + person.lastName : person.firstName,
  );
  // const [filteredFirstNames, setFilteredFirstNames] = useState<string[]>(firstNames);
  // const [filteredLastNames, setFilteredLastNames] = useState<string[]>(lastNames);
  const [filteredFullNames, setFilteredFullNames] = useState<string[]>(
    fullNames,
  );
  const [searchType, setSearchType] = useState<string>('search');
  const [searchVariable, setSearchVariable] = useState<string>('firstName');

  const buildOptions = (options: Option[]): ReactNode[] => {
    return options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ));
  };

  return (
    <SearchBoxContainer>
      <SelectWrapper>
        <StyledSelect
          value={searchType}
          onChange={(event: ChangeEvent<HTMLSelectElement>) =>
            setSearchType(event.target.value)
          }
        >
          {buildOptions(SEARCH_TYPE_OPTIONS)}
        </StyledSelect>
      </SelectWrapper>
      <SelectWrapper>
        <StyledSelect></StyledSelect>
      </SelectWrapper>
      <SelectInput
        options={
          searchType === 'search'
            ? SEARCH_VARIABLE_OPTIONS
            : SEARCH_FILTER_OPTIONS
        }
      />
    </SearchBoxContainer>
  );
};
