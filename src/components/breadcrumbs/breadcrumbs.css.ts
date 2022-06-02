import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const BreadcrumbsWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  font-size: 18px;
`;

export const LinkCrumb = styled(Link)`
  color: black;
`;

export const Crumb = styled.span`
  color: black;
`;

export const CrumbWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const Caret = styled.div`
  margin: 0 4px;
`;
