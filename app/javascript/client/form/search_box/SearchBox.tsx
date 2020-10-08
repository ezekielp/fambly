import React, { FC, ChangeEvent, ReactNode, useState } from 'react';
import { HomeContainerPersonInfoFragment } from 'client/graphqlTypes';
import { SelectWrapper, StyledSelect, Option } from 'client/form/SelectInput';
import { Tag } from 'client/profiles/tags/TagsContainer';
import Autosuggest, {
  SuggestionsFetchRequestedParams,
} from 'react-autosuggest';
import {
  SEARCH_FILTER_OPTIONS,
  SEARCH_TYPE_OPTIONS,
  SEARCH_VARIABLE_OPTIONS,
  getFullNamesFromPeople,
} from './utils';
import styled from 'styled-components';
import { escapeRegexCharacters } from 'client/profiles/utils';
import { RouteComponentProps } from 'react-router-dom';

// Need the list of people — their ids, first names, and last names — and their tags (tag names)
// For now I think just pass them down from HomeContainer?

const SearchBoxContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

interface SearchBoxProps extends RouteComponentProps {
  people: HomeContainerPersonInfoFragment[];
  tags: Tag[];
  setTagFilter: (tagName: string) => void;
}

export const SearchBox: FC<SearchBoxProps> = ({
  people,
  tags,
  setTagFilter,
  history,
}) => {
  const fullNames = getFullNamesFromPeople(people);
  const tagNames = tags.map((tag) => tag.name);

  const [filteredFullNames, setFilteredFullNames] = useState<string[]>(
    fullNames,
  );
  const [filteredTagNames, setFilteredTagNames] = useState<string[]>(tagNames);
  const [queryType, setQueryType] = useState<string>('search');
  const [searchVariable, setSearchVariable] = useState<string>('firstName');
  const [inputValue, setInputValue] = useState<string>('');

  const buildOptions = (options: Option[]): ReactNode[] => {
    return options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ));
  };

  const getSuggestions = (value: string): string[] => {
    const trimmedInputValue = escapeRegexCharacters(value.trim().toLowerCase());
    const regex = new RegExp('^' + trimmedInputValue, 'i');
    if (queryType === 'search') {
      if (searchVariable === 'firstName') {
        return getFullNamesFromPeople(
          people.filter((person) => regex.test(person.firstName)),
        );
      } else {
        // searchVariable === 'lastName'
        return getFullNamesFromPeople(
          people.filter((person) =>
            regex.test(person.lastName ? person.lastName : ''),
          ),
        );
      }
    } else {
      // queryType === 'filter'
      return tagNames.filter((tagName) => regex.test(tagName));
    }
  };

  const onSuggestionsFetchRequested = (
    props: SuggestionsFetchRequestedParams,
  ) => {
    if (queryType === 'search') {
      setFilteredFullNames(getSuggestions(props.value));
    } else {
      // queryType === 'filter'
      setFilteredTagNames(getSuggestions(props.value));
    }
  };

  const onSuggestionsClearRequested = () => {
    setFilteredFullNames([]);
    setFilteredTagNames([]);
  };

  const shouldRenderSuggestions = (): boolean => true;

  const getSuggestionValue = (suggestion: string): string => suggestion;

  const renderSuggestion = (suggestion: string): ReactNode => (
    <div>{suggestion}</div>
  );

  return (
    <SearchBoxContainer>
      <SelectWrapper>
        <StyledSelect
          value={queryType}
          onChange={(event: ChangeEvent<HTMLSelectElement>) =>
            setQueryType(event.target.value)
          }
        >
          {buildOptions(SEARCH_TYPE_OPTIONS)}
        </StyledSelect>
      </SelectWrapper>
      <SelectWrapper>
        <StyledSelect
          value={queryType === 'search' ? searchVariable : 'filter'}
          onChange={(event: ChangeEvent<HTMLSelectElement>) => {
            if (queryType === 'search') {
              setSearchVariable(event.target.value);
            }
          }}
        >
          {queryType === 'search' && buildOptions(SEARCH_VARIABLE_OPTIONS)}
          {queryType === 'filter' && buildOptions(SEARCH_FILTER_OPTIONS)}
        </StyledSelect>
      </SelectWrapper>
      <Autosuggest
        suggestions={
          queryType === 'search' ? filteredFullNames : filteredTagNames
        }
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        shouldRenderSuggestions={shouldRenderSuggestions}
        onSuggestionSelected={(event, data) => {
          event.preventDefault();
          event.stopPropagation();
          if (queryType === 'search') {
            const names = data.suggestion.split(' ');
            const queriedPerson = people.find((person) => {
              if (names.length > 1) {
                return (
                  person.firstName === names[0] && person.lastName === names[1]
                );
              } else {
                // names.length === 1
                // meaning there is only a first name
                return person.firstName === names[0];
              }
            });
            queriedPerson && history.push(`/profiles/${queriedPerson.id}`);
          } else {
            // queryType === 'filter'
            setTagFilter(data.suggestion);
          }
        }}
        inputProps={{
          onChange: (event: any) => setInputValue(event.target.value),
          value: inputValue,
        }}
      />
    </SearchBoxContainer>
  );
};
