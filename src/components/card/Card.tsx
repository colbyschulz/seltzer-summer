import React, { FC, ReactNode } from 'react';
import { CardWrapper } from './card.css';

const Card: FC<{ children: ReactNode; style?: any }> = ({ children, style }) => {
  return <CardWrapper {...style}>{children}</CardWrapper>;
};

export default Card;
