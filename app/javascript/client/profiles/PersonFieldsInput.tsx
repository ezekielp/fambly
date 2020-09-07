import React, { FC, ChangeEvent } from 'react';
import { PersonInfoFragment } from 'client/graphqlTypes';

interface PersonFieldsInputProps {
  personData: PersonInfoFragment;
  fieldToAdd: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
}

export const PersonFieldsInput: FC<PersonFieldsInputProps> = ({
  personData,
  fieldToAdd,
  onChange,
}) => {
  const {
    firstName,
    lastName,
    age,
    monthsOld,
    gender,
    birthYear,
    birthMonth,
    birthDay,
  } = personData;

  return (
    <>
      <select value={fieldToAdd} onChange={onChange}>
        <option value="">Select a field to add</option>
        <option value="note">Note</option>
        <optgroup label="Essential info">
          {!age && !monthsOld && <option value="age">Age</option>}
          {!birthYear && !birthMonth && !birthDay && (
            <option value="birthdate">Birthdate</option>
          )}
          {!gender && <option value="gender">Gender</option>}
          {!lastName && <option value="lastName">Last name</option>}
        </optgroup>
        <optgroup label="Family">
          <option value="child">Child</option>
          <option value="parent">Parent</option>
        </optgroup>
        <optgroup label="Personal history">
          <option value="personPlace">Place {firstName} has lived</option>
        </optgroup>
      </select>
    </>
  );
};
