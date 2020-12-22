import React, { FC, ChangeEvent } from 'react';
import { PersonInfoFragment } from 'client/graphqlTypes';
import { SelectWrapper, StyledSelect } from 'client/form/SelectInput';
import { spacing } from 'client/shared/styles';
import styled from 'styled-components';

const Container = styled.div`
  margin-bottom: ${spacing[3]};
`;

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
    middleName,
    lastName,
    age,
    monthsOld,
    gender,
    birthYear,
    birthMonth,
    birthDay,
  } = personData;

  return (
    <Container>
      <SelectWrapper>
        <StyledSelect value={fieldToAdd} onChange={onChange}>
          <option value="">Select a field to add</option>
          <option value="note">Note</option>
          <optgroup label="Essential info">
            {!age && !monthsOld && <option value="age">Age</option>}
            {!birthYear && !birthMonth && !birthDay && (
              <option value="birthdate">Birthdate</option>
            )}
            {!gender && <option value="gender">Gender</option>}
            {!middleName && <option value="middleName">Middle name</option>}
            {!lastName && <option value="lastName">Last name</option>}
            <option value="address">Address</option>
            <option value="email">Email address</option>
          </optgroup>
          <optgroup label="Relationships">
            <option value="spouse">Spouse</option>
            <option value="partner">Partner (boyfriend / girlfriend)</option>
            <option value="exSpouse">Former spouse</option>
            <option value="exPartner">
              Former partner (ex-boyfriend / ex-girlfriend)
            </option>
          </optgroup>
          <optgroup label="Family">
            <option value="child">Child</option>
            <option value="parent">Parent</option>
            <option value="sibling">Sibling</option>
          </optgroup>
          <optgroup label="Personal history">
            <option value="personPlace">Place {firstName} has lived</option>
          </optgroup>
        </StyledSelect>
      </SelectWrapper>
    </Container>
  );
};
