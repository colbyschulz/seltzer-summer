import React, { FC, MouseEventHandler } from 'react';
import { StyledButton } from './button.css';

interface ButtonProps {
  type?: string;
  children: React.ReactNode;
  style?: any;
  onClick?: (MouseEventHandler<HTMLAnchorElement> & MouseEventHandler<HTMLButtonElement>) | undefined;
}
const Button: FC<ButtonProps> = ({ children, style, onClick }) => (
  <StyledButton style={style} onClick={onClick}>
    {children}
  </StyledButton>
);

export default Button;
