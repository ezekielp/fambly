import React, { FC, useState } from 'react';
import { BirthdateForm } from './BirthdateForm';
import { MONTHS } from './utils';

interface BirthdateContainerProps {
  birthYear?: number | null;
  birthMonth?: number | null;
  birthDay?: number | null;
  personId: string;
}

export const BirthdateContainer: FC<BirthdateContainerProps> = (props) => {
  const { birthYear, birthMonth, birthDay, personId } = props;
  const [editFlag, setEditFlag] = useState(false);

  const birthdateContainerContent = (
    year: number | null | undefined,
    month: string,
    day: string,
  ) => {
    if (year && month && !day) {
      return (
        <div>
          Born in: {MONTHS[month]} {year}
        </div>
      );
    } else if (year && !month && !day) {
      return <div>Born in: {year}</div>;
    } else if (month && day && !year) {
      return (
        <div>
          Birthdate: {MONTHS[month]} {day}
        </div>
      );
    } else if (month && day && year) {
      return (
        <div>
          Birthdate: {MONTHS[month]} {day}, {year}
        </div>
      );
    } else {
      return <></>;
    }
  };

  const month = birthMonth ? birthMonth.toString() : '';
  const day = birthDay ? birthDay.toString() : '';

  const initialValues = {
    birthYear,
    birthMonth: month,
    birthDay: day,
  };

  const editBirthdateForm = (
    <BirthdateForm
      initialValues={initialValues}
      personId={personId}
      setEditFlag={setEditFlag}
    />
  );

  return editFlag
    ? editBirthdateForm
    : birthdateContainerContent(birthYear, month, day);
};
