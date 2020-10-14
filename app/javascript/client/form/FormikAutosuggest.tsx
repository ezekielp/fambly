import React, { FC, FormEvent, ReactNode } from 'react';
import Autosuggest, {
  SuggestionsFetchRequestedParams,
  SuggestionSelectedEventData,
} from 'react-autosuggest';
import { escapeRegexCharacters } from 'client/profiles/utils';

interface FormikAutosuggestProps<SuggestionType> {
  records: SuggestionType[];
  suggestions: SuggestionType[];
  setSuggestions: (suggestions: any[]) => void;
  getSuggestionValue: (suggestion: SuggestionType) => string;
  inputValue: string;
  onSuggestionSelected: (
    event: FormEvent<any>,
    data: SuggestionSelectedEventData<SuggestionType>,
  ) => void;
  onChange: (event: any) => void;
  onBlur?: () => void;
}

export const FormikAutosuggest: FC<FormikAutosuggestProps<
  Record<string, any>
>> = ({
  records,
  suggestions,
  setSuggestions,
  getSuggestionValue,
  inputValue,
  onSuggestionSelected,
  onChange,
  onBlur,
}) => {
  const getSuggestions = (inputValue: string): Record<string, any>[] => {
    const trimmedInputValue = escapeRegexCharacters(
      inputValue.trim().toLowerCase(),
    );
    const regex = new RegExp('^' + trimmedInputValue, 'i');
    return records.filter((record) => regex.test(getSuggestionValue(record)));
  };

  const onSuggestionsFetchRequested = ({
    value,
  }: SuggestionsFetchRequestedParams) => setSuggestions(getSuggestions(value));

  const onSuggestionsClearRequested = () => setSuggestions([]);

  const renderSuggestion = (suggestion: Record<string, any>): ReactNode => (
    <div>{getSuggestionValue(suggestion)}</div>
  );

  return (
    <Autosuggest
      suggestions={suggestions}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
      getSuggestionValue={(suggestion: Record<string, any>) =>
        getSuggestionValue(suggestion)
      }
      renderSuggestion={renderSuggestion}
      shouldRenderSuggestions={() => true}
      onSuggestionSelected={(
        event: FormEvent<any>,
        data: SuggestionSelectedEventData<Record<string, any>>,
      ) => {
        event.preventDefault();
        event.stopPropagation();
        onSuggestionSelected(event, data);
      }}
      inputProps={{
        onChange,
        value: inputValue,
        onBlur: onBlur ? onBlur : () => null,
      }}
    />
  );
};
