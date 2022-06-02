import React, { FC } from 'react';
import { BreadcrumbsWrapper, Caret, Crumb, CrumbWrapper, LinkCrumb } from './breadcrumbs.css';

interface BreadcrumbsProps {
  config: { route: string | null; display: string }[];
}

const Breadcrumbs: FC<BreadcrumbsProps> = ({ config }) => {
  const crumbs = config.map(({ route, display }, i) => {
    const hasCaret = i !== config.length - 1;
    if (!route) {
      return (
        <CrumbWrapper key={display}>
          <Crumb>{display}</Crumb>
          {hasCaret ? ' > ' : null}
        </CrumbWrapper>
      );
    }

    return (
      <CrumbWrapper key={display}>
        <LinkCrumb to={route}>{display}</LinkCrumb>
        {hasCaret ? <Caret>{'>'}</Caret> : null}
      </CrumbWrapper>
    );
  });

  return <BreadcrumbsWrapper>{crumbs}</BreadcrumbsWrapper>;
};

export default Breadcrumbs;
