import { Link } from 'react-router-dom';
import styled from 'styled-components';

import colors from '../../colors';

export const BreadcrumbsWrapper = styled.div`
  display: flex;
  align-items: center;
  font-size: 18px;
`;

export const LinkCrumb = styled(Link)`
  color: ${colors.black};
`;

export const Crumb = styled.span`
  color: ${colors.black};
`;

export const CrumbWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const Caret = styled.div`
  margin: 0 4px;
`;
