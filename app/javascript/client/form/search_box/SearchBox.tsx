import React, { FC, ChangeEvent, ReactNode, useState } from 'react';
import { HomeContainerPersonInfoFragment as Person } from 'client/graphqlTypes';
import { SelectWrapper, StyledSelect, Option } from 'client/form/SelectInput';
import { Tag } from 'client/profiles/tags/TagsContainer';
import Autosuggest, {
  SuggestionsFetchRequestedParams,
} from 'react-autosuggest';
import {
  SEARCH_FILTER_OPTIONS,
  SEARCH_TYPE_OPTIONS,
  SEARCH_VARIABLE_OPTIONS,
  getFullNameFromPerson,
} from './utils';
import styled from 'styled-components';
import { escapeRegexCharacters } from 'client/profiles/utils';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { spacing } from 'client/shared/styles';
import { Field, Form, Formik, FieldProps } from 'formik';

const SearchBoxContainer = styled.div`
  margin-bottom: ${spacing[2]};
`;

const FlexContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const StyledSelectWrapper = styled(SelectWrapper)`
  width: 100%;

  &:not(:last-child) {
    margin-right: 1rem;
  }
`;

interface SearchBoxProps {
  people: Person[];
  tags: Tag[];
  setTagFilter: (tagName: string) => void;
  setSelectedTagColor: (tagColor: string) => void;
}

interface SearchFormData {
  searchValue: string;
}

const blankInitialValues: SearchFormData = {
  searchValue: '',
};

const InternalSearchBox: FC<SearchBoxProps & RouteComponentProps> = ({
  people,
  tags,
  setTagFilter,
  setSelectedTagColor,
  history,
}) => {
  const [filteredPeople, setFilteredPeople] = useState<any>(people);
  const [filteredTags, setFilteredTags] = useState<any>(tags);
  const [queryType, setQueryType] = useState<string>('search');
  const [searchVariable, setSearchVariable] = useState<string>('firstName');
  const [inputValue, setInputValue] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<Person | Tag>(people[0]);

  const buildOptions = (options: Option[]): ReactNode[] => {
    return options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ));
  };

  const getSuggestions = (value: string): Person[] | Tag[] => {
    const trimmedInputValue = escapeRegexCharacters(value.trim().toLowerCase());
    const regex = new RegExp('^' + trimmedInputValue, 'i');
    if (queryType === 'search') {
      if (searchVariable === 'firstName') {
        return people.filter((person) => regex.test(person.firstName));
      } else {
        // searchVariable === 'lastName'
        return people.filter((person) =>
          regex.test(person.lastName ? person.lastName : ''),
        );
      }
    } else {
      // queryType === 'filter'
      return tags.filter((tag) => regex.test(tag.name));
    }
  };

  const onSuggestionsFetchRequested = (
    props: SuggestionsFetchRequestedParams,
  ) => {
    if (queryType === 'search') {
      setFilteredPeople(getSuggestions(props.value));
    } else {
      // queryType === 'filter'
      setFilteredTags(getSuggestions(props.value));
    }
  };

  const onSuggestionsClearRequested = () => {
    setFilteredPeople([]);
    setFilteredTags([]);
  };

  const shouldRenderSuggestions = (): boolean => true;

  const getSuggestionValue = (suggestion: Person | Tag): string => {
    if ('firstName' in suggestion) {
      return getFullNameFromPerson(suggestion);
    } else if ('name' in suggestion) {
      return suggestion.name;
    }
    return '';
  };

  const renderSuggestion = (suggestion: Person | Tag): ReactNode => {
    if ('firstName' in suggestion) {
      return <div>{getFullNameFromPerson(suggestion)}</div>;
    } else if ('name' in suggestion) {
      return <div>{suggestion.name}</div>;
    }
    return <div></div>;
  };

  const handleSubmit = async () => {
    setInputValue('');

    if ('firstName' in selectedItem) {
      history.push(`/profiles/${selectedItem.id}`);
    } else if ('name' in selectedItem) {
      // queryType === 'filter'
      setTagFilter(selectedItem.name);
      setSelectedTagColor(selectedItem.color ? selectedItem.color : '');
    }
  };

  return (
    <SearchBoxContainer>
      <FlexContainer>
        <StyledSelectWrapper>
          <StyledSelect
            value={queryType}
            onChange={(event: ChangeEvent<HTMLSelectElement>) =>
              setQueryType(event.target.value)
            }
          >
            {buildOptions(SEARCH_TYPE_OPTIONS)}
          </StyledSelect>
        </StyledSelectWrapper>
        <StyledSelectWrapper>
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
        </StyledSelectWrapper>
      </FlexContainer>
      <Formik initialValues={blankInitialValues} onSubmit={handleSubmit}>
        {({ submitForm }) => (
          <Form>
            <Field name="searchValue">
              {({ form }: FieldProps) => (
                <Autosuggest
                  suggestions={
                    queryType === 'search' ? filteredPeople : filteredTags
                  }
                  onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                  onSuggestionsClearRequested={onSuggestionsClearRequested}
                  getSuggestionValue={getSuggestionValue}
                  renderSuggestion={renderSuggestion}
                  shouldRenderSuggestions={shouldRenderSuggestions}
                  onSuggestionSelected={(event, { suggestion }) => {
                    event.preventDefault();
                    event.stopPropagation();
                    if ('firstName' in suggestion) {
                      setInputValue(getFullNameFromPerson(suggestion));
                      form.setFieldValue(
                        'searchValue',
                        getFullNameFromPerson(suggestion),
                      );
                    } else if ('name' in suggestion) {
                      setInputValue(suggestion.name);
                      form.setFieldValue('searchValue', suggestion.name);
                    }
                    setSelectedItem(suggestion);
                    submitForm();
                  }}
                  inputProps={{
                    onChange: (event: any) => {
                      setInputValue(event.target.value);
                      form.setFieldValue('searchValue', event.target.value);
                    },
                    value: inputValue,
                  }}
                />
              )}
            </Field>
          </Form>
        )}
      </Formik>
    </SearchBoxContainer>
  );
};

export const SearchBox = withRouter(InternalSearchBox);
