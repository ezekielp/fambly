import React, { FC } from 'react';
import { SubContactInfoFragment } from 'client/graphqlTypes';
import { AmorousPartnerItem } from './AmorousPartnerItem';
import { ProfileLabel } from 'client/common/ProfileLabel';
import { ProfileFieldContainer } from 'client/common/ProfileFieldContainer';

interface AmorousPartnersContainerProps {
  amorousPartners: SubContactInfoFragment[];
  otherPartnerFirstName: string;
  otherPartnerLastName?: string | null | undefined;
  otherPartnerId: string;
  relations: SubContactInfoFragment[];
}

export const AmorousPartnersContainer: FC<AmorousPartnersContainerProps> = ({
  amorousPartners,
  otherPartnerFirstName,
  otherPartnerLastName,
  otherPartnerId,
  relations,
}) => {
  const amorousPartnerItems = amorousPartners.map((partner) => {
    return (
      <AmorousPartnerItem
        key={partner.id}
        partner={partner}
        otherPartnerFirstName={otherPartnerFirstName}
        otherPartnerLastName={otherPartnerLastName}
        otherPartnerId={otherPartnerId}
        relations={relations}
      />
    );
  });

  return (
    <ProfileFieldContainer>
      <ProfileLabel>partners</ProfileLabel>
      <div>{amorousPartnerItems}</div>
    </ProfileFieldContainer>
  );
};
