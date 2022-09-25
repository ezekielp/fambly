import React, { FormEvent, ReactNode } from 'react';
import Autosuggest, {
  SuggestionsFetchRequestedParams,
  SuggestionSelectedEventData,
} from 'react-autosuggest';
import { escapeRegexCharacters } from 'client/profiles/utils';

interface FormikAutosuggestProps<SuggestionType> {
  records: SuggestionType[];
  suggestions: SuggestionType[];
  setSuggestions: (suggestions: SuggestionType[]) => void;
  getSuggestionValue: (suggestion: SuggestionType) => string;
  inputValue: string;
  onSuggestionSelected: (
    event: FormEvent<any>,
    data: SuggestionSelectedEventData<SuggestionType>,
  ) => void;
  onChange: (event: any) => void;
  onBlur?: () => void;
}

export const FormikAutosuggest = <SuggestionType extends Record<string, any>>({
  records,
  suggestions,
  setSuggestions,
  getSuggestionValue,
  inputValue,
  onSuggestionSelected,
  onChange,
  onBlur,
}: FormikAutosuggestProps<SuggestionType>) => {
  const getSuggestions = (inputValue: string): SuggestionType[] => {
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

  const renderSuggestion = (suggestion: SuggestionType) => (
    <div>{getSuggestionValue(suggestion)}</div>
  );

  return (
    <Autosuggest
      suggestions={suggestions}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
      getSuggestionValue={(suggestion: SuggestionType) =>
        getSuggestionValue(suggestion)
      }
      renderSuggestion={renderSuggestion}
      shouldRenderSuggestions={() => true}
      onSuggestionSelected={(
        event: FormEvent<any>,
        data: SuggestionSelectedEventData<SuggestionType>,
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
