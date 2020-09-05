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
        <option value=""></option>
        {!age && !monthsOld && <option value="age">Age</option>}
        {!birthYear && !birthMonth && !birthDay && (
          <option value="birthdate">Birthdate</option>
        )}
        <option value="child">Child</option>
        {!gender && <option value="gender">Gender</option>}
        {!lastName && <option value="lastName">Last name</option>}
        <option value="note">Note</option>
        <option value="parent">Parent</option>
      </select>
    </>
  );
};
