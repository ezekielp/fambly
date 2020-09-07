import React, { FC } from 'react';
import { PersonPlaceInfoFragment } from 'client/graphqlTypes';
import { PersonPlaceForm } from './PersonPlaceForm';
import { NoteItem } from 'client/profiles/notes/NoteItem';

interface PersonPlaceItemProps {
  personPlace: PersonPlaceInfoFragment;
}

export const PersonPlaceItem: FC<PersonPlaceItemProps> = ({ personPlace }) => {
  const {
    id,
    place,
    person,
    startMonth,
    startYear,
    endMonth,
    endYear,
    notes,
  } = personPlace;
  const { country, stateOrRegion, town, street, zipCode } = place;
  // const currentYear = new Date().getFullYear();

  const getTimingText = () => {
    const startMonthText = startMonth ? startMonth : '';
    const endMonthText = endMonth ? endMonth + ' ' : ' ';
    if (startYear && endYear) {
      return (
        <div>
          ({startMonthText} {startYear}-{endMonthText}
          {endYear})
        </div>
      );
    } else if (startYear) {
      return <div>({startYear}-)</div>;
    } else if (endYear) {
      return <div>(until {endYear})</div>;
    }
    return <></>;
  };

  const noteItems =
    notes && notes.map((note) => <NoteItem note={note} key={note.id} />);

  return (
    <>
      {getTimingText()}
      <div>{street && street}</div>
      <div>
        {town && town}, {stateOrRegion && stateOrRegion} {zipCode && zipCode}
      </div>
      <div>{country}</div>
      {noteItems}
    </>
  );
};
