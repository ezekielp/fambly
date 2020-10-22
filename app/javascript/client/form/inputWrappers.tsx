import styled from 'styled-components';

export const RowWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

export const LeftThreeQuarterWrapper = styled.div`
  width: 75%;
  padding-right: 1rem;
`;

export const LeftHalfWrapper = styled.div`
  width: 50%;
  padding-right: 1rem;
`;

export const RightHalfWrapper = styled.div`
  width: 50%;
`;

export const MiddleQuarterWrapper = styled.div`
  width: 25%;
  padding-right: 1rem;
`;

export const RightQuarterWrapper = styled.div`
  width: 25%;
`;

export const OrContainer = styled.div`
  padding: 1.25rem;
  font-variation-settings: 'wght' 700;
`;

export const NameRowWrapper = styled(RowWrapper)`
  margin-bottom: 30px;
`;

export const FirstNameLabel = styled.div`
  margin-top: 19px;
  margin-bottom: 15px;
`;

export const LastNameLabel = styled.div`
  margin-bottom: 15px;
  width: 55%;
`;
